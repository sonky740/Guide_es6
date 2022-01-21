import Data from '../util/data.js';
import BaseComponent from '../util/baseComponent.js';

const NAME = 'modal';
// const EVENT_KEY = `${NAME}`;

class Modal extends BaseComponent {
  constructor(element) {
    super(element);

    Data.setData(element, NAME, this);
  }

  static getInstance(element) {
    return Data.getData(element, this.NAME);
  }
}

export default Modal;
