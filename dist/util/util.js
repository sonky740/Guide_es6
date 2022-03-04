"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientInfo = exports.toHTML = exports.siblings = exports.numberComma = void 0;
/**
 * 세자리마다 , 표시
 */
function numberComma(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
exports.numberComma = numberComma;
/**
 * 형제요소
 */
function siblings(node) {
    const parent = node.parentElement;
    const children = parent === null || parent === void 0 ? void 0 : parent.children;
    const tempArr = [];
    for (let i = 0; i < children.length; i++) {
        tempArr.push(children[i]);
    }
    return tempArr.filter(function (e) {
        return e != node;
    });
}
exports.siblings = siblings;
/**
 * HTML스트링을 HTML형태로 반환
 */
const toHTML = (htmlString) => {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
};
exports.toHTML = toHTML;
/**
 * version check
 * @returns {Object} mo, iosVer, aosVer, name, version
 */
function getClientInfo() {
    let userAgent = navigator.userAgent;
    const browser = {
        mo: '',
        iosVer: 0,
        aosVer: 0,
        name: '',
        version: ''
    };
    // 모바일 OS 체크
    const mobileArr = ['iPhone', 'iPod', 'BlackBerry', 'Android', 'Windows CE', 'LG', 'MOT', 'SAMSUNG', 'SonyEricsson'];
    for (const txt in mobileArr) {
        if (userAgent.match(mobileArr[txt]) != null) {
            browser.mo = mobileArr[txt];
        }
    }
    // ios 버전 체크
    if ((userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('iPad') > -1) && userAgent.indexOf('OS') > -1) {
        browser.iosVer = window.Number(userAgent.substring(userAgent.indexOf('OS') + 3, userAgent.indexOf('OS') + 5));
    }
    // aos 버전 체크
    if (userAgent.indexOf('Android') > -1) {
        browser.aosVer = window.Number(userAgent.substring(userAgent.indexOf('Android') + 8, userAgent.indexOf('Android') + 9));
    }
    userAgent = userAgent.toLowerCase();
    if (userAgent.indexOf('opr') !== -1) {
        const reg = /opr\/(\S+)/;
        const regArr = reg.exec(userAgent);
        browser.name = 'Opera';
        browser.version = regArr[1];
    }
    else if (userAgent.indexOf('edge') !== -1) {
        const reg = /edge\/(\S+)/;
        const regArr = reg.exec(userAgent);
        browser.name = 'Edge';
        browser.version = regArr[1];
    }
    else if (userAgent.indexOf('chrome') !== -1) {
        const reg = /chrome\/(\S+)/;
        const regArr = reg.exec(userAgent);
        browser.name = 'Chrome';
        browser.version = regArr[1];
    }
    else if (userAgent.indexOf('safari') !== -1) {
        const reg = /safari\/(\S+)/;
        const regArr = reg.exec(userAgent);
        browser.name = 'Safari';
        browser.version = regArr[1];
    }
    else if (userAgent.indexOf('firefox') !== -1) {
        const reg = /firefox\/(\S+)/;
        const regArr = reg.exec(userAgent);
        browser.name = 'Firefox';
        browser.version = regArr[1];
    }
    else if (userAgent.indexOf('trident') !== -1) {
        browser.name = 'IE';
        if (userAgent.indexOf('msie') !== -1) {
            const reg = /msie (\S+)/;
            const regArr = reg.exec(userAgent);
            browser.version = regArr[1];
            browser.version = browser.version.replace(';', '');
        }
        else {
            const reg = /rv:(\S+)/;
            const regArr = reg.exec(userAgent);
            browser.version = regArr[1];
        }
    }
    return browser;
}
exports.getClientInfo = getClientInfo;
