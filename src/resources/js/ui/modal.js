import Data from '../util/data.js';
import BaseComponent from '../util/baseComponent.js';

class Modal extends BaseComponent {
  constructor(element) {
    super(element);

    console.log(element);

    this.show();
  }

  show() {
    console.log('a');
  }

  static getInstance(element) {
    return Data.getData(element, 'modal');
  }
}

export default Modal;
