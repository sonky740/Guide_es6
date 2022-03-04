import EventHandler from '../util/eventHandler';
import { toHTML } from '../util/util';

interface ConfigType {
  showing: string;
  hiding: string;
  container: string;
  content: string;
}

const NAME = 'toast';
const EVENT_KEY = `${NAME}`;

const defaultConfig = {
  showing: 'showing',
  hiding: 'hiding',
  container: '<div class="toast"></div>',
  content: '<div class="toast-content">MESSAGE</div>'
};

class Toast {
  private _config: ConfigType;
  private _toastContent: HTMLElement | null = null;

  constructor(config: object | undefined) {
    this._config = {
      ...defaultConfig,
      ...config
    };
  }

  static TOAST_HOLDER: HTMLElement | null = null;
  static TOAST_COUNT = 0;

  static getContainer(template: string): HTMLElement {
    if (Toast.TOAST_HOLDER === null) {
      Toast.TOAST_HOLDER = toHTML(template) as HTMLElement;
      document.body.appendChild(Toast.TOAST_HOLDER);
    }
    return Toast.TOAST_HOLDER;
  }

  show(message: string, time = 2, addClass: string) {
    this._toastContent = toHTML(this._config.content.replace('MESSAGE', message)) as HTMLElement;
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
    this._toastContent?.classList.remove(this._config.showing);
    this._toastContent?.classList.add(this._config.hiding);
    EventHandler.one(this._toastContent, 'animationend', () => {
      Toast.TOAST_COUNT--;
      Toast.getContainer(this._config.container).removeChild(this._toastContent as HTMLElement);
      if (Toast.TOAST_COUNT <= 0) {
        document.body.removeChild(Toast.TOAST_HOLDER as HTMLElement);
        Toast.TOAST_HOLDER = null;
      }

      EventHandler.trigger(document, `${EVENT_KEY}.hidden`);
    });
  }
}

export default Toast;
