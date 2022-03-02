import Data from '../util/data.js';
import EventHandler from '../util/eventHandler.js';
import BaseComponent from '../util/baseComponent.js';
import { siblings } from '../util/util.js';

const NAME = 'accr';
const EVENT_KEY = `${NAME}`;

const defaultConfig = {
  showing: 'showing',
  shown: 'shown',
  hiding: 'hiding',
  hidden: 'hidden'
};

interface ConfigType {
  showing: string;
  shown: string;
  hiding: string;
  hidden: string;
}

class Accordion extends BaseComponent {
  private _config: ConfigType;
  private _item: ArrayLike<Element>;
  private _isMoving: boolean;
  static NAME: string;

  constructor(element: HTMLElement, config: ConfigType) {
    super(element);
    this._config = {
      ...defaultConfig,
      ...config
    };

    this._item = this._element.children;
    this._isMoving = false;

    this.init();

    Data.setData(element, NAME, this);
  }

  init() {
    Array.from(this._item).forEach((item: Element) => {
      const target = item.querySelector('[data-accr-target]') as HTMLElement;
      const trigger = item.querySelector('[data-accr-trigger]') as HTMLButtonElement;

      // 처음에 열려있다면...
      if (item.classList.contains('on')) {
        trigger.classList.add('on');
        trigger.querySelector<HTMLElement>('.blind').innerText = '접기';
        target.classList.add(this._config.shown);
      } else {
        target.classList.add(this._config.hidden);
      }

      EventHandler.on(trigger, 'click', (e: MouseEvent) => {
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

  show(item: Element) {
    if (typeof item === 'number') {
      const number = this._element.children[item];
      item = number;
    } else if (typeof item === 'string') {
      const string = this._element.querySelector(item);
      item = string;
    }

    const header = item.querySelector('[data-accr-header]') as HTMLElement;
    const trigger = item.querySelector('[data-accr-trigger]') as HTMLButtonElement;
    const target = item.querySelector('[data-accr-target]') as HTMLElement;

    if (item.classList.contains('on')) return false;

    EventHandler.trigger(this._element, `${EVENT_KEY}.showing`, {
      item: item,
      header: header,
      trigger: trigger,
      target: target
    });

    item.classList.add('on');
    trigger.classList.add('on');
    trigger.querySelector<HTMLElement>('.blind').innerText = '접기';
    target.classList.remove(this._config.hidden);
    target.classList.add(this._config.showing);
    target.style.height = `${target.scrollHeight}px`;

    const complete = () => {
      target.classList.remove(this._config.showing);
      target.classList.add(this._config.shown);
      target.removeAttribute('style');
      this._isMoving = false;

      EventHandler.trigger(this._element, `${EVENT_KEY}.shown`, {
        item: item,
        header: header,
        trigger: trigger,
        target: target
      });
    };

    // data-accr = "only" 하나만 열릴 때
    if (this._element.dataset.accr === 'only') {
      siblings(item).forEach((items: Element) => {
        if (item.classList.contains('on')) this.hide(items);
      });
    }

    if (this._element.dataset.animation === 'false') {
      complete();
    } else {
      EventHandler.one(target, 'transitionend', () => complete());
    }
  }

  hide(item: Element) {
    if (typeof item === 'number') {
      const number = this._element.children[item];
      item = number;
    } else if (typeof item === 'string') {
      const string = this._element.querySelector(item);
      item = string;
    }

    const header = item.querySelector('[data-accr-header]') as HTMLElement;
    const target = item.querySelector('[data-accr-target]') as HTMLElement;
    const trigger = item.querySelector('[data-accr-trigger]') as HTMLButtonElement;

    if (!item.classList.contains('on')) return false;

    EventHandler.trigger(this._element, `${EVENT_KEY}.hiding`, {
      item: item,
      header: header,
      trigger: trigger,
      target: target
    });

    trigger.classList.remove('on');
    trigger.querySelector<HTMLElement>('.blind').innerText = '펼치기';
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

      EventHandler.trigger(this._element, `${EVENT_KEY}.hidden`, {
        item: item,
        header: header,
        trigger: trigger,
        target: target
      });
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

  static getInstance(element: Element) {
    return Data.getData(element, this.NAME);
  }
}

export default Accordion;
