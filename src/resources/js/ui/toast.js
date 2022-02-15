import EventHandler from '../util/eventHandler.js';
import { toHTML } from '../util/util.js';

const NAME = 'toast';
const EVENT_KEY = `${NAME}`;

const defaultConfig = {
  showing: 'showing',
  hiding: 'hiding',
  container: '<div class="toast"></div>',
  content: '<div class="toast-content">MESSAGE</div>'
};

class Toast {
  constructor(config) {
    this._config = {
      ...defaultConfig,
      ...config
    };
    this._toastContent = null;
  }

  static TOAST_HOLDER = null;
  static TOAST_COUNT = 0;

  static getContainer(template) {
    if (Toast.TOAST_HOLDER === null) {
      Toast.TOAST_HOLDER = toHTML(template);
      document.body.appendChild(Toast.TOAST_HOLDER);
    }
    return Toast.TOAST_HOLDER;
  }

  show(message, time = 2, addClass) {
    this._toastContent = toHTML(this._config.content.replace('MESSAGE', message));
    Toast.getContainer(this._config.container).appendChild(this._toastContent);
    this._toastContent.classList.add(this._config.showing);
    if (addClass) this._toastContent.classList.add(addClass);
    Toast.TOAST_COUNT++;

    setTimeout(() => {
      EventHandler.trigger(document, `${EVENT_KEY}.shown`);
    }, 0);

    setTimeout(() => {
      this.hide();
    }, time * 1000);
  }

  hide() {
    this._toastContent.classList.remove(this._config.showing);
    this._toastContent.classList.add(this._config.hiding);
    EventHandler.one(this._toastContent, 'animationend', () => {
      Toast.getContainer(this._config.container).removeChild(this._toastContent);
      Toast.TOAST_COUNT--;
      if (Toast.TOAST_COUNT <= 0) {
        document.body.removeChild(Toast.TOAST_HOLDER);
        Toast.TOAST_HOLDER = null;
      }

      EventHandler.trigger(document, `${EVENT_KEY}.hidden`);
    });
  }
}

export default Toast;
