"use strict";
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
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const ethers_1 = require("ethers");
const connectors_1 = require("../connectors");
const multicall_1 = require("../utils/multicall");
const utils_1 = require("../utils/utils");
const balanceAbi = [
    {
        constant: true,
        inputs: [{ name: 'who', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [{ name: 'addr', type: 'address' }],
        name: 'getEthBalance',
        outputs: [{ name: 'balance', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
];
const getBalances = (walletAddress, tokens) => __awaiter(void 0, void 0, void 0, function* () {
    if (tokens.length === 0) {
        return [];
    }
    const { chainId } = tokens[0];
    tokens.forEach((token) => {
        if (token.chainId !== chainId) {
            // eslint-disable-next-line no-console
            console.warn(`Requested tokens have to be on the same chain.`);
            return [];
        }
    });
    if ((yield (0, connectors_1.getMulticallAddress)(chainId)) && tokens.length > 1) {
        return getBalancesFromProviderUsingMulticall(walletAddress, tokens);
    }
    else {
        return getBalancesFromProvider(walletAddress, tokens);
    }
});
const getBalancesFromProviderUsingMulticall = (walletAddress, tokens) => __awaiter(void 0, void 0, void 0, function* () {
    // Configuration
    const { chainId } = tokens[0];
    const multicallAddress = yield (0, connectors_1.getMulticallAddress)(chainId);
    if (!multicallAddress) {
        throw new Error('No multicallAddress found for the given chain.');
    }
    return executeMulticall(walletAddress, tokens, multicallAddress, chainId);
});
const executeMulticall = (walletAddress, tokens, multicallAddress, chainId) => __awaiter(void 0, void 0, void 0, function* () {
    // Collect calls we want to make
    const calls = [];
    tokens.map((token) => {
        if ((0, utils_1.isZeroAddress)(token.address)) {
            calls.push({
                address: multicallAddress,
                name: 'getEthBalance',
                params: [walletAddress],
            });
        }
        else {
            calls.push({
                address: token.address,
                name: 'balanceOf',
                params: [walletAddress],
            });
        }
    });
    const res = yield fetchViaMulticall(calls, balanceAbi, chainId, multicallAddress);
    if (!res.length) {
        return [];
    }
    return tokens.map((token, i) => {
        const amount = new bignumber_js_1.default(res[i].amount.toString() || '0')
            .shiftedBy(-token.decimals)
            .toFixed();
        return Object.assign(Object.assign({}, token), { amount: amount || '0', blockNumber: res[i].blockNumber });
    });
});
const fetchViaMulticall = (calls, abi, chainId, multicallAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, multicall_1.fetchDataUsingMulticall)(calls, abi, chainId, multicallAddress);
    return result.map(({ data, blockNumber }) => ({
        amount: data ? data : new bignumber_js_1.default(0),
        blockNumber,
    }));
});
const getBalancesFromProvider = (walletAddress, tokens) => __awaiter(void 0, void 0, void 0, function* () {
    const chainId = tokens[0].chainId;
    const rpc = yield (0, connectors_1.getRpcProvider)(chainId);
    const tokenAmountPromises = tokens.map((token) => __awaiter(void 0, void 0, void 0, function* () {
        let amount = '0';
        let blockNumber;
        try {
            const balance = yield getBalanceFromProvider(walletAddress, token.address, chainId, rpc);
            amount = new bignumber_js_1.default(balance.amount.toString())
                .shiftedBy(-token.decimals)
                .toString();
            blockNumber = balance.blockNumber;
        }
        catch (e) {
            // eslint-disable-next-line no-console
            console.warn(e);
        }
        return Object.assign(Object.assign({}, token), { amount,
            blockNumber });
    }));
    return Promise.all(tokenAmountPromises);
});
const getBalanceFromProvider = (walletAddress, assetId, chainId, provider) => __awaiter(void 0, void 0, void 0, function* () {
    const blockNumber = yield getCurrentBlockNumber(chainId);
    let balance;
    if ((0, utils_1.isZeroAddress)(assetId)) {
        balance = yield provider.getBalance(walletAddress, blockNumber);
    }
    else {
        const contract = new ethers_1.ethers.Contract(assetId, ['function balanceOf(address owner) view returns (uint256)'], provider);
        balance = yield contract.balanceOf(walletAddress, {
            blockTag: blockNumber,
        });
    }
    return {
        amount: balance,
        blockNumber,
    };
});
const getCurrentBlockNumber = (chainId) => __awaiter(void 0, void 0, void 0, function* () {
    const rpc = yield (0, connectors_1.getRpcProvider)(chainId);
    return rpc.getBlockNumber();
});
exports.default = {
    getBalances,
};
