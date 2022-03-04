"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = __importDefault(require("../util/data"));
const baseComponent_1 = __importDefault(require("../util/baseComponent"));
const eventHandler_1 = __importDefault(require("../util/eventHandler"));
const NAME = 'tooltip';
const EVENT_KEY = `${NAME}`;
const defaultConfig = {
    shown: 'shown',
    hiding: 'hiding'
};
class Tooltip extends baseComponent_1.default {
    constructor(element, config) {
        super(element);
        this._trigger = this._element.querySelector('[data-tooltip-trigger]');
        this._config = Object.assign(Object.assign({}, defaultConfig), config);
        this.init();
        data_1.default.setData(element, NAME, this);
    }
    init() {
        if (this._element.dataset.tooltip !== 'mouseover') {
            // tooltip click
            eventHandler_1.default.on(this._element, 'click', (e) => {
                e.preventDefault();
                // show toggle
                if (e.target.hasAttribute('data-tooltip-trigger')) {
                    if (this._element.classList.contains(this._config.shown)) {
                        this.hide();
                        return false;
                    }
                    this.show();
                    setTimeout(() => {
                        eventHandler_1.default.on(window, 'click', (e) => {
                            if (!e.target.closest('[data-tooltip-target]') && this._element.dataset.tooltipBackdrop !== 'false') {
                                this.hide();
                            }
                        });
                    }, 0);
                }
                // hide
                else if (e.target.hasAttribute('data-tooltip-close')) {
                    this.hide();
                }
            });
        }
        else if (this._element.dataset.tooltip === 'mouseover') {
            // show
            eventHandler_1.default.on(this._element, 'mouseover', () => {
                this.show();
            });
            eventHandler_1.default.on(this._trigger, 'focus', () => {
                this.show();
            });
            // hide
            eventHandler_1.default.on(this._element, 'mouseleave', () => {
                this.hide();
            });
            eventHandler_1.default.on(this._trigger, 'blur', () => {
                this.hide();
            });
        }
    }
    show() {
        if (this._element.classList.contains(this._config.shown))
            return false;
        eventHandler_1.default.trigger(this._element, `${EVENT_KEY}.showing`, { target: this._element });
        this._element.classList.add(this._config.shown);
        const complete = () => {
            eventHandler_1.default.trigger(this._element, `${EVENT_KEY}.shown`, { target: this._element });
        };
        eventHandler_1.default.one(this._element, 'animationend', () => complete());
    }
    hide() {
        if (!this._element.classList.contains(this._config.shown))
            return false;
        eventHandler_1.default.trigger(this._element, `${EVENT_KEY}.hiding`, { target: this._element });
        this._element.classList.remove(this._config.shown);
        this._element.classList.add(this._config.hiding);
        const complete = () => {
            this._element.classList.remove(this._config.hiding);
            eventHandler_1.default.trigger(this._element, `${EVENT_KEY}.hidden`, { target: this._element });
        };
        eventHandler_1.default.one(this._element, 'animationend', () => complete());
        eventHandler_1.default.off(window, 'click');
    }
    static get NAME() {
        return NAME;
    }
    static getInstance(element) {
        return data_1.default.getData(element, this.NAME);
    }
}
exports.default = Tooltip;
