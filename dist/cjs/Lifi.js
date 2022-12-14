"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const allowance_1 = require("./allowance");
const balance = __importStar(require("./balance"));
const connectors_1 = require("./connectors");
const StatusManager_1 = require("./execution/StatusManager");
const StepExecutor_1 = require("./execution/StepExecutor");
const helpers_1 = require("./helpers");
const ApiService_1 = __importDefault(require("./services/ApiService"));
const ChainsService_1 = __importDefault(require("./services/ChainsService"));
const ConfigService_1 = __importDefault(require("./services/ConfigService"));
const typeguards_1 = require("./typeguards");
const errors_1 = require("./utils/errors");
const preRestart_1 = require("./utils/preRestart");
const utils_1 = require("./utils/utils");
const version_1 = require("./version");
class LIFI {
    constructor(configUpdate) {
        this.activeRouteDictionary = {};
        /**
         * Get the current configuration of the SDK
         * @return {Config} - The config object
         */
        this.getConfig = () => {
            return this.configService.getConfig();
        };
        /**
         * Get the SDK configuration after all setup calls are finished
         * @return {Promise<Config>} - The config object
         */
        this.getConfigAsync = () => {
            return this.configService.getConfigAsync();
        };
        /**
         * Get an instance of a provider for a specific cahin
         * @param {number} chainId - Id of the chain the provider is for
         * @param {boolean} archive - Whether to use an archive provider that is based on a default rpc or not. defaults to false
         * @return {FallbackProvider} The provider for the given chain
         */
        this.getRpcProvider = (chainId, archive = false) => {
            return (0, connectors_1.getRpcProvider)(chainId, archive);
        };
        /**
         * Set a new confuration for the SDK
         * @param {ConfigUpdate} configUpdate - An object containing the configuration fields that should be updated.
         * @return {Config} The renewed config object
         */
        this.setConfig = (configUpdate) => {
            return this.configService.updateConfig(configUpdate);
        };
        /**
         * Get a set of current possibilities based on a request that specifies which chains, exchanges and bridges are preferred or unwanted.
         * @param {PossibilitiesRequest} request - Object defining preferences regarding chain, exchanges and bridges
         * @return {Promise<PossibilitiesResponse>} Object listing current possibilities for any-to-any cross-chain-swaps based on the provided preferences.
         * @throws {LifiError} Throws a LifiError if request fails.
         */
        this.getPossibilities = (request, options) => __awaiter(this, void 0, void 0, function* () {
            return ApiService_1.default.getPossibilities(request, options);
        });
        /**
         * Fetch information about a Token
         * @param {ChainKey | ChainId} chain - Id or key of the chain that contains the token
         * @param {string} token - Address or symbol of the token on the requested chain
         * @throws {LifiError} - Throws a LifiError if request fails
         */
        this.getToken = (chain, token, options) => __awaiter(this, void 0, void 0, function* () {
            return ApiService_1.default.getToken(chain, token, options);
        });
        /**
         * Get a quote for a token transfer
         * @param {QuoteRequest} request - The configuration of the requested quote
         * @throws {LifiError} - Throws a LifiError if request fails
         */
        this.getQuote = (request, options) => __awaiter(this, void 0, void 0, function* () {
            return ApiService_1.default.getQuote(request, options);
        });
        /**
         * Get a quote for a destination contract call
         * @param {ContractCallQuoteRequest} request - The configuration of the requested destination call
         * @throws {LifiError} - Throws a LifiError if request fails
         */
        this.getContractCallQuote = (request, options) => __awaiter(this, void 0, void 0, function* () {
            return ApiService_1.default.getContractCallQuote(request, options);
        });
        /**
         * Check the status of a transfer. For cross chain transfers, the "bridge" parameter is required.
         * @param {GetStatusRequest} request - Configuration of the requested status
         * @throws {LifiError} - Throws a LifiError if request fails
         */
        this.getStatus = (request, options) => __awaiter(this, void 0, void 0, function* () {
            return ApiService_1.default.getStatus(request, options);
        });
        /**
         * Get the available tools to bridge and swap tokens.
         * @param {ToolsRequest?} request - The configuration of the requested tools
         * @returns The tools that are available on the requested chains
         */
        this.getTools = (request, options) => __awaiter(this, void 0, void 0, function* () {
            return ApiService_1.default.getTools(request || {}, options);
        });
        /**
         * Get all known tokens.
         * @param {TokensRequest?} request - The configuration of the requested tokens
         * @returns The tokens that are available on the requested chains
         */
        this.getTokens = (request, options) => __awaiter(this, void 0, void 0, function* () {
            return ApiService_1.default.getTokens(request || {}, options);
        });
        /**
         * Get all available chains
         * @return {Promise<Chain[]>} A list of all available chains
         * @throws {LifiError} Throws a LifiError if request fails.
         */
        this.getChains = () => __awaiter(this, void 0, void 0, function* () {
            return this.chainsService.getChains();
        });
        /**
         * Get a set of routes for a request that describes a transfer of tokens.
         * @param {RoutesRequest} routesRequest - A description of the transfer.
         * @return {Promise<RoutesResponse>} The resulting routes that can be used to realize the described transfer of tokens.
         * @throws {LifiError} Throws a LifiError if request fails.
         */
        this.getRoutes = (request, options) => __awaiter(this, void 0, void 0, function* () {
            return ApiService_1.default.getRoutes(request, options);
        });
        /**
         * Get the transaction data for a single step of a route
         * @param {Step} step - The step object.
         * @return {Promise<Step>} The step populated with the transaction data.
         * @throws {LifiError} Throws a LifiError if request fails.
         */
        this.getStepTransaction = (step, options) => __awaiter(this, void 0, void 0, function* () {
            return ApiService_1.default.getStepTransaction(step, options);
        });
        /**
         * Stops the execution of an active route.
         * @param {Route} route - A route that is currently in execution.
         * @return {Route} The stopped route.
         */
        this.stopExecution = (route) => {
            if (!this.activeRouteDictionary[route.id]) {
                return route;
            }
            for (const executor of this.activeRouteDictionary[route.id].executors) {
                executor.setInteraction({
                    allowInteraction: false,
                    allowUpdates: false,
                    stopExecution: true,
                });
            }
            delete this.activeRouteDictionary[route.id];
            return route;
        };
        /**
         * Executes a route until a user interaction is necessary (signing transactions, etc.) and then halts until the route is resumed.
         * @param {Route} route - A route that is currently in execution.
         * @deprecated use updateRouteExecution instead.
         */
        this.moveExecutionToBackground = (route) => {
            const activeRoute = this.activeRouteDictionary[route.id];
            if (!activeRoute) {
                return;
            }
            for (const executor of activeRoute.executors) {
                executor.setInteraction({ allowInteraction: false, allowUpdates: true });
            }
            activeRoute.settings = Object.assign(Object.assign({}, activeRoute.settings), { executeInBackground: true });
        };
        /**
         * Updates route execution to background or foreground state.
         * @param {Route} route - A route that is currently in execution.
         * @param {boolean} settings - An object with execution settings.
         */
        this.updateRouteExecution = (route, settings) => {
            const activeRoute = this.activeRouteDictionary[route.id];
            if (!activeRoute) {
                return;
            }
            for (const executor of activeRoute.executors) {
                executor.setInteraction({
                    allowInteraction: !settings.executeInBackground,
                    allowUpdates: true,
                });
            }
            // Update active route settings so we know what the current state of execution is
            activeRoute.settings = Object.assign(Object.assign({}, activeRoute.settings), settings);
        };
        /**
         * Execute a route.
         * @param {Signer} signer - The signer required to send the transactions.
         * @param {Route} route - The route that should be executed. Cannot be an active route.
         * @param {ExecutionSettings} settings - An object containing settings and callbacks.
         * @return {Promise<Route>} The executed route.
         * @throws {LifiError} Throws a LifiError if the execution fails.
         */
        this.executeRoute = (signer, route, settings) => __awaiter(this, void 0, void 0, function* () {
            // Deep clone to prevent side effects
            const clonedRoute = (0, utils_1.deepClone)(route);
            // Check if route is already running
            if (this.activeRouteDictionary[clonedRoute.id]) {
                // TODO: maybe inform user why nothing happens?
                return clonedRoute;
            }
            return this.executeSteps(signer, clonedRoute, settings);
        });
        /**
         * Resume the execution of a route that has been stopped or had an error while executing.
         * @param {Signer} signer - The signer required to send the transactions.
         * @param {Route} route - The route that is to be executed. Cannot be an active route.
         * @param {ExecutionSettings} settings - An object containing settings and callbacks.
         * @return {Promise<Route>} The executed route.
         * @throws {LifiError} Throws a LifiError if the execution fails.
         */
        this.resumeRoute = (signer, route, settings) => __awaiter(this, void 0, void 0, function* () {
            // Deep clone to prevent side effects
            const clonedRoute = (0, utils_1.deepClone)(route);
            const activeRoute = this.activeRouteDictionary[clonedRoute.id];
            if (activeRoute) {
                const executionHalted = activeRoute.executors.some((executor) => executor.executionStopped);
                if (!executionHalted) {
                    // Check if we want to resume route execution in the background
                    this.updateRouteExecution(route, {
                        executeInBackground: settings === null || settings === void 0 ? void 0 : settings.executeInBackground,
                    });
                    return clonedRoute;
                }
            }
            (0, preRestart_1.handlePreRestart)(clonedRoute);
            return this.executeSteps(signer, clonedRoute, settings);
        });
        this.executeSteps = (signer, route, settings) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const config = this.configService.getConfig();
            const executionData = {
                route,
                executors: [],
                settings: Object.assign(Object.assign({}, config.defaultExecutionSettings), settings),
            };
            this.activeRouteDictionary[route.id] = executionData;
            const statusManager = new StatusManager_1.StatusManager(route, this.activeRouteDictionary[route.id].settings, (route) => {
                if (this.activeRouteDictionary[route.id]) {
                    this.activeRouteDictionary[route.id].route = route;
                }
            });
            // Loop over steps and execute them
            for (let index = 0; index < route.steps.length; index++) {
                const activeRoute = this.activeRouteDictionary[route.id];
                // Check if execution has stopped in the meantime
                if (!activeRoute) {
                    break;
                }
                const step = route.steps[index];
                const previousStep = route.steps[index - 1];
                // Check if the step is already done
                if (((_a = step.execution) === null || _a === void 0 ? void 0 : _a.status) === 'DONE') {
                    continue;
                }
                // Update amount using output of previous execution. In the future this should be handled by calling `updateRoute`
                if ((_b = previousStep === null || previousStep === void 0 ? void 0 : previousStep.execution) === null || _b === void 0 ? void 0 : _b.toAmount) {
                    step.action.fromAmount = previousStep.execution.toAmount;
                }
                try {
                    const stepExecutor = new StepExecutor_1.StepExecutor(statusManager, activeRoute.settings);
                    activeRoute.executors.push(stepExecutor);
                    // Check if we want to execute this step in the background
                    this.updateRouteExecution(route, activeRoute.settings);
                    const executedStep = yield stepExecutor.executeStep(signer, step);
                    // We may reach this point if user interaction isn't allowed. We want to stop execution until we resume it
                    if (((_c = executedStep.execution) === null || _c === void 0 ? void 0 : _c.status) !== 'DONE') {
                        this.stopExecution(route);
                    }
                    // Execution stopped during the current step, we don't want to continue to the next step so we return already
                    if (stepExecutor.executionStopped) {
                        return route;
                    }
                }
                catch (e) {
                    this.stopExecution(route);
                    throw e;
                }
            }
            // Clean up after the execution
            delete this.activeRouteDictionary[route.id];
            return route;
        });
        /**
         * Update the ExecutionSettings for an active route.
         * @param {ExecutionSettings} settings - An object with execution settings.
         * @param {Route} route - The active route that gets the new execution settings.
         * @throws {ValidationError} Throws a ValidationError if parameters are invalid.
         */
        this.updateExecutionSettings = (settings, route) => {
            if (!this.activeRouteDictionary[route.id]) {
                throw new errors_1.ValidationError("Can't set ExecutionSettings for the inactive route.");
            }
            const config = this.configService.getConfig();
            this.activeRouteDictionary[route.id].settings = Object.assign(Object.assign({}, config.defaultExecutionSettings), settings);
        };
        /**
         * Get the list of active routes.
         * @return {Route[]} A list of routes.
         */
        this.getActiveRoutes = () => {
            return Object.values(this.activeRouteDictionary).map((dict) => dict.route);
        };
        /**
         * Return the current route information for given route. The route has to be active.
         * @param {Route} route - A route object.
         * @return {Route} The updated route.
         */
        this.getActiveRoute = (route) => {
            var _a;
            return (_a = this.activeRouteDictionary[route.id]) === null || _a === void 0 ? void 0 : _a.route;
        };
        /**
         * Returns the balances of a specific token a wallet holds across all aggregated chains.
         * @param {string} walletAddress - A wallet address.
         * @param {Token} token - A Token object.
         * @return {Promise<TokenAmount | null>} An object containing the token and the amounts on different chains.
         * @throws {ValidationError} Throws a ValidationError if parameters are invalid.
         */
        this.getTokenBalance = (walletAddress, token) => __awaiter(this, void 0, void 0, function* () {
            if (!walletAddress) {
                throw new errors_1.ValidationError('Missing walletAddress.');
            }
            if (!(0, typeguards_1.isToken)(token)) {
                throw new errors_1.ValidationError(`Invalid token passed: address "${token.address}" on chainId "${token.chainId}"`);
            }
            return balance.getTokenBalance(walletAddress, token);
        });
        /**
         * Returns the balances for a list tokens a wallet holds  across all aggregated chains.
         * @param {string} walletAddress - A wallet address.
         * @param {Token[]} tokens - A list of Token objects.
         * @return {Promise<TokenAmount[]>} A list of objects containing the tokens and the amounts on different chains.
         * @throws {ValidationError} Throws a ValidationError if parameters are invalid.
         */
        this.getTokenBalances = (walletAddress, tokens) => __awaiter(this, void 0, void 0, function* () {
            if (!walletAddress) {
                throw new errors_1.ValidationError('Missing walletAddress.');
            }
            const invalidTokens = tokens.filter((token) => !(0, typeguards_1.isToken)(token));
            if (invalidTokens.length) {
                throw new errors_1.ValidationError(`Invalid token passed: address "${invalidTokens[0].address}" on chainId "${invalidTokens[0].chainId}"`);
            }
            return balance.getTokenBalances(walletAddress, tokens);
        });
        /**
         * This method queries the balances of tokens for a specific list of chains for a given wallet.
         * @param {string} walletAddress - A walletaddress.
         * @param {{ [chainId: number]: Token[] }} tokensByChain - A list of Token objects organized by chain ids.
         * @return {Promise<{ [chainId: number]: TokenAmount[] }>} A list of objects containing the tokens and the amounts on different chains organized by the chosen chains.
         * @throws {ValidationError} Throws a ValidationError if parameters are invalid.
         */
        this.getTokenBalancesForChains = (walletAddress, tokensByChain) => __awaiter(this, void 0, void 0, function* () {
            if (!walletAddress) {
                throw new errors_1.ValidationError('Missing walletAddress.');
            }
            const tokenList = Object.values(tokensByChain).flat();
            const invalidTokens = tokenList.filter((token) => !(0, typeguards_1.isToken)(token));
            if (invalidTokens.length) {
                throw new errors_1.ValidationError(`Invalid token passed: address "${invalidTokens[0].address}" on chainId "${invalidTokens[0].chainId}"`);
            }
            return balance.getTokenBalancesForChains(walletAddress, tokensByChain);
        });
        /**
         * Get the current approval for a certain token.
         * @param signer - The signer owning the token
         * @param token - The token that should be checked
         * @param approvalAddress - The address that has be approved
         */
        this.getTokenApproval = (signer, token, approvalAddress) => __awaiter(this, void 0, void 0, function* () {
            return (0, allowance_1.getTokenApproval)(signer, token, approvalAddress);
        });
        /**
         * Get the current approval for a list of token / approval address pairs.
         * @param signer - The signer owning the tokens
         * @param tokenData - A list of token and approval address pairs
         */
        this.bulkGetTokenApproval = (signer, tokenData) => __awaiter(this, void 0, void 0, function* () {
            return (0, allowance_1.bulkGetTokenApproval)(signer, tokenData);
        });
        /**
         * Set approval for a certain token and amount.
         * @param { ApproveTokenRequest } request - The approval request
         */
        this.approveToken = (request) => {
            return (0, allowance_1.approveToken)(request);
        };
        /**
         * Revoke approval for a certain token.
         * @param { RevokeApprovalRequest } request - The revoke request
         */
        this.revokeTokenApproval = (request) => {
            return (0, allowance_1.revokeTokenApproval)(request);
        };
        this.configService = ConfigService_1.default.getInstance();
        if (configUpdate) {
            // Update API urls before we request chains
            this.configService.updateConfig(configUpdate);
        }
        this.chainsService = ChainsService_1.default.getInstance();
        this.chainsService.getChains().then((chains) => {
            this.configService.updateChains(chains);
        });
        (0, helpers_1.checkPackageUpdates)(version_1.name, version_1.version, configUpdate === null || configUpdate === void 0 ? void 0 : configUpdate.disableVersionCheck);
    }
}
exports.default = LIFI;
