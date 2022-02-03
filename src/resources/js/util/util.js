/**
 * 세자리마다 , 표시
 * @param {Number} x
 * @returns {Number}
 */
export function numberComma(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 형제요소
 * @param {Element} node
 * @returns {Element[]} // 본인을 제외한 형제요소
 */
export function siblings(node) {
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
 * version check
 * @returns {Object} name, version
 */
export function getClientInfo() {
  var userAgent = navigator.userAgent;
  var reg = null;
  var browser = {
    name: null,
    version: null
  };

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
