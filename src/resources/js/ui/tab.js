import Data from '../util/data.js';
import EventHandler from '../util/eventHandler.js';
import BaseComponent from '../util/baseComponent.js';
import { siblings } from '../util/util.js';

const NAME = 'tab';
const EVENT_KEY = `${NAME}`;

class Tab extends BaseComponent {
  constructor(element) {
    super(element);

    this._trigger = this._element.querySelectorAll('[data-tab-trigger]');
    this._isMoving = false;

    this._trigger.forEach(trigger => {
      const item = trigger.closest('[data-tab-item]');
      const target = document.getElementById(trigger.dataset.tabTrigger);

      if (item.classList.contains('on')) {
        target.classList.add('tab-in');
      }

      EventHandler.on(trigger, 'click', e => {
        e.preventDefault();
        e.stopPropagation();

        if (!item.classList.contains('on')) {
          this.show(trigger);
        }
      });
    });

    Data.setData(element, NAME, this);
  }

  show(trigger) {
    const item = trigger.closest('[data-tab-item]');
    const target = document.getElementById(trigger.dataset.tabTrigger);
    const groups = document.querySelectorAll(`[data-tab-target="${this._element.dataset.tab}"]`);

    if (this._isMoving) return false;
    this._isMoving = true;

    if (item.classList.contains('on')) return false;

    siblings(item).forEach(items => {
      items.classList.remove('on');
    });
    item.classList.add('on');

    groups.forEach(group => {
      if (group.classList.contains('tab-in')) {
        group.classList.remove('tab-in');
        group.classList.add('tab-out');

        EventHandler.trigger(group, `${EVENT_KEY}.hiding`);

        EventHandler.one(group, 'animationend', () => {
          if (group.classList.contains('tab-out')) {
            group.classList.remove('tab-out');

            EventHandler.trigger(group, `${EVENT_KEY}.hidden`);

            target.classList.add('tab-in');
            this._isMoving = false;

            EventHandler.trigger(target, `${EVENT_KEY}.showing`);
          }
        });
      }
    });

    EventHandler.one(target, 'animationend', () => {
      EventHandler.trigger(target, `${EVENT_KEY}.shown`);
    });
  }

  static getInstance(element) {
    return Data.getData(element, this.NAME);
  }
}

export default Tab;
