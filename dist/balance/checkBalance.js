var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import BigNumber from 'bignumber.js';
import { BalanceError } from '../utils/errors';
import { getTokenBalance } from './getTokenBalance';
export const checkBalance = (signer, step, depth = 0) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenAmount = yield getTokenBalance(yield signer.getAddress(), step.action.fromToken);
    if (tokenAmount) {
        const currentBalance = new BigNumber(tokenAmount.amount).shiftedBy(tokenAmount.decimals);
        const neededBalance = new BigNumber(step.action.fromAmount);
        if (currentBalance.lt(neededBalance)) {
            if (depth <= 3) {
                yield new Promise((resolve) => {
                    setTimeout(resolve, 200);
                });
                yield checkBalance(signer, step, depth + 1);
            }
            else if (neededBalance.multipliedBy(1 - step.action.slippage).lte(currentBalance)) {
                // adjust amount in slippage limits
                step.action.fromAmount = currentBalance.toFixed(0);
            }
            else {
                const neeeded = neededBalance.shiftedBy(-tokenAmount.decimals).toFixed();
                const current = currentBalance
                    .shiftedBy(-tokenAmount.decimals)
                    .toFixed();
                let errorMessage = `Your ${tokenAmount.symbol} balance is too low, ` +
                    `you try to transfer ${neeeded} ${tokenAmount.symbol}, ` +
                    `but your wallet only holds ${current} ${tokenAmount.symbol}. ` +
                    `No funds have been sent. `;
                if (!currentBalance.isZero()) {
                    errorMessage +=
                        `If the problem consists, please delete this transfer and ` +
                            `start a new one with a maximum of ${current} ${tokenAmount.symbol}.`;
                }
                throw new BalanceError('The balance is too low.', errorMessage);
            }
        }
    }
});
