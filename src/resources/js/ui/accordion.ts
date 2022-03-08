import Data from '../util/data';
import EventHandler from '../util/eventHandler';
import BaseComponent from '../util/baseComponent';
import { siblings } from '../util/util';

interface ConfigType {
  showing: string;
  shown: string;
  hiding: string;
  hidden: string;
}

const NAME = 'accordion';
const EVENT_KEY = `${NAME}`;

const defaultConfig = {
  showing: 'showing',
  shown: 'shown',
  hiding: 'hiding',
  hidden: 'hidden'
};

class Accordion extends BaseComponent {
  private _config: ConfigType;
  private _item: HTMLCollection = this._element.children;
  private _isMoving = false;

  constructor(element: HTMLElement, config: object | undefined) {
    super(element);
    this._config = {
      ...defaultConfig,
      ...config
    };

    this.init();
  }

  init() {
    Array.from(this._item).forEach(item => {
      const target = item.querySelector('[data-accr-target]') as HTMLDivElement;
      const trigger = item.querySelector('[data-accr-trigger]') as HTMLButtonElement;
      const ir = trigger.querySelector('.blind') as HTMLSpanElement;

      // 처음에 열려있다면...
      if (item.classList.contains('on')) {
        trigger.classList.add('on');
        trigger.setAttribute('aria-expanded', 'true');
        ir.innerText = '접기';
        target.classList.add(this._config.shown);
      } else {
        target.classList.add(this._config.hidden);
        ir.innerText = '펼치기';
        trigger.setAttribute('aria-expanded', 'false');
      }

      // aria
      target.hasAttribute('id') ? false : target.setAttribute('id', this._getRandomSerial());
      trigger.hasAttribute('id') ? false : trigger.setAttribute('id', this._getRandomSerial());
      trigger.setAttribute('aria-controls', `${target.getAttribute('id')}`);
      target.setAttribute('aria-labelledby', `${trigger.getAttribute('id')}`);

      EventHandler.on(trigger, 'click', (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (this._isMoving) return false;
        this._isMoving = true;

        if (!item.classList.contains('on')) {
          this.show(item as HTMLElement);
        } else if (item.classList.contains('on')) {
          this.hide(item as HTMLElement);
        }
      });
    });
  }

  show(item: HTMLElement | string | number) {
    if (typeof item === 'number') {
      const numberItem = this._element.children[item];
      item = numberItem as HTMLElement;
    } else if (typeof item === 'string') {
      const stringItem = this._element.querySelector(item);
      item = stringItem as HTMLElement;
    }

    const header = item.querySelector('[data-accr-header]') as HTMLElement;
    const trigger = item.querySelector('[data-accr-trigger]') as HTMLButtonElement;
    const target = item.querySelector('[data-accr-target]') as HTMLDivElement;
    const ir = trigger.querySelector('.blind') as HTMLSpanElement;

    if (item.classList.contains('on')) return false;

    EventHandler.trigger(this._element, `${EVENT_KEY}.showing`, {
      item: item,
      header: header,
      trigger: trigger,
      target: target
    });

    item.classList.add('on');
    trigger.classList.add('on');
    trigger.setAttribute('aria-expanded', 'true');
    ir.innerText = '접기';
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
      siblings(item).forEach(items => {
        if ((item as HTMLElement).classList.contains('on')) this.hide(items as HTMLElement);
      });
    }

    if (this._element.dataset.animation === 'false') {
      complete();
    } else {
      EventHandler.one(target, 'transitionend', () => complete());
    }
  }

  hide(item: HTMLElement | string | number) {
    if (typeof item === 'number') {
      const numberItem = this._element.children[item];
      item = numberItem as HTMLElement;
    } else if (typeof item === 'string') {
      const stringItem = this._element.querySelector(item);
      item = stringItem as HTMLElement;
    }

    const header = item.querySelector('[data-accr-header]') as HTMLElement;
    const trigger = item.querySelector('[data-accr-trigger]') as HTMLButtonElement;
    const target = item.querySelector('[data-accr-target]') as HTMLDivElement;
    const ir = trigger.querySelector('.blind') as HTMLSpanElement;

    if (!item.classList.contains('on')) return false;

    EventHandler.trigger(this._element, `${EVENT_KEY}.hiding`, {
      item: item,
      header: header,
      trigger: trigger,
      target: target
    });

    trigger.classList.remove('on');
    trigger.setAttribute('aria-expanded', 'false');
    ir.innerText = '펼치기';
    target.style.height = `${target.scrollHeight}px`;
    target.style.height = `${target.scrollHeight}px`;
    target.classList.remove(this._config.shown);
    target.classList.add(this._config.hiding);
    target.removeAttribute('style');

    const complete = () => {
      target.classList.remove(this._config.hiding);
      target.classList.add(this._config.hidden);
      (item as HTMLElement).classList.remove('on');
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
      this.show(item as HTMLElement);
    });
  }

  hideAll() {
    Array.from(this._item).forEach(item => {
      this.hide(item as HTMLElement);
    });
  }

  static get NAME() {
    return NAME;
  }
}

export default Accordion;
