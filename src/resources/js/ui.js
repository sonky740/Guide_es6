import polyfill from './util/polyfill.js';
import lyNav from './layout/ly_nav.js';
import Modal from './ui/modal.js';
import Accordion from './ui/accordion.js';

/**
 * @author 손기연
 * @memberof SKY
 * @namespace SKY
 *
 * 목차
 * @see lyNav // 레이아웃 네비게이션
 * @see Modal // 모달
 * @see Accordion // 아코디언
 */

const UIInitializer = (target, UI, options = {}) => {
  const elements = document.querySelectorAll(target);
  elements.forEach(el => {
    const isIgnore = !!el.getAttribute('data-ignore');
    if (!isIgnore) {
      if (!UI.getInstance(el)) {
        new UI(el, options);
      }
    }
  });
};

polyfill();

window.addEventListener('DOMContentLoaded', function () {
  lyNav();

  UIInitializer('[data-accr]', Accordion);
});

export { Modal, Accordion };
