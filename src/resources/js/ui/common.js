import { getClientInfo } from '../util/util.js';

const mobileCheck = () => {
  getClientInfo().mo !== null ? document.body.classList.add('mo') : document.body.classList.remove('mo');
};

const inputDelete = () => {
  // console.log('a');
};

// 실행 함수
const init = () => {
  mobileCheck();
  inputDelete();
};

// 내보내기
const Common = { init };

window.addEventListener('resize', () => {
  mobileCheck();
});

export default Common;
