import Data from '../util/data.js';
import EventHandler from '../util/eventHandler.js';
import BaseComponent from '../util/baseComponent.js';

const NAME = 'wordle';
// const EVENT_KEY = `${NAME}`;

const defaultConfig = {
  template: `<div class="wordle-row">
    <input type="input" class="wordle-input" maxlength="1" data-wordle-input>
    <input type="input" class="wordle-input" maxlength="1" data-wordle-input>
    <input type="input" class="wordle-input" maxlength="1" data-wordle-input>
    <input type="input" class="wordle-input" maxlength="1" data-wordle-input>
    <input type="input" class="wordle-input" maxlength="1" data-wordle-input>
  </div>`,
  btn: `<button type="button" class="wordle-btn" data-wordle-btn>확인</button>`,
  answer: ['APPLE', 'BLACK', 'CANDY', 'DREAM', 'EVERY', 'FLOOR', 'GHOST', 'HAPPY', 'INNER', 'JUICE', 'KOREA', 'LIGHT', 'MONEY', 'NURSE', 'PIZZA', 'QUEEN', 'RIVER', 'SLEEP', 'TODAY', 'UNDER', 'WHITE', 'ZEALS']
};

class Wordle extends BaseComponent {
  constructor(element, config) {
    super(element);
    this._config = {
      ...defaultConfig,
      ...config
    };

    this.init();

    console.log(this._answer);

    Data.setData(element, NAME, this);
  }

  init() {
    this._element.insertAdjacentHTML('afterbegin', this._config.template);
    this._element.insertAdjacentHTML('beforeend', this._config.btn);

    this._btn = this._element.querySelector('[data-wordle-btn]');
    this._answer = this._config.answer[Math.floor(Math.random() * this._config.answer.length)];

    this.input();

    EventHandler.on(this._btn, 'click', () => {
      if (!this._btn.hasAttribute('data-wordle-retry')) {
        this.confirm();
      } else {
        this.reset();
      }
      this.input();
    });
  }

  confirm() {
    this._input = this._element.querySelectorAll('[data-wordle-input]');

    let missionText = '';

    for (let i = 0; i < this._input.length; i++) {
      missionText += this._input[i].value;

      if (this._input[i].value.toUpperCase() === this._answer[i].toUpperCase()) {
        this._input[i].classList.add('wordle-answer');
      } else if (this._answer.includes(this._input[i].value.toUpperCase()) && this._input[i].value !== '') {
        this._input[i].classList.add('wordle-half');
      } else {
        this._input[i].classList.add('wordle-wrong');
      }

      this._input[i].setAttribute('disabled', '');
      this._input[i].removeAttribute('data-wordle-input');
    }

    if (missionText.toUpperCase() === this._answer.toUpperCase()) {
      this._input[0].parentNode.classList.add('wordle-complete');
      // this._btn.innerText = '다시하기';
      this._btn.setAttribute('data-wordle-retry', '');
      return false;
    }

    this._btn.insertAdjacentHTML('beforebegin', this._config.template);
    this._input[0].parentNode.nextElementSibling.children[0].focus();
  }

  reset() {
    alert('다시하기 예정');
    // this._element.innerHTML = '';
    // this.init();
  }

  input() {
    this._input = this._element.querySelectorAll('[data-wordle-input]');
    this._input.forEach((el, i, al) => {
      EventHandler.on(el, 'input', e => {
        if (el !== al[al.length - 1] && e.inputType !== 'deleteContentBackward') {
          al[i + 1].focus();
        }
      });
      EventHandler.on(el, 'keyup', e => {
        if (e.keyCode === 13) {
          console.log('a');
          this._btn.click();
        }
      });
      EventHandler.on(el, 'keydown', e => {
        if (e.keyCode === 8 && el !== al[0] && el.value === '') {
          al[i - 1].focus();
        }
      });
    });
  }

  static getInstance(element) {
    return Data.getData(element, this.NAME);
  }
}

export default Wordle;
