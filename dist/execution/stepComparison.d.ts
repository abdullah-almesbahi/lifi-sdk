import { StatusManager } from '.';
import { InternalExecutionSettings, Step } from '../types';
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
export declare const stepComparison: (statusManager: StatusManager, oldStep: Step, newStep: Step, settings: InternalExecutionSettings, allowUserInteraction: boolean) => Promise<Step>;
