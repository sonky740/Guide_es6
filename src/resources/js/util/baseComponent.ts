import Data from './data';

class BaseComponent {
  public _element: HTMLElement;
  constructor(element: HTMLElement | null) {
    element = typeof element === 'string' ? document.querySelector(element) : element;

    if (!element) {
      throw new Error(`${(<any>this.constructor).NAME}이 없습니다.`);
    }

    this._element = element;
    Data.setData(this._element, (<any>this.constructor).NAME, this);
  }

  _getRandomSerial() {
    return `${(<any>this.constructor).NAME}_${Math.random().toString(36).slice(2, 11)}`;
  }

  _throwError(message: string) {
    throw new Error(`${(<any>this.constructor).NAME}: ${message}`);
  }

  _warn(message: string) {
    console.warn(`${(<any>this.constructor).NAME}: ${message}`);
  }

  // dispose() {
  //   Data.removeData(this._element, this.constructor.NAME);
  //   console.log('dispose');
  // }
}

export default BaseComponent;
