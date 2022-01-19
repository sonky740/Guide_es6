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
 * @returns {Element[]}
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
 * ios version check
 * @returns {Number}
 */
export function checkVersion() {
  const agent = window.navigator.userAgent,
    start = agent.indexOf('OS');
  if ((agent.indexOf('iPhone') > -1 || agent.indexOf('iPad') > -1) && start > -1) {
    return window.Number(agent.substr(start + 3, 3).replace('_', '.'));
  }
  return 0;
}
