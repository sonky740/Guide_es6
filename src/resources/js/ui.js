import polyfill from './util/polyfill.js';
import lyNav from './layout/ly_nav.js';
import Modal from './ui/modal.js';
import Accordion from './ui/accordion.js';
import Tab from './ui/tab.js';
import Tooltip from './ui/tooltip.js';
import Toast from './ui/toast.js';
import ScrollView from './ui/scrollView.js';
import Range from './ui/range.js';
import Checkbox from './ui/checkbox.js';
import Counter from './ui/counter.js';
import Common from './ui/common.js';
import Wordle from './ui/wordle.js';

/**
 * @author 손기연
 * @memberof SKY
 * @namespace SKY
 */

const UIInitializer = (target, UI, options = {}) => {
  const elements = document.querySelectorAll(target);
  elements.forEach(el => {
    if (!UI.getInstance(el)) {
      new UI(el, options);
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

// 전역객체로 선언
window.SKY = { init, Modal, Accordion, Tab, Tooltip, Toast, ScrollView, Range, Checkbox, Counter, Common, UIInitializer };

export { init, Modal, Accordion, Tab, Tooltip, Toast, ScrollView, Range, Checkbox, Counter, Common, UIInitializer };
