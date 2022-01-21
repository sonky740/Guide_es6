import Data from '../util/data.js';
import BaseComponent from '../util/baseComponent.js';

const NAME = 'modal';
const EVENT_KEY = `${NAME}`;

class Modal extends BaseComponent {
  constructor(element) {
    super(element);

    this._trigger = document.querySelector(`[data-modal-trigger="${this._element.getAttribute('id')}"]`); // [data-moda-trigger]
    this._close = this._element.querySelectorAll('[data-modal-close]'); // 모달 닫기 버튼
    this._isShow = false; // true일 경우 이벤트 작동 안되게

    // 모달 트리거 클릭 시 모달 show
    if (this._trigger) {
      this._trigger.addEventListener('click', e => this.show(e));
    }

    // 모달 딤 클릭 시 닫기
    this._element.addEventListener('click', e => {
      if (e.target === this._element && this._element.dataset.modalBackdrop !== 'false') this.hide(e);
    });

    // 모달 닫기 버튼 클릭 시 닫기
    this._close.forEach(el => {
      el.addEventListener('click', () => {
        this.hide();
      });
    });

    Data.setData(element, NAME, this);
  }

  show(e) {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (this._isShow === true) return false;

    this._element.classList.add('modal-in');
    this._element.setAttribute('tabindex', 0);

    this._isShow = true;

    const showing = new CustomEvent(`${EVENT_KEY}.showing`);
    this._element.dispatchEvent(showing);

    this._element.children[0].addEventListener(
      'animationend',
      () => {
        this._isShow = false;
        this._element.focus();
        this._element.removeAttribute('tabindex');

        const shown = new CustomEvent(`${EVENT_KEY}.shown`);
        this._element.dispatchEvent(shown);
      },
      { once: true }
    );
  }

  hide(e) {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (this._isShow === true) return false;

    this._element.classList.remove('modal-in');
    this._element.classList.add('modal-out');

    this._isShow = true;

    const hiding = new CustomEvent(`${EVENT_KEY}.hiding`);
    this._element.dispatchEvent(hiding);

    this._element.children[0].addEventListener(
      'animationend',
      () => {
        this._isShow = false;
        this._element.classList.remove('modal-out');
        this._trigger.focus();

        const hidden = new CustomEvent(`${EVENT_KEY}.hidden`);
        this._element.dispatchEvent(hidden);
      },
      { once: true }
    );
  }

  static getInstance(element) {
    return Data.getData(element, this.NAME);
  }
}

document.addEventListener('click', e => {
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
