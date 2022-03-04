"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = __importDefault(require("../util/data"));
const eventHandler_1 = __importDefault(require("../util/eventHandler"));
const baseComponent_1 = __importDefault(require("../util/baseComponent"));
const util_1 = require("../util/util");
const NAME = 'counter';
const EVENT_KEY = `${NAME}`;
class Counter extends baseComponent_1.default {
    constructor(element) {
        super(element);
        this._counter = 0;
        this._initNumber = 0;
        this._duration = 0;
        this._comma = false;
        this._startTime = 0;
        this.init();
        data_1.default.setData(element, NAME, this);
    }
    init() {
        this._counter = Number(this._element.getAttribute('data-counter'));
        this._initNumber = Number(this._element.getAttribute('data-init-number'));
        this._duration = Number(this._element.getAttribute('data-duration'));
        this._comma = Boolean(this._element.getAttribute('data-comma'));
        this._startTime = 0;
        this._step();
    }
    _step() {
        const step = (currentTime) => {
            if (this._startTime === 0) {
                this._startTime = currentTime;
            }
            const progress = Math.min((currentTime - this._startTime) / this._duration, 1);
            if (this._comma) {
                this._element.innerHTML = (0, util_1.numberComma)(Math.floor(progress * (this._counter - this._initNumber) + this._initNumber));
            }
            else {
                this._element.innerHTML = Math.floor(progress * (this._counter - this._initNumber) + this._initNumber).toString();
            }
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
            else {
                eventHandler_1.default.trigger(this._element, `${EVENT_KEY}.end`, {
                    target: this._element
                });
            }
        };
        window.requestAnimationFrame(step);
    }
    static get NAME() {
        return NAME;
    }
    static getInstance(element) {
        return data_1.default.getData(element, this.NAME);
    }
}
exports.default = Counter;
