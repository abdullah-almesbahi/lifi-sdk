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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StepExecutor = void 0;
const ExecutionManager_1 = require("./ExecutionManager");
const switchChain_1 = require("./switchChain");
// Please be careful when changing the defaults as it may break the behavior (e.g., background execution)
const defaultInteractionSettings = {
    allowInteraction: true,
    allowUpdates: true,
    stopExecution: false,
};
class StepExecutor {
    constructor(statusManager, settings) {
        this.allowUserInteraction = true;
        this.executionStopped = false;
        this.setInteraction = (settings) => {
            const interactionSettings = Object.assign(Object.assign({}, defaultInteractionSettings), settings);
            this.allowUserInteraction = interactionSettings.allowInteraction;
            this.executionManager.allowInteraction(interactionSettings.allowInteraction);
            this.statusManager.allowUpdates(interactionSettings.allowUpdates);
            this.executionStopped = interactionSettings.stopExecution;
        };
        // TODO: add checkChain method and update signer inside executors
        // This can come in handy when we execute multiple routes simultaneously and
        // should be sure that we are on the right chain when waiting for transactions.
        this.checkChain = () => {
            throw new Error('checkChain is not implemented.');
        };
        this.executeStep = (signer, step) => __awaiter(this, void 0, void 0, function* () {
            // Make sure that the chain is still correct
            const updatedSigner = yield (0, switchChain_1.switchChain)(signer, this.statusManager, step, this.settings.switchChainHook, this.allowUserInteraction);
            if (!updatedSigner) {
                // Chain switch was not successful, stop execution here
                return step;
            }
            signer = updatedSigner;
            const parameters = {
                signer,
                step,
                settings: this.settings,
                statusManager: this.statusManager,
            };
            yield this.executionManager.execute(parameters);
            return step;
        });
        this.executionManager = new ExecutionManager_1.ExecutionManager();
        this.statusManager = statusManager;
        this.settings = settings;
    }
}
exports.StepExecutor = StepExecutor;
