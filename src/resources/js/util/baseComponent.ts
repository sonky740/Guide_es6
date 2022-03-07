import Data from './data';

class BaseComponent {
  public _element: HTMLElement;

  constructor(element: HTMLElement | null) {
    element = typeof element === 'string' ? document.querySelector(element) : element;

    if (!element) {
      throw new Error(`${(this as any).constructor.NAME}이 없습니다.`);
    }

    this._element = element;
    Data.setData(this._element, (this as any).constructor.NAME, this);
  }

  _getRandomSerial() {
    return `${(this as any).constructor.NAME}_${Math.random().toString(36).slice(2, 11)}`;
  }

  _throwError(message: string) {
    throw new Error(`${(this as any).constructor.NAME}: ${message}`);
  }

  _warn(message: string) {
    console.warn(`${(this as any).constructor.NAME}: ${message}`);
  }

  // dispose() {
  //   Data.removeData(this._element, this.constructor.NAME);
  //   console.log('dispose');
  // }
}

export default BaseComponent;
