var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import utils from './utils';
export const getTokenBalance = (walletAddress, token) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenAmounts = yield getTokenBalances(walletAddress, [token]);
    return tokenAmounts.length ? tokenAmounts[0] : null;
});
export const getTokenBalances = (walletAddress, tokens) => __awaiter(void 0, void 0, void 0, function* () {
    // split by chain
    const tokensByChain = {};
    tokens.forEach((token) => {
        if (!tokensByChain[token.chainId]) {
            tokensByChain[token.chainId] = [];
        }
        tokensByChain[token.chainId].push(token);
    });
    const tokenAmountsByChain = yield getTokenBalancesForChains(walletAddress, tokensByChain);
    return Object.values(tokenAmountsByChain).flat();
});
export const getTokenBalancesForChains = (walletAddress, tokensByChain) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenAmountsByChain = {};
    const promises = Object.keys(tokensByChain).map((chainIdStr) => __awaiter(void 0, void 0, void 0, function* () {
        const chainId = parseInt(chainIdStr);
        const tokenAmounts = yield utils.getBalances(walletAddress, tokensByChain[chainId]);
        tokenAmountsByChain[chainId] = tokenAmounts;
    }));
    yield Promise.allSettled(promises);
    return tokenAmountsByChain;
});
