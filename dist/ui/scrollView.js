"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = __importDefault(require("../util/data"));
const eventHandler_1 = __importDefault(require("../util/eventHandler"));
const baseComponent_1 = __importDefault(require("../util/baseComponent"));
const NAME = 'scrollView';
const EVENT_KEY = `${NAME}`;
const defaultConfig = {
    onClass: 'on',
    shown: 'shown',
    hidden: 'hidden'
};
class ScrollView extends baseComponent_1.default {
    constructor(element, config) {
        super(element);
        this._top = this._element.getBoundingClientRect().top;
        this._viewH = document.documentElement.clientHeight;
        this._multiple = Number(this._element.dataset.multiple) || 7 / 10;
        this._effectClass = this._element.dataset.scrollView || 'view-up';
        this._config = Object.assign(Object.assign({}, defaultConfig), config);
        this.init();
        data_1.default.setData(element, NAME, this);
    }
    init() {
        if (this._top < this._viewH * this._multiple)
            this._show();
        this._events();
    }
    _events() {
        ['scroll', 'resize'].forEach(events => {
            eventHandler_1.default.on(window, events, () => {
                this._top = this._element.getBoundingClientRect().top;
                this._viewH = document.documentElement.clientHeight;
                if (this._top < this._viewH * this._multiple) {
                    this._show();
                }
                else if (this._top > this._viewH * this._multiple && !this._element.hasAttribute('data-scroll-forward')) {
                    this._hide();
                }
            });
        });
    }
    _show() {
        if (this._element.classList.contains(this._config.onClass))
            return false;
        this._element.classList.add(this._config.onClass);
        this._element.classList.add(this._effectClass);
        eventHandler_1.default.one(this._element, 'transitionend', () => {
            eventHandler_1.default.trigger(this._element, `${EVENT_KEY}.shown`, {
                target: this._element
            });
        });
    }
    _hide() {
        if (!this._element.classList.contains(this._config.onClass))
            return false;
        this._element.classList.remove(this._config.onClass);
        this._element.classList.remove(this._effectClass);
        eventHandler_1.default.one(this._element, 'transitionend', () => {
            eventHandler_1.default.trigger(this._element, `${EVENT_KEY}.hidden`, {
                target: this._element
            });
        });
    }
    static get NAME() {
        return NAME;
    }
    static getInstance(element) {
        return data_1.default.getData(element, this.NAME);
    }
}
exports.default = ScrollView;
