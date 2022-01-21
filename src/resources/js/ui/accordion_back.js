import Data from '../util/data.js';
import BaseComponent from '../util/baseComponent.js';
import { siblings } from '../util/util.js';

const NAME = 'accr';
// const EVENT_KEY = `${NAME}`;

class Accordion extends BaseComponent {
  constructor(element) {
    super(element);

    this._accr = this._element.parentNode;
    this._trigger = this._element.querySelector('[data-accr-trigger]');
    this._target = this._element.querySelector('[data-accr-target]');
    this._isOpen = false;

    if (this._element.classList.contains('on')) {
      this._trigger.classList.add('on');
      this._target.classList.add('shown');
    }

    this._trigger.addEventListener('click', e => {
      if (this._element.classList.contains('on')) {
        this.hide(e);
      } else {
        this.show(e);
      }
    });

    Data.setData(element, NAME, this);
  }

  show() {
    if (this._isOpen === true) return false;

    this._isOpen = true;

    this._trigger.classList.add('on');
    this._target.classList.add('showing');

    this._target.style.height = `${this._target.scrollHeight}px`;
    this._element.classList.add('on');
    this._target.addEventListener(
      'transitionend',
      () => {
        this._target.classList.remove('showing');
        this._target.classList.add('shown');
        this._target.removeAttribute('style');

        this._isOpen = false;
      },
      { once: true }
    );

    if (this._accr.dataset.accr === 'only') {
      siblings(this._element).forEach(el => {
        this.hide(el);
      });
    }
  }

  hide() {
    if (this._isOpen === true) return false;

    this._isOpen = true;

    this._target.style.height = `${this._target.scrollHeight}px`;
    this._target.heightCache = this._target.offsetHeight;
    this._target.classList.remove('shown');
    this._target.classList.add('hiding');
    this._target.style.height = '';
    this._trigger.classList.remove('on');

    this._target.addEventListener(
      'transitionend',
      () => {
        this._target.classList.remove('hiding');
        this._target.removeAttribute('style');
        this._element.classList.remove('on');

        this._isOpen = false;
      },
      { once: true }
    );
  }

  static getInstance(element) {
    return Data.getData(element, this.NAME);
  }
}

export default Accordion;
