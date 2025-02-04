"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnknownError = exports.NotFoundError = exports.BalanceError = exports.SlippageError = exports.TransactionError = exports.ValidationError = exports.ServerError = exports.ProviderError = exports.RPCError = exports.LifiError = exports.MetaMaskProviderErrorCode = exports.MetaMaskRPCErrorCode = exports.LifiErrorCode = void 0;
var ErrorType;
(function (ErrorType) {
    ErrorType["RPCError"] = "RPCError";
    ErrorType["ProviderError"] = "ProviderError";
    ErrorType["ServerError"] = "ServerError";
    ErrorType["TransactionError"] = "TransactionError";
    ErrorType["ValidationError"] = "ValidationError";
    ErrorType["NotFoundError"] = "NotFoundError";
    ErrorType["UnknownError"] = "UnknownError";
    ErrorType["SlippageError"] = "SlippageError";
})(ErrorType || (ErrorType = {}));
var LifiErrorCode;
(function (LifiErrorCode) {
    LifiErrorCode[LifiErrorCode["InternalError"] = 1000] = "InternalError";
    LifiErrorCode[LifiErrorCode["ValidationError"] = 1001] = "ValidationError";
    LifiErrorCode[LifiErrorCode["TransactionUnderpriced"] = 1002] = "TransactionUnderpriced";
    LifiErrorCode[LifiErrorCode["TransactionFailed"] = 1003] = "TransactionFailed";
    LifiErrorCode[LifiErrorCode["Timeout"] = 1004] = "Timeout";
    LifiErrorCode[LifiErrorCode["ProviderUnavailable"] = 1005] = "ProviderUnavailable";
    LifiErrorCode[LifiErrorCode["NotFound"] = 1006] = "NotFound";
    LifiErrorCode[LifiErrorCode["ChainSwitchError"] = 1007] = "ChainSwitchError";
    LifiErrorCode[LifiErrorCode["TransactionUnprepared"] = 1008] = "TransactionUnprepared";
    LifiErrorCode[LifiErrorCode["GasLimitError"] = 1009] = "GasLimitError";
    LifiErrorCode[LifiErrorCode["TransactionCanceled"] = 1010] = "TransactionCanceled";
    LifiErrorCode[LifiErrorCode["SlippageError"] = 1011] = "SlippageError";
    LifiErrorCode[LifiErrorCode["TransactionRejected"] = 1012] = "TransactionRejected";
    LifiErrorCode[LifiErrorCode["BalanceError"] = 1013] = "BalanceError";
})(LifiErrorCode = exports.LifiErrorCode || (exports.LifiErrorCode = {}));
var MetaMaskRPCErrorCode;
(function (MetaMaskRPCErrorCode) {
    MetaMaskRPCErrorCode[MetaMaskRPCErrorCode["invalidInput"] = -32000] = "invalidInput";
    MetaMaskRPCErrorCode[MetaMaskRPCErrorCode["resourceNotFound"] = -32001] = "resourceNotFound";
    MetaMaskRPCErrorCode[MetaMaskRPCErrorCode["resourceUnavailable"] = -32002] = "resourceUnavailable";
    MetaMaskRPCErrorCode[MetaMaskRPCErrorCode["transactionRejected"] = -32003] = "transactionRejected";
    MetaMaskRPCErrorCode[MetaMaskRPCErrorCode["methodNotSupported"] = -32004] = "methodNotSupported";
    MetaMaskRPCErrorCode[MetaMaskRPCErrorCode["limitExceeded"] = -32005] = "limitExceeded";
    MetaMaskRPCErrorCode[MetaMaskRPCErrorCode["parse"] = -32700] = "parse";
    MetaMaskRPCErrorCode[MetaMaskRPCErrorCode["invalidRequest"] = -32600] = "invalidRequest";
    MetaMaskRPCErrorCode[MetaMaskRPCErrorCode["methodNotFound"] = -32601] = "methodNotFound";
    MetaMaskRPCErrorCode[MetaMaskRPCErrorCode["invalidParams"] = -32602] = "invalidParams";
    MetaMaskRPCErrorCode[MetaMaskRPCErrorCode["internal"] = -32603] = "internal";
})(MetaMaskRPCErrorCode = exports.MetaMaskRPCErrorCode || (exports.MetaMaskRPCErrorCode = {}));
var MetaMaskProviderErrorCode;
(function (MetaMaskProviderErrorCode) {
    MetaMaskProviderErrorCode[MetaMaskProviderErrorCode["userRejectedRequest"] = 4001] = "userRejectedRequest";
    MetaMaskProviderErrorCode[MetaMaskProviderErrorCode["unauthorized"] = 4100] = "unauthorized";
    MetaMaskProviderErrorCode[MetaMaskProviderErrorCode["unsupportedMethod"] = 4200] = "unsupportedMethod";
    MetaMaskProviderErrorCode[MetaMaskProviderErrorCode["disconnected"] = 4900] = "disconnected";
    MetaMaskProviderErrorCode[MetaMaskProviderErrorCode["chainDisconnected"] = 4901] = "chainDisconnected";
})(MetaMaskProviderErrorCode = exports.MetaMaskProviderErrorCode || (exports.MetaMaskProviderErrorCode = {}));
class LifiError extends Error {
    constructor(type, code, message, htmlMessage, stack) {
        super(message);
        // Set the prototype explicitly: https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(this, LifiError.prototype);
        this.code = code;
        // the name property is used by toString(). It is a string and we can't use our custom ErrorTypes, that's why we have to cast
        this.name = type.toString();
        this.htmlMessage = htmlMessage;
        // passing a stack allows us to preserve the stack from errors that we caught and just want to transform in one of our custom errors
        if (stack) {
            this.stack = stack;
        }
    }
}
exports.LifiError = LifiError;
class RPCError extends LifiError {
    constructor(code, message, htmlMessage, stack) {
        super(ErrorType.RPCError, code, message, htmlMessage, stack);
    }
}
exports.RPCError = RPCError;
class ProviderError extends LifiError {
    constructor(code, message, htmlMessage, stack) {
        super(ErrorType.ProviderError, code, message, htmlMessage, stack);
    }
}
exports.ProviderError = ProviderError;
class ServerError extends LifiError {
    constructor(message, htmlMessage, stack) {
        super(ErrorType.ServerError, LifiErrorCode.InternalError, message, htmlMessage, stack);
    }
}
exports.ServerError = ServerError;
class ValidationError extends LifiError {
    constructor(message, htmlMessage, stack) {
        super(ErrorType.ValidationError, LifiErrorCode.ValidationError, message, htmlMessage, stack);
    }
}
exports.ValidationError = ValidationError;
class TransactionError extends LifiError {
    constructor(code, message, htmlMessage, stack) {
        super(ErrorType.TransactionError, code, message, htmlMessage, stack);
    }
}
exports.TransactionError = TransactionError;
class SlippageError extends LifiError {
    constructor(message, htmlMessage, stack) {
        super(ErrorType.SlippageError, LifiErrorCode.SlippageError, message, htmlMessage, stack);
    }
}
exports.SlippageError = SlippageError;
class BalanceError extends LifiError {
    constructor(message, htmlMessage, stack) {
        super(ErrorType.ValidationError, LifiErrorCode.BalanceError, message, htmlMessage, stack);
    }
}
exports.BalanceError = BalanceError;
class NotFoundError extends LifiError {
    constructor(message, htmlMessage, stack) {
        super(ErrorType.NotFoundError, LifiErrorCode.NotFound, message, htmlMessage, stack);
    }
}
exports.NotFoundError = NotFoundError;
class UnknownError extends LifiError {
    constructor(code, message, htmlMessage, stack) {
        super(ErrorType.UnknownError, code, message, htmlMessage, stack);
    }
}
exports.UnknownError = UnknownError;
