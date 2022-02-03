import Data from '../util/data.js';
import EventHandler from '../util/eventHandler.js';
import BaseComponent from '../util/baseComponent.js';

const NAME = 'modal';
const SHOWING = 'showing';
const SHOWN = 'shown';
const HIDING = 'hiding';
const EVENT_KEY = `${NAME}`;

class Modal extends BaseComponent {
  constructor(element) {
    super(element);

    this._trigger = document.querySelector(`[data-modal-trigger="${this._element.getAttribute('id')}"]`); // [data-moda-trigger]
    this._close = this._element.querySelectorAll('[data-modal-close]'); // 모달 닫기 버튼
    this._isMoving = false; // true일 경우 이벤트 작동 안되게

    // 모달 트리거 클릭 시 모달 show
    if (this._trigger) {
      EventHandler.on(this._trigger, 'click', e => this.show(e));
    }

    // 모달 딤 클릭 시 닫기
    EventHandler.on(this._element, 'click', e => {
      if (e.target === this._element && this._element.dataset.modalBackdrop !== 'false') this.hide(e);
    });

    // 모달 닫기 버튼 클릭 시 닫기
    this._close.forEach(el => {
      EventHandler.on(el, 'click', () => this.hide());
    });

    Data.setData(element, NAME, this);
  }

  show(e) {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (this._isMoving === true || this._element.classList.contains(SHOWN)) return false;

    this._element.classList.add(SHOWING);
    this._element.setAttribute('tabindex', 0);

    this._isMoving = true;

    EventHandler.trigger(this._element, `${EVENT_KEY}.showing`);

    const complete = () => {
      this._element.classList.remove(SHOWING);
      this._element.classList.add(SHOWN);
      this._element.focus();
      this._element.removeAttribute('tabindex');

      EventHandler.trigger(this._element, `${EVENT_KEY}.shown`);
      this._isMoving = false;
    };

    if (this._element.dataset.animation === 'false') {
      complete();
    } else {
      EventHandler.one(this._element, 'animationend', () => complete());
    }
  }

  hide(e) {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (this._isMoving === true) return false;

    this._element.classList.remove(SHOWN);
    this._element.classList.add(HIDING);

    this._isMoving = true;

    EventHandler.trigger(this._element, `${EVENT_KEY}.hiding`);

    const complete = () => {
      this._isMoving = false;
      this._element.classList.remove(HIDING);
      this._trigger.focus();

      EventHandler.trigger(this._element, `${EVENT_KEY}.hidden`);
    };

    if (this._element.dataset.animation === 'false') {
      complete();
    } else {
      EventHandler.one(this._element, 'animationend', () => complete());
    }
  }

  static getInstance(element) {
    return Data.getData(element, this.NAME);
  }
}

EventHandler.on(document, 'click', e => {
  const target = e.target.getAttribute('data-modal-trigger');
  if (target === null) {
    return false;
  } else {
    const modalEl = document.getElementById(`${target}`);
    if (modalEl) {
      const modal = Modal.getInstance(modalEl);
      if (modal) {
        modal.show();
      } else {
        new Modal(modalEl).show();
      }
    }
  }
});

export default Modal;
