import Data from '../util/data';
// import EventHandler from '../util/eventHandler';
import BaseComponent from '../util/baseComponent';

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

  static get NAME() {
    return NAME;
  }

  static getInstance(element) {
    return Data.getData(element, this.NAME);
  }
}

export default Sample;
