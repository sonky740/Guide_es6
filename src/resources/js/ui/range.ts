import Data from '../util/data';
import BaseComponent from '../util/baseComponent';
import EventHandler from '../util/eventHandler';
import { numberComma } from '../util/util';

const NAME = 'range';
const EVENT_KEY = `${NAME}`;

class Range extends BaseComponent {
  private _range = this._element.querySelector('input[type="range"]') as HTMLInputElement;
  private _fill = this._element.querySelector('.range-fill') as HTMLDivElement;
  private _startRange = this._element.querySelector('input[type="range"][data-range-multi="start"]') as HTMLInputElement;
  private _endRange = this._element.querySelector('input[type="range"][data-range-multi="end"]') as HTMLInputElement;
  private _value = 0;
  private _multiValues = {
    start: 0,
    end: 0
  };
  constructor(element: HTMLElement) {
    super(element);

    this.init();
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
    let inputValue = Number(this._range.value);
    const inputMin = Number(this._range.min);
    const inputMax = Number(this._range.max);
    const inputStep = Number(this._range.step);

    const per = ((inputValue - inputMin) / (inputMax - inputMin)) * 100;

    // bar
    this._fill.style.right = `${100 - per}%`;

    this._value = Number(inputValue);

    // min값 선택 안되게
    if (per === 0 && this._element.classList.contains('min-no')) {
      inputValue = inputStep;
      this._fill.style.right = `100 - ${(inputStep / inputMax) * 100}%`;
    }

    // value값을 나타내야할 때
    const value = document.getElementById(`${this._range.dataset.rangeValue}`);
    if (value) value.innerText = numberComma(inputValue);

    EventHandler.trigger(this._element, `${EVENT_KEY}.input`, {
      value: this._value
    });
  }

  startInput() {
    this._startRange.value = Math.min(Number(this._startRange.value), Number(this._endRange.value) - Number(this._startRange.dataset.rangeMinstep)).toString();
    this._multiValues.start = Number(this._startRange.value);
    const perStart = Number(this._startRange.value) / Number(this._startRange.step);
    this._fill.style.left = `${perStart}%`;

    if (Number(this._startRange.value) >= Number(this._endRange.value) - 5) {
      this._startRange.style.zIndex = '2';
    } else {
      this._startRange.removeAttribute('style');
    }

    // value값을 나타내야할 때
    const value = document.getElementById(`${this._startRange.dataset.rangeStartvalue}`);
    if (value) value.innerText = numberComma(Number(this._startRange.value));

    EventHandler.trigger(this._element, `${EVENT_KEY}.multi`, {
      value: this._multiValues
    });
  }

  endInput() {
    this._endRange.value = Math.max(Number(this._endRange.value), Number(this._startRange.value) + Number(this._endRange.dataset.rangeMinstep)).toString();
    this._multiValues.end = Number(this._endRange.value);
    const perEnd = Number(this._endRange.value) / Number(this._endRange.step);
    this._fill.style.right = `${100 - perEnd}%`;

    // value값을 나타내야할 때
    const value = document.getElementById(`${this._endRange.dataset.rangeEndvalue}`) as HTMLElement;
    if (value) value.innerText = numberComma(Number(this._endRange.value));

    // data-range-last가 있을 때
    if (this._endRange.dataset.rangeMax !== undefined && this._endRange.value === this._endRange.max) {
      value.innerText = numberComma(Number(this._endRange.value)) + this._endRange.dataset.rangeMax;
    }

    EventHandler.trigger(this._element, `${EVENT_KEY}.multi`, {
      value: this._multiValues
    });
  }

  static get NAME() {
    return NAME;
  }

  static getInstance(element: HTMLElement) {
    return Data.getData(element, this.NAME);
  }
}

export default Range;
