var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { LifiErrorCode, ProviderError } from '../utils/errors';
/**
 * This method checks whether the signer is configured for the correct chain.
 * If yes it returns the signer.
 * If no and if user interaction is allowed it triggers the switchChainHook. If no user interaction is allowed it aborts.
 *
 * @param signer
 * @param statusManager
 * @param step
 * @param switchChainHook
 * @param allowUserInteraction
 */
export const switchChain = (signer, statusManager, step, switchChainHook, allowUserInteraction) => __awaiter(void 0, void 0, void 0, function* () {
    // if we are already on the correct chain we can proceed directly
    if ((yield signer.getChainId()) === step.action.fromChainId) {
        return signer;
    }
    // -> set status message
    step.execution = statusManager.initExecutionObject(step);
    statusManager.updateExecution(step, 'ACTION_REQUIRED');
    let switchProcess = statusManager.findOrCreateProcess(step, 'SWITCH_CHAIN', 'ACTION_REQUIRED');
    if (!allowUserInteraction) {
        return;
    }
    try {
        const updatedSigner = yield switchChainHook(step.action.fromChainId);
        const updatedChainId = yield (updatedSigner === null || updatedSigner === void 0 ? void 0 : updatedSigner.getChainId());
        if (updatedChainId !== step.action.fromChainId) {
            throw new ProviderError(LifiErrorCode.ChainSwitchError, 'Chain switch required.');
        }
        switchProcess = statusManager.updateProcess(step, switchProcess.type, 'DONE');
        statusManager.updateExecution(step, 'PENDING');
        return updatedSigner;
    }
    catch (error) {
        statusManager.updateProcess(step, switchProcess.type, 'FAILED', {
            error: {
                message: error.message,
                code: LifiErrorCode.ChainSwitchError,
            },
        });
        statusManager.updateExecution(step, 'FAILED');
        throw error;
    }
});
