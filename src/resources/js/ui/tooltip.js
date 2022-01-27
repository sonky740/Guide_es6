import Data from '../util/data.js';
import BaseComponent from '../util/baseComponent.js';

const NAME = 'tooltip';
// const EVENT_KEY = `${NAME}`;

class Tooltip extends BaseComponent {
  constructor(element) {
    super(element);

    Data.setData(element, NAME, this);
  }

  static getInstance(element) {
    return Data.getData(element, this.NAME);
  }
}

export default Tooltip;
