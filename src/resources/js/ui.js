import polyfill from './util/polyfill.js';
import lyNav from './layout/ly_nav.js';
import Modal from './ui/modal.js';
import Accordion from './ui/accordion.js';
import Tab from './ui/tab.js';
import Range from './ui/range.js';
import Common from './ui/common.js';

/**
 * @author 손기연
 * @memberof SKY
 * @namespace SKY
 *
 * 목차
 * @see lyNav // 레이아웃 네비게이션
 * @see Modal // 모달
 * @see Accordion // 아코디언
 * @see Tab // 탭
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
  UIInitializer('[data-range]', Range);
};

polyfill();

window.addEventListener('DOMContentLoaded', function () {
  lyNav();

  init();
});

export { init, Modal, Accordion, Tab, Range, Common };
