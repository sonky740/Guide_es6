import { getClientInfo } from '../util/util.js';

const mobileCheck = () => {
  getClientInfo().mo !== null ? document.body.classList.add('mo') : document.body.classList.remove('mo');
};

const inputDelete = () => {
  // console.log('a');
};

window.addEventListener('DOMContentLoaded', () => {
  mobileCheck();

  inputDelete();
});

window.addEventListener('resize', () => {
  mobileCheck();
});

export default { inputDelete };
