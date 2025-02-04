var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
import { isRoutesRequest, isStep } from '../typeguards';
import { ValidationError } from '../utils/errors';
import { parseBackendError } from '../utils/parseError';
import ConfigService from './ConfigService';
const getPossibilities = (request, options) => __awaiter(void 0, void 0, void 0, function* () {
    if (!request) {
        request = {};
    }
    const configService = ConfigService.getInstance();
    const config = configService.getConfig();
    // apply defaults
    request.bridges = request.bridges || config.defaultRouteOptions.bridges;
    request.exchanges = request.exchanges || config.defaultRouteOptions.exchanges;
    // send request
    try {
        const result = yield axios.post(config.apiUrl + 'advanced/possibilities', request, {
            signal: options === null || options === void 0 ? void 0 : options.signal,
        });
        return result.data;
    }
    catch (e) {
        throw parseBackendError(e);
    }
});
const getToken = (chain, token, options) => __awaiter(void 0, void 0, void 0, function* () {
    if (!chain) {
        throw new ValidationError('Required parameter "chain" is missing.');
    }
    if (!token) {
        throw new ValidationError('Required parameter "token" is missing.');
    }
    const configService = ConfigService.getInstance();
    const config = configService.getConfig();
    try {
        const result = yield axios.get(config.apiUrl + 'token', {
            params: {
                chain,
                token,
            },
            signal: options === null || options === void 0 ? void 0 : options.signal,
        });
        return result.data;
    }
    catch (e) {
        throw parseBackendError(e);
    }
});
const getQuote = (request, options) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const configService = ConfigService.getInstance();
    const config = configService.getConfig();
    // validation
    const requiredParameters = [
        'fromChain',
        'fromToken',
        'fromAddress',
        'fromAmount',
        'toChain',
        'toToken',
    ];
    requiredParameters.forEach((requiredParameter) => {
        if (!request[requiredParameter]) {
            throw new ValidationError(`Required parameter "${requiredParameter}" is missing.`);
        }
    });
    // apply defaults
    request.order = request.order || config.defaultRouteOptions.order;
    request.slippage = request.slippage || config.defaultRouteOptions.slippage;
    request.integrator =
        request.integrator || config.defaultRouteOptions.integrator;
    request.referrer = request.referrer || config.defaultRouteOptions.referrer;
    request.fee = request.fee || config.defaultRouteOptions.fee;
    request.allowBridges =
        request.allowBridges || ((_a = config.defaultRouteOptions.bridges) === null || _a === void 0 ? void 0 : _a.allow);
    request.denyBridges =
        request.denyBridges || ((_b = config.defaultRouteOptions.bridges) === null || _b === void 0 ? void 0 : _b.deny);
    request.preferBridges =
        request.preferBridges || ((_c = config.defaultRouteOptions.bridges) === null || _c === void 0 ? void 0 : _c.prefer);
    request.allowExchanges =
        request.allowExchanges || ((_d = config.defaultRouteOptions.exchanges) === null || _d === void 0 ? void 0 : _d.allow);
    request.denyExchanges =
        request.denyExchanges || ((_e = config.defaultRouteOptions.exchanges) === null || _e === void 0 ? void 0 : _e.deny);
    request.preferExchanges =
        request.preferExchanges || ((_f = config.defaultRouteOptions.exchanges) === null || _f === void 0 ? void 0 : _f.prefer);
    try {
        const result = yield axios.get(config.apiUrl + 'quote', {
            params: request,
            signal: options === null || options === void 0 ? void 0 : options.signal,
        });
        return result.data;
    }
    catch (e) {
        throw parseBackendError(e);
    }
});
const getContractCallQuote = (request, options) => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h, _j, _k, _l, _m;
    const configService = ConfigService.getInstance();
    const config = configService.getConfig();
    // validation
    const requiredParameters = [
        'fromChain',
        'fromToken',
        'fromAddress',
        'toChain',
        'toToken',
        'toAmount',
        'toContractAddress',
        'toContractCallData',
        'toContractGasLimit',
    ];
    requiredParameters.forEach((requiredParameter) => {
        if (!request[requiredParameter]) {
            throw new ValidationError(`Required parameter "${requiredParameter}" is missing.`);
        }
    });
    // apply defaults
    // option.order is not used in this endpoint
    request.slippage = request.slippage || config.defaultRouteOptions.slippage;
    request.integrator =
        request.integrator || config.defaultRouteOptions.integrator;
    request.referrer = request.referrer || config.defaultRouteOptions.referrer;
    request.fee = request.fee || config.defaultRouteOptions.fee;
    request.allowBridges =
        request.allowBridges || ((_g = config.defaultRouteOptions.bridges) === null || _g === void 0 ? void 0 : _g.allow);
    request.denyBridges =
        request.denyBridges || ((_h = config.defaultRouteOptions.bridges) === null || _h === void 0 ? void 0 : _h.deny);
    request.preferBridges =
        request.preferBridges || ((_j = config.defaultRouteOptions.bridges) === null || _j === void 0 ? void 0 : _j.prefer);
    request.allowExchanges =
        request.allowExchanges || ((_k = config.defaultRouteOptions.exchanges) === null || _k === void 0 ? void 0 : _k.allow);
    request.denyExchanges =
        request.denyExchanges || ((_l = config.defaultRouteOptions.exchanges) === null || _l === void 0 ? void 0 : _l.deny);
    request.preferExchanges =
        request.preferExchanges || ((_m = config.defaultRouteOptions.exchanges) === null || _m === void 0 ? void 0 : _m.prefer);
    // send request
    try {
        const result = yield axios.post(config.apiUrl + 'quote/contractCall', request, {
            signal: options === null || options === void 0 ? void 0 : options.signal,
        });
        return result.data;
    }
    catch (e) {
        throw parseBackendError(e);
    }
});
const getStatus = ({ bridge, fromChain, toChain, txHash }, options) => __awaiter(void 0, void 0, void 0, function* () {
    if (fromChain !== toChain && !bridge) {
        throw new ValidationError('Parameter "bridge" is required for cross chain transfers.');
    }
    if (!fromChain) {
        throw new ValidationError('Required parameter "fromChain" is missing.');
    }
    if (!toChain) {
        throw new ValidationError('Required parameter "toChain" is missing.');
    }
    if (!txHash) {
        throw new ValidationError('Required parameter "txHash" is missing.');
    }
    const configService = ConfigService.getInstance();
    const config = configService.getConfig();
    try {
        const result = yield axios.get(config.apiUrl + 'status', {
            params: {
                bridge,
                fromChain,
                toChain,
                txHash,
            },
            signal: options === null || options === void 0 ? void 0 : options.signal,
        });
        return result.data;
    }
    catch (e) {
        throw parseBackendError(e);
    }
});
const getChains = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const configService = ConfigService.getInstance();
    const config = configService.getConfig();
    try {
        const result = yield axios.get(config.apiUrl + 'chains', {
            signal: options === null || options === void 0 ? void 0 : options.signal,
        });
        return result.data.chains;
    }
    catch (e) {
        throw parseBackendError(e);
    }
});
const getRoutes = (request, options) => __awaiter(void 0, void 0, void 0, function* () {
    if (!isRoutesRequest(request)) {
        throw new ValidationError('Invalid routes request.');
    }
    const configService = ConfigService.getInstance();
    const config = configService.getConfig();
    // apply defaults
    request.options = Object.assign(Object.assign({}, config.defaultRouteOptions), request.options);
    // send request
    try {
        const result = yield axios.post(config.apiUrl + 'advanced/routes', request, {
            signal: options === null || options === void 0 ? void 0 : options.signal,
        });
        return result.data;
    }
    catch (e) {
        throw parseBackendError(e);
    }
});
const getStepTransaction = (step, options) => __awaiter(void 0, void 0, void 0, function* () {
    if (!isStep(step)) {
        // While the validation fails for some users we should not enforce it
        // eslint-disable-next-line no-console
        console.warn('SDK Validation: Invalid Step', step);
    }
    const configService = ConfigService.getInstance();
    const config = configService.getConfig();
    try {
        const result = yield axios.post(config.apiUrl + 'advanced/stepTransaction', step, {
            signal: options === null || options === void 0 ? void 0 : options.signal,
        });
        return result.data;
    }
    catch (e) {
        throw parseBackendError(e);
    }
});
const getTools = (request, options) => __awaiter(void 0, void 0, void 0, function* () {
    const configService = ConfigService.getInstance();
    const config = configService.getConfig();
    const r = yield axios.get(config.apiUrl + 'tools', {
        params: request,
        signal: options === null || options === void 0 ? void 0 : options.signal,
    });
    return r.data;
});
const getTokens = (request, options) => __awaiter(void 0, void 0, void 0, function* () {
    const configService = ConfigService.getInstance();
    const config = configService.getConfig();
    const r = yield axios.get(config.apiUrl + 'tokens', {
        params: request,
        signal: options === null || options === void 0 ? void 0 : options.signal,
    });
    return r.data;
});
export default {
    getPossibilities,
    getToken,
    getQuote,
    getContractCallQuote,
    getStatus,
    getChains,
    getRoutes,
    getStepTransaction,
    getTools,
    getTokens,
};
