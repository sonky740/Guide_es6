import Data from '../util/data.js';
import EventHandler from '../util/eventHandler.js';
import BaseComponent from '../util/baseComponent.js';
import { siblings } from '../util/util.js';

const NAME = 'tab';
const SHOWN = 'tab-in';
const HIDDEN = 'tab-out';
const EVENT_KEY = `${NAME}`;

class Tab extends BaseComponent {
  constructor(element) {
    super(element);

    this._trigger = this._element.querySelectorAll('[data-tab-trigger]');
    this._isMoving = false;

    this.initVars();

    this._trigger.forEach(trigger => {
      const target = document.querySelector(trigger.dataset.tabTrigger);

      if (trigger.classList.contains('on')) {
        target.classList.add(SHOWN);
      }

      EventHandler.on(trigger, 'click', e => {
        e.preventDefault();
        e.stopPropagation();

        if (!trigger.classList.contains('on')) {
          this.show(target);
        }
      });
    });

    Data.setData(element, NAME, this);
  }

  initVars() {
    this._element.setAttribute('role', 'tablist');
    this._trigger.forEach(trigger => {
      const target = document.querySelector(trigger.dataset.tabTrigger);
      trigger.setAttribute('role', 'tab');
      target.setAttribute('role', 'tabpanel');
    });
  }

  show(target) {
    let trigger;
    if (typeof target === 'number') {
      trigger = this._element.children[target];
      target = document.querySelector(trigger.dataset.tabTrigger);
    } else if (typeof target === 'string') {
      trigger = document.querySelector(`[data-tab-trigger="${target}"]`);
      target = document.querySelector(target);
    } else if (typeof target === 'object') {
      trigger = document.querySelector(`[data-tab-trigger="#${target.getAttribute('id')}"]`);
    }

    if (this._isMoving || trigger.classList.contains('on')) return false;
    this._isMoving = true;

    const groups = document.querySelectorAll(`[data-tab-target="${this._element.dataset.tab}"]`);

    siblings(trigger).forEach(trs => {
      trs.classList.remove('on');
    });
    trigger.classList.add('on');

    groups.forEach(group => {
      if (group.classList.contains(SHOWN)) {
        group.classList.remove(SHOWN);
        group.classList.add(HIDDEN);

        EventHandler.trigger(group, `${EVENT_KEY}.hiding`);

        const complete = () => {
          if (group.classList.contains(HIDDEN)) {
            group.classList.remove(HIDDEN);

            EventHandler.trigger(group, `${EVENT_KEY}.hidden`);

            EventHandler.trigger(target, `${EVENT_KEY}.showing`);

            target.classList.add(SHOWN);
            this._isMoving = false;
          }
        };

        EventHandler.one(group, 'animationend', () => complete());
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
