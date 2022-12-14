import { Signer } from 'ethers';
import { StatusManager } from '../execution/StatusManager';
import { Chain, InternalExecutionSettings, Step } from '../types';
export declare const checkAllowance: (signer: Signer, step: Step, statusManager: StatusManager, settings: InternalExecutionSettings, chain: Chain, allowUserInteraction?: boolean) => Promise<void>;
