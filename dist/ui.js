"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIInitializer = exports.Common = exports.Counter = exports.Checkbox = exports.Range = exports.ScrollView = exports.Toast = exports.Tooltip = exports.Tab = exports.Accordion = exports.Modal = exports.init = void 0;
const polyfill_1 = __importDefault(require("./util/polyfill"));
const ly_nav_1 = __importDefault(require("./layout/ly_nav"));
const modal_1 = __importDefault(require("./ui/modal"));
exports.Modal = modal_1.default;
const accordion_1 = __importDefault(require("./ui/accordion"));
exports.Accordion = accordion_1.default;
const tab_1 = __importDefault(require("./ui/tab"));
exports.Tab = tab_1.default;
const tooltip_1 = __importDefault(require("./ui/tooltip"));
exports.Tooltip = tooltip_1.default;
const toast_1 = __importDefault(require("./ui/toast"));
exports.Toast = toast_1.default;
const scrollView_1 = __importDefault(require("./ui/scrollView"));
exports.ScrollView = scrollView_1.default;
const range_1 = __importDefault(require("./ui/range"));
exports.Range = range_1.default;
const checkbox_1 = __importDefault(require("./ui/checkbox"));
exports.Checkbox = checkbox_1.default;
const counter_1 = __importDefault(require("./ui/counter"));
exports.Counter = counter_1.default;
const common_1 = __importDefault(require("./ui/common"));
exports.Common = common_1.default;
const wordle_1 = __importDefault(require("./ui/wordle"));
const UIInitializer = (target, UI, options = {}) => {
    const elements = document.querySelectorAll(target);
    elements.forEach((el) => {
        if (!UI.getInstance(el)) {
            new UI(el, options);
        }
    });
};
exports.UIInitializer = UIInitializer;
const init = () => {
    UIInitializer('[data-accr]', accordion_1.default);
    UIInitializer('[data-tab]', tab_1.default);
    UIInitializer('[data-tooltip]', tooltip_1.default);
    UIInitializer('[data-range]', range_1.default);
    UIInitializer('[data-checkbox]', checkbox_1.default);
    UIInitializer('[data-scroll-view]', scrollView_1.default);
    UIInitializer('[data-counter]', counter_1.default);
    UIInitializer('[data-wordle]', wordle_1.default);
    common_1.default.init();
};
exports.init = init;
(0, polyfill_1.default)();
window.addEventListener('DOMContentLoaded', function () {
    (0, ly_nav_1.default)();
    init();
});
// 전역객체로 선언
window.SKY = { init, Modal: modal_1.default, Accordion: accordion_1.default, Tab: tab_1.default, Tooltip: tooltip_1.default, Toast: toast_1.default, ScrollView: scrollView_1.default, Range: range_1.default, Checkbox: checkbox_1.default, Counter: counter_1.default, Common: common_1.default, UIInitializer };
