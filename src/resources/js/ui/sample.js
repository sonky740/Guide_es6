import Data from '../util/data.js';
// import EventHandler from '../util/eventHandler.js';
import BaseComponent from '../util/baseComponent.js';

const NAME = 'sample';
// const EVENT_KEY = `${NAME}`;

const defaultConfig = {
  showing: 'showing',
  shown: 'shown',
  hiding: 'hiding',
  hidden: 'hidden'
};

class Sample extends BaseComponent {
  constructor(element, config) {
    super(element);
    this._config = {
      ...defaultConfig,
      ...config
    };

    Data.setData(element, NAME, this);
  }

  static getInstance(element) {
    return Data.getData(element, this.NAME);
  }
}

export default Sample;
