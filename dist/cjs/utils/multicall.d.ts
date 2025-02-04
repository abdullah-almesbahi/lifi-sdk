import { Fragment, JsonFragment } from '@ethersproject/abi';
export type MultiCallData = {
    address: string;
    name: string;
    params?: any[];
};
export declare const fetchDataUsingMulticall: (calls: Array<MultiCallData>, abi: ReadonlyArray<Fragment | JsonFragment | string>, chainId: number, multicallAddress: string, requireSuccess?: boolean) => Promise<{
    data: unknown;
    blockNumber: number;
}[]>;
