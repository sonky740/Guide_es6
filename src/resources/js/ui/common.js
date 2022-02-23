import EventHandler from '../util/eventHandler';
import { getClientInfo, numberComma } from '../util/util.js';

const mobileCheck = () => {
  getClientInfo().mo !== null ? document.body.classList.add('mo') : document.body.classList.remove('mo');
};

const inputDelete = () => {
  // console.log('a');
};

// 숫자 애니메이션
const counter = () => {
  const counter = document.querySelectorAll('[data-counter]');

  counter.forEach(function (el) {
    const initNumber = el.getAttribute('data-init-number');
    const duration = el.getAttribute('data-duration');
    const comma = el.getAttribute('data-comma');
    let startTime = null;

    const step = function (currentTime) {
      if (!startTime) {
        startTime = currentTime;
      }
      const progress = Math.min((currentTime - startTime) / duration, 1);
      if (comma) {
        el.innerHTML = numberComma(Math.floor(progress * (el.getAttribute('data-counter') - Number(initNumber)) + Number(initNumber)));
      } else {
        el.innerHTML = Math.floor(progress * (el.getAttribute('data-counter') - Number(initNumber)) + Number(initNumber));
      }
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        EventHandler.trigger(el, 'counter.end', { target: el });
      }
    };

    window.requestAnimationFrame(step);
  });
};

// 전체 실행 함수
const init = () => {
  mobileCheck();
  inputDelete();
  if (document.querySelectorAll('[data-counter]').length) counter();
};

// 내보내기
const Common = {
  init,
  mobileCheck,
  inputDelete,
  counter
};

window.addEventListener('resize', () => {
  mobileCheck();
});

export default Common;
