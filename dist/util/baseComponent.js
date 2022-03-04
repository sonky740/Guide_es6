"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = __importDefault(require("./data"));
class BaseComponent {
    constructor(element) {
        element = typeof element === 'string' ? document.querySelector(element) : element;
        if (!element) {
            throw new Error(`${this.constructor.NAME}이 없습니다.`);
        }
        this._element = element;
        data_1.default.setData(this._element, this.constructor.NAME, this);
    }
    _getRandomSerial() {
        return `${this.constructor.NAME}_${Math.random().toString(36).slice(2, 11)}`;
    }
    _throwError(message) {
        throw new Error(`${this.constructor.NAME}: ${message}`);
    }
    _warn(message) {
        console.warn(`${this.constructor.NAME}: ${message}`);
    }
}
exports.default = BaseComponent;
