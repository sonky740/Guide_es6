import Data from '../util/data';
import EventHandler from '../util/eventHandler';
import BaseComponent from '../util/baseComponent';

interface ConfigType {
  info: string;
  template: string;
  btn: string;
  answer: string[];
}

const NAME = 'wordle';
// const EVENT_KEY = `${NAME}`;

const defaultConfig = {
  info: `<div class="wordle-info">
    <div><span>성공 횟수: </span><strong data-wordle-success>0</strong></div>
    <div><span>실패 횟수: </span><strong data-wordle-number>0</strong></div>
  </div>`,
  template: `<div class="wordle-row">
    <input type="input" class="wordle-input" maxlength="1" data-wordle-input>
    <input type="input" class="wordle-input" maxlength="1" data-wordle-input>
    <input type="input" class="wordle-input" maxlength="1" data-wordle-input>
    <input type="input" class="wordle-input" maxlength="1" data-wordle-input>
    <input type="input" class="wordle-input" maxlength="1" data-wordle-input>
  </div>`,
  btn: `<button type="button" class="wordle-btn" data-wordle-btn>확인</button>`,
  answer: ['ABOUT', 'ABOVE', 'AFTER', 'AGAIN', 'ALONE', 'APPLE', 'BEACH', 'BEGIN', 'BLACK', 'BRING', 'BROWN', 'BUNNY', 'CAMEL', 'CANDY', 'CARRY', 'CHILD', 'CLEAN', 'CLOSE', 'COUNT', 'DADDY', 'DREAM', 'DRESS', 'DRIVE', 'EIGHT', 'EVERY', 'FIGHT', 'FLOOR', 'FOUND', 'GHOST', 'GOOSE', 'GREAT', 'GREEN', 'HAPPY', 'HEARD', 'HEART', 'HIPPO', 'HORSE', 'HOUSE', 'INDIA', 'JUICE', 'KOALA', 'LARGE', 'LIGHT', 'LUCKY', 'MOMMY', 'MONEY', 'MOOSE', 'MOUSE', 'MUMMY', 'MUSIC', 'NEVER', 'NURSE', 'PANDA', 'PAPER', 'PARTY', 'PIZZA', 'PLANE', 'PLANT', 'PLATE', 'PRICE', 'PUPPY', 'QUACK', 'QUEEN', 'QUIET', 'RIGHT', 'RIVER', 'ROBIN', 'ROBOT', 'ROUND', 'SEVEN', 'SHEEP', 'SKUNK', 'SLEEP', 'SMALL', 'SPOON', 'STAMP', 'STAND', 'STICK', 'STORE', 'STORY', 'STRAY', 'SUNNY', 'SWEET', 'TABLE', 'THERE', 'THING', 'THREE', 'TIGER', 'TODAY', 'TRAIN', 'TRUCK', 'TUMMY', 'UNDER', 'WATER', 'WHITE', 'WITCH', 'WOMAN', 'WOMEN', 'WRITE', 'ZEBRA']
};

class Wordle extends BaseComponent {
  private _config: ConfigType;
  private _number = 0;
  private _success = 0;
  private _numberText: HTMLElement | null = null;
  private _successText: HTMLElement | null = null;
  private _btn: HTMLButtonElement | null = null;
  private _answer = '';

  constructor(element: HTMLElement, config: object | undefined) {
    super(element);
    this._config = {
      ...defaultConfig,
      ...config
    };

    this.init();

    this.input();

    Data.setData(element, NAME, this);
  }

  init() {
    this._element.insertAdjacentHTML('afterbegin', this._config.template);
    this._element.insertAdjacentHTML('afterbegin', this._config.info);
    this._element.insertAdjacentHTML('beforeend', this._config.btn);

    this._number = 0;
    this._success = Number(localStorage.getItem('wordle-success')) || 0;
    this._numberText = this._element.querySelector('[data-wordle-number]');
    this._successText = this._element.querySelector('[data-wordle-success]') as HTMLElement;
    this._btn = this._element.querySelector('[data-wordle-btn]');
    this._answer = this._config.answer[Math.floor(Math.random() * this._config.answer.length)];

    this._successText.innerText = this._success.toString();

    EventHandler.on(this._btn, 'click', () => {
      if (!this._btn?.hasAttribute('data-wordle-retry')) {
        this.confirm();
      } else {
        this.reset();
      }
      this.input();
    });
  }

  confirm() {
    const inputs: NodeListOf<HTMLInputElement> = this._element.querySelectorAll('[data-wordle-input]');
    const inputParent = inputs[0].parentNode as HTMLDivElement;
    let missionText = '';

    for (let i = 0; i < inputs.length; i++) {
      missionText += inputs[i].value;

      if (inputs[i].value.toUpperCase() === this._answer[i].toUpperCase()) {
        inputs[i].classList.add('wordle-answer');
      } else if (this._answer.includes(inputs[i].value.toUpperCase()) && inputs[i].value !== '') {
        inputs[i].classList.add('wordle-half');
      } else {
        inputs[i].classList.add('wordle-wrong');
      }

      inputs[i].setAttribute('disabled', '');
      inputs[i].removeAttribute('data-wordle-input');
    }

    // 성공 시
    if (missionText.toUpperCase() === this._answer.toUpperCase()) {
      inputParent.classList.add('wordle-complete');
      (this._btn as HTMLButtonElement).innerText = '다시하기';
      this._btn?.setAttribute('data-wordle-retry', '');

      this._success++;
      localStorage.setItem('wordle-success', this._success.toString());
      (this._successText as HTMLElement).innerText = this._success.toString();
      return false;
    } else {
      inputParent.classList.add('wordle-fail');
    }
    (this._numberText as HTMLElement).innerText = (this._number + 1).toString();
    this._number++;

    this._btn?.insertAdjacentHTML('beforebegin', this._config.template);
    (inputParent.nextElementSibling?.children[0] as HTMLElement).focus();
  }

  reset() {
    this._element.innerHTML = '';
    this.init();
  }

  input() {
    const inputs: NodeListOf<HTMLInputElement> = this._element.querySelectorAll('[data-wordle-input]');
    inputs.forEach((el, i, al: NodeListOf<HTMLInputElement>) => {
      EventHandler.on(el, 'input', (e: InputEvent) => {
        if (el !== al[al.length - 1] && e.inputType !== 'deleteContentBackward') {
          al[i + 1].focus();
        }
      });
      EventHandler.on(el, 'keyup', (e: KeyboardEvent) => {
        if (e.keyCode === 13) {
          this._btn?.click();
        }
      });
      EventHandler.on(el, 'keydown', (e: KeyboardEvent) => {
        if (e.keyCode === 8 && el !== al[0] && el.value === '') {
          al[i - 1].focus();
        }
      });
    });
  }

  static get NAME() {
    return NAME;
  }

  static getInstance(element: HTMLElement) {
    return Data.getData(element, this.NAME);
  }
}

export default Wordle;
