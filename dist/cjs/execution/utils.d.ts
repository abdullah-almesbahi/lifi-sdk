import { ProcessType, Status, StatusMessage, StatusResponse, Step, Substatus } from '@lifi/types';
import { StatusManager } from '..';
export declare function waitForReceivingTransaction(txHash: string, statusManager: StatusManager, processType: ProcessType, step: Step): Promise<StatusResponse>;
export declare function getProcessMessage(type: ProcessType, status: Status): string | undefined;
export declare function getSubstatusMessage(status: StatusMessage, substatus?: Substatus): string | undefined;
export declare function checkStepSlippageThreshold(oldStep: Step, newStep: Step): boolean;
