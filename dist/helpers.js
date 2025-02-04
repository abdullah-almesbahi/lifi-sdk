var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { name, version } from './version';
const ethereumRequest = (method, params) => __awaiter(void 0, void 0, void 0, function* () {
    // If ethereum.request() exists, the provider is probably EIP-1193 compliant.
    if (!(ethereum === null || ethereum === void 0 ? void 0 : ethereum.request)) {
        throw new Error('Provider not available.');
    }
    return ethereum.request({
        method,
        params,
    });
});
/**
 * Predefined hook that decrypts calldata using EIP-1193 compliant wallet functions.
 * @param {string} walletAddress - The wallet address of the user that should decrypt the calldata.
 * @return {(encryptedData: string) => Promise<any>} A function that decrypts data using EIP-1193 compliant wallet functions.
 */
export const getEthereumDecryptionHook = (walletAddress) => {
    return (encryptedData) => {
        return ethereumRequest('eth_decrypt', [encryptedData, walletAddress]);
    };
};
/**
 * Predefined hook that get the public encryption key of a user using EIP-1193 compliant wallet functions.
 * @param {string} walletAddress - The wallet address of the user.
 * @return {(walletAddress: string) => () => Promise<any>} A function that return the public encryption key using EIP-1193 compliant wallet functions.
 */
export const getEthereumPublicKeyHook = (walletAddress) => {
    return () => {
        return ethereumRequest('eth_getEncryptionPublicKey', [walletAddress]);
    };
};
/**
 * Returns a random number between min (inclusive) and max (inclusive)
 */
export const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
export const isSameToken = (tokenA, tokenB) => tokenA.chainId === tokenB.chainId &&
    tokenA.address.toLowerCase() === tokenB.address.toLowerCase();
function semverCompare(a, b) {
    if (a.startsWith(b + '-')) {
        return -1;
    }
    if (b.startsWith(a + '-')) {
        return 1;
    }
    return a.localeCompare(b, undefined, {
        numeric: true,
        sensitivity: 'case',
        caseFirst: 'upper',
    });
}
export const checkPackageUpdates = (packageName, packageVersion, disableCheck) => __awaiter(void 0, void 0, void 0, function* () {
    if (disableCheck || process.env.NODE_ENV !== 'development') {
        return;
    }
    try {
        const pkgName = packageName !== null && packageName !== void 0 ? packageName : name;
        const response = yield (yield fetch(`https://registry.npmjs.org/${pkgName}/latest`)).json();
        const latestVersion = response.version;
        const currentVersion = packageVersion !== null && packageVersion !== void 0 ? packageVersion : version;
        if (semverCompare(latestVersion, currentVersion)) {
            console.warn(
            // eslint-disable-next-line max-len
            `${pkgName}: new package version is available. Please update as soon as possible to enjoy the newest features. Current version: ${currentVersion}. Latest version: ${latestVersion}.`);
        }
    }
    catch (error) {
        // Cannot verify version, might be network error etc. We don't bother showing anything in that case
    }
});
