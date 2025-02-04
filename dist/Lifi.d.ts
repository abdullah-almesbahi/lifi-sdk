import { FallbackProvider } from '@ethersproject/providers';
import { ChainId, ChainKey, ContractCallQuoteRequest, ExtendedChain, GetStatusRequest, PossibilitiesRequest, PossibilitiesResponse, QuoteRequest, RequestOptions, Route, RoutesRequest, RoutesResponse, StatusResponse, Step, Token, TokenAmount, TokensRequest, TokensResponse, ToolsRequest, ToolsResponse } from '@lifi/types';
import { Signer } from 'ethers';
import { ApproveTokenRequest, RevokeApprovalRequest } from './allowance';
import { Config, ConfigUpdate, ExecutionSettings, RevokeTokenData } from './types';
export default class LIFI {
    private activeRouteDictionary;
    private configService;
    private chainsService;
    constructor(configUpdate?: ConfigUpdate);
    /**
     * Get the current configuration of the SDK
     * @return {Config} - The config object
     */
    getConfig: () => Config;
    /**
     * Get the SDK configuration after all setup calls are finished
     * @return {Promise<Config>} - The config object
     */
    getConfigAsync: () => Promise<Config>;
    /**
     * Get an instance of a provider for a specific cahin
     * @param {number} chainId - Id of the chain the provider is for
     * @param {boolean} archive - Whether to use an archive provider that is based on a default rpc or not. defaults to false
     * @return {FallbackProvider} The provider for the given chain
     */
    getRpcProvider: (chainId: number, archive?: boolean) => Promise<FallbackProvider>;
    /**
     * Set a new confuration for the SDK
     * @param {ConfigUpdate} configUpdate - An object containing the configuration fields that should be updated.
     * @return {Config} The renewed config object
     */
    setConfig: (configUpdate: ConfigUpdate) => Config;
    /**
     * Get a set of current possibilities based on a request that specifies which chains, exchanges and bridges are preferred or unwanted.
     * @param {PossibilitiesRequest} request - Object defining preferences regarding chain, exchanges and bridges
     * @return {Promise<PossibilitiesResponse>} Object listing current possibilities for any-to-any cross-chain-swaps based on the provided preferences.
     * @throws {LifiError} Throws a LifiError if request fails.
     */
    getPossibilities: (request?: PossibilitiesRequest, options?: RequestOptions) => Promise<PossibilitiesResponse>;
    /**
     * Fetch information about a Token
     * @param {ChainKey | ChainId} chain - Id or key of the chain that contains the token
     * @param {string} token - Address or symbol of the token on the requested chain
     * @throws {LifiError} - Throws a LifiError if request fails
     */
    getToken: (chain: ChainKey | ChainId, token: string, options?: RequestOptions) => Promise<Token>;
    /**
     * Get a quote for a token transfer
     * @param {QuoteRequest} request - The configuration of the requested quote
     * @throws {LifiError} - Throws a LifiError if request fails
     */
    getQuote: (request: QuoteRequest, options?: RequestOptions) => Promise<Step>;
    /**
     * Get a quote for a destination contract call
     * @param {ContractCallQuoteRequest} request - The configuration of the requested destination call
     * @throws {LifiError} - Throws a LifiError if request fails
     */
    getContractCallQuote: (request: ContractCallQuoteRequest, options?: RequestOptions) => Promise<Step>;
    /**
     * Check the status of a transfer. For cross chain transfers, the "bridge" parameter is required.
     * @param {GetStatusRequest} request - Configuration of the requested status
     * @throws {LifiError} - Throws a LifiError if request fails
     */
    getStatus: (request: GetStatusRequest, options?: RequestOptions) => Promise<StatusResponse>;
    /**
     * Get the available tools to bridge and swap tokens.
     * @param {ToolsRequest?} request - The configuration of the requested tools
     * @returns The tools that are available on the requested chains
     */
    getTools: (request?: ToolsRequest, options?: RequestOptions) => Promise<ToolsResponse>;
    /**
     * Get all known tokens.
     * @param {TokensRequest?} request - The configuration of the requested tokens
     * @returns The tokens that are available on the requested chains
     */
    getTokens: (request?: TokensRequest, options?: RequestOptions) => Promise<TokensResponse>;
    /**
     * Get all available chains
     * @return {Promise<Chain[]>} A list of all available chains
     * @throws {LifiError} Throws a LifiError if request fails.
     */
    getChains: () => Promise<ExtendedChain[]>;
    /**
     * Get a set of routes for a request that describes a transfer of tokens.
     * @param {RoutesRequest} routesRequest - A description of the transfer.
     * @return {Promise<RoutesResponse>} The resulting routes that can be used to realize the described transfer of tokens.
     * @throws {LifiError} Throws a LifiError if request fails.
     */
    getRoutes: (request: RoutesRequest, options?: RequestOptions) => Promise<RoutesResponse>;
    /**
     * Get the transaction data for a single step of a route
     * @param {Step} step - The step object.
     * @return {Promise<Step>} The step populated with the transaction data.
     * @throws {LifiError} Throws a LifiError if request fails.
     */
    getStepTransaction: (step: Step, options?: RequestOptions) => Promise<Step>;
    /**
     * Stops the execution of an active route.
     * @param {Route} route - A route that is currently in execution.
     * @return {Route} The stopped route.
     */
    stopExecution: (route: Route) => Route;
    /**
     * Executes a route until a user interaction is necessary (signing transactions, etc.) and then halts until the route is resumed.
     * @param {Route} route - A route that is currently in execution.
     * @deprecated use updateRouteExecution instead.
     */
    moveExecutionToBackground: (route: Route) => void;
    /**
     * Updates route execution to background or foreground state.
     * @param {Route} route - A route that is currently in execution.
     * @param {boolean} settings - An object with execution settings.
     */
    updateRouteExecution: (route: Route, settings: Pick<ExecutionSettings, 'executeInBackground'>) => void;
    /**
     * Execute a route.
     * @param {Signer} signer - The signer required to send the transactions.
     * @param {Route} route - The route that should be executed. Cannot be an active route.
     * @param {ExecutionSettings} settings - An object containing settings and callbacks.
     * @return {Promise<Route>} The executed route.
     * @throws {LifiError} Throws a LifiError if the execution fails.
     */
    executeRoute: (signer: Signer, route: Route, settings?: ExecutionSettings) => Promise<Route>;
    /**
     * Resume the execution of a route that has been stopped or had an error while executing.
     * @param {Signer} signer - The signer required to send the transactions.
     * @param {Route} route - The route that is to be executed. Cannot be an active route.
     * @param {ExecutionSettings} settings - An object containing settings and callbacks.
     * @return {Promise<Route>} The executed route.
     * @throws {LifiError} Throws a LifiError if the execution fails.
     */
    resumeRoute: (signer: Signer, route: Route, settings?: ExecutionSettings) => Promise<Route>;
    private executeSteps;
    /**
     * Update the ExecutionSettings for an active route.
     * @param {ExecutionSettings} settings - An object with execution settings.
     * @param {Route} route - The active route that gets the new execution settings.
     * @throws {ValidationError} Throws a ValidationError if parameters are invalid.
     */
    updateExecutionSettings: (settings: ExecutionSettings, route: Route) => void;
    /**
     * Get the list of active routes.
     * @return {Route[]} A list of routes.
     */
    getActiveRoutes: () => Route[];
    /**
     * Return the current route information for given route. The route has to be active.
     * @param {Route} route - A route object.
     * @return {Route} The updated route.
     */
    getActiveRoute: (route: Route) => Route | undefined;
    /**
     * Returns the balances of a specific token a wallet holds across all aggregated chains.
     * @param {string} walletAddress - A wallet address.
     * @param {Token} token - A Token object.
     * @return {Promise<TokenAmount | null>} An object containing the token and the amounts on different chains.
     * @throws {ValidationError} Throws a ValidationError if parameters are invalid.
     */
    getTokenBalance: (walletAddress: string, token: Token) => Promise<TokenAmount | null>;
    /**
     * Returns the balances for a list tokens a wallet holds  across all aggregated chains.
     * @param {string} walletAddress - A wallet address.
     * @param {Token[]} tokens - A list of Token objects.
     * @return {Promise<TokenAmount[]>} A list of objects containing the tokens and the amounts on different chains.
     * @throws {ValidationError} Throws a ValidationError if parameters are invalid.
     */
    getTokenBalances: (walletAddress: string, tokens: Token[]) => Promise<TokenAmount[]>;
    /**
     * This method queries the balances of tokens for a specific list of chains for a given wallet.
     * @param {string} walletAddress - A walletaddress.
     * @param {{ [chainId: number]: Token[] }} tokensByChain - A list of Token objects organized by chain ids.
     * @return {Promise<{ [chainId: number]: TokenAmount[] }>} A list of objects containing the tokens and the amounts on different chains organized by the chosen chains.
     * @throws {ValidationError} Throws a ValidationError if parameters are invalid.
     */
    getTokenBalancesForChains: (walletAddress: string, tokensByChain: {
        [chainId: number]: Token[];
    }) => Promise<{
        [chainId: number]: TokenAmount[];
    }>;
    /**
     * Get the current approval for a certain token.
     * @param signer - The signer owning the token
     * @param token - The token that should be checked
     * @param approvalAddress - The address that has be approved
     */
    getTokenApproval: (signer: Signer, token: Token, approvalAddress: string) => Promise<string | undefined>;
    /**
     * Get the current approval for a list of token / approval address pairs.
     * @param signer - The signer owning the tokens
     * @param tokenData - A list of token and approval address pairs
     */
    bulkGetTokenApproval: (signer: Signer, tokenData: RevokeTokenData[]) => Promise<{
        token: Token;
        approval: string | undefined;
    }[]>;
    /**
     * Set approval for a certain token and amount.
     * @param { ApproveTokenRequest } request - The approval request
     */
    approveToken: (request: ApproveTokenRequest) => Promise<void>;
    /**
     * Revoke approval for a certain token.
     * @param { RevokeApprovalRequest } request - The revoke request
     */
    revokeTokenApproval: (request: RevokeApprovalRequest) => Promise<void>;
}
