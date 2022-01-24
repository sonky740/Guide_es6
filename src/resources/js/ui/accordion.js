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
    this._isShow = false;

    Array.from(this._item).forEach(item => {
      const target = item.querySelector('[data-accr-target]');
      const trigger = item.querySelector('[data-accr-trigger]');

      // 처음에 열려있다면...
      if (item.classList.contains('on')) {
        trigger.classList.add('on');
        trigger.querySelector('.blind').innerText = '접기';
        target.classList.add('shown');
      }

      EventHandler.on(trigger, 'click', e => {
        e.preventDefault();
        e.stopPropagation();

        if (!item.classList.contains('on')) {
          this.show(item);
        } else if (item.classList.contains('on')) {
          this.hide(item);
        }
      });
    });

    Data.setData(element, NAME, this);
  }

  show(item) {
    if (typeof item === 'number') {
      const number = this._element.children[item];
      item = number;
    } else if (typeof item === 'string') {
      const string = this._element.querySelector(item);
      item = string;
    }

    if (item.classList.contains('on')) return false;

    const target = item.querySelector('[data-accr-target]');
    const trigger = item.querySelector('[data-accr-trigger]');

    if (this._isShow) return false;
    this._isShow = true;

    item.classList.add('on');
    trigger.classList.add('on');
    trigger.querySelector('.blind').innerText = '접기';

    const showing = new CustomEvent(`${EVENT_KEY}.showing`);
    target.dispatchEvent(showing);

    if (this._element.dataset.accrAniamtion === 'false') {
      target.classList.add('shown');
      this._isShow = false;

      const shown = new CustomEvent(`${EVENT_KEY}.shown`);
      target.dispatchEvent(shown);
    } else {
      // transition
      this.showTransition(target);
    }

    // data-accr = "only" 하나만 열릴 때
    if (this._element.dataset.accr === 'only') {
      siblings(item).forEach(items => {
        const targets = items.querySelector('[data-accr-target]');
        const triggers = items.querySelector('[data-accr-trigger]');

        if (targets.classList.contains('shown')) {
          triggers.classList.remove('on');
          triggers.querySelector('.blind').innerText = '펼치기';

          const hiding = new CustomEvent(`${EVENT_KEY}.hiding`);
          targets.dispatchEvent(hiding);

          if (this._element.dataset.accrAniamtion === 'false') {
            items.classList.remove('on');
            targets.classList.remove('shown');
            this._isShow = false;

            const hidden = new CustomEvent(`${EVENT_KEY}.hidden`);
            target.dispatchEvent(hidden);
          } else {
            // transition
            this.hideTransition(items, targets);
          }
        }
      });
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

    if (!item.classList.contains('on')) return false;

    const target = item.querySelector('[data-accr-target]');
    const trigger = item.querySelector('[data-accr-trigger]');

    if (this._isShow) return false;
    this._isShow = true;

    trigger.classList.remove('on');
    trigger.querySelector('.blind').innerText = '펼치기';

    const hiding = new CustomEvent(`${EVENT_KEY}.hiding`);
    target.dispatchEvent(hiding);

    // transition
    if (this._element.dataset.accrAniamtion === 'false') {
      item.classList.remove('on');
      target.classList.remove('shown');
      this._isShow = false;

      const hidden = new CustomEvent(`${EVENT_KEY}.hidden`);
      target.dispatchEvent(hidden);
    } else {
      // transition
      this.hideTransition(item, target);
    }
  }

  showTransition(target) {
    target.classList.add('showing');
    target.style.height = `${target.scrollHeight}px`;

    EventHandler.one(target, 'transitionend', () => {
      if (target.classList.contains('showing')) {
        target.classList.remove('showing');
        target.removeAttribute('style');
        target.classList.add('shown');
        this._isShow = false;

        const shown = new CustomEvent(`${EVENT_KEY}.shown`);
        target.dispatchEvent(shown);
      }
    });
  }

  hideTransition(item, target) {
    target.style.height = `${target.scrollHeight}px`;
    target.heightCache = target.scrollHeight;
    target.classList.add('hiding');
    target.classList.remove('shown');
    target.removeAttribute('style');
    item.querySelector('[data-accr-trigger] .blind').innerText = '펼치기';

    EventHandler.one(target, 'transitionend', () => {
      if (target.classList.contains('hiding')) {
        item.classList.remove('on');
        target.classList.remove('hiding');
        this._isShow = false;

        const hidden = new CustomEvent(`${EVENT_KEY}.hidden`);
        target.dispatchEvent(hidden);
      }
    });
  }

  showAll() {
    Array.from(this._item).forEach(item => {
      const target = item.querySelector('[data-accr-target]');
      const trigger = item.querySelector('[data-accr-trigger]');

      if (this._element.dataset.accr !== 'only') {
        if (target.classList.contains('shown')) return false;
        item.classList.add('on');
        trigger.classList.add('on');
        trigger.querySelector('.blind').innerText = '접기';

        const showing = new CustomEvent(`${EVENT_KEY}.showing`);
        target.dispatchEvent(showing);

        this.showTransition(target);
      } else if (this._element.dataset.accr === 'only') {
        console.error('하나만 열릴 때는 동작하지 않습니다.');
      }
    });
  }

  hideAll() {
    Array.from(this._item).forEach(item => {
      const target = item.querySelector('[data-accr-target]');
      const trigger = item.querySelector('[data-accr-trigger]');

      trigger.classList.remove('on');
      trigger.querySelector('.blind').innerText = '펼치기';

      const hiding = new CustomEvent(`${EVENT_KEY}.hiding`);
      target.dispatchEvent(hiding);

      this.hideTransition(item, target);
    });
  }

  static getInstance(element) {
    return Data.getData(element, this.NAME);
  }
}

export default Accordion;
