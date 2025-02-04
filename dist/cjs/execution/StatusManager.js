"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusManager = void 0;
const types_1 = require("../types");
const utils_1 = require("../utils/utils");
const utils_2 = require("./utils");
/**
 * Manages status updates of a route and provides various functions for tracking processes
 * @param  {Route} route  The route this StatusManger belongs to.
 * @param  {InternalExecutionSettings} settings   The ExecutionSettings for this route.
 * @param  {InternalUpdateRouteCallback} internalUpdateRouteCallback  Internal callback to propage route changes.
 * @return {StatusManager}       An instance of StatusManager.
 */
class StatusManager {
    constructor(route, settings, internalUpdateRouteCallback) {
        this.shouldUpdate = true;
        /**
         * Initializes the execution object of a Step.
         * @param  {Step} step  The current step in execution
         * @return {Execution}       The initialized execution object for this step and a function to update this step
         */
        this.initExecutionObject = (step) => {
            const currentExecution = step.execution || (0, utils_1.deepClone)(types_1.emptyExecution);
            if (!step.execution) {
                step.execution = currentExecution;
                step.execution.status = 'PENDING';
                this.updateStepInRoute(step);
            }
            // Change status to PENDING after resuming from FAILED
            if (currentExecution.status === 'FAILED') {
                currentExecution.status = 'PENDING';
                this.updateStepInRoute(step);
            }
            return currentExecution;
        };
        /**
         * Create and push a new process into the execution.
         * @param  {ProcessType} type Type of the process. Used to identify already existing processes.
         * @param  {Step} step The step that should contain the new process.
         * @param  {Status} status By default created procces is set to the STARTED status. We can override new process with the needed status.
         * @return {Process}
         */
        this.findOrCreateProcess = (step, type, status) => {
            var _a;
            if (!((_a = step.execution) === null || _a === void 0 ? void 0 : _a.process)) {
                throw new Error("Execution hasn't been initialized.");
            }
            const process = step.execution.process.find((p) => p.type === type);
            if (process) {
                if (status && process.status !== status) {
                    process.status = status;
                    this.updateStepInRoute(step);
                }
                return process;
            }
            const newProcess = {
                type: type,
                startedAt: Date.now(),
                message: (0, utils_2.getProcessMessage)(type, status !== null && status !== void 0 ? status : 'STARTED'),
                status: status !== null && status !== void 0 ? status : 'STARTED',
            };
            step.execution.process.push(newProcess);
            this.updateStepInRoute(step);
            return newProcess;
        };
        /**
         * Update a process object.
         * @param  {Step} step The step where the process should be updated
         * @param  {ProcessType} type  The process type to update
         * @param  {Status} status The status the process gets.
         * @param  {object} [params]   Additional parameters to append to the process.
         * @return {Process} The update process
         */
        this.updateProcess = (step, type, status, params) => {
            var _a, _b, _c;
            if (!step.execution) {
                throw new Error("Can't update an empty step execution.");
            }
            const currentProcess = (_a = step === null || step === void 0 ? void 0 : step.execution) === null || _a === void 0 ? void 0 : _a.process.find((p) => p.type === type);
            if (!currentProcess) {
                throw new Error("Can't find a process for the given type.");
            }
            switch (status) {
                case 'CANCELLED':
                    currentProcess.doneAt = Date.now();
                    break;
                case 'FAILED':
                    currentProcess.doneAt = Date.now();
                    step.execution.status = 'FAILED';
                    break;
                case 'DONE':
                    currentProcess.doneAt = Date.now();
                    break;
                case 'PENDING':
                    step.execution.status = 'PENDING';
                    break;
                case 'ACTION_REQUIRED':
                    step.execution.status = 'ACTION_REQUIRED';
                    break;
                default:
                    break;
            }
            currentProcess.status = status;
            currentProcess.message = (0, utils_2.getProcessMessage)(type, status);
            // set extra parameters or overwritte the standard params set in the switch statement
            if (params) {
                for (const [key, value] of Object.entries(params)) {
                    currentProcess[key] = value;
                }
            }
            // Sort processes, the ones with DONE status go first
            step.execution.process = [
                ...(_b = step === null || step === void 0 ? void 0 : step.execution) === null || _b === void 0 ? void 0 : _b.process.filter((process) => process.status === 'DONE'),
                ...(_c = step === null || step === void 0 ? void 0 : step.execution) === null || _c === void 0 ? void 0 : _c.process.filter((process) => process.status !== 'DONE'),
            ];
            this.updateStepInRoute(step); // updates the step in the route
            return currentProcess;
        };
        /**
         * Remove a process from the execution
         * @param  {Step} step The step where the process should be removed from
         * @param  {ProcessType} type  The process type to remove
         * @return {void}
         */
        this.removeProcess = (step, type) => {
            if (!step.execution) {
                throw new Error("Execution hasn't been initialized.");
            }
            const index = step.execution.process.findIndex((p) => p.type === type);
            step.execution.process.splice(index, 1);
            this.updateStepInRoute(step);
        };
        this.updateStepInRoute = (step) => {
            if (!this.shouldUpdate) {
                return step;
            }
            const stepIndex = this.route.steps.findIndex((routeStep) => routeStep.id === step.id);
            if (stepIndex === -1) {
                throw new Error("Couldn't find a step to update.");
            }
            this.route.steps[stepIndex] = Object.assign(this.route.steps[stepIndex], step);
            this.settings.updateCallback(this.route);
            this.internalUpdateRouteCallback(this.route);
            return this.route.steps[stepIndex];
        };
        this.route = route;
        this.settings = settings;
        this.internalUpdateRouteCallback = internalUpdateRouteCallback;
    }
    /**
     * Updates the execution object of a Step.
     * @param  {Step} step  The current step in execution
     * @param  {Status} status  The status for the execution
     * @param  {Receipt} receipt Optional. Information about received tokens
     * @return {Step}       The step with the updated execution object
     */
    updateExecution(step, status, receipt) {
        if (!step.execution) {
            throw Error("Can't update empty execution.");
        }
        step.execution.status = status;
        if (receipt) {
            step.execution = Object.assign(Object.assign({}, step.execution), receipt);
        }
        this.updateStepInRoute(step);
        return step;
    }
    allowUpdates(value) {
        this.shouldUpdate = value;
    }
}
exports.StatusManager = StatusManager;
