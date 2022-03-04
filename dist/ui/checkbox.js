"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = __importDefault(require("../util/data"));
const eventHandler_1 = __importDefault(require("../util/eventHandler"));
const baseComponent_1 = __importDefault(require("../util/baseComponent"));
const NAME = 'checkbox';
const EVENT_KEY = `${NAME}`;
class Checkbox extends baseComponent_1.default {
    constructor(element) {
        super(element);
        this._all = document.querySelector(`[data-checkbox-all="${this._element.dataset.checkbox}"]`);
        this._checkbox = this._element.querySelectorAll('input[type="checkbox"]');
        this.init();
        data_1.default.setData(element, NAME, this);
    }
    init() {
        this._check();
        if (this._all) {
            this._allCheck();
        }
    }
    _check() {
        this._checkbox.forEach((el) => {
            eventHandler_1.default.on(el, 'click', () => {
                const checked = this._element.querySelectorAll('input[type="checkbox"]:checked');
                if (this._checkbox.length === checked.length && this._all && !this._all.checked) {
                    this._all.checked = true;
                    eventHandler_1.default.trigger(this._element, `${EVENT_KEY}.checked`);
                }
                else if (this._checkbox.length - 1 === checked.length && this._all && this._all.checked) {
                    this._all.checked = false;
                    eventHandler_1.default.trigger(this._element, `${EVENT_KEY}.unchecked`);
                }
            });
        });
    }
    _allCheck() {
        eventHandler_1.default.on(this._all, 'click', () => {
            var _a;
            if ((_a = this._all) === null || _a === void 0 ? void 0 : _a.checked) {
                this._checkbox.forEach(el => (el.checked = true));
                eventHandler_1.default.trigger(this._element, `${EVENT_KEY}.checked`);
            }
            else {
                this._checkbox.forEach(el => (el.checked = false));
                eventHandler_1.default.trigger(this._element, `${EVENT_KEY}.unchecked`);
            }
        });
    }
    static get NAME() {
        return NAME;
    }
    static getInstance(element) {
        return data_1.default.getData(element, this.NAME);
    }
}
exports.default = Checkbox;
