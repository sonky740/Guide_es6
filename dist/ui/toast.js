"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eventHandler_1 = __importDefault(require("../util/eventHandler"));
const util_1 = require("../util/util");
const NAME = 'toast';
const EVENT_KEY = `${NAME}`;
const defaultConfig = {
    showing: 'showing',
    hiding: 'hiding',
    container: '<div class="toast"></div>',
    content: '<div class="toast-content">MESSAGE</div>'
};
class Toast {
    constructor(config) {
        this._toastContent = null;
        this._config = Object.assign(Object.assign({}, defaultConfig), config);
    }
    static getContainer(template) {
        if (Toast.TOAST_HOLDER === null) {
            Toast.TOAST_HOLDER = (0, util_1.toHTML)(template);
            document.body.appendChild(Toast.TOAST_HOLDER);
        }
        return Toast.TOAST_HOLDER;
    }
    show(message, time = 2, addClass) {
        this._toastContent = (0, util_1.toHTML)(this._config.content.replace('MESSAGE', message));
        Toast.getContainer(this._config.container).appendChild(this._toastContent);
        this._toastContent.classList.add(this._config.showing);
        if (addClass)
            this._toastContent.classList.add(addClass);
        Toast.TOAST_COUNT++;
        setTimeout(() => {
            eventHandler_1.default.trigger(document, `${EVENT_KEY}.shown`);
        }, 0);
        setTimeout(() => {
            this.hide();
        }, time * 1000);
    }
    hide() {
        var _a, _b;
        (_a = this._toastContent) === null || _a === void 0 ? void 0 : _a.classList.remove(this._config.showing);
        (_b = this._toastContent) === null || _b === void 0 ? void 0 : _b.classList.add(this._config.hiding);
        eventHandler_1.default.one(this._toastContent, 'animationend', () => {
            Toast.TOAST_COUNT--;
            Toast.getContainer(this._config.container).removeChild(this._toastContent);
            if (Toast.TOAST_COUNT <= 0) {
                document.body.removeChild(Toast.TOAST_HOLDER);
                Toast.TOAST_HOLDER = null;
            }
            eventHandler_1.default.trigger(document, `${EVENT_KEY}.hidden`);
        });
    }
}
Toast.TOAST_HOLDER = null;
Toast.TOAST_COUNT = 0;
exports.default = Toast;
