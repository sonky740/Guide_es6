import Data from '../util/data.js';
import EventHandler from '../util/eventHandler.js';
import BaseComponent from '../util/baseComponent.js';

const NAME = 'modal';
const EVENT_KEY = `${NAME}`;

const defaultConfig = {
  showing: 'showing',
  shown: 'shown',
  hiding: 'hiding'
};

class Modal extends BaseComponent {
  constructor(element, config) {
    super(element);
    this._config = {
      ...defaultConfig,
      ...config
    };

    this._trigger = document.querySelector(`[data-modal-trigger="${this._element.getAttribute('id')}"]`); // [data-modal-trigger]
    this._close = this._element.querySelectorAll('[data-modal-close]'); // 모달 닫기 버튼
    this._isMoving = false; // true일 경우 이벤트 작동 안되게

    this.init();

    Data.setData(element, NAME, this);
  }

  init() {
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
  }

  show(e) {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (this._isMoving === true || this._element.classList.contains(this._config.shown)) return false;
    this._isMoving = true;

    this._element.classList.add(this._config.showing);
    this._element.setAttribute('tabindex', 0);

    // window scroll 방지
    document.body.classList.add('modal-open');

    EventHandler.trigger(this._element, `${EVENT_KEY}.showing`, { target: this._element, trigger: this._trigger });

    const complete = () => {
      this._element.classList.remove(this._config.showing);
      this._element.classList.add(this._config.shown);
      this._element.focus();
      this._element.removeAttribute('tabindex');

      EventHandler.trigger(this._element, `${EVENT_KEY}.shown`, { target: this._element, trigger: this._trigger });
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
    this._isMoving = true;

    this._element.classList.remove(this._config.shown);
    this._element.classList.add(this._config.hiding);

    EventHandler.trigger(this._element, `${EVENT_KEY}.hiding`, { target: this._element, trigger: this._trigger });

    const complete = () => {
      this._isMoving = false;
      this._element.classList.remove(this._config.hiding);
      this._trigger.focus();

      // 마지막 모달을 닫을 때 window scroll 복구
      const arr = [];
      document.querySelectorAll('[data-modal]').forEach(modals => {
        arr.push(modals.classList.contains('shown'));
      });
      arr.some(isOpen => {
        if (!isOpen) {
          document.body.classList.remove('modal-open');
        }
        return isOpen === true;
      });

      EventHandler.trigger(this._element, `${EVENT_KEY}.hidden`, { target: this._element, trigger: this._trigger });
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
