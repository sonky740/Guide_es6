/**
 * 숫자에 콤마를 추가
 * @param {number} x
 * @returns {string}
 * @example
 * numberComma(1000) // 1,000
 */
const numberComma = (x: number): string => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * 형제요소
 * @param {HTMLElement} node
 * @returns {Array}
 * @example
 * siblings(document.querySelector('div')) // [div, div, div]
 */
const siblings = (node: HTMLElement): Element[] => {
  const parent = node.parentElement as HTMLElement;
  const children = parent?.children as HTMLCollection;
  const tempArr = [];

  for (let i = 0; i < children.length; i++) {
    tempArr.push(children[i]);
  }

  return tempArr.filter(function (e) {
    return e != node;
  });
};

/**
 * HTML을 파싱하여 DOM객체를 생성
 * @param {string} htmlString
 * @returns {ChildNode}
 * @example
 * toHTML('<div>test</div>') // <div>test</div>
 */
const toHTML = (htmlString: string): ChildNode | null => {
  const div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
};

/**
 * 현재 엘리먼트의 index
 * @param {Element} element
 * @example
 * getIndex(document.querySelector('div')) // 0
 */
const getIndex = (element: Element) => {
  if (!element) {
    return -1;
  }
  let currentElement = element;
  let index = 0;
  while (currentElement.previousElementSibling) {
    index += 1;
    currentElement = currentElement.previousElementSibling;
  }
  return index;
};

/**
 * version check
 * @returns {Object} mo, iosVer, aosVer, name, version
 */
const getClientInfo = () => {
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
    browser.aosVer = window.Number(
      userAgent.substring(userAgent.indexOf('Android') + 8, userAgent.indexOf('Android') + 9)
    );
  }

  userAgent = userAgent.toLowerCase();

  if (userAgent.indexOf('opr') !== -1) {
    const reg = /opr\/(\S+)/;
    const regArr = reg.exec(userAgent) as RegExpExecArray;
    browser.name = 'Opera';
    browser.version = regArr[1];
  } else if (userAgent.indexOf('edge') !== -1) {
    const reg = /edge\/(\S+)/;
    const regArr = reg.exec(userAgent) as RegExpExecArray;
    browser.name = 'Edge';
    browser.version = regArr[1];
  } else if (userAgent.indexOf('chrome') !== -1) {
    const reg = /chrome\/(\S+)/;
    const regArr = reg.exec(userAgent) as RegExpExecArray;
    browser.name = 'Chrome';
    browser.version = regArr[1];
  } else if (userAgent.indexOf('safari') !== -1) {
    const reg = /safari\/(\S+)/;
    const regArr = reg.exec(userAgent) as RegExpExecArray;
    browser.name = 'Safari';
    browser.version = regArr[1];
  } else if (userAgent.indexOf('firefox') !== -1) {
    const reg = /firefox\/(\S+)/;
    const regArr = reg.exec(userAgent) as RegExpExecArray;
    browser.name = 'Firefox';
    browser.version = regArr[1];
  } else if (userAgent.indexOf('trident') !== -1) {
    browser.name = 'IE';

    if (userAgent.indexOf('msie') !== -1) {
      const reg = /msie (\S+)/;
      const regArr = reg.exec(userAgent) as RegExpExecArray;
      browser.version = regArr[1];
      browser.version = browser.version.replace(';', '');
    } else {
      const reg = /rv:(\S+)/;
      const regArr = reg.exec(userAgent) as RegExpExecArray;
      browser.version = regArr[1];
    }
  }
  return browser;
};

export { numberComma, siblings, toHTML, getIndex, getClientInfo };
