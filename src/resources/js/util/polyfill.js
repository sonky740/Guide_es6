export default function polyfill() {
  // IE closest 대응
  if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
  }
  if (!Element.prototype.closest) {
    Element.prototype.closest = function (s) {
      var el = this;

      do {
        if (el.matches(s)) return el;
        el = el.parentElement || el.parentNode;
      } while (el !== null && el.nodeType === 1);
      return null;
    };
  }
  // IE forEach 대응
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }
  // IE CustomEvent 대응
  (function () {
    if (typeof window.CustomEvent === 'function') return false;

    function CustomEvent(event, params) {
      params = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined
      };
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    }
    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
  })();
  // IE remove 대응
  if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function () {
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
    };
  }
  // IE Array from 대응
  if (!Array.from) {
    Array.from = (function () {
      var toStr = Object.prototype.toString;
      var isCallable = function (fn) {
        return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
      };
      var toInteger = function (value) {
        var number = Number(value);
        if (isNaN(number)) {
          return 0;
        }
        if (number === 0 || !isFinite(number)) {
          return number;
        }
        return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
      };
      var maxSafeInteger = Math.pow(2, 53) - 1;
      var toLength = function (value) {
        var len = toInteger(value);
        return Math.min(Math.max(len, 0), maxSafeInteger);
      };

      // The length property of the from method is 1.
      return function from(arrayLike /*, mapFn, thisArg */) {
        // 1. Let C be the this value.
        var C = this;

        // 2. Let items be ToObject(arrayLike).
        var items = Object(arrayLike);

        // 3. ReturnIfAbrupt(items).
        if (arrayLike == null) {
          throw new TypeError('Array.from requires an array-like object - not null or undefined');
        }

        // 4. If mapfn is undefined, then let mapping be false.
        var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
        var T;
        if (typeof mapFn !== 'undefined') {
          // 5. else
          // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
          if (!isCallable(mapFn)) {
            throw new TypeError('Array.from: when provided, the second argument must be a function');
          }

          // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
          if (arguments.length > 2) {
            T = arguments[2];
          }
        }

        // 10. Let lenValue be Get(items, "length").
        // 11. Let len be ToLength(lenValue).
        var len = toLength(items.length);

        // 13. If IsConstructor(C) is true, then
        // 13. a. Let A be the result of calling the [[Construct]] internal method
        // of C with an argument list containing the single item len.
        // 14. a. Else, Let A be ArrayCreate(len).
        var A = isCallable(C) ? Object(new C(len)) : new Array(len);

        // 16. Let k be 0.
        var k = 0;
        // 17. Repeat, while k < len… (also steps a - h)
        var kValue;
        while (k < len) {
          kValue = items[k];
          if (mapFn) {
            A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
          } else {
            A[k] = kValue;
          }
          k += 1;
        }
        // 18. Let putStatus be Put(A, "length", len, true).
        A.length = len;
        // 20. Return A.
        return A;
      };
    })();
  }
  // IE startWith 대응
  String.prototype.startsWith = function (search, pos) {
    return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
  };
  // ios scroll smooth polyfill
  !(function () {
    'use strict';

    function o() {
      var o = window,
        t = document;
      if (!('scrollBehavior' in t.documentElement.style && !0 !== o.__forceSmoothScrollPolyfill__)) {
        var l,
          e = o.HTMLElement || o.Element,
          r = 468,
          i = {
            scroll: o.scroll || o.scrollTo,
            scrollBy: o.scrollBy,
            elementScroll: e.prototype.scroll || n,
            scrollIntoView: e.prototype.scrollIntoView
          },
          s = o.performance && o.performance.now ? o.performance.now.bind(o.performance) : Date.now,
          c = ((l = o.navigator.userAgent), new RegExp(['MSIE ', 'Trident/', 'Edge/'].join('|')).test(l) ? 1 : 0);
        (o.scroll = o.scrollTo =
          function () {
            void 0 !== arguments[0] && (!0 !== f(arguments[0]) ? h.call(o, t.body, void 0 !== arguments[0].left ? ~~arguments[0].left : o.scrollX || o.pageXOffset, void 0 !== arguments[0].top ? ~~arguments[0].top : o.scrollY || o.pageYOffset) : i.scroll.call(o, void 0 !== arguments[0].left ? arguments[0].left : 'object' != typeof arguments[0] ? arguments[0] : o.scrollX || o.pageXOffset, void 0 !== arguments[0].top ? arguments[0].top : void 0 !== arguments[1] ? arguments[1] : o.scrollY || o.pageYOffset));
          }),
          (o.scrollBy = function () {
            void 0 !== arguments[0] && (f(arguments[0]) ? i.scrollBy.call(o, void 0 !== arguments[0].left ? arguments[0].left : 'object' != typeof arguments[0] ? arguments[0] : 0, void 0 !== arguments[0].top ? arguments[0].top : void 0 !== arguments[1] ? arguments[1] : 0) : h.call(o, t.body, ~~arguments[0].left + (o.scrollX || o.pageXOffset), ~~arguments[0].top + (o.scrollY || o.pageYOffset)));
          }),
          (e.prototype.scroll = e.prototype.scrollTo =
            function () {
              if (void 0 !== arguments[0])
                if (!0 !== f(arguments[0])) {
                  var o = arguments[0].left,
                    t = arguments[0].top;
                  h.call(this, this, void 0 === o ? this.scrollLeft : ~~o, void 0 === t ? this.scrollTop : ~~t);
                } else {
                  if ('number' == typeof arguments[0] && void 0 === arguments[1]) throw new SyntaxError('Value could not be converted');
                  i.elementScroll.call(this, void 0 !== arguments[0].left ? ~~arguments[0].left : 'object' != typeof arguments[0] ? ~~arguments[0] : this.scrollLeft, void 0 !== arguments[0].top ? ~~arguments[0].top : void 0 !== arguments[1] ? ~~arguments[1] : this.scrollTop);
                }
            }),
          (e.prototype.scrollBy = function () {
            void 0 !== arguments[0] &&
              (!0 !== f(arguments[0])
                ? this.scroll({
                    left: ~~arguments[0].left + this.scrollLeft,
                    top: ~~arguments[0].top + this.scrollTop,
                    behavior: arguments[0].behavior
                  })
                : i.elementScroll.call(this, void 0 !== arguments[0].left ? ~~arguments[0].left + this.scrollLeft : ~~arguments[0] + this.scrollLeft, void 0 !== arguments[0].top ? ~~arguments[0].top + this.scrollTop : ~~arguments[1] + this.scrollTop));
          }),
          (e.prototype.scrollIntoView = function () {
            if (!0 !== f(arguments[0])) {
              var l = (function (o) {
                  for (; o !== t.body && !1 === ((e = p((l = o), 'Y') && a(l, 'Y')), (r = p(l, 'X') && a(l, 'X')), e || r); ) o = o.parentNode || o.host;
                  var l, e, r;
                  return o;
                })(this),
                e = l.getBoundingClientRect(),
                r = this.getBoundingClientRect();
              l !== t.body
                ? (h.call(this, l, l.scrollLeft + r.left - e.left, l.scrollTop + r.top - e.top),
                  'fixed' !== o.getComputedStyle(l).position &&
                    o.scrollBy({
                      left: e.left,
                      top: e.top,
                      behavior: 'smooth'
                    }))
                : o.scrollBy({
                    left: r.left,
                    top: r.top,
                    behavior: 'smooth'
                  });
            } else i.scrollIntoView.call(this, void 0 === arguments[0] || arguments[0]);
          });
      }

      function n(o, t) {
        (this.scrollLeft = o), (this.scrollTop = t);
      }

      function f(o) {
        if (null === o || 'object' != typeof o || void 0 === o.behavior || 'auto' === o.behavior || 'instant' === o.behavior) return !0;
        if ('object' == typeof o && 'smooth' === o.behavior) return !1;
        throw new TypeError('behavior member of ScrollOptions ' + o.behavior + ' is not a valid value for enumeration ScrollBehavior.');
      }

      function p(o, t) {
        return 'Y' === t ? o.clientHeight + c < o.scrollHeight : 'X' === t ? o.clientWidth + c < o.scrollWidth : void 0;
      }

      function a(t, l) {
        var e = o.getComputedStyle(t, null)['overflow' + l];
        return 'auto' === e || 'scroll' === e;
      }

      function d(t) {
        var l,
          e,
          i,
          c,
          n = (s() - t.startTime) / r;
        (c = n = n > 1 ? 1 : n), (l = 0.5 * (1 - Math.cos(Math.PI * c))), (e = t.startX + (t.x - t.startX) * l), (i = t.startY + (t.y - t.startY) * l), t.method.call(t.scrollable, e, i), (e === t.x && i === t.y) || o.requestAnimationFrame(d.bind(o, t));
      }

      function h(l, e, r) {
        var c,
          f,
          p,
          a,
          h = s();
        l === t.body ? ((c = o), (f = o.scrollX || o.pageXOffset), (p = o.scrollY || o.pageYOffset), (a = i.scroll)) : ((c = l), (f = l.scrollLeft), (p = l.scrollTop), (a = n)),
          d({
            scrollable: c,
            method: a,
            startTime: h,
            startX: f,
            startY: p,
            x: e,
            y: r
          });
      }
    }
    'object' == typeof exports && 'undefined' != typeof module
      ? (module.exports = {
          polyfill: o
        })
      : o();
  })();
}
