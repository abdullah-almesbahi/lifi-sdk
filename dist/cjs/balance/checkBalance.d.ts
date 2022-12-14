import { ethers } from 'ethers';
import { Step } from '..';
export declare const checkBalance: (signer: ethers.Signer, step: Step, depth?: number) => Promise<void>;
