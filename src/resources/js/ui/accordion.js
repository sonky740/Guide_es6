import Data from '../util/data.js';
import EventHandler from '../util/eventHandler';
import BaseComponent from '../util/baseComponent.js';
import { siblings } from '../util/util.js';

const NAME = 'accr';
const EVENT_KEY = `${NAME}`;

class Accordion extends BaseComponent {
  constructor(element) {
    super(element);

    this._item = this._element.children;
    this._isMoving = false;

    this.init();

    Data.setData(element, NAME, this);
  }

  init() {
    Array.from(this._item).forEach(item => {
      const target = item.querySelector('[data-accr-target]');
      const trigger = item.querySelector('[data-accr-trigger]');

      // 처음에 열려있다면...
      if (item.classList.contains('on')) {
        trigger.classList.add('on');
        trigger.querySelector('.blind').innerText = '접기';
        target.classList.add('shown');
      } else {
        target.classList.add('hidden');
      }

      EventHandler.on(trigger, 'click', e => {
        e.preventDefault();
        e.stopPropagation();

        if (this._isMoving) return false;
        this._isMoving = true;

        if (!item.classList.contains('on')) {
          this.show(item);
        } else if (item.classList.contains('on')) {
          this.hide(item);
        }
      });
    });
  }

  show(item) {
    if (typeof item === 'number') {
      const number = this._element.children[item];
      item = number;
    } else if (typeof item === 'string') {
      const string = this._element.querySelector(item);
      item = string;
    }

    const target = item.querySelector('[data-accr-target]');
    const trigger = item.querySelector('[data-accr-trigger]');

    if (item.classList.contains('on')) return false;

    item.classList.add('on');
    trigger.classList.add('on');
    trigger.querySelector('.blind').innerText = '접기';
    target.classList.remove('hidden');
    target.classList.add('showing');
    target.style.height = `${target.scrollHeight}px`;

    EventHandler.trigger(item, `${EVENT_KEY}.showing`);

    const complete = () => {
      target.classList.remove('showing');
      target.classList.add('shown');
      target.removeAttribute('style');
      this._isMoving = false;

      EventHandler.trigger(item, `${EVENT_KEY}.shown`);
    };

    // data-accr = "only" 하나만 열릴 때
    if (this._element.dataset.accr === 'only') {
      siblings(item).forEach(items => {
        if (item.classList.contains('on')) this.hide(items);
      });
    }

    if (this._element.dataset.accrAnimation === 'false') {
      complete();
    } else {
      EventHandler.one(target, 'transitionend', () => complete());
    }
  }

  hide(item) {
    if (typeof item === 'number') {
      const number = this._element.children[item];
      item = number;
    } else if (typeof item === 'string') {
      const string = this._element.querySelector(item);
      item = string;
    }

    const target = item.querySelector('[data-accr-target]');
    const trigger = item.querySelector('[data-accr-trigger]');

    if (!item.classList.contains('on')) return false;

    trigger.classList.remove('on');
    trigger.querySelector('.blind').innerText = '펼치기';
    target.style.height = `${target.scrollHeight}px`;
    target.heightCache = target.scrollHeight;
    target.classList.remove('shown');
    target.classList.add('hiding');
    target.removeAttribute('style');

    EventHandler.trigger(item, `${EVENT_KEY}.hiding`);

    const complete = () => {
      target.classList.remove('hiding');
      target.classList.add('hidden');
      item.classList.remove('on');
      this._isMoving = false;

      EventHandler.trigger(item, `${EVENT_KEY}.hidden`);
    };

    // transition
    if (this._element.dataset.accrAnimation === 'false') {
      complete();
    } else {
      EventHandler.one(target, 'transitionend', () => complete());
    }
  }

  showAll() {
    Array.from(this._item).forEach(item => {
      if (this._element.dataset.accr === 'only') super._throwError('하나만 열릴 때는 동작하지 않습니다.');
      if (item.classList.contains('on')) return false;
      this.show(item);
    });
  }

  hideAll() {
    Array.from(this._item).forEach(item => {
      this.hide(item);
    });
  }

  static getInstance(element) {
    return Data.getData(element, this.NAME);
  }
}

export default Accordion;
