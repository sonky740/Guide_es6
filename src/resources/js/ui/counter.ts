import Data from '../util/data';
import EventHandler from '../util/eventHandler';
import BaseComponent from '../util/baseComponent';
import { numberComma } from '../util/util';

const NAME = 'counter';
const EVENT_KEY = `${NAME}`;

class Counter extends BaseComponent {
  private _counter: number;
  private _initNumber: number;
  private _duration: number;
  private _comma: boolean;
  private _startTime: number;
  constructor(element: HTMLElement) {
    super(element);

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
    const step = (currentTime: number) => {
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

  static getInstance(element: HTMLElement) {
    return Data.getData(element, this.NAME);
  }
}

export default Counter;
