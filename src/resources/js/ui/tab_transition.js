import Data from '../util/data.js';
import EventHandler from '../util/eventHandler.js';
import BaseComponent from '../util/baseComponent.js';
import { siblings } from '../util/util.js';

const NAME = 'tab';
const SHOWING = 'showing';
const SHOWN = 'shown';
const FADE = 'fade';
const HIDING = 'hiding';
const HIDDEN = 'hidden';
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
        target.classList.add(FADE);
      } else {
        target.classList.add(HIDDEN);
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
        group.classList.add(HIDING);
        group.classList.remove(SHOWN);
        group.classList.remove(FADE);

        EventHandler.trigger(group, `${EVENT_KEY}.hiding`);

        const groupComplete = () => {
          group.classList.remove(HIDING);
          group.classList.add(HIDDEN);

          EventHandler.trigger(group, `${EVENT_KEY}.hidden`);

          target.classList.remove(HIDDEN);
          target.classList.add(SHOWING);
          EventHandler.trigger(target, `${EVENT_KEY}.showing`);

          setTimeout(() => {
            target.classList.add(FADE);
          });
        };

        if (this._element.dataset.tabAnimation === 'false') {
          groupComplete();
        } else {
          EventHandler.one(group, 'transitionend', () => groupComplete());
        }
      }
    });

    const targetComplete = () => {
      target.classList.remove(SHOWING);
      target.classList.add(SHOWN);
      EventHandler.trigger(target, `${EVENT_KEY}.shown`);

      this._isMoving = false;
    };

    if (this._element.dataset.tabAnimation === 'false') {
      targetComplete();
    } else {
      EventHandler.one(target, 'transitionend', () => targetComplete());
    }
  }

  static getInstance(element) {
    return Data.getData(element, this.NAME);
  }
}

export default Tab;
