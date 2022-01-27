import Data from './data.js';

class BaseComponent {
  constructor(element) {
    element = typeof element === 'string' ? document.querySelector(element) : element;

    if (!element) {
      console.error(`${this.constructor.NAME}이 없습니다.`);
      return false;
    }

    this._element = element;
    Data.setData(this._element, this.constructor.NAME, this);
  }

  _getRandomSerial() {
    return `${this.constructor.NAME}_${Math.random().toString(36).slice(2, 11)}`;
  }

  _throwError(message) {
    throw new Error(`${this.constructor.NAME}: ${message}`);
  }

  _warn(message) {
    console.warn(`${this.constructor.NAME}: ${message}`);
  }

  // dispose() {
  //   Data.removeData(this._element, this.constructor.NAME);
  //   console.log('dispose');
  // }
}

export default BaseComponent;
