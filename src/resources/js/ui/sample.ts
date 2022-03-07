import Data from '../util/data';
// import EventHandler from '../util/eventHandler';
import BaseComponent from '../util/baseComponent';

const NAME = 'sample';
// const EVENT_KEY = `${NAME}`;

interface ConfigType {
  showing: string;
  shown: string;
  hiding: string;
  hidden: string;
}

const defaultConfig = {
  showing: 'showing',
  shown: 'shown',
  hiding: 'hiding',
  hidden: 'hidden'
};

class Sample extends BaseComponent {
  private _config: ConfigType;
  constructor(element: HTMLElement, config: object | undefined) {
    super(element);
    this._config = {
      ...defaultConfig,
      ...config
    };
  }

  static get NAME() {
    return NAME;
  }

  static getInstance(element: HTMLElement) {
    return Data.getData(element, this.NAME);
  }
}

export default Sample;
