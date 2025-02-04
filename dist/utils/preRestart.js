import { LifiErrorCode } from './errors';
export const handlePreRestart = (route) => {
    var _a;
    for (let index = 0; index < route.steps.length; index++) {
        const stepHasFailed = ((_a = route.steps[index].execution) === null || _a === void 0 ? void 0 : _a.status) === 'FAILED';
        if (stepHasFailed) {
            handleErrorType(route, index);
            deleteFailedProcesses(route, index);
            deleteTransactionData(route, index);
        }
    }
};
const handleErrorType = (route, index) => {
    var _a, _b, _c, _d;
    const isGasLimitError = (_a = route.steps[index].execution) === null || _a === void 0 ? void 0 : _a.process.some((p) => { var _a; return ((_a = p.error) === null || _a === void 0 ? void 0 : _a.code) === LifiErrorCode.GasLimitError; });
    const isGasPriceError = (_b = route.steps[index].execution) === null || _b === void 0 ? void 0 : _b.process.some((p) => { var _a; return ((_a = p.error) === null || _a === void 0 ? void 0 : _a.code) === LifiErrorCode.TransactionUnderpriced; });
    if (isGasLimitError) {
        (_c = route.steps[index].estimate.gasCosts) === null || _c === void 0 ? void 0 : _c.forEach((gasCost) => (gasCost.limit = `${Math.round(Number(gasCost.limit) * 1.25)}`));
    }
    if (isGasPriceError) {
        (_d = route.steps[index].estimate.gasCosts) === null || _d === void 0 ? void 0 : _d.forEach((gasCost) => (gasCost.price = `${Math.round(Number(gasCost.price) * 1.25)}`));
    }
};
const deleteFailedProcesses = (route, index) => {
    if (route.steps[index].execution) {
        route.steps[index].execution.process = route.steps[index].execution.process.filter((process) => process.status === 'DONE');
    }
};
const deleteTransactionData = (route, index) => {
    route.steps[index].transactionRequest = undefined;
};
