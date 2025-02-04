import { Execution, InternalExecutionSettings, Process, ProcessType, Route, Status, Step, Token } from '../types';
interface Receipt {
    fromAmount?: string;
    toAmount?: string;
    toToken?: Token;
    gasPrice?: string;
    gasUsed?: string;
    gasToken?: Token;
    gasAmount?: string;
    gasAmountUSD?: string;
}
type InternalUpdateRouteCallback = (route: Route) => void;
type OptionalParameters = Partial<Pick<Process, 'doneAt' | 'failedAt' | 'txHash' | 'txLink' | 'error' | 'substatus' | 'substatusMessage'>>;
/**
 * Manages status updates of a route and provides various functions for tracking processes
 * @param  {Route} route  The route this StatusManger belongs to.
 * @param  {InternalExecutionSettings} settings   The ExecutionSettings for this route.
 * @param  {InternalUpdateRouteCallback} internalUpdateRouteCallback  Internal callback to propage route changes.
 * @return {StatusManager}       An instance of StatusManager.
 */
export declare class StatusManager {
    private readonly route;
    private readonly settings;
    private readonly internalUpdateRouteCallback;
    private shouldUpdate;
    constructor(route: Route, settings: InternalExecutionSettings, internalUpdateRouteCallback: InternalUpdateRouteCallback);
    /**
     * Initializes the execution object of a Step.
     * @param  {Step} step  The current step in execution
     * @return {Execution}       The initialized execution object for this step and a function to update this step
     */
    initExecutionObject: (step: Step) => Execution;
    /**
     * Updates the execution object of a Step.
     * @param  {Step} step  The current step in execution
     * @param  {Status} status  The status for the execution
     * @param  {Receipt} receipt Optional. Information about received tokens
     * @return {Step}       The step with the updated execution object
     */
    updateExecution(step: Step, status: Status, receipt?: Receipt): Step;
    /**
     * Create and push a new process into the execution.
     * @param  {ProcessType} type Type of the process. Used to identify already existing processes.
     * @param  {Step} step The step that should contain the new process.
     * @param  {Status} status By default created procces is set to the STARTED status. We can override new process with the needed status.
     * @return {Process}
     */
    findOrCreateProcess: (step: Step, type: ProcessType, status?: Status) => Process;
    /**
     * Update a process object.
     * @param  {Step} step The step where the process should be updated
     * @param  {ProcessType} type  The process type to update
     * @param  {Status} status The status the process gets.
     * @param  {object} [params]   Additional parameters to append to the process.
     * @return {Process} The update process
     */
    updateProcess: (step: Step, type: ProcessType, status: Status, params?: OptionalParameters) => Process;
    /**
     * Remove a process from the execution
     * @param  {Step} step The step where the process should be removed from
     * @param  {ProcessType} type  The process type to remove
     * @return {void}
     */
    removeProcess: (step: Step, type: ProcessType) => void;
    updateStepInRoute: (step: Step) => Step;
    allowUpdates(value: boolean): void;
}
export {};
