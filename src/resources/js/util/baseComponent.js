import Data from './data.js';

class BaseComponent {
  constructor(element) {
    element = typeof element === 'string' ? document.querySelector(element) : element;

    if (!element) {
      return;
    }

    this._element = element;
    Data.setData(this._element, this.constructor.NAME, this);
  }

  // dispose() {
  //   Data.removeData(this._element, this.constructor.NAME);
  //   console.log('dispose');
  // }
}

export default BaseComponent;
