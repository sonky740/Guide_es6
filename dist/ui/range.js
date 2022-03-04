"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = __importDefault(require("../util/data"));
const baseComponent_1 = __importDefault(require("../util/baseComponent"));
const eventHandler_1 = __importDefault(require("../util/eventHandler"));
const util_1 = require("../util/util");
const NAME = 'range';
const EVENT_KEY = `${NAME}`;
class Range extends baseComponent_1.default {
    constructor(element) {
        super(element);
        this._range = this._element.querySelector('input[type="range"]');
        this._fill = this._element.querySelector('.range-fill');
        this._startRange = this._element.querySelector('input[type="range"][data-range-multi="start"]');
        this._endRange = this._element.querySelector('input[type="range"][data-range-multi="end"]');
        this._value = 0;
        this._multiValues = {
            start: 0,
            end: 0
        };
        this.init();
        data_1.default.setData(element, NAME, this);
    }
    init() {
        if (!this._range.hasAttribute('data-range-multi')) {
            this.singleInput();
            eventHandler_1.default.on(this._range, 'input', () => this.singleInput());
        }
        else {
            this.startInput();
            this.endInput();
            eventHandler_1.default.on(this._startRange, 'input', () => this.startInput());
            eventHandler_1.default.on(this._endRange, 'input', () => this.endInput());
        }
    }
    singleInput() {
        let inputValue = Number(this._range.value);
        const inputMin = Number(this._range.min);
        const inputMax = Number(this._range.max);
        const inputStep = Number(this._range.step);
        const per = ((inputValue - inputMin) / (inputMax - inputMin)) * 100;
        // bar
        this._fill.style.right = `${100 - per}%`;
        this._value = Number(inputValue);
        // min값 선택 안되게
        if (per === 0 && this._element.classList.contains('min-no')) {
            inputValue = inputStep;
            this._fill.style.right = `100 - ${(inputStep / inputMax) * 100}%`;
        }
        // value값을 나타내야할 때
        const value = document.getElementById(`${this._range.dataset.rangeValue}`);
        if (value)
            value.innerText = (0, util_1.numberComma)(inputValue);
        eventHandler_1.default.trigger(this._element, `${EVENT_KEY}.input`, {
            value: this._value
        });
    }
    startInput() {
        this._startRange.value = Math.min(Number(this._startRange.value), Number(this._endRange.value) - Number(this._startRange.dataset.rangeMinstep)).toString();
        this._multiValues.start = Number(this._startRange.value);
        const perStart = Number(this._startRange.value) / Number(this._startRange.step);
        this._fill.style.left = `${perStart}%`;
        if (Number(this._startRange.value) >= Number(this._endRange.value) - 5) {
            this._startRange.style.zIndex = '2';
        }
        else {
            this._startRange.removeAttribute('style');
        }
        // value값을 나타내야할 때
        const value = document.getElementById(`${this._startRange.dataset.rangeStartvalue}`);
        if (value)
            value.innerText = (0, util_1.numberComma)(Number(this._startRange.value));
        eventHandler_1.default.trigger(this._element, `${EVENT_KEY}.multi`, {
            value: this._multiValues
        });
    }
    endInput() {
        this._endRange.value = Math.max(Number(this._endRange.value), Number(this._startRange.value) + Number(this._endRange.dataset.rangeMinstep)).toString();
        this._multiValues.end = Number(this._endRange.value);
        const perEnd = Number(this._endRange.value) / Number(this._endRange.step);
        this._fill.style.right = `${100 - perEnd}%`;
        // value값을 나타내야할 때
        const value = document.getElementById(`${this._endRange.dataset.rangeEndvalue}`);
        if (value)
            value.innerText = (0, util_1.numberComma)(Number(this._endRange.value));
        // data-range-last가 있을 때
        if (this._endRange.dataset.rangeMax !== undefined && this._endRange.value === this._endRange.max) {
            value.innerText = (0, util_1.numberComma)(Number(this._endRange.value)) + this._endRange.dataset.rangeMax;
        }
        eventHandler_1.default.trigger(this._element, `${EVENT_KEY}.multi`, {
            value: this._multiValues
        });
    }
    static get NAME() {
        return NAME;
    }
    static getInstance(element) {
        return data_1.default.getData(element, this.NAME);
    }
}
exports.default = Range;
