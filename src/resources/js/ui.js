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
import Common from './ui/common.js';

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

  Common.init();
};

polyfill();

window.addEventListener('DOMContentLoaded', function () {
  lyNav();
  init();
});

export { init, Modal, Accordion, Tab, Tooltip, Toast, ScrollView, Range, Checkbox, Common, UIInitializer };
