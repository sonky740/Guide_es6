import Data from './data';

declare global {
  interface Function {
    NAME: string;
  }
}

class BaseComponent {
  public _element: HTMLElement;

  constructor(element: HTMLElement | null) {
    element = typeof element === 'string' ? document.querySelector(element) : element;

    if (!element) {
      throw new Error(`${this.constructor.NAME}이 없습니다.`);
    }

    this._element = element;
    Data.set(this._element, this.constructor.NAME, this);
  }

  _getRandomSerial() {
    return `${this.constructor.NAME}_${Math.random().toString(36).slice(2, 11)}`;
  }

  _throwError(message: string) {
    throw new Error(`${this.constructor.NAME}: ${message}`);
  }

  _warn(message: string) {
    console.warn(`${this.constructor.NAME}: ${message}`);
  }

  // dispose() {
  //   Data.remove(this._element, this.constructor.NAME);
  //   console.log('dispose');
  // }

  static getInstance(element: HTMLElement) {
    return Data.get(element, this.NAME);
  }

  static getInstances() {
    return Data.getAll(this.NAME);
  }
}

export default BaseComponent;
