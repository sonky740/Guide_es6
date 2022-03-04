"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = __importDefault(require("../util/data"));
const eventHandler_1 = __importDefault(require("../util/eventHandler"));
const baseComponent_1 = __importDefault(require("../util/baseComponent"));
const util_1 = require("../util/util");
const NAME = 'accordion';
const EVENT_KEY = `${NAME}`;
const defaultConfig = {
    showing: 'showing',
    shown: 'shown',
    hiding: 'hiding',
    hidden: 'hidden'
};
class Accordion extends baseComponent_1.default {
    constructor(element, config) {
        super(element);
        this._item = this._element.children;
        this._isMoving = false;
        this._config = Object.assign(Object.assign({}, defaultConfig), config);
        this.init();
        data_1.default.setData(element, NAME, this);
    }
    init() {
        Array.from(this._item).forEach(item => {
            const target = item.querySelector('[data-accr-target]');
            const trigger = item.querySelector('[data-accr-trigger]');
            const ir = trigger.querySelector('.blind');
            // 처음에 열려있다면...
            if (item.classList.contains('on')) {
                trigger.classList.add('on');
                ir.innerText = '접기';
                target.classList.add(this._config.shown);
            }
            else {
                target.classList.add(this._config.hidden);
            }
            eventHandler_1.default.on(trigger, 'click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (this._isMoving)
                    return false;
                this._isMoving = true;
                if (!item.classList.contains('on')) {
                    this.show(item);
                }
                else if (item.classList.contains('on')) {
                    this.hide(item);
                }
            });
        });
    }
    show(item) {
        if (typeof item === 'number') {
            const numberItem = this._element.children[item];
            item = numberItem;
        }
        else if (typeof item === 'string') {
            const stringItem = this._element.querySelector(item);
            item = stringItem;
        }
        const header = item.querySelector('[data-accr-header]');
        const trigger = item.querySelector('[data-accr-trigger]');
        const target = item.querySelector('[data-accr-target]');
        const ir = trigger.querySelector('.blind');
        if (item.classList.contains('on'))
            return false;
        eventHandler_1.default.trigger(this._element, `${EVENT_KEY}.showing`, {
            item: item,
            header: header,
            trigger: trigger,
            target: target
        });
        item.classList.add('on');
        trigger.classList.add('on');
        ir.innerText = '접기';
        target.classList.remove(this._config.hidden);
        target.classList.add(this._config.showing);
        target.style.height = `${target.scrollHeight}px`;
        const complete = () => {
            target.classList.remove(this._config.showing);
            target.classList.add(this._config.shown);
            target.removeAttribute('style');
            this._isMoving = false;
            eventHandler_1.default.trigger(this._element, `${EVENT_KEY}.shown`, {
                item: item,
                header: header,
                trigger: trigger,
                target: target
            });
        };
        // data-accr = "only" 하나만 열릴 때
        if (this._element.dataset.accr === 'only') {
            (0, util_1.siblings)(item).forEach(items => {
                if (item.classList.contains('on'))
                    this.hide(items);
            });
        }
        if (this._element.dataset.animation === 'false') {
            complete();
        }
        else {
            eventHandler_1.default.one(target, 'transitionend', () => complete());
        }
    }
    hide(item) {
        if (typeof item === 'number') {
            const numberItem = this._element.children[item];
            item = numberItem;
        }
        else if (typeof item === 'string') {
            const stringItem = this._element.querySelector(item);
            item = stringItem;
        }
        const header = item.querySelector('[data-accr-header]');
        const trigger = item.querySelector('[data-accr-trigger]');
        const target = item.querySelector('[data-accr-target]');
        const ir = trigger.querySelector('.blind');
        if (!item.classList.contains('on'))
            return false;
        eventHandler_1.default.trigger(this._element, `${EVENT_KEY}.hiding`, {
            item: item,
            header: header,
            trigger: trigger,
            target: target
        });
        trigger.classList.remove('on');
        ir.innerText = '펼치기';
        target.style.height = `${target.scrollHeight}px`;
        target.style.height = `${target.scrollHeight}px`;
        target.classList.remove(this._config.shown);
        target.classList.add(this._config.hiding);
        target.removeAttribute('style');
        const complete = () => {
            target.classList.remove(this._config.hiding);
            target.classList.add(this._config.hidden);
            item.classList.remove('on');
            this._isMoving = false;
            eventHandler_1.default.trigger(this._element, `${EVENT_KEY}.hidden`, {
                item: item,
                header: header,
                trigger: trigger,
                target: target
            });
        };
        // transition
        if (this._element.dataset.animation === 'false') {
            complete();
        }
        else {
            eventHandler_1.default.one(target, 'transitionend', () => complete());
        }
    }
    showAll() {
        Array.from(this._item).forEach(item => {
            if (this._element.dataset.accr === 'only')
                super._throwError('하나만 열릴 때는 동작하지 않습니다.');
            if (item.classList.contains('on'))
                return false;
            this.show(item);
        });
    }
    hideAll() {
        Array.from(this._item).forEach(item => {
            this.hide(item);
        });
    }
    static get NAME() {
        return NAME;
    }
    static getInstance(element) {
        return data_1.default.getData(element, this.NAME);
    }
}
exports.default = Accordion;
