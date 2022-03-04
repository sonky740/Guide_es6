"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = __importDefault(require("../util/data"));
const eventHandler_1 = __importDefault(require("../util/eventHandler"));
const baseComponent_1 = __importDefault(require("../util/baseComponent"));
const NAME = 'modal';
const EVENT_KEY = `${NAME}`;
const defaultConfig = {
    showing: 'showing',
    shown: 'shown',
    hiding: 'hiding'
};
class Modal extends baseComponent_1.default {
    constructor(element, config) {
        super(element);
        this._wrap = this._element.querySelector('.ly-modal-wrap');
        this._header = this._element.querySelector('.ly-modal-header');
        this._trigger = document.querySelector(`[data-modal-trigger="${this._element.getAttribute('id')}"]`); // [data-modal-trigger]
        this._close = this._element.querySelectorAll('[data-modal-close]'); // 모달 닫기 버튼
        this._isMoving = false; // true일 경우 이벤트 작동 안되게
        this._touchStart = 0; // 터치 시작점
        this._distance = 0; // 움직인 거리
        this._config = Object.assign(Object.assign({}, defaultConfig), config);
        this.init();
        data_1.default.setData(element, NAME, this);
    }
    init() {
        // 모달 트리거 클릭 시 모달 show
        if (this._trigger) {
            eventHandler_1.default.on(this._trigger, 'click', (e) => this.show(e));
        }
        // 모달 딤 클릭 시 닫기
        eventHandler_1.default.on(this._element, 'click', (e) => {
            if (e.target === this._element && this._element.dataset.modalBackdrop !== 'false')
                this.hide(e);
        });
        // 모달 닫기 버튼 클릭 시 닫기
        this._close.forEach(el => {
            eventHandler_1.default.on(el, 'click', () => this.hide());
        });
        // 바텀 모달이고, data-modal-touch가 true일 때
        this._touchMove();
    }
    show(e) {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        if (this._isMoving === true || this._element.classList.contains(this._config.shown))
            return false;
        this._isMoving = true;
        this._element.classList.add(this._config.showing);
        this._element.setAttribute('tabindex', '0');
        // window scroll 방지
        document.body.classList.add('modal-open');
        const x = window.scrollX;
        const y = window.scrollY;
        window.onscroll = function () {
            window.scrollTo(x, y);
        };
        eventHandler_1.default.trigger(this._element, `${EVENT_KEY}.showing`, {
            target: this._element,
            trigger: this._trigger
        });
        const complete = () => {
            this._element.classList.remove(this._config.showing);
            this._element.classList.add(this._config.shown);
            this._element.focus();
            this._element.removeAttribute('tabindex');
            eventHandler_1.default.trigger(this._element, `${EVENT_KEY}.shown`, {
                target: this._element,
                trigger: this._trigger
            });
            this._isMoving = false;
        };
        if (this._element.dataset.animation === 'false') {
            complete();
        }
        else {
            eventHandler_1.default.one(this._element, 'animationend', () => complete());
        }
    }
    hide(e) {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        if (this._isMoving === true)
            return false;
        this._isMoving = true;
        this._element.classList.remove(this._config.shown);
        this._element.classList.add(this._config.hiding);
        eventHandler_1.default.trigger(this._element, `${EVENT_KEY}.hiding`, {
            target: this._element,
            trigger: this._trigger
        });
        const complete = () => {
            var _a;
            this._isMoving = false;
            this._element.classList.remove(this._config.hiding);
            (_a = this._trigger) === null || _a === void 0 ? void 0 : _a.focus();
            // 마지막 모달을 닫을 때 window scroll 복구
            const arr = [];
            document.querySelectorAll('[data-modal]').forEach(modals => {
                arr.push(modals.classList.contains('shown'));
            });
            arr.some(isOpen => {
                if (!isOpen) {
                    document.body.classList.remove('modal-open');
                    window.onscroll = function () {
                        return true;
                    };
                }
                return isOpen === true;
            });
            eventHandler_1.default.trigger(this._element, `${EVENT_KEY}.hidden`, {
                target: this._element,
                trigger: this._trigger
            });
        };
        if (this._element.dataset.animation === 'false') {
            complete();
        }
        else {
            eventHandler_1.default.one(this._element, 'animationend', () => complete());
        }
    }
    _touchMove() {
        if (this._element.classList.contains('btm') && this._element.dataset.modalTouch === 'true') {
            eventHandler_1.default.on(this._header, 'touchstart', (e) => {
                this._touchStart = e.touches[0].screenY;
            });
            eventHandler_1.default.on(this._header, 'touchmove', (e) => {
                this._distance = e.touches[0].screenY - this._touchStart;
                if (this._distance > 0) {
                    this._wrap.style.bottom = `${-this._distance}px`;
                }
            });
            eventHandler_1.default.on(this._header, 'touchend', () => {
                if (this._distance < 80) {
                    this._wrap.removeAttribute('style');
                }
                else if (this._distance > 80) {
                    this.hide();
                    eventHandler_1.default.one(this._element, `${EVENT_KEY}.hidden`, () => {
                        this._wrap.removeAttribute('style');
                    });
                }
            });
        }
    }
    static get NAME() {
        return NAME;
    }
    static getInstance(element) {
        return data_1.default.getData(element, this.NAME);
    }
}
eventHandler_1.default.on(document, 'click', (e) => {
    const target = e.target.getAttribute('data-modal-trigger');
    if (target === null) {
        return false;
    }
    else {
        const modalEl = document.getElementById(`${target}`);
        if (modalEl) {
            const modal = Modal.getInstance(modalEl);
            if (modal) {
                modal.show();
            }
            else {
                new Modal(modalEl).show();
            }
        }
    }
});
exports.default = Modal;
