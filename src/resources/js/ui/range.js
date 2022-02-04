import Data from '../util/data.js';
import BaseComponent from '../util/baseComponent.js';
import EventHandler from '../util/eventHandler.js';
import { numberComma } from '../util/util.js';

const NAME = 'range';
const EVENT_KEY = `${NAME}`;

class Range extends BaseComponent {
  constructor(element) {
    super(element);

    this._range = this._element.querySelector('input[type="range"]');
    this._fill = this._element.querySelector('.range-fill');
    this._startRange = this._element.querySelector('input[type="range"][data-range-multi="start"]');
    this._endRange = this._element.querySelector('input[type="range"][data-range-multi="end"]');
    this._value = 0;
    this._multiValues = {
      start: 0,
      end: 0
    };

    this.init();

    Data.setData(element, NAME, this);
  }

  init() {
    if (!this._range.hasAttribute('data-range-multi')) {
      this.singleInput();
      EventHandler.on(this._range, 'input', () => this.singleInput());
    } else {
      this.startInput();
      this.endInput();
      EventHandler.on(this._startRange, 'input', () => this.startInput());
      EventHandler.on(this._endRange, 'input', () => this.endInput());
    }
  }

  singleInput() {
    const per = ((this._range.value - this._range.min) / (this._range.max - this._range.min)) * 100;

    // bar
    this._fill.style.right = `${100 - per}%`;

    this._value = Number(this._range.value);

    // min값 선택 안되게
    if (per === 0 && this._element.classList.contains('min-no')) {
      this._range.value = this._range.step;
      this._fill.style.right = 100 - `${(this._range.step / this._range.max) * 100}%`;
    }

    // value값을 나타내야할 때
    const value = document.querySelector(`[data-range-value="${this._range.getAttribute('id')}"]`);
    if (value) value.innerText = numberComma(this._range.value);

    EventHandler.trigger(this._range, `${EVENT_KEY}.input`, { value: this._value });
  }

  startInput() {
    this._startRange.value = Math.min(parseInt(this._startRange.value), parseInt(this._endRange.value) - parseInt(this._startRange.dataset.rangeMinstep));
    this._multiValues.start = Number(this._startRange.value);
    this._perStart = this._startRange.value / this._startRange.step;
    this._fill.style.left = `${this._perStart}%`;

    if (this._startRange.value >= this._endRange.value - 5) {
      this._startRange.style.zIndex = '2';
    } else {
      this._startRange.removeAttribute('style');
    }

    // value값을 나타내야할 때
    const value = document.querySelector(`[data-range-startvalue="${this._startRange.getAttribute('id')}"]`);
    if (value) value.innerText = numberComma(this._startRange.value);

    EventHandler.trigger(this._startRange, `${EVENT_KEY}.multi`, { value: this._multiValues });
  }

  endInput() {
    this._endRange.value = Math.max(parseInt(this._endRange.value), parseInt(this._startRange.value) + parseInt(this._endRange.dataset.rangeMinstep));
    this._multiValues.end = Number(this._endRange.value);
    this._perEnd = this._endRange.value / this._endRange.step;
    this._fill.style.right = `${100 - this._perEnd}%`;

    // value값을 나타내야할 때
    const value = document.querySelector(`[data-range-endvalue="${this._endRange.getAttribute('id')}"]`);
    if (value) value.innerText = numberComma(this._endRange.value);

    // data-range-last가 있을 때
    if (this._endRange.dataset.rangeMax !== undefined && this._endRange.value === this._endRange.max) {
      value.innerText = numberComma(this._endRange.value) + this._endRange.dataset.rangeMax;
    }

    EventHandler.trigger(this._endRange, `${EVENT_KEY}.multi`, { value: this._multiValues });
  }

  static getInstance(element) {
    return Data.getData(element, this.NAME);
  }
}

export default Range;
