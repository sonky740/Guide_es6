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

const NAME = 'tab';
const EVENT_KEY = `${NAME}`;

const defaultConfig = {
  showing: 'showing',
  shown: 'shown',
  hiding: 'hiding',
  hidden: 'hidden'
};

class Tab extends BaseComponent {
  private _config: ConfigType;
  private _trigger: NodeListOf<HTMLButtonElement | HTMLAnchorElement> = this._element.querySelectorAll('[data-tab-trigger]');
  private _isMoving = false;

  constructor(element: HTMLElement, config: object | undefined) {
    super(element);
    this._config = {
      ...defaultConfig,
      ...config
    };

    this.init();

    Data.setData(element, NAME, this);
  }

  init() {
    this.initVars();

    this._trigger.forEach((trigger: HTMLButtonElement | HTMLAnchorElement) => {
      const target = document.querySelector(trigger.dataset.tabTrigger as string);

      if (trigger.classList.contains('on')) {
        target?.classList.add(this._config.shown);
      } else {
        target?.classList.add(this._config.hidden);
      }

      EventHandler.on(trigger, 'click', (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!trigger.classList.contains('on')) {
          this.show(target as HTMLElement);
        }
      });
    });
  }

  initVars() {
    this._element.setAttribute('role', 'tablist');
    this._trigger.forEach(trigger => {
      const target = document.querySelector(trigger.dataset.tabTrigger as string);
      trigger.setAttribute('role', 'tab');
      target?.setAttribute('role', 'tabpanel');
    });
  }

  show(target: HTMLElement | string | number) {
    let trigger!: HTMLElement;
    if (typeof target === 'number') {
      trigger = this._element.children[target] as HTMLButtonElement | HTMLAnchorElement;
      target = document.querySelector(trigger.dataset.tabTrigger as string) as HTMLElement;
    } else if (typeof target === 'string') {
      trigger = document.querySelector(`[data-tab-trigger="${target}"]`) as HTMLButtonElement | HTMLAnchorElement;
      target = document.querySelector(target) as HTMLElement;
    } else if (typeof target === 'object') {
      trigger = document.querySelector(`[data-tab-trigger="#${target.getAttribute('id')}"]`) as HTMLButtonElement | HTMLAnchorElement;
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
          (target as HTMLElement).classList.remove(this._config.hidden);

          EventHandler.trigger(this._element, `${EVENT_KEY}.showing`, { target: target, trigger: trigger });
          (target as HTMLElement).classList.add(this._config.showing);

          (target as HTMLElement).classList.add(this._config.shown);
        };

        if (this._element.dataset.animation === 'false') {
          groupComplete();
        } else {
          EventHandler.one(group, 'animationend', () => groupComplete());
        }
      }
    });

    const targetComplete = () => {
      (target as HTMLElement).classList.remove(this._config.showing);
      (target as HTMLElement).classList.add(this._config.shown);
      EventHandler.trigger(this._element, `${EVENT_KEY}.shown`, { target: target, trigger: trigger });

      this._isMoving = false;
    };

    if (this._element.dataset.animation === 'false') {
      targetComplete();
    } else {
      EventHandler.one(target, 'animationend', () => targetComplete());
    }
  }

  static get NAME() {
    return NAME;
  }

  static getInstance(element: HTMLElement) {
    return Data.getData(element, this.NAME);
  }
}

export default Tab;
