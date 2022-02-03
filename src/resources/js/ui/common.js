import { numberComma } from '../util/util.js';

const inputDelete = () => {
  // console.log('a');
};

const UI_Control = {};

UI_Control.range = {
  init: function () {
    this.constructor();

    this.range.forEach(function (rangeThis) {
      const rangeTarget = rangeThis.querySelectorAll('input[type="range"]');
      const rangeLabel = rangeThis.querySelector('.range-label');
      const rangeFill = rangeThis.querySelector('.range-fill');
      const rangeStart = rangeThis.querySelector('input[type="range"][data-range-multi="start"]');
      const rangeEnd = rangeThis.querySelector('input[type="range"][data-range-multi="end"]');

      rangeTarget.forEach(function (rangeTargets) {
        // 간격 표시
        const spacingBody = rangeThis.querySelector('.range-fill-spacing');
        if (spacingBody) {
          const spacing = rangeTargets.max / rangeTargets.step;

          for (let i = 0; i < spacing; i++) {
            const spacing_li = document.createElement('li');
            spacingBody.appendChild(spacing_li);
          }
        }

        // single, multi check
        if (!rangeStart && !rangeEnd) {
          // single init
          UI_Control.range.input(rangeThis, rangeTargets, rangeLabel, rangeFill);

          rangeTargets.addEventListener('input', function () {
            UI_Control.range.input(rangeThis, rangeTargets, rangeLabel, rangeFill);
          });
        } else {
          // multi init
          UI_Control.range.inputStart(rangeFill, rangeStart, rangeEnd);
          UI_Control.range.inputEnd(rangeFill, rangeStart, rangeEnd);

          rangeStart.addEventListener('input', function () {
            UI_Control.range.inputStart(rangeFill, rangeStart, rangeEnd);
          });
          rangeEnd.addEventListener('input', function () {
            UI_Control.range.inputEnd(rangeFill, rangeStart, rangeEnd);
          });
        }
      });
    });
  },
  constructor: function () {
    this.range = document.querySelectorAll('[data-range]');
  },
  /**
   * 단일 range
   * @param {HTMLElement} rangeThis [data-range]
   * @param {HTMLElement} rangeTargets input[type="range"]
   * @param {HTMLElement} rangeLabel 말풍선
   * @param {HTMLElement} rangeFill range 막대
   */
  input: function (rangeThis, rangeTargets, rangeLabel, rangeFill) {
    // percent
    const per = ((rangeTargets.value - rangeTargets.min) / (rangeTargets.max - rangeTargets.min)) * 100;

    // bar
    rangeFill.style.right = 100 - per + '%';

    // 말풍선
    if (rangeLabel) {
      rangeLabel.style.left = per + '%';
      rangeLabel.innerHTML = numberComma(rangeTargets.value) + rangeTargets.getAttribute('data-range-unit');

      if (per < 12.5) {
        rangeLabel.classList.replace('right', 'left');
      } else if (per > 87.5) {
        rangeLabel.classList.replace('left', 'right');
      } else {
        rangeLabel.classList.remove('left');
        rangeLabel.classList.remove('right');
      }

      if (per <= 12.5) {
        rangeLabel.style.transform = 'translateX(-40%)';
      } else if (per <= 25) {
        rangeLabel.style.transform = 'translateX(-42%)';
      } else if (per <= 37.5) {
        rangeLabel.style.transform = 'translateX(-46%)';
      } else if (per <= 50) {
        rangeLabel.style.transform = 'translateX(-48%)';
      } else if (per <= 62.5) {
        rangeLabel.style.transform = 'translateX(-52%)';
      } else if (per <= 75) {
        rangeLabel.style.transform = 'translateX(-55%)';
      } else if (per <= 87.5) {
        rangeLabel.style.transform = 'translateX(-58%)';
      } else {
        rangeLabel.style.left = per + '%';
      }
    }

    // min값 선택 안되게
    if (per === 0 && rangeThis.classList.contains('min-no')) {
      rangeLabel.classList.remove('left');
      rangeTargets.value = rangeTargets.step;
      rangeLabel.innerHTML = numberComma(rangeTargets.step) + rangeTargets.getAttribute('data-range-unit');
      rangeLabel.style.left = (rangeTargets.step / rangeTargets.max) * 100 + '%';
      rangeFill.style.right = 100 - (rangeTargets.step / rangeTargets.max) * 100 + '%';
    }
  },
  /**
   * 멀티 range - 왼쪽 range
   * @param {HTMLElement} rangeFill range multi 막대
   * @param {HTMLElement} rangeStart range start element
   * @param {HTMLElement} rangeEnd range end element
   */
  inputStart: function (rangeFill, rangeStart, rangeEnd) {
    const perStart = ((rangeStart.value - rangeStart.min) / (rangeStart.max - rangeStart.min)) * 100;
    const perEnd = ((rangeEnd.value - rangeEnd.min) / (rangeEnd.max - rangeEnd.min)) * 100;
    rangeFill.style.left = perStart + '%';
    rangeFill.style.right = 100 - perEnd + '%';

    rangeStart.value = Math.min(parseInt(rangeStart.value), parseInt(rangeEnd.value) - parseInt(rangeStart.dataset.rangeMinstep));

    if (rangeStart.value >= rangeEnd.value - 5) {
      rangeStart.style.zIndex = '2';
    } else {
      rangeStart.removeAttribute('style');
    }

    // value값을 나타내야할 때
    const value = document.querySelector('[data-range-startvalue="' + rangeStart.getAttribute('id') + '"]');
    if (value) value.innerText = numberComma(rangeStart.value);
  },
  /**
   * 멀티 range - 오른쪽 range
   * @param {HTMLElement} rangeFill range multi 막대
   * @param {HTMLElement} rangeStart range start element
   * @param {HTMLElement} rangeEnd range end element
   */
  inputEnd: function (rangeFill, rangeStart, rangeEnd) {
    const perStart = ((rangeStart.value - rangeStart.min) / (rangeStart.max - rangeStart.min)) * 100;
    const perEnd = ((rangeEnd.value - rangeEnd.min) / (rangeEnd.max - rangeEnd.min)) * 100;
    rangeFill.style.left = perStart + '%';
    rangeFill.style.right = 100 - perEnd + '%';

    rangeEnd.value = Math.max(parseInt(rangeEnd.value), parseInt(rangeStart.value) + parseInt(rangeEnd.dataset.rangeMinstep));

    // value값을 나타내야할 때
    const value = document.querySelector('[data-range-endvalue="' + rangeEnd.getAttribute('id') + '"]');
    if (value) value.innerText = numberComma(rangeEnd.value);

    // data-range-last가 있을 때
    if (rangeEnd.dataset.rangeMax !== undefined && rangeEnd.value === rangeEnd.max) {
      value.innerText = numberComma(rangeEnd.value) + rangeEnd.dataset.rangeMax;
    }
  }
};

window.addEventListener('DOMContentLoaded', () => {
  inputDelete();
  if (document.querySelectorAll('.range').length) UI_Control.range.init();
});

export default { inputDelete };
