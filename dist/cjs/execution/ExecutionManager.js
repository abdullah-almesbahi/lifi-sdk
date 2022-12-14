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
exports.ExecutionManager = void 0;
const allowance_1 = require("../allowance");
const balance_1 = require("../balance");
const ApiService_1 = __importDefault(require("../services/ApiService"));
const ChainsService_1 = __importDefault(require("../services/ChainsService"));
const errors_1 = require("../utils/errors");
const getProvider_1 = require("../utils/getProvider");
const parseError_1 = require("../utils/parseError");
const utils_1 = require("../utils/utils");
const stepComparison_1 = require("./stepComparison");
const switchChain_1 = require("./switchChain");
const utils_2 = require("./utils");
class ExecutionManager {
    constructor() {
        this.allowUserInteraction = true;
        this.allowInteraction = (value) => {
            this.allowUserInteraction = value;
        };
        this.execute = ({ signer, step, statusManager, settings, }) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            step.execution = statusManager.initExecutionObject(step);
            const chainsService = ChainsService_1.default.getInstance();
            const fromChain = yield chainsService.getChainById(step.action.fromChainId);
            const toChain = yield chainsService.getChainById(step.action.toChainId);
            const isBridgeExecution = fromChain.id !== toChain.id;
            const currentProcessType = isBridgeExecution ? 'CROSS_CHAIN' : 'SWAP';
            // STEP 1: Check allowance
            const existingProcess = step.execution.process.find((p) => p.type === currentProcessType);
            // Check token approval only if fromToken is not the native token => no approval needed in that case
            if (!(existingProcess === null || existingProcess === void 0 ? void 0 : existingProcess.txHash) &&
                !(0, utils_1.isZeroAddress)(step.action.fromToken.address)) {
                yield (0, allowance_1.checkAllowance)(signer, step, statusManager, settings, fromChain, this.allowUserInteraction);
            }
            // STEP 2: Get transaction
            let process = statusManager.findOrCreateProcess(step, currentProcessType);
            if (process.status !== 'DONE') {
                try {
                    let transaction;
                    if (process.txHash) {
                        // Make sure that the chain is still correct
                        const updatedSigner = yield (0, switchChain_1.switchChain)(signer, statusManager, step, settings.switchChainHook, this.allowUserInteraction);
                        if (!updatedSigner) {
                            // Chain switch was not successful, stop execution here
                            return step.execution;
                        }
                        signer = updatedSigner;
                        // Load exiting transaction
                        transaction = yield (0, getProvider_1.getProvider)(signer).getTransaction(process.txHash);
                    }
                    else {
                        process = statusManager.updateProcess(step, process.type, 'STARTED');
                        // Check balance
                        yield (0, balance_1.checkBalance)(signer, step);
                        // Create new transaction
                        if (!step.transactionRequest) {
                            const personalizedStep = yield (0, utils_1.personalizeStep)(signer, step);
                            const updatedStep = yield ApiService_1.default.getStepTransaction(personalizedStep);
                            const comparedStep = yield (0, stepComparison_1.stepComparison)(statusManager, personalizedStep, updatedStep, settings, this.allowUserInteraction);
                            step = Object.assign(Object.assign({}, comparedStep), { execution: step.execution });
                        }
                        const { transactionRequest } = step;
                        if (!transactionRequest) {
                            throw new errors_1.TransactionError(errors_1.LifiErrorCode.TransactionUnprepared, 'Unable to prepare transaction.');
                        }
                        // STEP 3: Send the transaction
                        // Make sure that the chain is still correct
                        const updatedSigner = yield (0, switchChain_1.switchChain)(signer, statusManager, step, settings.switchChainHook, this.allowUserInteraction);
                        if (!updatedSigner) {
                            // Chain switch was not successful, stop execution here
                            return step.execution;
                        }
                        signer = updatedSigner;
                        process = statusManager.updateProcess(step, process.type, 'ACTION_REQUIRED');
                        if (!this.allowUserInteraction) {
                            return step.execution;
                        }
                        // Submit the transaction
                        transaction = yield signer.sendTransaction(transactionRequest);
                        // STEP 4: Wait for the transaction
                        process = statusManager.updateProcess(step, process.type, 'PENDING', {
                            txHash: transaction.hash,
                            txLink: fromChain.metamask.blockExplorerUrls[0] +
                                'tx/' +
                                transaction.hash,
                        });
                    }
                    yield transaction.wait();
                    process = statusManager.updateProcess(step, process.type, 'PENDING', {
                        txHash: transaction.hash,
                        txLink: fromChain.metamask.blockExplorerUrls[0] + 'tx/' + transaction.hash,
                    });
                    if (isBridgeExecution) {
                        process = statusManager.updateProcess(step, process.type, 'DONE');
                    }
                }
                catch (e) {
                    if (e.code === 'TRANSACTION_REPLACED' && e.replacement) {
                        process = statusManager.updateProcess(step, process.type, 'DONE', {
                            txHash: e.replacement.hash,
                            txLink: fromChain.metamask.blockExplorerUrls[0] +
                                'tx/' +
                                e.replacement.hash,
                        });
                    }
                    else {
                        const error = yield (0, parseError_1.parseError)(e, step, process);
                        process = statusManager.updateProcess(step, process.type, 'FAILED', {
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
            }
            // STEP 5: Wait for the receiving chain
            const processTxHash = process.txHash;
            if (isBridgeExecution) {
                process = statusManager.findOrCreateProcess(step, 'RECEIVING_CHAIN', 'PENDING');
            }
            let statusResponse;
            try {
                if (!processTxHash) {
                    throw new Error('Transaction hash is undefined.');
                }
                statusResponse = yield (0, utils_2.waitForReceivingTransaction)(processTxHash, statusManager, process.type, step);
                process = statusManager.updateProcess(step, process.type, 'DONE', {
                    substatus: statusResponse.substatus,
                    substatusMessage: statusResponse.substatusMessage ||
                        (0, utils_2.getSubstatusMessage)(statusResponse.status, statusResponse.substatus),
                    txHash: (_a = statusResponse.receiving) === null || _a === void 0 ? void 0 : _a.txHash,
                    txLink: toChain.metamask.blockExplorerUrls[0] +
                        'tx/' +
                        ((_b = statusResponse.receiving) === null || _b === void 0 ? void 0 : _b.txHash),
                });
                statusManager.updateExecution(step, 'DONE', {
                    fromAmount: statusResponse.sending.amount,
                    toAmount: (_c = statusResponse.receiving) === null || _c === void 0 ? void 0 : _c.amount,
                    toToken: (_d = statusResponse.receiving) === null || _d === void 0 ? void 0 : _d.token,
                    gasAmount: statusResponse.sending.gasAmount,
                    gasAmountUSD: statusResponse.sending.gasAmountUSD,
                    gasPrice: statusResponse.sending.gasPrice,
                    gasToken: statusResponse.sending.gasToken,
                    gasUsed: statusResponse.sending.gasUsed,
                });
            }
            catch (e) {
                process = statusManager.updateProcess(step, process.type, 'FAILED', {
                    error: {
                        code: errors_1.LifiErrorCode.TransactionFailed,
                        message: 'Failed while waiting for receiving chain.',
                        htmlMessage: (0, parseError_1.getTransactionFailedMessage)(step, process.txLink),
                    },
                });
                statusManager.updateExecution(step, 'FAILED');
                console.warn(e);
                throw e;
            }
            // DONE
            return step.execution;
        });
    }
}
exports.ExecutionManager = ExecutionManager;
