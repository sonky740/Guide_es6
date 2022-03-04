"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = __importDefault(require("../util/data"));
// import EventHandler from '../util/eventHandler';
const baseComponent_1 = __importDefault(require("../util/baseComponent"));
const NAME = 'sample';
const defaultConfig = {
    showing: 'showing',
    shown: 'shown',
    hiding: 'hiding',
    hidden: 'hidden'
};
class Sample extends baseComponent_1.default {
    constructor(element, config) {
        super(element);
        this._config = Object.assign(Object.assign({}, defaultConfig), config);
        data_1.default.setData(element, NAME, this);
    }
    static get NAME() {
        return NAME;
    }
    static getInstance(element) {
        return data_1.default.getData(element, this.NAME);
    }
}
exports.default = Sample;
