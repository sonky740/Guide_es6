import Data from '../util/data.js';
import EventHandler from '../util/eventHandler.js';
import BaseComponent from '../util/baseComponent.js';
import { siblings } from '../util/util.js';

const NAME = 'tab';
const EVENT_KEY = `${NAME}`;

const defaultConfig = {
  showing: 'showing',
  shown: 'shown',
  hiding: 'hiding',
  hidden: 'hidden'
};

class Tab extends BaseComponent {
  constructor(element, config) {
    super(element);
    this._config = {
      ...defaultConfig,
      ...config
    };

    this._trigger = this._element.querySelectorAll('[data-tab-trigger]');
    this._isMoving = false;

    this.init();

    Data.setData(element, NAME, this);
  }

  init() {
    this.initVars();

    this._trigger.forEach(trigger => {
      const target = document.querySelector(trigger.dataset.tabTrigger);

      if (trigger.classList.contains('on')) {
        target.classList.add(this._config.shown);
      } else {
        target.classList.add(this._config.hidden);
      }

      EventHandler.on(trigger, 'click', e => {
        e.preventDefault();
        e.stopPropagation();

        if (!trigger.classList.contains('on')) {
          this.show(target);
        }
      });
    });
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

    siblings(trigger).forEach(trs => {
      trs.classList.remove('on');
    });
    trigger.classList.add('on');

    // const groups = document.querySelectorAll(`[data-tab-target="${this._element.dataset.tab}"]`);
    siblings(target).forEach(group => {
      const hideTrigger = document.querySelector(`[data-tab-trigger="#${group.getAttribute('id')}"]`);
      if (group.classList.contains(this._config.shown)) {
        group.classList.add(this._config.hiding);
        group.classList.remove(this._config.shown);

        EventHandler.trigger(this._element, `${EVENT_KEY}.hiding`, { target: group, trigger: hideTrigger });

        const groupComplete = () => {
          group.classList.remove(this._config.hiding);
          group.classList.add(this._config.hidden);

          EventHandler.trigger(this._element, `${EVENT_KEY}.hidden`, { target: group, trigger: hideTrigger });
          target.classList.remove(this._config.hidden);

          EventHandler.trigger(this._element, `${EVENT_KEY}.showing`, { target: target, trigger: trigger });
          target.classList.add(this._config.showing);

          target.classList.add(this._config.shown);
        };

        if (this._element.dataset.animation === 'false') {
          groupComplete();
        } else {
          EventHandler.one(group, 'animationend', () => groupComplete());
        }
      }
    });

    const targetComplete = () => {
      target.classList.remove(this._config.showing);
      target.classList.add(this._config.shown);
      EventHandler.trigger(this._element, `${EVENT_KEY}.shown`, { target: target, trigger: trigger });

      this._isMoving = false;
    };

    if (this._element.dataset.animation === 'false') {
      targetComplete();
    } else {
      EventHandler.one(target, 'animationend', () => targetComplete());
    }
  }

  static getInstance(element) {
    return Data.getData(element, this.NAME);
  }
}

export default Tab;
