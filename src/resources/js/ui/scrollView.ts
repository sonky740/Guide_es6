import EventHandler from '../util/eventHandler';
import BaseComponent from '../util/baseComponent';

interface ConfigType {
  onClass: string;
  shown: string;
  hidden: string;
}

const NAME = 'scrollView';
const EVENT_KEY = `${NAME}`;

const defaultConfig = {
  onClass: 'on',
  shown: 'shown',
  hidden: 'hidden'
};
class ScrollView extends BaseComponent {
  private _config: ConfigType;
  private _top: number = this._element.getBoundingClientRect().top;
  private _viewH: number = document.documentElement.clientHeight;
  private _multiple: number = Number(this._element.dataset.multiple) || 7 / 10;
  private _effectClass: string = this._element.dataset.scrollView || 'view-up';

  constructor(element: HTMLElement, config: object | undefined) {
    super(element);
    this._config = {
      ...defaultConfig,
      ...config
    };

    this.init();
  }

  init() {
    if (this._top < this._viewH * this._multiple) this._show();

    this._events();
  }

  _events() {
    ['scroll', 'resize'].forEach(events => {
      EventHandler.on(window, events, () => {
        this._top = this._element.getBoundingClientRect().top;
        this._viewH = document.documentElement.clientHeight;

        if (this._top < this._viewH * this._multiple) {
          this._show();
        } else if (this._top > this._viewH * this._multiple && !this._element.hasAttribute('data-scroll-forward')) {
          this._hide();
        }
      });
    });
  }

  _show() {
    if (this._element.classList.contains(this._config.onClass)) return false;
    this._element.classList.add(this._config.onClass);
    this._element.classList.add(this._effectClass);

    EventHandler.one(this._element, 'transitionend', () => {
      EventHandler.trigger(this._element, `${EVENT_KEY}.shown`, {
        target: this._element
      });
    });
  }

  _hide() {
    if (!this._element.classList.contains(this._config.onClass)) return false;
    this._element.classList.remove(this._config.onClass);
    this._element.classList.remove(this._effectClass);

    EventHandler.one(this._element, 'transitionend', () => {
      EventHandler.trigger(this._element, `${EVENT_KEY}.hidden`, {
        target: this._element
      });
    });
  }

  static get NAME() {
    return NAME;
  }
}

export default ScrollView;
