"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import EventHandler from '../util/eventHandler';
const util_1 = require("../util/util");
const windowHeight = () => {
    const vh = window.innerHeight;
    return document.documentElement.style.setProperty('--vh', `${vh}px`);
};
const mobileCheck = () => {
    (0, util_1.getClientInfo)().mo !== '' ? document.body.classList.add('mo') : document.body.classList.remove('mo');
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
exports.default = Common;
