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

    this.init();

    Data.setData(element, NAME, this);
  }

  init() {
    this._initNumber = this._element.getAttribute('data-init-number');
    this._duration = this._element.getAttribute('data-duration');
    this._comma = this._element.getAttribute('data-comma');
    this._startTime = null;

    this._step();
  }

  _step() {
    const step = currentTime => {
      if (!this._startTime) {
        this._startTime = currentTime;
      }
      const progress = Math.min((currentTime - this._startTime) / this._duration, 1);
      if (this._comma) {
        this._element.innerHTML = numberComma(Math.floor(progress * (this._element.getAttribute('data-counter') - Number(this._initNumber)) + Number(this._initNumber)));
      } else {
        this._element.innerHTML = Math.floor(progress * (this._element.getAttribute('data-counter') - Number(this._initNumber)) + Number(this._initNumber));
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
