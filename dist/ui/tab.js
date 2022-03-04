"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = __importDefault(require("../util/data"));
const eventHandler_1 = __importDefault(require("../util/eventHandler"));
const baseComponent_1 = __importDefault(require("../util/baseComponent"));
const util_1 = require("../util/util");
const NAME = 'tab';
const EVENT_KEY = `${NAME}`;
const defaultConfig = {
    showing: 'showing',
    shown: 'shown',
    hiding: 'hiding',
    hidden: 'hidden'
};
class Tab extends baseComponent_1.default {
    constructor(element, config) {
        super(element);
        this._trigger = this._element.querySelectorAll('[data-tab-trigger]');
        this._isMoving = false;
        this._config = Object.assign(Object.assign({}, defaultConfig), config);
        this.init();
        data_1.default.setData(element, NAME, this);
    }
    init() {
        this.initVars();
        this._trigger.forEach((trigger) => {
            const target = document.querySelector(trigger.dataset.tabTrigger);
            if (trigger.classList.contains('on')) {
                target === null || target === void 0 ? void 0 : target.classList.add(this._config.shown);
            }
            else {
                target === null || target === void 0 ? void 0 : target.classList.add(this._config.hidden);
            }
            eventHandler_1.default.on(trigger, 'click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!trigger.classList.contains('on')) {
                    this.show(target);
                }
            });
        });
    }
    initVars() {
        this._element.setAttribute('role', 'tablist');
        this._trigger.forEach(trigger => {
            const target = document.querySelector(trigger.dataset.tabTrigger);
            trigger.setAttribute('role', 'tab');
            target === null || target === void 0 ? void 0 : target.setAttribute('role', 'tabpanel');
        });
    }
    show(target) {
        let trigger;
        if (typeof target === 'number') {
            trigger = this._element.children[target];
            target = document.querySelector(trigger.dataset.tabTrigger);
        }
        else if (typeof target === 'string') {
            trigger = document.querySelector(`[data-tab-trigger="${target}"]`);
            target = document.querySelector(target);
        }
        else if (typeof target === 'object') {
            trigger = document.querySelector(`[data-tab-trigger="#${target.getAttribute('id')}"]`);
        }
        if (this._isMoving || trigger.classList.contains('on'))
            return false;
        this._isMoving = true;
        (0, util_1.siblings)(trigger).forEach(trs => {
            trs.classList.remove('on');
        });
        trigger.classList.add('on');
        // const groups = document.querySelectorAll(`[data-tab-target="${this._element.dataset.tab}"]`);
        (0, util_1.siblings)(target).forEach(group => {
            const hideTrigger = document.querySelector(`[data-tab-trigger="#${group.getAttribute('id')}"]`);
            if (group.classList.contains(this._config.shown)) {
                group.classList.add(this._config.hiding);
                group.classList.remove(this._config.shown);
                eventHandler_1.default.trigger(this._element, `${EVENT_KEY}.hiding`, { target: group, trigger: hideTrigger });
                const groupComplete = () => {
                    group.classList.remove(this._config.hiding);
                    group.classList.add(this._config.hidden);
                    eventHandler_1.default.trigger(this._element, `${EVENT_KEY}.hidden`, { target: group, trigger: hideTrigger });
                    target.classList.remove(this._config.hidden);
                    eventHandler_1.default.trigger(this._element, `${EVENT_KEY}.showing`, { target: target, trigger: trigger });
                    target.classList.add(this._config.showing);
                    target.classList.add(this._config.shown);
                };
                if (this._element.dataset.animation === 'false') {
                    groupComplete();
                }
                else {
                    eventHandler_1.default.one(group, 'animationend', () => groupComplete());
                }
            }
        });
        const targetComplete = () => {
            target.classList.remove(this._config.showing);
            target.classList.add(this._config.shown);
            eventHandler_1.default.trigger(this._element, `${EVENT_KEY}.shown`, { target: target, trigger: trigger });
            this._isMoving = false;
        };
        if (this._element.dataset.animation === 'false') {
            targetComplete();
        }
        else {
            eventHandler_1.default.one(target, 'animationend', () => targetComplete());
        }
    }
    static get NAME() {
        return NAME;
    }
    static getInstance(element) {
        return data_1.default.getData(element, this.NAME);
    }
}
exports.default = Tab;
