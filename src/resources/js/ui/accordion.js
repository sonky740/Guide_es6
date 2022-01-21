import Data from '../util/data.js';
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

      if (item.classList.contains('on')) {
        trigger.classList.add('on');
        target.classList.add('shown');
      }

      trigger.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();

        this.click(item, target, trigger);
      });
    });

    Data.setData(element, NAME, this);
  }

  click(item, target, trigger) {
    if (this._isShow) return false;
    this._isShow = true;

    if (!item.classList.contains('on')) {
      item.classList.add('on');
      trigger.classList.add('on');
      trigger.querySelector('.blind').innerText = '접기';

      const showing = new CustomEvent(`${EVENT_KEY}.showing`);
      target.dispatchEvent(showing);

      // transition
      this.showTransition(target);

      // data-accr = "only" 하나만 열릴 때
      if (this._element.dataset.accr === 'only') {
        siblings(item).forEach(items => {
          const targets = items.querySelector('[data-accr-target]');

          if (targets.classList.contains('shown')) {
            items.querySelector('[data-accr-trigger]').classList.remove('on');

            this.hideTransition(items, targets);
          }
        });
      }
    } else {
      trigger.classList.remove('on');
      trigger.querySelector('.blind').innerText = '펼치기';

      const hiding = new CustomEvent(`${EVENT_KEY}.hiding`);
      target.dispatchEvent(hiding);

      // transition
      this.hideTransition(item, target);
    }
  }

  showTransition(target) {
    target.classList.add('showing');
    target.style.height = `${target.scrollHeight}px`;

    target.addEventListener(
      'transitionend',
      () => {
        if (target.classList.contains('showing')) {
          target.classList.remove('showing');
          target.removeAttribute('style');
          target.classList.add('shown');
          this._isShow = false;

          const shown = new CustomEvent(`${EVENT_KEY}.shown`);
          target.dispatchEvent(shown);
        }
      },
      { once: true }
    );
  }

  hideTransition(item, target) {
    target.style.height = `${target.scrollHeight}px`;
    target.style.height = `${target.scrollHeight}px`;
    target.classList.add('hiding');
    target.classList.remove('shown');
    target.removeAttribute('style');
    item.querySelector('[data-accr-trigger] .blind').innerText = '펼치기';

    target.addEventListener(
      'transitionend',
      () => {
        if (target.classList.contains('hiding')) {
          item.classList.remove('on');
          target.classList.remove('hiding');
          this._isShow = false;

          const hidden = new CustomEvent(`${EVENT_KEY}.hidden`);
          target.dispatchEvent(hidden);
        }
      },
      { once: true }
    );
  }

  showAll() {
    Array.from(this._item).forEach(item => {
      const target = item.querySelector('[data-accr-target]');
      const trigger = item.querySelector('[data-accr-trigger]');

      if (this._element.dataset.accr !== 'only') {
        if (target.classList.contains('shown')) return false;
        item.classList.add('on');
        trigger.classList.add('on');

        this.showTransition(target);
      } else if (this._element.dataset.accr === 'only') {
        console.warn('하나만 열릴 때는 작동하지 않습니다.');
      }
    });
  }

  hideAll() {
    Array.from(this._item).forEach(item => {
      const target = item.querySelector('[data-accr-target]');
      const trigger = item.querySelector('[data-accr-trigger]');

      trigger.classList.remove('on');

      this.hideTransition(item, target);
    });
  }

  static getInstance(element) {
    return Data.getData(element, this.NAME);
  }
}

export default Accordion;
