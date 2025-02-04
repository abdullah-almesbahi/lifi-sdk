import { ContractCallQuoteRequest, GetStatusRequest, QuoteRequest, RequestOptions, TokensRequest, TokensResponse } from '@lifi/types';
import { ChainId, ChainKey, ExtendedChain, PossibilitiesRequest, PossibilitiesResponse, RoutesRequest, RoutesResponse, StatusResponse, Step, Token, ToolsRequest, ToolsResponse } from '../types';
declare const _default: {
    getPossibilities: (request?: PossibilitiesRequest | undefined, options?: RequestOptions | undefined) => Promise<PossibilitiesResponse>;
    getToken: (chain: ChainKey | ChainId, token: string, options?: RequestOptions | undefined) => Promise<Token>;
    getQuote: (request: QuoteRequest, options?: RequestOptions | undefined) => Promise<Step>;
    getContractCallQuote: (request: ContractCallQuoteRequest, options?: RequestOptions | undefined) => Promise<Step>;
    getStatus: ({ bridge, fromChain, toChain, txHash }: GetStatusRequest, options?: RequestOptions | undefined) => Promise<StatusResponse>;
    getChains: (options?: RequestOptions | undefined) => Promise<ExtendedChain[]>;
    getRoutes: (request: RoutesRequest, options?: RequestOptions | undefined) => Promise<RoutesResponse>;
    getStepTransaction: (step: Step, options?: RequestOptions | undefined) => Promise<Step>;
    getTools: (request?: ToolsRequest | undefined, options?: RequestOptions | undefined) => Promise<ToolsResponse>;
    getTokens: (request?: TokensRequest | undefined, options?: RequestOptions | undefined) => Promise<TokensResponse>;
};
export default _default;
