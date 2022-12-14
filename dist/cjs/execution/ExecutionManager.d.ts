import { Execution } from '@lifi/types';
import { ExecutionParams } from '../types';
export declare class ExecutionManager {
    allowUserInteraction: boolean;
    allowInteraction: (value: boolean) => void;
    execute: ({ signer, step, statusManager, settings, }: ExecutionParams) => Promise<Execution>;
}
