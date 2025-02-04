declare enum ErrorType {
    RPCError = "RPCError",
    ProviderError = "ProviderError",
    ServerError = "ServerError",
    TransactionError = "TransactionError",
    ValidationError = "ValidationError",
    NotFoundError = "NotFoundError",
    UnknownError = "UnknownError",
    SlippageError = "SlippageError"
}
export declare enum LifiErrorCode {
    InternalError = 1000,
    ValidationError = 1001,
    TransactionUnderpriced = 1002,
    TransactionFailed = 1003,
    Timeout = 1004,
    ProviderUnavailable = 1005,
    NotFound = 1006,
    ChainSwitchError = 1007,
    TransactionUnprepared = 1008,
    GasLimitError = 1009,
    TransactionCanceled = 1010,
    SlippageError = 1011,
    TransactionRejected = 1012,
    BalanceError = 1013
}
export declare enum MetaMaskRPCErrorCode {
    invalidInput = -32000,
    resourceNotFound = -32001,
    resourceUnavailable = -32002,
    transactionRejected = -32003,
    methodNotSupported = -32004,
    limitExceeded = -32005,
    parse = -32700,
    invalidRequest = -32600,
    methodNotFound = -32601,
    invalidParams = -32602,
    internal = -32603
}
export declare enum MetaMaskProviderErrorCode {
    userRejectedRequest = 4001,
    unauthorized = 4100,
    unsupportedMethod = 4200,
    disconnected = 4900,
    chainDisconnected = 4901
}
export type ErrorCode = LifiErrorCode | MetaMaskRPCErrorCode | MetaMaskProviderErrorCode;
export declare class LifiError extends Error {
    code: ErrorCode;
    htmlMessage?: string;
    constructor(type: ErrorType, code: number, message: string, htmlMessage?: string, stack?: string);
}
export declare class RPCError extends LifiError {
    constructor(code: ErrorCode, message: string, htmlMessage?: string, stack?: string);
}
export declare class ProviderError extends LifiError {
    constructor(code: ErrorCode, message: string, htmlMessage?: string, stack?: string);
}
export declare class ServerError extends LifiError {
    constructor(message: string, htmlMessage?: string, stack?: string);
}
export declare class ValidationError extends LifiError {
    constructor(message: string, htmlMessage?: string, stack?: string);
}
export declare class TransactionError extends LifiError {
    constructor(code: ErrorCode, message: string, htmlMessage?: string, stack?: string);
}
export declare class SlippageError extends LifiError {
    constructor(message: string, htmlMessage?: string, stack?: string);
}
export declare class BalanceError extends LifiError {
    constructor(message: string, htmlMessage?: string, stack?: string);
}
export declare class NotFoundError extends LifiError {
    constructor(message: string, htmlMessage?: string, stack?: string);
}
export declare class UnknownError extends LifiError {
    constructor(code: ErrorCode, message: string, htmlMessage?: string, stack?: string);
}
export {};
