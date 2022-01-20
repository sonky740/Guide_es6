import polyfill from './util/polyfill.js';
import lyNav from './layout/ly_nav.js';
import Modal from './ui/modal.js';

/**
 * @author 손기연
 * @memberof UI_Control
 * @namespace UI_Control
 *
 * 목차
 * @see lyNav // 레이아웃 네비게이션
 */

window.addEventListener('DOMContentLoaded', function () {
  polyfill();

  lyNav();

  document.querySelectorAll('[data-modal]').forEach(el => {
    if (!Modal.getInstance(el)) new Modal(el);
  });
});

export default {
  Modal
};
