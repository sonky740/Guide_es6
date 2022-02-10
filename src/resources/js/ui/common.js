import { getClientInfo } from '../util/util.js';

const mobileCheck = () => {
  getClientInfo().mo !== null ? document.body.classList.add('mo') : document.body.classList.remove('mo');
};

const inputDelete = () => {
  // console.log('a');
};

// 전체 실행 함수
const init = () => {
  mobileCheck();
  inputDelete();
};

// 내보내기
const Common = { init, mobileCheck, inputDelete };

window.addEventListener('resize', () => {
  mobileCheck();
});

export default Common;
