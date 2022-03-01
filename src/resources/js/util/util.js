/**
 * 세자리마다 , 표시
 * @param {Number} x
 * @returns {Number}
 */
function numberComma(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 형제요소
 * @param {Element} node
 * @returns {Element[]} // 본인을 제외한 형제요소
 */
function siblings(node) {
  const children = node.parentElement.children;
  const tempArr = [];

  for (let i = 0; i < children.length; i++) {
    tempArr.push(children[i]);
  }

  return tempArr.filter(function (e) {
    return e != node;
  });
}

/**
 * HTML스트링을 HTML형태로 반환
 * @param {String} htmlString
 * @return {Element} 엘리먼트
 */
const toHTML = htmlString => {
  const div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
};

/**
 * version check
 * @returns {Object} mo, iosVer, aosVer, name, version
 */
function getClientInfo() {
  let userAgent = navigator.userAgent;
  let reg = null;
  const browser = {
    mo: null,
    iosVer: null,
    aosVer: null,
    name: null,
    version: null
  };

  // 모바일 OS 체크
  const mobileArr = new Array('iPhone', 'iPod', 'BlackBerry', 'Android', 'Windows CE', 'LG', 'MOT', 'SAMSUNG', 'SonyEricsson');
  for (let txt in mobileArr) {
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
    reg = /opr\/(\S+)/;
    browser.name = 'Opera';
    browser.version = reg.exec(userAgent)[1];
  } else if (userAgent.indexOf('edge') !== -1) {
    reg = /edge\/(\S+)/;
    browser.name = 'Edge';
    browser.version = reg.exec(userAgent)[1];
  } else if (userAgent.indexOf('chrome') !== -1) {
    reg = /chrome\/(\S+)/;
    browser.name = 'Chrome';
    browser.version = reg.exec(userAgent)[1];
  } else if (userAgent.indexOf('safari') !== -1) {
    reg = /safari\/(\S+)/;
    browser.name = 'Safari';
    browser.version = reg.exec(userAgent)[1];
  } else if (userAgent.indexOf('firefox') !== -1) {
    reg = /firefox\/(\S+)/;
    browser.name = 'Firefox';
    browser.version = reg.exec(userAgent)[1];
  } else if (userAgent.indexOf('trident') !== -1) {
    browser.name = 'IE';

    if (userAgent.indexOf('msie') !== -1) {
      reg = /msie (\S+)/;
      browser.version = reg.exec(userAgent)[1];
      browser.version = browser.version.replace(';', '');
    } else {
      reg = /rv:(\S+)/;
      browser.version = reg.exec(userAgent)[1];
    }
  }

  return browser;
}

export { numberComma, siblings, toHTML, getClientInfo };
