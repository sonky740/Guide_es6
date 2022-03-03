import Data from '../util/data.js';
import EventHandler from '../util/eventHandler.js';
import BaseComponent from '../util/baseComponent.js';
import { numberComma } from '../util/util.js';

const NAME = 'counter';
const EVENT_KEY = `${NAME}`;

class Counter extends BaseComponent {
  constructor(element, config) {
    super(element);
    this._config = {
      ...config
    };

    this._counter = 0;
    this._initNumber = 0;
    this._duration = 0;
    this._comma = false;
    this._startTime = 0;

    this.init();

    Data.setData(element, NAME, this);
  }

  init() {
    this._counter = Number(this._element.getAttribute('data-counter'));
    this._initNumber = Number(this._element.getAttribute('data-init-number'));
    this._duration = Number(this._element.getAttribute('data-duration'));
    this._comma = Boolean(this._element.getAttribute('data-comma'));
    this._startTime = 0;

    this._step();
  }

  _step() {
    const step = currentTime => {
      if (this._startTime === 0) {
        this._startTime = currentTime;
      }
      const progress = Math.min((currentTime - this._startTime) / this._duration, 1);
      if (this._comma) {
        this._element.innerHTML = numberComma(Math.floor(progress * (this._counter - this._initNumber) + this._initNumber));
      } else {
        this._element.innerHTML = Math.floor(progress * (this._counter - this._initNumber) + this._initNumber).toString();
      }
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        EventHandler.trigger(this._element, `${EVENT_KEY}.end`, {
          target: this._element
        });
      }
    };

    window.requestAnimationFrame(step);
  }

  static get NAME() {
    return NAME;
  }

  static getInstance(element) {
    return Data.getData(element, this.NAME);
  }
}

export default Counter;
