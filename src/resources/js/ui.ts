import polyfill from './util/polyfill';
import lyNav from './layout/ly_nav';
import Modal from './ui/modal';
import Accordion from './ui/accordion';
import Tab from './ui/tab';
import Tooltip from './ui/tooltip';
import Toast from './ui/toast';
import ScrollView from './ui/scrollView';
import Range from './ui/range';
import Checkbox from './ui/checkbox';
import Counter from './ui/counter';
import Common from './ui/common';
import Wordle from './ui/wordle';

/**
 * @author 손기연
 * @memberof SKY
 * @namespace SKY
 */

interface UiType {
  getInstance(el: HTMLElement): (el: HTMLElement) => object;
  new (el: HTMLElement, options?: object): void;
}

const UIInitializer = (target: string, UI, options = {}) => {
  const elements = document.querySelectorAll(target);
  elements.forEach((el: Element) => {
    if (!UI.getInstance(el as HTMLElement)) {
      new UI(el as HTMLElement, options);
    }
  });
};

const init = () => {
  UIInitializer('[data-accr]', Accordion);
  UIInitializer('[data-tab]', Tab);
  UIInitializer('[data-tooltip]', Tooltip);
  UIInitializer('[data-range]', Range);
  UIInitializer('[data-checkbox]', Checkbox);
  UIInitializer('[data-scroll-view]', ScrollView);
  UIInitializer('[data-counter]', Counter);

  UIInitializer('[data-wordle]', Wordle);
  Common.init();
};

polyfill();

window.addEventListener('DOMContentLoaded', function () {
  lyNav();
  init();
});

declare global {
  interface Window {
    SKY: object;
  }
}

// 전역객체로 선언
window.SKY = { init, Modal, Accordion, Tab, Tooltip, Toast, ScrollView, Range, Checkbox, Counter, Common, UIInitializer };

export { init, Modal, Accordion, Tab, Tooltip, Toast, ScrollView, Range, Checkbox, Counter, Common, UIInitializer };
