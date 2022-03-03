// import EventHandler from '../util/eventHandler';
import { getClientInfo } from '../util/util.js';

const windowHeight = () => {
  const vh = window.innerHeight;
  return document.documentElement.style.setProperty('--vh', `${vh}px`);
};

const mobileCheck = () => {
  getClientInfo().mo !== null ? document.body.classList.add('mo') : document.body.classList.remove('mo');
};

const inputDelete = () => {
  // console.log('a');
};

// 전체 실행 함수
const init = () => {
  windowHeight();
  mobileCheck();
  inputDelete();
};

// 내보내기
const Common = {
  init,
  windowHeight,
  mobileCheck,
  inputDelete
};

window.addEventListener('resize', () => {
  windowHeight();
  mobileCheck();
});

export default Common;
