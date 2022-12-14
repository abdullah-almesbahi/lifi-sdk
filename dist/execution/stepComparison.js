var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { LifiErrorCode, TransactionError } from '../utils/errors';
import { checkStepSlippageThreshold } from './utils';
/**
 * This method checks whether the new and updated Step meets the required exchange rate conditions.
 * If yes it returns the updated Step.
 * If no and if user interaction is allowed it triggers the acceptExchangeRateUpdateHook. If no user interaction is allowed it aborts.
 *
 * @param statusManager
 * @param oldStep
 * @param newStep
 * @param acceptSlippageUpdateHook
 * @param allowUserInteraction
 */
export const stepComparison = (statusManager, oldStep, newStep, settings, allowUserInteraction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Check if changed exchange rate is in the range of slippage threshold
    if (checkStepSlippageThreshold(oldStep, newStep)) {
        return statusManager.updateStepInRoute(newStep);
    }
    const acceptExchangeRateUpdateHook = (_a = settings.acceptExchangeRateUpdateHook) !== null && _a !== void 0 ? _a : settings.acceptSlippageUpdateHook;
    let allowStepUpdate;
    if (allowUserInteraction) {
        allowStepUpdate = yield acceptExchangeRateUpdateHook({
            oldToAmount: oldStep.estimate.toAmount,
            newToAmount: newStep.estimate.toAmount,
            toToken: newStep.action.toToken,
            oldSlippage: oldStep.action.slippage,
            newSlippage: newStep.action.slippage,
        });
    }
    if (!allowStepUpdate) {
        // The user declined the new exchange rate, so we are not going to proceed
        throw new TransactionError(LifiErrorCode.TransactionCanceled, 'Exchange rate has changed!', `Transaction was not sent, your funds are still in your wallet.
      The exchange rate has changed and the previous estimation can not be fulfilled due to value loss.`);
    }
    return statusManager.updateStepInRoute(newStep);
});
