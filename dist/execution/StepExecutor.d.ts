import { Signer } from 'ethers';
import { InteractionSettings, InternalExecutionSettings, Step } from '../types';
import { ExecutionManager } from './ExecutionManager';
import { StatusManager } from './StatusManager';
export declare class StepExecutor {
    executionManager: ExecutionManager;
    statusManager: StatusManager;
    settings: InternalExecutionSettings;
    allowUserInteraction: boolean;
    executionStopped: boolean;
    constructor(statusManager: StatusManager, settings: InternalExecutionSettings);
    setInteraction: (settings?: InteractionSettings) => void;
    checkChain: () => never;
    executeStep: (signer: Signer, step: Step) => Promise<Step>;
}
