var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ChainId, } from '../types';
const DefaultExecutionSettings = {
    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    updateCallback: () => { },
    switchChainHook: () => Promise.resolve(undefined),
    acceptSlippageUpdateHook: () => Promise.resolve(undefined),
    acceptExchangeRateUpdateHook: () => Promise.resolve(undefined),
    infiniteApproval: false,
    executeInBackground: false,
};
export default class ConfigService {
    constructor() {
        this.resolveSetupPromise = undefined;
        /**
         * This call immediately returns the current config. It does not make sure that all chain data is already loaded
         * Use this if you need access to basic information like API urls or settings
         */
        this.getConfig = () => {
            return this.config;
        };
        /**
         * This call waits for all setup promises to be done.
         * Use this if you need access to chain data (RPCs or multicalls)
         */
        this.getConfigAsync = () => __awaiter(this, void 0, void 0, function* () {
            yield this.setupPromise;
            return this.config;
        });
        this.updateConfig = (configUpdate) => {
            // API
            this.config.apiUrl = configUpdate.apiUrl || this.config.apiUrl;
            // RPCS
            this.config.rpcs = Object.assign(this.config.rpcs, configUpdate.rpcs);
            // MULTICALL
            this.config.multicallAddresses = Object.assign(this.config.multicallAddresses, configUpdate.multicallAddresses);
            // SETTINGS
            this.config.defaultExecutionSettings = Object.assign(this.config.defaultExecutionSettings, configUpdate.defaultExecutionSettings);
            // OPTIONS
            this.config.defaultRouteOptions = Object.assign(this.config.defaultRouteOptions, configUpdate.defaultRouteOptions);
            return this.config;
        };
        this.updateChains = (chains) => {
            var _a, _b;
            for (const chain of chains) {
                const chainId = chain.id;
                // set RPCs if they were not configured by the user before
                if (!((_a = this.config.rpcs[chainId]) === null || _a === void 0 ? void 0 : _a.length)) {
                    this.config.rpcs[chainId] = chain.metamask.rpcUrls;
                }
                // set multicall addresses if they exist and were not configured by the user before
                if (chain.multicallAddress && !this.config.multicallAddresses[chainId]) {
                    this.config.multicallAddresses[chainId] = chain.multicallAddress;
                }
            }
            (_b = this.resolveSetupPromise) === null || _b === void 0 ? void 0 : _b.call(this);
            return this.config;
        };
        this.config = ConfigService.getDefaultConfig();
        this.setupPromise = new Promise((resolve) => {
            this.resolveSetupPromise = resolve;
        });
    }
    static chainIdToObject(val) {
        const result = {};
        const values = Object.values(ChainId);
        values.forEach((chainId) => {
            if (typeof chainId !== 'string') {
                result[chainId] = val ? JSON.parse(JSON.stringify(val)) : val;
            }
        });
        return result;
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new ConfigService();
        }
        return this.instance;
    }
}
ConfigService.getDefaultConfig = () => {
    return {
        apiUrl: 'https://li.quest/v1/',
        rpcs: ConfigService.chainIdToObject([]),
        multicallAddresses: ConfigService.chainIdToObject(undefined),
        defaultExecutionSettings: DefaultExecutionSettings,
        defaultRouteOptions: {
            integrator: 'lifi-sdk',
        },
    };
};
