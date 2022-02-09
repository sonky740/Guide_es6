import Data from '../util/data.js';
import EventHandler from '../util/eventHandler.js';
import BaseComponent from '../util/baseComponent.js';

const NAME = 'checkbox';
const EVENT_KEY = `${NAME}`;

class Checkbox extends BaseComponent {
  constructor(element) {
    super(element);

    this._all = document.querySelector(`[data-checkbox-all="${this._element.dataset.checkbox}"]`);
    this._checkbox = this._element.querySelectorAll('input[type="checkbox"]');

    this.init();

    Data.setData(element, NAME, this);
  }

  init() {
    this._check();

    if (this._all) {
      this._allCheck();
    }
  }

  _check() {
    this._checkbox.forEach(el => {
      EventHandler.on(el, 'click', () => {
        const checked = this._element.querySelectorAll('input[type="checkbox"]:checked');

        if (this._checkbox.length === checked.length && this._all && !this._all.checked) {
          this._all.checked = true;
          EventHandler.trigger(this._element, `${EVENT_KEY}.checked`);
        } else if (this._checkbox.length - 1 === checked.length && this._all && this._all.checked) {
          this._all.checked = false;
          EventHandler.trigger(this._element, `${EVENT_KEY}.unchecked`);
        }
      });
    });
  }

  _allCheck() {
    EventHandler.on(this._all, 'click', () => {
      if (this._all.checked) {
        this._checkbox.forEach(el => (el.checked = true));
        EventHandler.trigger(this._element, `${EVENT_KEY}.checked`);
      } else {
        this._checkbox.forEach(el => (el.checked = false));
        EventHandler.trigger(this._element, `${EVENT_KEY}.unchecked`);
      }
    });
  }

  static getInstance(element) {
    return Data.getData(element, this.NAME);
  }
}

export default Checkbox;
