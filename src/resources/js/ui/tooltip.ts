import Data from '../util/data';
import BaseComponent from '../util/baseComponent';
import EventHandler from '../util/eventHandler';

interface ConfigType {
  shown: string;
  hiding: string;
}

const NAME = 'tooltip';
const EVENT_KEY = `${NAME}`;

const defaultConfig = {
  shown: 'shown',
  hiding: 'hiding'
};

class Tooltip extends BaseComponent {
  private _config: ConfigType;
  private _trigger: HTMLButtonElement | null = this._element.querySelector('[data-tooltip-trigger]');

  constructor(element: HTMLElement, config: object | undefined) {
    super(element);
    this._config = {
      ...defaultConfig,
      ...config
    };

    this.init();
  }

  init() {
    if (this._element.dataset.tooltip !== 'mouseover') {
      // tooltip click
      EventHandler.on(this._element, 'click', (e: MouseEvent) => {
        e.preventDefault();

        // show toggle
        if ((e.target as HTMLButtonElement).hasAttribute('data-tooltip-trigger')) {
          if (this._element.classList.contains(this._config.shown)) {
            this.hide();
            return false;
          }
          this.show();

          setTimeout(() => {
            EventHandler.on(window, 'click', (e: MouseEvent) => {
              if (!(e.target as HTMLButtonElement).closest('[data-tooltip-target]') && this._element.dataset.tooltipBackdrop !== 'false') {
                this.hide();
              }
            });
          }, 0);
        }
        // hide
        else if ((e.target as HTMLButtonElement).hasAttribute('data-tooltip-close')) {
          this.hide();
        }
      });
    } else if (this._element.dataset.tooltip === 'mouseover') {
      // show
      EventHandler.on(this._element, 'mouseover', () => {
        this.show();
      });
      EventHandler.on(this._trigger, 'focus', () => {
        this.show();
      });
      // hide
      EventHandler.on(this._element, 'mouseleave', () => {
        this.hide();
      });
      EventHandler.on(this._trigger, 'blur', () => {
        this.hide();
      });
    }
  }

  show() {
    if (this._element.classList.contains(this._config.shown)) return false;

    EventHandler.trigger(this._element, `${EVENT_KEY}.showing`, { target: this._element });

    this._element.classList.add(this._config.shown);

    const complete = () => {
      EventHandler.trigger(this._element, `${EVENT_KEY}.shown`, { target: this._element });
    };

    EventHandler.one(this._element, 'animationend', () => complete());
  }

  hide() {
    if (!this._element.classList.contains(this._config.shown)) return false;

    EventHandler.trigger(this._element, `${EVENT_KEY}.hiding`, { target: this._element });

    this._element.classList.remove(this._config.shown);
    this._element.classList.add(this._config.hiding);

    const complete = () => {
      this._element.classList.remove(this._config.hiding);

      EventHandler.trigger(this._element, `${EVENT_KEY}.hidden`, { target: this._element });
    };

    EventHandler.one(this._element, 'animationend', () => complete());
    EventHandler.off(window, 'click');
  }

  static get NAME() {
    return NAME;
  }
}

export default Tooltip;
