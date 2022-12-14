"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAllowance = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const ethers_1 = require("ethers");
const utils_1 = require("../allowance/utils");
const getProvider_1 = require("../utils/getProvider");
const parseError_1 = require("../utils/parseError");
const checkAllowance = (signer, step, statusManager, settings, chain, allowUserInteraction = false) => __awaiter(void 0, void 0, void 0, function* () {
    // Ask the user to set an allowance
    let allowanceProcess = statusManager.findOrCreateProcess(step, 'TOKEN_ALLOWANCE');
    // Check allowance
    try {
        if (allowanceProcess.txHash && allowanceProcess.status !== 'DONE') {
            if (allowanceProcess.status !== 'PENDING') {
                allowanceProcess = statusManager.updateProcess(step, allowanceProcess.type, 'PENDING');
            }
            yield (0, getProvider_1.getProvider)(signer).waitForTransaction(allowanceProcess.txHash);
            allowanceProcess = statusManager.updateProcess(step, allowanceProcess.type, 'DONE');
        }
        else {
            const approved = yield (0, utils_1.getApproved)(signer, step.action.fromToken.address, step.estimate.approvalAddress);
            if (new bignumber_js_1.default(step.action.fromAmount).gt(approved)) {
                if (!allowUserInteraction) {
                    return;
                }
                const approvalAmount = settings.infiniteApproval
                    ? ethers_1.constants.MaxUint256.toString()
                    : step.action.fromAmount;
                const approveTx = yield (0, utils_1.setApproval)(signer, step.action.fromToken.address, step.estimate.approvalAddress, approvalAmount);
                allowanceProcess = statusManager.updateProcess(step, allowanceProcess.type, 'PENDING', {
                    txHash: approveTx.hash,
                    txLink: chain.metamask.blockExplorerUrls[0] + 'tx/' + approveTx.hash,
                });
                // Wait for the transcation
                yield approveTx.wait();
                allowanceProcess = statusManager.updateProcess(step, allowanceProcess.type, 'DONE');
            }
            else {
                allowanceProcess = statusManager.updateProcess(step, allowanceProcess.type, 'DONE');
            }
        }
    }
    catch (e) {
        if (e.code === 'TRANSACTION_REPLACED' && e.replacement) {
            yield transactionReplaced(e.replacement, allowanceProcess, step, chain, statusManager);
        }
        else {
            const error = yield (0, parseError_1.parseError)(e, step, allowanceProcess);
            allowanceProcess = statusManager.updateProcess(step, allowanceProcess.type, 'FAILED', {
                error: {
                    message: error.message,
                    htmlMessage: error.htmlMessage,
                    code: error.code,
                },
            });
            statusManager.updateExecution(step, 'FAILED');
            throw error;
        }
    }
});
exports.checkAllowance = checkAllowance;
const transactionReplaced = (replacementTx, allowanceProcess, step, chain, statusManager) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        allowanceProcess = statusManager.updateProcess(step, allowanceProcess.type, 'PENDING', {
            txHash: replacementTx.hash,
            txLink: chain.metamask.blockExplorerUrls[0] + 'tx/' + replacementTx.hash,
        });
        yield replacementTx.wait();
        allowanceProcess = statusManager.updateProcess(step, allowanceProcess.type, 'DONE');
    }
    catch (e) {
        if (e.code === 'TRANSACTION_REPLACED' && e.replacement) {
            yield transactionReplaced(e.replacement, allowanceProcess, step, chain, statusManager);
        }
        throw e;
    }
});
