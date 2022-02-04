import Data from '../util/data.js';
import EventHandler from '../util/eventHandler.js';
import BaseComponent from '../util/baseComponent.js';
import { siblings } from '../util/util.js';

const NAME = 'accr';
const SHOWING = 'showing';
const SHOWN = 'shown';
const HIDING = 'hiding';
const HIDDEN = 'hidden';
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
        target.classList.add(SHOWN);
      } else {
        target.classList.add(HIDDEN);
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

    const header = item.querySelector('[data-accr-header]');
    const trigger = item.querySelector('[data-accr-trigger]');
    const target = item.querySelector('[data-accr-target]');

    if (item.classList.contains('on')) return false;

    EventHandler.trigger(this._element, `${EVENT_KEY}.showing`, { item: item, header: header, trigger: trigger, target: target });

    item.classList.add('on');
    trigger.classList.add('on');
    trigger.querySelector('.blind').innerText = '접기';
    target.classList.remove(HIDDEN);
    target.classList.add(SHOWING);
    target.style.height = `${target.scrollHeight}px`;

    const complete = () => {
      target.classList.remove(SHOWING);
      target.classList.add(SHOWN);
      target.removeAttribute('style');
      this._isMoving = false;

      EventHandler.trigger(this._element, `${EVENT_KEY}.shown`, { item: item, header: header, trigger: trigger, target: target });
    };

    // data-accr = "only" 하나만 열릴 때
    if (this._element.dataset.accr === 'only') {
      siblings(item).forEach(items => {
        if (item.classList.contains('on')) this.hide(items);
      });
    }

    if (this._element.dataset.animation === 'false') {
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

    const header = item.querySelector('[data-accr-header]');
    const target = item.querySelector('[data-accr-target]');
    const trigger = item.querySelector('[data-accr-trigger]');

    if (!item.classList.contains('on')) return false;

    EventHandler.trigger(this._element, `${EVENT_KEY}.hiding`, { item: item, header: header, trigger: trigger, target: target });

    trigger.classList.remove('on');
    trigger.querySelector('.blind').innerText = '펼치기';
    target.style.height = `${target.scrollHeight}px`;
    target.heightCache = target.scrollHeight;
    target.classList.remove(SHOWN);
    target.classList.add(HIDING);
    target.removeAttribute('style');

    const complete = () => {
      target.classList.remove(HIDING);
      target.classList.add(HIDDEN);
      item.classList.remove('on');
      this._isMoving = false;

      EventHandler.trigger(this._element, `${EVENT_KEY}.hidden`, { item: item, header: header, trigger: trigger, target: target });
    };

    // transition
    if (this._element.dataset.animation === 'false') {
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
