var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getChainById } from '@lifi/types';
import { errorCodes as MetaMaskErrorCodes, getMessageFromCode, } from 'eth-rpc-errors';
import ChainsService from '../services/ChainsService';
import { LifiError, LifiErrorCode, MetaMaskProviderErrorCode, NotFoundError, ProviderError, RPCError, ServerError, SlippageError, TransactionError, UnknownError, ValidationError, } from './errors';
import { formatTokenAmountOnly } from './utils';
/**
 * Available MetaMask error codes:
 *
 * export const errorCodes: ErrorCodes = {
     rpc: {
      invalidInput: -32000,
      resourceNotFound: -32001,
      resourceUnavailable: -32002,
      transactionRejected: -32003,
      methodNotSupported: -32004,
      limitExceeded: -32005,
      parse: -32700,
      invalidRequest: -32600,
      methodNotFound: -32601,
      invalidParams: -32602,
      internal: -32603,
    },
    provider: {
      userRejectedRequest: 4001,
      unauthorized: 4100,
      unsupportedMethod: 4200,
      disconnected: 4900,
      chainDisconnected: 4901,
    },
  };
 *
 * For more information about error codes supported by metamask check
 * https://github.com/MetaMask/eth-rpc-errors
 * https://eips.ethereum.org/EIPS/eip-1474#error-codes
 * https://eips.ethereum.org/EIPS/eip-1193#provider-errors
 */
export const getTransactionNotSentMessage = (step, process) => __awaiter(void 0, void 0, void 0, function* () {
    let transactionNotSend = 'Transaction was not sent, your funds are still in your wallet';
    // add information about funds if available
    if (step) {
        const chainService = ChainsService.getInstance();
        const chain = yield chainService.getChainById(step.action.fromChainId);
        transactionNotSend += ` (${formatTokenAmountOnly(step.action.fromToken, step.action.fromAmount)} ${step.action.fromToken.symbol} on ${chain.name})`;
    }
    transactionNotSend +=
        ", please retry.<br/>If it still doesn't work, it is safe to delete this transfer and start a new one.";
    // add transaction explorer link if available
    transactionNotSend +=
        process && process.txLink
            ? `<br>You can check the failed transaction&nbsp;<a href="${process.txLink}" target="_blank" rel="nofollow noreferrer">here</a>.`
            : '';
    return transactionNotSend;
});
export const getTransactionFailedMessage = (step, txLink) => {
    const baseString = `It appears that your transaction may not have been successful.
  However, to confirm this, please check your ${getChainById(step.action.toChainId).name} wallet for ${step.action.toToken.symbol}.`;
    return txLink
        ? `${baseString}
    You can also check the&nbsp;<a href="${txLink}" target="_blank" rel="nofollow noreferrer">block explorer</a> for more information.`
        : baseString;
};
export const parseError = (e, step, process) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    if (e instanceof LifiError) {
        return e;
    }
    if (e.code) {
        // MetaMask errors have a numeric error code
        if (typeof e.code === 'number') {
            if (Object.values(MetaMaskErrorCodes.rpc).includes(e.code)) {
                // rpc errors
                // underpriced errors are sent as internal errors, so we need to parse the message manually
                if (e.code === MetaMaskErrorCodes.rpc.internal &&
                    ((_a = e.message) === null || _a === void 0 ? void 0 : _a.includes('underpriced'))) {
                    return new RPCError(LifiErrorCode.TransactionUnderpriced, 'Transaction is underpriced.', yield getTransactionNotSentMessage(step, process), e.stack);
                }
                if (((_b = e.message) === null || _b === void 0 ? void 0 : _b.includes('intrinsic gas too low')) ||
                    ((_c = e.message) === null || _c === void 0 ? void 0 : _c.includes('out of gas'))) {
                    return new TransactionError(LifiErrorCode.GasLimitError, 'Gas limit is too low.', yield getTransactionNotSentMessage(step, process), e.stack);
                }
                return new RPCError(e.code, getMessageFromCode(e.code), yield getTransactionNotSentMessage(step, process), e.stack);
            }
            // provider errors
            if (Object.values(MetaMaskErrorCodes.provider).includes(e.code)) {
                return new ProviderError(e.code, getMessageFromCode(e.code), yield getTransactionNotSentMessage(step, process), e.stack);
            }
        }
    }
    switch (e.code) {
        case 'CALL_EXCEPTION':
            return new ProviderError(LifiErrorCode.TransactionFailed, e.reason, yield getTransactionNotSentMessage(step, process), e.stack);
        case 'ACTION_REJECTED':
        case MetaMaskProviderErrorCode.userRejectedRequest:
            return new TransactionError(LifiErrorCode.TransactionRejected, e.message, yield getTransactionNotSentMessage(step, process), e.stack);
        case LifiErrorCode.TransactionUnprepared:
            return new TransactionError(LifiErrorCode.TransactionUnprepared, e.message, yield getTransactionNotSentMessage(step, process), e.stack);
        case LifiErrorCode.ValidationError:
            return new TransactionError(LifiErrorCode.ValidationError, e.message, e.htmlMessage);
        default:
            return new UnknownError(LifiErrorCode.InternalError, e.message || 'Unknown error occurred.', undefined, e.stack);
    }
});
export const parseBackendError = (e) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    if (((_a = e.response) === null || _a === void 0 ? void 0 : _a.status) === 400) {
        return new ValidationError(((_c = (_b = e.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || ((_d = e.response) === null || _d === void 0 ? void 0 : _d.statusText), undefined, e.stack);
    }
    if (((_e = e.response) === null || _e === void 0 ? void 0 : _e.status) === 404) {
        return new NotFoundError(((_g = (_f = e.response) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g.message) || ((_h = e.response) === null || _h === void 0 ? void 0 : _h.statusText), undefined, e.stack);
    }
    if (((_j = e.response) === null || _j === void 0 ? void 0 : _j.status) === 409) {
        return new SlippageError(((_l = (_k = e.response) === null || _k === void 0 ? void 0 : _k.data) === null || _l === void 0 ? void 0 : _l.message) || ((_m = e.response) === null || _m === void 0 ? void 0 : _m.statusText), 'The slippage is larger than the defined threshold. Please request a new route to get a fresh quote.', e.stack);
    }
    if (((_o = e.response) === null || _o === void 0 ? void 0 : _o.status) === 500) {
        return new ServerError(((_q = (_p = e.response) === null || _p === void 0 ? void 0 : _p.data) === null || _q === void 0 ? void 0 : _q.message) || ((_r = e.response) === null || _r === void 0 ? void 0 : _r.statusText), undefined, e.stack);
    }
    return new ServerError('Something went wrong.', undefined, e.stack);
};
