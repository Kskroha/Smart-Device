/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./js/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../node_modules/smoothscroll-polyfill/dist/smoothscroll.js":
/*!******************************************************************!*\
  !*** ../node_modules/smoothscroll-polyfill/dist/smoothscroll.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* smoothscroll v0.4.4 - 2019 - Dustan Kasten, Jeremias Menichelli - MIT License */
(function () {
  'use strict';

  // polyfill
  function polyfill() {
    // aliases
    var w = window;
    var d = document;

    // return if scroll behavior is supported and polyfill is not forced
    if (
      'scrollBehavior' in d.documentElement.style &&
      w.__forceSmoothScrollPolyfill__ !== true
    ) {
      return;
    }

    // globals
    var Element = w.HTMLElement || w.Element;
    var SCROLL_TIME = 468;

    // object gathering original scroll methods
    var original = {
      scroll: w.scroll || w.scrollTo,
      scrollBy: w.scrollBy,
      elementScroll: Element.prototype.scroll || scrollElement,
      scrollIntoView: Element.prototype.scrollIntoView
    };

    // define timing method
    var now =
      w.performance && w.performance.now
        ? w.performance.now.bind(w.performance)
        : Date.now;

    /**
     * indicates if a the current browser is made by Microsoft
     * @method isMicrosoftBrowser
     * @param {String} userAgent
     * @returns {Boolean}
     */
    function isMicrosoftBrowser(userAgent) {
      var userAgentPatterns = ['MSIE ', 'Trident/', 'Edge/'];

      return new RegExp(userAgentPatterns.join('|')).test(userAgent);
    }

    /*
     * IE has rounding bug rounding down clientHeight and clientWidth and
     * rounding up scrollHeight and scrollWidth causing false positives
     * on hasScrollableSpace
     */
    var ROUNDING_TOLERANCE = isMicrosoftBrowser(w.navigator.userAgent) ? 1 : 0;

    /**
     * changes scroll position inside an element
     * @method scrollElement
     * @param {Number} x
     * @param {Number} y
     * @returns {undefined}
     */
    function scrollElement(x, y) {
      this.scrollLeft = x;
      this.scrollTop = y;
    }

    /**
     * returns result of applying ease math function to a number
     * @method ease
     * @param {Number} k
     * @returns {Number}
     */
    function ease(k) {
      return 0.5 * (1 - Math.cos(Math.PI * k));
    }

    /**
     * indicates if a smooth behavior should be applied
     * @method shouldBailOut
     * @param {Number|Object} firstArg
     * @returns {Boolean}
     */
    function shouldBailOut(firstArg) {
      if (
        firstArg === null ||
        typeof firstArg !== 'object' ||
        firstArg.behavior === undefined ||
        firstArg.behavior === 'auto' ||
        firstArg.behavior === 'instant'
      ) {
        // first argument is not an object/null
        // or behavior is auto, instant or undefined
        return true;
      }

      if (typeof firstArg === 'object' && firstArg.behavior === 'smooth') {
        // first argument is an object and behavior is smooth
        return false;
      }

      // throw error when behavior is not supported
      throw new TypeError(
        'behavior member of ScrollOptions ' +
          firstArg.behavior +
          ' is not a valid value for enumeration ScrollBehavior.'
      );
    }

    /**
     * indicates if an element has scrollable space in the provided axis
     * @method hasScrollableSpace
     * @param {Node} el
     * @param {String} axis
     * @returns {Boolean}
     */
    function hasScrollableSpace(el, axis) {
      if (axis === 'Y') {
        return el.clientHeight + ROUNDING_TOLERANCE < el.scrollHeight;
      }

      if (axis === 'X') {
        return el.clientWidth + ROUNDING_TOLERANCE < el.scrollWidth;
      }
    }

    /**
     * indicates if an element has a scrollable overflow property in the axis
     * @method canOverflow
     * @param {Node} el
     * @param {String} axis
     * @returns {Boolean}
     */
    function canOverflow(el, axis) {
      var overflowValue = w.getComputedStyle(el, null)['overflow' + axis];

      return overflowValue === 'auto' || overflowValue === 'scroll';
    }

    /**
     * indicates if an element can be scrolled in either axis
     * @method isScrollable
     * @param {Node} el
     * @param {String} axis
     * @returns {Boolean}
     */
    function isScrollable(el) {
      var isScrollableY = hasScrollableSpace(el, 'Y') && canOverflow(el, 'Y');
      var isScrollableX = hasScrollableSpace(el, 'X') && canOverflow(el, 'X');

      return isScrollableY || isScrollableX;
    }

    /**
     * finds scrollable parent of an element
     * @method findScrollableParent
     * @param {Node} el
     * @returns {Node} el
     */
    function findScrollableParent(el) {
      while (el !== d.body && isScrollable(el) === false) {
        el = el.parentNode || el.host;
      }

      return el;
    }

    /**
     * self invoked function that, given a context, steps through scrolling
     * @method step
     * @param {Object} context
     * @returns {undefined}
     */
    function step(context) {
      var time = now();
      var value;
      var currentX;
      var currentY;
      var elapsed = (time - context.startTime) / SCROLL_TIME;

      // avoid elapsed times higher than one
      elapsed = elapsed > 1 ? 1 : elapsed;

      // apply easing to elapsed time
      value = ease(elapsed);

      currentX = context.startX + (context.x - context.startX) * value;
      currentY = context.startY + (context.y - context.startY) * value;

      context.method.call(context.scrollable, currentX, currentY);

      // scroll more if we have not reached our destination
      if (currentX !== context.x || currentY !== context.y) {
        w.requestAnimationFrame(step.bind(w, context));
      }
    }

    /**
     * scrolls window or element with a smooth behavior
     * @method smoothScroll
     * @param {Object|Node} el
     * @param {Number} x
     * @param {Number} y
     * @returns {undefined}
     */
    function smoothScroll(el, x, y) {
      var scrollable;
      var startX;
      var startY;
      var method;
      var startTime = now();

      // define scroll context
      if (el === d.body) {
        scrollable = w;
        startX = w.scrollX || w.pageXOffset;
        startY = w.scrollY || w.pageYOffset;
        method = original.scroll;
      } else {
        scrollable = el;
        startX = el.scrollLeft;
        startY = el.scrollTop;
        method = scrollElement;
      }

      // scroll looping over a frame
      step({
        scrollable: scrollable,
        method: method,
        startTime: startTime,
        startX: startX,
        startY: startY,
        x: x,
        y: y
      });
    }

    // ORIGINAL METHODS OVERRIDES
    // w.scroll and w.scrollTo
    w.scroll = w.scrollTo = function() {
      // avoid action when no arguments are passed
      if (arguments[0] === undefined) {
        return;
      }

      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0]) === true) {
        original.scroll.call(
          w,
          arguments[0].left !== undefined
            ? arguments[0].left
            : typeof arguments[0] !== 'object'
              ? arguments[0]
              : w.scrollX || w.pageXOffset,
          // use top prop, second argument if present or fallback to scrollY
          arguments[0].top !== undefined
            ? arguments[0].top
            : arguments[1] !== undefined
              ? arguments[1]
              : w.scrollY || w.pageYOffset
        );

        return;
      }

      // LET THE SMOOTHNESS BEGIN!
      smoothScroll.call(
        w,
        d.body,
        arguments[0].left !== undefined
          ? ~~arguments[0].left
          : w.scrollX || w.pageXOffset,
        arguments[0].top !== undefined
          ? ~~arguments[0].top
          : w.scrollY || w.pageYOffset
      );
    };

    // w.scrollBy
    w.scrollBy = function() {
      // avoid action when no arguments are passed
      if (arguments[0] === undefined) {
        return;
      }

      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0])) {
        original.scrollBy.call(
          w,
          arguments[0].left !== undefined
            ? arguments[0].left
            : typeof arguments[0] !== 'object' ? arguments[0] : 0,
          arguments[0].top !== undefined
            ? arguments[0].top
            : arguments[1] !== undefined ? arguments[1] : 0
        );

        return;
      }

      // LET THE SMOOTHNESS BEGIN!
      smoothScroll.call(
        w,
        d.body,
        ~~arguments[0].left + (w.scrollX || w.pageXOffset),
        ~~arguments[0].top + (w.scrollY || w.pageYOffset)
      );
    };

    // Element.prototype.scroll and Element.prototype.scrollTo
    Element.prototype.scroll = Element.prototype.scrollTo = function() {
      // avoid action when no arguments are passed
      if (arguments[0] === undefined) {
        return;
      }

      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0]) === true) {
        // if one number is passed, throw error to match Firefox implementation
        if (typeof arguments[0] === 'number' && arguments[1] === undefined) {
          throw new SyntaxError('Value could not be converted');
        }

        original.elementScroll.call(
          this,
          // use left prop, first number argument or fallback to scrollLeft
          arguments[0].left !== undefined
            ? ~~arguments[0].left
            : typeof arguments[0] !== 'object' ? ~~arguments[0] : this.scrollLeft,
          // use top prop, second argument or fallback to scrollTop
          arguments[0].top !== undefined
            ? ~~arguments[0].top
            : arguments[1] !== undefined ? ~~arguments[1] : this.scrollTop
        );

        return;
      }

      var left = arguments[0].left;
      var top = arguments[0].top;

      // LET THE SMOOTHNESS BEGIN!
      smoothScroll.call(
        this,
        this,
        typeof left === 'undefined' ? this.scrollLeft : ~~left,
        typeof top === 'undefined' ? this.scrollTop : ~~top
      );
    };

    // Element.prototype.scrollBy
    Element.prototype.scrollBy = function() {
      // avoid action when no arguments are passed
      if (arguments[0] === undefined) {
        return;
      }

      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0]) === true) {
        original.elementScroll.call(
          this,
          arguments[0].left !== undefined
            ? ~~arguments[0].left + this.scrollLeft
            : ~~arguments[0] + this.scrollLeft,
          arguments[0].top !== undefined
            ? ~~arguments[0].top + this.scrollTop
            : ~~arguments[1] + this.scrollTop
        );

        return;
      }

      this.scroll({
        left: ~~arguments[0].left + this.scrollLeft,
        top: ~~arguments[0].top + this.scrollTop,
        behavior: arguments[0].behavior
      });
    };

    // Element.prototype.scrollIntoView
    Element.prototype.scrollIntoView = function() {
      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0]) === true) {
        original.scrollIntoView.call(
          this,
          arguments[0] === undefined ? true : arguments[0]
        );

        return;
      }

      // LET THE SMOOTHNESS BEGIN!
      var scrollableParent = findScrollableParent(this);
      var parentRects = scrollableParent.getBoundingClientRect();
      var clientRects = this.getBoundingClientRect();

      if (scrollableParent !== d.body) {
        // reveal element inside parent
        smoothScroll.call(
          this,
          scrollableParent,
          scrollableParent.scrollLeft + clientRects.left - parentRects.left,
          scrollableParent.scrollTop + clientRects.top - parentRects.top
        );

        // reveal parent in viewport unless is fixed
        if (w.getComputedStyle(scrollableParent).position !== 'fixed') {
          w.scrollBy({
            left: parentRects.left,
            top: parentRects.top,
            behavior: 'smooth'
          });
        }
      } else {
        // reveal element in viewport
        w.scrollBy({
          left: clientRects.left,
          top: clientRects.top,
          behavior: 'smooth'
        });
      }
    };
  }

  if (true) {
    // commonjs
    module.exports = { polyfill: polyfill };
  } else {}

}());


/***/ }),

/***/ "./js/main.js":
/*!********************!*\
  !*** ./js/main.js ***!
  \********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_ios_vh_fix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/ios-vh-fix */ "./js/utils/ios-vh-fix.js");
/* harmony import */ var _modules_modals_init_modals__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/modals/init-modals */ "./js/modules/modals/init-modals.js");
/* harmony import */ var _modules_form_validate_form__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/form-validate/form */ "./js/modules/form-validate/form.js");
/* harmony import */ var _modules_accordion_init_accordion__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/accordion/init-accordion */ "./js/modules/accordion/init-accordion.js");
/* harmony import */ var _vendor_phone_mask__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./vendor/phone-mask */ "./js/vendor/phone-mask.js");
/* harmony import */ var smoothscroll_polyfill__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! smoothscroll-polyfill */ "../node_modules/smoothscroll-polyfill/dist/smoothscroll.js");
/* harmony import */ var smoothscroll_polyfill__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(smoothscroll_polyfill__WEBPACK_IMPORTED_MODULE_5__);







// ---------------------------------

window.addEventListener('DOMContentLoaded', function () {
  var scrollBtn = document.querySelector('.hero__button');
  var mainForm = document.querySelector('.contact');
  var showMoreBtn = document.querySelector('.company__button');
  var hiddenText = document.querySelector('.company__hidden');
  var mobileHiddenText = document.querySelector('.company__mobile-hidden');
  var isTextShown = false;
  // Utils
  // ---------------------------------
  smoothscroll_polyfill__WEBPACK_IMPORTED_MODULE_5___default.a.polyfill();
  Object(_utils_ios_vh_fix__WEBPACK_IMPORTED_MODULE_0__["iosVhFix"])();

  // Modules
  Object(_modules_accordion_init_accordion__WEBPACK_IMPORTED_MODULE_3__["initAccordions"])();
  Object(_vendor_phone_mask__WEBPACK_IMPORTED_MODULE_4__["initPhoneMask"])();

  // все скрипты должны быть в обработчике 'DOMContentLoaded', но не все в 'load'
  // в load следует добавить скрипты, не участвующие в работе первого экрана
  scrollBtn.addEventListener('click', function (evt) {
    evt.preventDefault();
    mainForm.scrollIntoView({
      behavior: 'smooth'
    });
  });
  showMoreBtn.addEventListener('click', function (evt) {
    evt.preventDefault();
    if (isTextShown === false) {
      hiddenText.classList.remove('company__hidden');
      mobileHiddenText.classList.remove('company__mobile-hidden');
      showMoreBtn.textContent = 'Свернуть';
      isTextShown = !isTextShown;
      return;
    }
    hiddenText.classList.add('company__hidden');
    mobileHiddenText.classList.add('company__mobile-hidden');
    showMoreBtn.textContent = 'Подробнее';
    isTextShown = !isTextShown;
  });
  window.addEventListener('load', function () {
    Object(_modules_modals_init_modals__WEBPACK_IMPORTED_MODULE_1__["initModals"])();
    var form = new _modules_form_validate_form__WEBPACK_IMPORTED_MODULE_2__["Form"]();
    window.form = form;
    form.init();
    window.focusLock.lock('modal__content form');
  });
});

// ---------------------------------

// ❗❗❗ обязательно установите плагины eslint, stylelint, editorconfig в редактор кода.

// привязывайте js не на классы, а на дата атрибуты (data-validate)

// вместо модификаторов .block--active используем утилитарные классы
// .is-active || .is-open || .is-invalid и прочие (обязателен нейминг в два слова)
// .select.select--opened ❌ ---> [data-select].is-open ✅

// выносим все в дата атрибуты
// url до иконок пинов карты, настройки автопрокрутки слайдера, url к json и т.д.

// для адаптивного JS используется matchMedia и addListener
// const breakpoint = window.matchMedia(`(min-width:1024px)`);
// const breakpointChecker = () => {
//   if (breakpoint.matches) {
//   } else {
//   }
// };
// breakpoint.addListener(breakpointChecker);
// breakpointChecker();

// используйте .closest(el)

/***/ }),

/***/ "./js/modules/accordion/accordions.js":
/*!********************************************!*\
  !*** ./js/modules/accordion/accordions.js ***!
  \********************************************/
/*! exports provided: Accordions */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Accordions", function() { return Accordions; });
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Accordions = /*#__PURE__*/function () {
  function Accordions() {
    _classCallCheck(this, Accordions);
    this._openHeight = 0;
    this._windowWidth = window.innerWidth;
    this._documentClickHandler = this._documentClickHandler.bind(this);
    this._windowResizeHandler = this._windowResizeHandler.bind(this);
    this._init();
  }
  _createClass(Accordions, [{
    key: "_init",
    value: function _init() {
      this.fullUpdate();
      document.addEventListener('click', this._documentClickHandler);
      window.addEventListener('resize', this._windowResizeHandler);
    }
  }, {
    key: "_documentClickHandler",
    value: function _documentClickHandler(evt) {
      var target = evt.target;
      if (!target.closest('[data-accordion="button"]')) {
        return;
      }
      evt.preventDefault();
      var parent = target.closest('[data-accordion="parent"]');
      if (parent.dataset.destroy && !window.matchMedia(parent.dataset.destroy).matches) {
        return;
      }
      var element = target.closest('[data-accordion="element"]');
      if (element.classList.contains('is-active')) {
        this.closeAccordion(element);
        return;
      }
      this.openAccordion(element);
    }
  }, {
    key: "_windowResizeHandler",
    value: function _windowResizeHandler() {
      if (this._windowWidth === window.innerWidth) {
        return;
      }
      this._windowWidth = window.innerWidth;
      this.updateAccordionsHeight();
    }
  }, {
    key: "closeAllAccordion",
    value: function closeAllAccordion(parent) {
      var _this = this;
      var elements = parent.querySelectorAll('[data-accordion="element"]');
      elements.forEach(function (element) {
        var currentParent = element.closest('[data-accordion="parent"]');
        if (currentParent === parent) {
          _this.closeAccordion(element);
        }
      });
    }
  }, {
    key: "updateAccordionsHeight",
    value: function updateAccordionsHeight() {
      var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      if (element) {
        var content = element.querySelector('[data-accordion="content"]');
        content.style.transition = 'none';
        content.style.maxHeight = "".concat(content.scrollHeight, "px");
        setTimeout(function () {
          content.style.transition = null;
        });
        return;
      }
      var closeElements = document.querySelectorAll('[data-accordion="element"]:not(.is-active)');
      closeElements.forEach(function (closeElement) {
        var parent = closeElement.closest('[data-accordion="parent"]');
        var content = closeElement.querySelector('[data-accordion="content"]');
        if (parent.dataset.destroy && !window.matchMedia(parent.dataset.destroy).matches) {
          content.style.maxHeight = '100%';
          return;
        }
        content.style.maxHeight = null;
      });
      var openElements = document.querySelectorAll('[data-accordion="element"].is-active');
      openElements.forEach(function (openElement) {
        var content = openElement.querySelector('[data-accordion="content"]');
        var parent = openElement.closest('[data-accordion="parent"]');
        if (parent.dataset.destroy && !window.matchMedia(parent.dataset.destroy).matches) {
          content.style.maxHeight = '100%';
          return;
        }
        content.style.transition = 'none';
        content.style.maxHeight = "".concat(content.scrollHeight, "px");
        setTimeout(function () {
          content.style.transition = null;
        });
      });
    }
  }, {
    key: "fullUpdate",
    value: function fullUpdate() {
      var _this2 = this;
      var parent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var transition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var openElements;
      if (parent) {
        openElements = parent.querySelectorAll('[data-accordion="element"].is-active');
      } else {
        openElements = document.querySelectorAll('[data-accordion="element"].is-active');
      }
      openElements.forEach(function (openElement) {
        var innerParent = openElement.querySelector('[data-accordion="parent"]');
        if (innerParent) {
          return;
        }
        _this2.openAccordion(openElement, transition);
      });
      this.updateAccordionsHeight();
    }
  }, {
    key: "openAccordion",
    value: function openAccordion(element) {
      var transition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var parentElement = element.closest('[data-accordion="parent"]');
      var contentElement = element.querySelector('[data-accordion="content"]');
      this._openHeight += contentElement.scrollHeight;
      if (parentElement.hasAttribute('data-single')) {
        this.closeAllAccordion(parentElement);
      }
      element.classList.add('is-active');
      if (transition) {
        contentElement.style.maxHeight = "".concat(this._openHeight, "px");
      } else {
        contentElement.style.transition = 'none';
        contentElement.style.maxHeight = "".concat(this._openHeight, "px");
        setTimeout(function () {
          contentElement.style.transition = null;
        });
      }
      if (parentElement.closest('[data-accordion="element"]')) {
        this.openAccordion(parentElement.closest('[data-accordion="element"]'), transition);
        return;
      }
      this._openHeight = 0;
    }
  }, {
    key: "closeAccordion",
    value: function closeAccordion(element) {
      var transition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var contentElement = element.querySelector('[data-accordion="content"]');
      if (!contentElement) {
        return;
      }
      element.classList.remove('is-active');
      if (transition) {
        contentElement.style.maxHeight = '0';
      } else {
        contentElement.style.transition = 'none';
        contentElement.style.maxHeight = '0';
        setTimeout(function () {
          contentElement.style.transition = null;
        });
      }
    }
  }]);
  return Accordions;
}();

/***/ }),

/***/ "./js/modules/accordion/init-accordion.js":
/*!************************************************!*\
  !*** ./js/modules/accordion/init-accordion.js ***!
  \************************************************/
/*! exports provided: initAccordions, accordions */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initAccordions", function() { return initAccordions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "accordions", function() { return accordions; });
/* harmony import */ var _accordions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./accordions */ "./js/modules/accordion/accordions.js");

var accordions;
var initAccordions = function initAccordions() {
  accordions = new _accordions__WEBPACK_IMPORTED_MODULE_0__["Accordions"]();
  // Используйте в разработке экспортируемую переменную accordions, window сделан для бэкэнда
  window.accordions = accordions;
};


/***/ }),

/***/ "./js/modules/form-validate/callback.js":
/*!**********************************************!*\
  !*** ./js/modules/form-validate/callback.js ***!
  \**********************************************/
/*! exports provided: callbacks */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "callbacks", function() { return callbacks; });
var baseSuccessCallback = function baseSuccessCallback(event) {
  event.preventDefault();
  // В данном колбеке бэкендер, либо разработчик при необходимости будет писать запрос на отправку формы на сервер и обрабатывать возможные ошибки или успешную отправку формы на сервер
};

var baseErrorCallback = function baseErrorCallback(event) {
  event.preventDefault();
  // Данный коллбек используется при необходимости выполнить какое-либо действие помимо показа ошибок при попытке отправить неккорректные данные, он не связан с запросами на сервер
};

var callbacks = {
  base: {
    // Сбросс формы
    reset: true,
    // Таймаут сброса формы
    resetTimeout: 500,
    successCallback: baseSuccessCallback,
    errorCallback: baseErrorCallback
  }
};

/***/ }),

/***/ "./js/modules/form-validate/form.js":
/*!******************************************!*\
  !*** ./js/modules/form-validate/form.js ***!
  \******************************************/
/*! exports provided: Form */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Form", function() { return Form; });
/* harmony import */ var _validator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validator */ "./js/modules/form-validate/validator.js");
/* harmony import */ var _callback__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./callback */ "./js/modules/form-validate/callback.js");
/* harmony import */ var _init_phone_input__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./init-phone-input */ "./js/modules/form-validate/init-phone-input.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }



var Form = /*#__PURE__*/function () {
  function Form() {
    _classCallCheck(this, Form);
    this._validator = new _validator__WEBPACK_IMPORTED_MODULE_0__["Validator"]();
    this._initPhoneInput = _init_phone_input__WEBPACK_IMPORTED_MODULE_2__["initPhoneInput"];
    this._callbacks = _callback__WEBPACK_IMPORTED_MODULE_1__["callbacks"];
  }
  _createClass(Form, [{
    key: "_resetSelect",
    value: function _resetSelect(select) {
      var nativeSelect = select.querySelector('select');
      var activeIndex = nativeSelect.options.selectedIndex;
      var selectedOption = nativeSelect.options[activeIndex];
      var buttonText = select.querySelector('.custom-select__text');
      var selectItems = select.querySelectorAll('.custom-select__item');
      buttonText.textContent = selectedOption.textContent;
      selectItems.forEach(function (item, index) {
        if (index === activeIndex - 1) {
          item.setAttribute('aria-selected', 'true');
          return;
        }
        item.setAttribute('aria-selected', 'false');
      });
      if (!nativeSelect.value) {
        select.classList.remove('not-empty');
        select.classList.remove('is-valid');
      }
    }
  }, {
    key: "_resetSelects",
    value: function _resetSelects(form) {
      var _this = this;
      var selects = form.querySelectorAll('[data-select]');
      selects.forEach(function (select) {
        _this._resetSelect(select);
      });
    }
  }, {
    key: "reset",
    value: function reset(form) {
      var _this2 = this;
      form.reset();
      form.querySelectorAll('.is-invalid').forEach(function (item) {
        return item.classList.remove('is-invalid');
      });
      form.querySelectorAll('.is-valid').forEach(function (item) {
        return item.classList.remove('is-valid');
      });
      form.querySelectorAll('.input-message').forEach(function (item) {
        return item.remove();
      });
      setTimeout(function () {
        _this2._resetSelects(form);
      });
    }
  }, {
    key: "initPhoneInput",
    value: function initPhoneInput(parent) {
      this._initPhoneInput(parent);
    }
  }, {
    key: "validateForm",
    value: function validateForm(form) {
      return this._validator.validateForm(form);
    }
  }, {
    key: "validateFormElement",
    value: function validateFormElement(item) {
      return this._validator.validateFormElement(item);
    }
  }, {
    key: "_onFormSubmit",
    value: function _onFormSubmit(event) {
      var _this3 = this;
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      if (this.validateForm(event.target) && callback) {
        this._callbacks[callback].successCallback(event);
        if (this._callbacks[callback].reset) {
          setTimeout(function () {
            _this3.reset(event.target);
          }, this._callbacks[callback].resetTimeout ? this._callbacks[callback].resetTimeout : 500);
        }
        return;
      }
      if (!this.validateForm(event.target) && callback) {
        this._callbacks[callback].errorCallback(event);
        return;
      }
    }
  }, {
    key: "_onFormInput",
    value: function _onFormInput(item) {
      this.validateFormElement(item);
    }
  }, {
    key: "_initValidate",
    value: function _initValidate(parent) {
      var _this4 = this;
      var form = parent.querySelector('form');
      if (!form) {
        return;
      }
      var phoneParents = form.querySelectorAll('[data-validate-type="phone"]');
      phoneParents.forEach(function (item) {
        return _this4._initPhoneInput(item);
      });
      var callback = parent.dataset.callback;
      form.noValidate = true;
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        _this4._onFormSubmit(event, callback);
      });
      form.addEventListener('input', function (event) {
        _this4._onFormInput(event.target);
      });
      form.addEventListener('reset', function (event) {
        _this4.reset(event.target);
      });
    }
  }, {
    key: "init",
    value: function init() {
      var _this5 = this;
      this._validateParent = document.querySelectorAll('[data-form-validate]');
      if (!this._validateParent.length) {
        return;
      }
      this._validateParent.forEach(function (parent) {
        return _this5._initValidate(parent);
      });
    }
  }]);
  return Form;
}();

/***/ }),

/***/ "./js/modules/form-validate/init-phone-input.js":
/*!******************************************************!*\
  !*** ./js/modules/form-validate/init-phone-input.js ***!
  \******************************************************/
/*! exports provided: initPhoneInput */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initPhoneInput", function() { return initPhoneInput; });
var baseCountryCode = '+7';
var baseMatrix = ' (___) ___ __ __';
var phoneLength = baseCountryCode.length + baseMatrix.length;
var onPhoneInputInput = function onPhoneInputInput(e) {
  var matrix = "".concat(baseCountryCode).concat(baseMatrix);
  var def = matrix.replace(/\D/g, '');
  var i = 0;
  var val = e.target.value.replace(/\D/g, '');
  if (def.length >= val.length) {
    val = def;
  }
  e.target.value = matrix.replace(/./g, function (a) {
    if (/[_\d]/.test(a) && i < val.length) {
      return val.charAt(i++);
    } else if (i >= val.length) {
      return '';
    } else {
      return a;
    }
  });
};
var onPhoneInputFocus = function onPhoneInputFocus(_ref) {
  var target = _ref.target;
  if (!target.value) {
    target.value = baseCountryCode;
  }
  target.addEventListener('input', onPhoneInputInput);
  target.addEventListener('blur', onPhoneInputBlur);
  target.addEventListener('keydown', onPhoneInputKeydown);
  target.addEventListener('paste', onPhoneInputPaste);
  target.addEventListener('click', onPhoneInputClick);
};
var onPhoneInputClick = function onPhoneInputClick(e) {
  if (e.target.selectionStart < 4) {
    e.preventDefault();
    e.target.setSelectionRange(3, 3);
  }
};
var onPhoneInputPaste = function onPhoneInputPaste(e) {
  e.target.setSelectionRange(0, 0);
  if (!e.target.selectionStart) {
    setTimeout(function () {
      if (e.target.value.startsWith('+7')) {
        return;
      }
      if (e.target.value.startsWith('+8')) {
        e.target.value = "+7 ".concat(e.target.value.slice(3));
        return;
      }
      e.target.value = '';
    });
  }
};
var onPhoneInputKeydown = function onPhoneInputKeydown(e) {
  if (e.target.selectionStart < 4 && (e.keyCode === 37 || e.keyCode === 13)) {
    e.preventDefault();
    e.target.setSelectionRange(3, 3);
  }
};
var onPhoneInputBlur = function onPhoneInputBlur(_ref2) {
  var target = _ref2.target;
  if (target.value === baseCountryCode) {
    var parent = target.closest('[data-validate-type="phone"]');
    target.value = '';
    if (!parent.hasAttribute('data-required')) {
      parent.classList.remove('is-valid');
      parent.classList.remove('is-invalid');
      var parentMessage = parent.querySelector('.input-message');
      if (parentMessage) {
        parentMessage.remove();
      }
    }
    parent.classList.remove('not-empty');
    target.removeEventListener('input', onPhoneInputInput);
    target.removeEventListener('blur', onPhoneInputBlur);
    target.removeEventListener('keydown', onPhoneInputKeydown);
    target.removeEventListener('paste', onPhoneInputPaste);
    target.removeEventListener('click', onPhoneInputClick);
  }
};
var initPhoneInput = function initPhoneInput(parent) {
  var input = parent.querySelector('input');
  parent.dataset.phoneLength = phoneLength;
  input.addEventListener('focus', onPhoneInputFocus);
};

/***/ }),

/***/ "./js/modules/form-validate/matrix.js":
/*!********************************************!*\
  !*** ./js/modules/form-validate/matrix.js ***!
  \********************************************/
/*! exports provided: matrixReplace */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "matrixReplace", function() { return matrixReplace; });
var matrixReplace = function matrixReplace(item, matrix, RegEx) {
  if (!matrix) {
    // eslint-disable-next-line no-console
    console.error('При валидации по матрице обязательно указывать формат матрицы: data-matrix=""');
    item.value = '';
    return;
  }
  if (!RegEx) {
    // eslint-disable-next-line no-console
    console.error('При валидации по матрице обязательно указывать формат ограничений: data-matrix-limitations=""');
    item.value = '';
    return;
  }
  var def = matrix.replace(RegEx, '');
  var val = item.value.replace(RegEx, '');
  var i = 0;
  if (def.length >= val.length) {
    val = def;
  }
  item.value = matrix.replace(/./g, function (a) {
    if (/[_\^]/.test(a) && i < val.length) {
      return val.charAt(i++);
    } else if (i >= val.length) {
      return '';
    } else {
      return a;
    }
  });
};

/***/ }),

/***/ "./js/modules/form-validate/regular-expression.js":
/*!********************************************************!*\
  !*** ./js/modules/form-validate/regular-expression.js ***!
  \********************************************************/
/*! exports provided: getLimitationsRegEx, getMatrixLimitationsRegEx, getMailRegEx */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getLimitationsRegEx", function() { return getLimitationsRegEx; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getMatrixLimitationsRegEx", function() { return getMatrixLimitationsRegEx; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getMailRegEx", function() { return getMailRegEx; });
var setLimitationError = function setLimitationError(limitation) {
  // eslint-disable-next-line no-console
  console.error("\u041F\u0435\u0440\u0435\u0434\u0430\u043D\u043D\u044B\u0439 \u0444\u043E\u0440\u043C\u0430\u0442 \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u0438\u044F(data-limitation=\"".concat(limitation, "\") - \u043D\u0435 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442\u0441\u044F. \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u043E\u0441\u0442\u044C \u0432\u0432\u0435\u0434\u0451\u043D\u043D\u044B\u0445 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0439."));
};
var getLimitationsRegEx = function getLimitationsRegEx(limitation) {
  switch (limitation) {
    case 'digit':
      return /[^\d]/g;
    case 'name':
      return /[^a-zA-Zа-яёА-ЯЁ\-\s]/g;
    case 'letters':
      return /[^a-zA-Zа-яёА-ЯЁ\s]/g;
    case 'letters-and-digit':
      return /[^a-zA-Zа-яёА-ЯЁ\s\d]/g;
    case 'cyrillic':
      return /[^а-яёА-ЯЁ\s]/g;
    case 'latin':
      return /[^a-zA-Z\s]/g;
    default:
      return setLimitationError(limitation);
  }
};
var getMatrixLimitationsRegEx = function getMatrixLimitationsRegEx(matrix) {
  switch (matrix) {
    case 'digit':
      return /[^\d]/g;
    case 'name':
      return /[^\а-яё\А-ЯЁ\a-z\A-Z\-]]/g;
    case 'letters':
      return /[^\а-яё\А-ЯЁ\a-z\A-Z]/g;
    case 'letters-and-digit':
      return /[^\а-яё\А-ЯЁ\a-z\A-Z\d]/g;
    case 'cyrillic':
      return /[^\а-яё\А-ЯЁ]/g;
    case 'latin':
      return /[^\a-z\A-Z]/g;
    default:
      return false;
  }
};
var getMailRegEx = function getMailRegEx() {
  return /[a-zA-Zа-яёА-ЯЁ0-9]{1}([a-zA-Zа-яёА-ЯЁ0-9\-_\.]{1,})?@[a-zA-Zа-яёА-ЯЁ0-9\-]{1}([a-zA-Zа-яёА-ЯЁ0-9.\-]{1,})?[a-zA-Zа-яёА-ЯЁ0-9\-]{1}\.[a-zA-Zа-яёА-ЯЁ]{2,6}/;
};

/***/ }),

/***/ "./js/modules/form-validate/render-message.js":
/*!****************************************************!*\
  !*** ./js/modules/form-validate/render-message.js ***!
  \****************************************************/
/*! exports provided: Message */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Message", function() { return Message; });
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Message = /*#__PURE__*/function () {
  function Message() {
    _classCallCheck(this, Message);
    this._baseErrorText = 'Это поле является обязательным';
  }
  _createClass(Message, [{
    key: "_messageTemplate",
    value: function _messageTemplate(message, state) {
      var cssClass = state === 'valid' ? 'is-valid' : 'is-invalid';
      return "<span class=\"input-message ".concat(cssClass, "\">").concat(message, "</span>");
    }
  }, {
    key: "removeMessage",
    value: function removeMessage(parent) {
      var parentMessage = parent.querySelector('.input-message');
      if (parentMessage) {
        parentMessage.remove();
      }
    }
  }, {
    key: "renderMessage",
    value: function renderMessage(parent, message, state) {
      this.removeMessage(parent);
      parent.insertAdjacentHTML('beforeend', this._messageTemplate(message, state));
    }
  }]);
  return Message;
}();

/***/ }),

/***/ "./js/modules/form-validate/validator.js":
/*!***********************************************!*\
  !*** ./js/modules/form-validate/validator.js ***!
  \***********************************************/
/*! exports provided: Validator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Validator", function() { return Validator; });
/* harmony import */ var _regular_expression__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./regular-expression */ "./js/modules/form-validate/regular-expression.js");
/* harmony import */ var _matrix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./matrix */ "./js/modules/form-validate/matrix.js");
/* harmony import */ var _render_message__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./render-message */ "./js/modules/form-validate/render-message.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }



var Validator = /*#__PURE__*/function () {
  function Validator() {
    _classCallCheck(this, Validator);
    this._getLimitationsRegEx = _regular_expression__WEBPACK_IMPORTED_MODULE_0__["getLimitationsRegEx"];
    this._getMatrixLimitationsRegEx = _regular_expression__WEBPACK_IMPORTED_MODULE_0__["getMatrixLimitationsRegEx"];
    this._getMailRegEx = _regular_expression__WEBPACK_IMPORTED_MODULE_0__["getMailRegEx"];
    this._matrixReplace = _matrix__WEBPACK_IMPORTED_MODULE_1__["matrixReplace"];
    this._message = new _render_message__WEBPACK_IMPORTED_MODULE_2__["Message"]();
  }
  _createClass(Validator, [{
    key: "_renderMessage",
    value: function _renderMessage(trigger, parent, input) {
      if (!parent.hasAttribute('data-required') && !input.value) {
        return;
      }
      if (!trigger) {
        parent.classList.add('is-invalid');
        if (parent.hasAttribute('data-message-base') && !input.value) {
          this._message.renderMessage(parent, parent.dataset.messageBase, 'invalid');
        } else if (parent.hasAttribute('data-message-extra') && input.value) {
          this._message.renderMessage(parent, parent.dataset.messageExtra, 'invalid');
        } else if (!parent.hasAttribute('data-message-extra') && parent.hasAttribute('data-message-base') && input.value) {
          this._message.renderMessage(parent, parent.dataset.messageBase, 'invalid');
        } else {
          this._message.removeMessage(parent);
        }
      } else {
        if (parent.hasAttribute('data-message-success')) {
          this._message.renderMessage(parent, parent.dataset.messageSuccess, 'valid');
        } else {
          this._message.removeMessage(parent);
        }
      }
    }
  }, {
    key: "_setItemValidState",
    value: function _setItemValidState(parent, input) {
      if (!parent.hasAttribute('data-required') && !input.value) {
        return;
      }
      parent.classList.add('is-valid');
      parent.classList.remove('is-invalid');
      input.setAttribute('aria-invalid', 'false');
      this._message.removeMessage(parent);
    }
  }, {
    key: "_setItemInvalidState",
    value: function _setItemInvalidState(parent, input) {
      if (!parent.hasAttribute('data-required') && !input.value) {
        return;
      }
      parent.classList.remove('is-valid');
      input.setAttribute('aria-invalid', 'true');
    }
  }, {
    key: "_simpleLimitation",
    value: function _simpleLimitation(item, limitation) {
      item.value = item.value.replace(this._getLimitationsRegEx(limitation), '');
    }
  }, {
    key: "_matrixLimitation",
    value: function _matrixLimitation(item, matrix, limitation) {
      this._matrixReplace(item, matrix, limitation);
    }
  }, {
    key: "_validateTextInput",
    value: function _validateTextInput(parent, input) {
      var flag = true;
      if (input.value.length >= (+input.getAttribute('minlength') || 1)) {
        this._setItemValidState(parent, input);
      } else {
        this._setItemInvalidState(parent, input);
        flag = false;
      }
      return flag;
    }
  }, {
    key: "_validateMatrixInput",
    value: function _validateMatrixInput(parent, input) {
      var flag = true;
      if (input.value.length === input.closest('[data-matrix]').dataset.matrix.length) {
        this._setItemValidState(parent, input);
      } else {
        this._setItemInvalidState(parent, input);
        flag = false;
      }
      return flag;
    }
  }, {
    key: "_validateEmailInput",
    value: function _validateEmailInput(parent, input) {
      var flag = true;
      if (new RegExp(this._getMailRegEx(), '').test(input.value)) {
        this._setItemValidState(parent, input);
      } else {
        this._setItemInvalidState(parent, input);
        flag = false;
      }
      return flag;
    }
  }, {
    key: "_validatePhoneInput",
    value: function _validatePhoneInput(parent, input) {
      var flag = true;
      if (input.value.length >= +parent.dataset.phoneLength) {
        this._setItemValidState(parent, input);
      } else {
        this._setItemInvalidState(parent, input);
        flag = false;
      }
      return flag;
    }
  }, {
    key: "_validateCheckbox",
    value: function _validateCheckbox(parent, input) {
      var flag = true;
      if (input.checked) {
        this._setItemValidState(parent, input);
      } else {
        this._setItemInvalidState(parent, input);
        flag = false;
      }
      return flag;
    }
  }, {
    key: "_findSelectedOption",
    value: function _findSelectedOption(options) {
      var flag = false;
      options.forEach(function (option) {
        if (option.value && option.selected) {
          flag = true;
        }
      });
      return flag;
    }
  }, {
    key: "_validateSelect",
    value: function _validateSelect(parent, input) {
      var options = input.querySelectorAll('option');
      var customSelectText = parent.querySelector('.custom-select__text');
      input.setAttribute('aria-invalid', 'false');
      var flag = true;
      if (this._findSelectedOption(options)) {
        this._setItemValidState(parent, input);
      } else {
        this._setItemInvalidState(parent, input);
        parent.classList.remove('not-empty');
        customSelectText.innerHTML = '';
        flag = false;
      }
      return flag;
    }
  }, {
    key: "_returnCheckedElements",
    value: function _returnCheckedElements(inputs) {
      var flag = false;
      inputs.forEach(function (input) {
        if (input.checked) {
          flag = true;
        }
      });
      return flag;
    }
  }, {
    key: "_removeGroupAria",
    value: function _removeGroupAria(inputs) {
      inputs.forEach(function (input) {
        if (!input.checked) {
          input.removeAttribute('aria-required');
          input.removeAttribute('aria-invalid');
        } else {
          input.setAttribute('aria-required', true);
          input.setAttribute('aria-invalid', false);
        }
      });
    }
  }, {
    key: "_setGroupAria",
    value: function _setGroupAria(inputs) {
      inputs.forEach(function (input) {
        input.setAttribute('aria-required', true);
        input.setAttribute('aria-invalid', true);
      });
    }
  }, {
    key: "_validateToggleGroup",
    value: function _validateToggleGroup(parent) {
      var formElements = parent.querySelectorAll('input');
      var flag = true;
      if (this._returnCheckedElements(formElements)) {
        this._removeGroupAria(formElements);
        parent.classList.remove('is-invalid');
        parent.classList.add('is-valid');
        this._message.removeMessage(parent);
      } else {
        this._setGroupAria(formElements);
        parent.classList.remove('is-valid');
        flag = false;
      }
      return flag;
    }
  }, {
    key: "_customExample",
    value: function _customExample(parent, input) {
      var flag = true;
      if (!input.value.length) {
        parent.dataset.messageBase = 'Поле обязательно к заполнению';
        this._setItemInvalidState(parent, input);
        flag = false;
      } else if (input.value.length < input.minLength) {
        parent.dataset.messageBase = "\u041E\u0441\u0442\u0430\u043B\u043E\u0441\u044C \u0432\u0432\u0435\u0441\u0442\u0438 \u0435\u0449\u0451 ".concat(input.minLength - input.value.length, " \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432");
        this._setItemInvalidState(parent, input);
        flag = false;
      } else if (input.value.length > input.minLength) {
        parent.dataset.messageBase = "\u0412\u044B \u0432\u0432\u0435\u043B\u0438 ".concat(input.value.length - input.minLength, " \u043B\u0438\u0448\u043D\u0438\u0445 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432");
        this._setItemInvalidState(parent, input);
        flag = false;
      } else {
        parent.dataset.messageSuccess = 'Поле заполнено корректно';
        this._setItemValidState(parent, input);
        flag = true;
      }
      return flag;
    }
  }, {
    key: "_validateFile",
    value: function _validateFile(parent, input) {
      var flag = true;
      var sizeTest = parent.dataset.maxSize && input.files[0] ? input.files[0].size < +parent.dataset.maxSize : true;
      if (input.value && sizeTest) {
        this._setItemValidState(parent, input);
      } else {
        this._setItemInvalidState(parent, input);
        flag = false;
      }
      return flag;
    }
  }, {
    key: "_validateInput",
    value: function _validateInput(type, parent, input) {
      switch (type) {
        case 'text':
          return this._validateTextInput(parent, input);
        case 'matrix':
          return this._validateMatrixInput(parent, input);
        case 'email':
          return this._validateEmailInput(parent, input);
        case 'phone':
          return this._validatePhoneInput(parent, input);
        case 'checkbox':
          return this._validateCheckbox(parent, input);
        case 'select':
          return this._validateSelect(parent, input);
        case 'toggle-group':
          return this._validateToggleGroup(parent, input);
        case 'file':
          return this._validateFile(parent, input);
        case 'custom-example':
          return this._customExample(parent, input);
        default:
          return false;
      }
    }
  }, {
    key: "validateFormElement",
    value: function validateFormElement(formElement) {
      var fullValidate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var parent = formElement.closest('[data-validate-type]');
      if (!parent) {
        return;
      }
      if (!parent.hasAttribute('data-required')) {
        var removeElement = parent.querySelector('input') || parent.querySelector('select') || parent.querySelector('textarea');
        if (!removeElement.value) {
          parent.classList.remove('is-valid');
          parent.classList.remove('is-invalid');
        }
      }
      var onInputValidate = parent.hasAttribute('data-on-input-validate');
      if (parent.hasAttribute('data-limitation')) {
        this._simpleLimitation(formElement, parent.dataset.limitation);
      }
      if (parent.dataset.validateType === 'matrix') {
        this._matrixLimitation(formElement, parent.dataset.matrix, this._getMatrixLimitationsRegEx(parent.dataset.matrixLimitation));
      }
      var isValid = this._validateInput(parent.dataset.validateType, parent, formElement);
      if (onInputValidate || fullValidate) {
        this._renderMessage(isValid, parent, formElement);
      }
    }
  }, {
    key: "_fullValidate",
    value: function _fullValidate(items) {
      var _this = this;
      var result = true;
      items.forEach(function (item) {
        var formElement = item.querySelector('input') || item.querySelector('select') || item.querySelector('textarea');
        _this.validateFormElement(formElement, true);
        if (item.classList.contains('is-invalid')) {
          result = false;
        }
      });
      return result;
    }
  }, {
    key: "validateForm",
    value: function validateForm(form) {
      var validateItems = form.querySelectorAll('[data-validate-type]');
      var result = this._fullValidate(validateItems);
      return result;
    }
  }]);
  return Validator;
}();

/***/ }),

/***/ "./js/modules/modals/init-modals.js":
/*!******************************************!*\
  !*** ./js/modules/modals/init-modals.js ***!
  \******************************************/
/*! exports provided: modals, initModals */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "modals", function() { return modals; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initModals", function() { return initModals; });
/* harmony import */ var _modals__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modals */ "./js/modules/modals/modals.js");

var modals;

// Здесь реализован пример открытия модалки через колбэк закрытия
// const openModalInCloseCallback = (name, context = this) => {
//   context._enableScrolling = false;
//   context._setSettings('default');
//   modals.open(name);
// };

// closeCallback() {
//   openModalInCloseCallback('modal-5');
// },

var settings = {
  'default': {
    preventDefault: true,
    stopPlay: true,
    lockFocus: true,
    startFocus: true,
    focusBack: true,
    eventTimeout: 400,
    openCallback: false,
    closeCallback: false
  }
};
var initModals = function initModals() {
  var modalElements = document.querySelectorAll('.modal');
  modalElements.forEach(function (el) {
    setTimeout(function () {
      el.classList.remove('modal--preload');
    }, 100);
  });
  modals = new _modals__WEBPACK_IMPORTED_MODULE_0__["Modals"](settings);
  // Используйте в разработке экспортируемую переменную modals, window сделан для бэкэнда
  window.modals = modals;
};


/***/ }),

/***/ "./js/modules/modals/modals.js":
/*!*************************************!*\
  !*** ./js/modules/modals/modals.js ***!
  \*************************************/
/*! exports provided: Modals */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Modals", function() { return Modals; });
/* harmony import */ var _utils_scroll_lock__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/scroll-lock */ "./js/utils/scroll-lock.js");
/* harmony import */ var _utils_focus_lock__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/focus-lock */ "./js/utils/focus-lock.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }


var Modals = /*#__PURE__*/function () {
  function Modals() {
    var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, Modals);
    this._scrollLock = new _utils_scroll_lock__WEBPACK_IMPORTED_MODULE_0__["ScrollLock"]();
    this._focusLock = new _utils_focus_lock__WEBPACK_IMPORTED_MODULE_1__["FocusLock"]();
    this._modalOpenElements = document.querySelectorAll('[data-open-modal]');
    this._openedModalElement = null;
    this._modalName = null;
    this._enableScrolling = true;
    this._settingKey = 'default';
    this._settings = settings;
    this._preventDefault = this._settings[this._settingKey].preventDefault;
    this._stopPlay = this._settings[this._settingKey].stopPlay;
    this._lockFocus = this._settings[this._settingKey].lockFocus;
    this._startFocus = this._settings[this._settingKey].startFocus;
    this._focusBack = this._settings[this._settingKey].focusBack;
    this._eventTimeout = this._settings[this._settingKey].eventTimeout;
    this._openCallback = this._settings[this._settingKey].openCallback;
    this._closeCallback = this._settings[this._settingKey].closeCallback;
    this._documentKeydownHandler = this._documentKeydownHandler.bind(this);
    this._documentClickHandler = this._documentClickHandler.bind(this);
    this._modalClickHandler = this._modalClickHandler.bind(this);
    this._init();
  }
  _createClass(Modals, [{
    key: "_init",
    value: function _init() {
      if (this._modalOpenElements.length) {
        document.addEventListener('click', this._documentClickHandler);
      }
    }
  }, {
    key: "_setSettings",
    value: function _setSettings() {
      var settingKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._settingKey;
      if (!this._settings[settingKey]) {
        return;
      }
      this._preventDefault = typeof this._settings[settingKey].preventDefault === 'boolean' ? this._settings[settingKey].preventDefault : this._settings[this._settingKey].preventDefault;
      this._stopPlay = typeof this._settings[settingKey].stopPlay === 'boolean' ? this._settings[settingKey].stopPlay : this._settings[this._settingKey].stopPlay;
      this._lockFocus = typeof this._settings[settingKey].lockFocus === 'boolean' ? this._settings[settingKey].lockFocus : this._settings[this._settingKey].lockFocus;
      this._startFocus = typeof this._settings[settingKey].startFocus === 'boolean' ? this._settings[settingKey].startFocus : this._settings[this._settingKey].startFocus;
      this._focusBack = typeof this._settings[settingKey].lockFocus === 'boolean' ? this._settings[settingKey].focusBack : this._settings[this._settingKey].focusBack;
      this._eventTimeout = typeof this._settings[settingKey].eventTimeout === 'number' ? this._settings[settingKey].eventTimeout : this._settings[this._settingKey].eventTimeout;
      this._openCallback = this._settings[settingKey].openCallback || this._settings[this._settingKey].openCallback;
      this._closeCallback = this._settings[settingKey].closeCallback || this._settings[this._settingKey].closeCallback;
    }
  }, {
    key: "_documentClickHandler",
    value: function _documentClickHandler(evt) {
      var target = evt.target;
      if (!target.closest('[data-open-modal]')) {
        return;
      }
      evt.preventDefault();
      this._modalName = target.closest('[data-open-modal]').dataset.openModal;
      if (!this._modalName) {
        return;
      }
      this.open();
    }
  }, {
    key: "_documentKeydownHandler",
    value: function _documentKeydownHandler(evt) {
      var isEscKey = evt.key === 'Escape' || evt.key === 'Esc';
      if (isEscKey) {
        evt.preventDefault();
        this.close(document.querySelector('.modal.is-active').dataset.modal);
      }
    }
  }, {
    key: "_modalClickHandler",
    value: function _modalClickHandler(evt) {
      var target = evt.target;
      if (!target.closest('[data-close-modal]')) {
        return;
      }
      this.close(target.closest('[data-modal]').dataset.modal);
    }
  }, {
    key: "_addListeners",
    value: function _addListeners(modal) {
      modal.addEventListener('click', this._modalClickHandler);
      document.addEventListener('keydown', this._documentKeydownHandler);
    }
  }, {
    key: "_removeListeners",
    value: function _removeListeners(modal) {
      modal.removeEventListener('click', this._modalClickHandler);
      document.removeEventListener('keydown', this._documentKeydownHandler);
    }
  }, {
    key: "_stopInteractive",
    value: function _stopInteractive(modal) {
      if (this._stopPlay) {
        modal.querySelectorAll('video, audio').forEach(function (el) {
          return el.pause();
        });
        modal.querySelectorAll('[data-iframe]').forEach(function (el) {
          el.querySelector('iframe').contentWindow.postMessage('{"event": "command", "func": "pauseVideo", "args": ""}', '*');
        });
      }
    }
  }, {
    key: "_autoPlay",
    value: function _autoPlay(modal) {
      modal.querySelectorAll('[data-iframe]').forEach(function (el) {
        var autoPlay = el.closest('[data-auto-play]');
        if (autoPlay) {
          el.querySelector('iframe').contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        }
      });
    }
  }, {
    key: "open",
    value: function open() {
      var _this = this;
      var modalName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._modalName;
      var modal = document.querySelector("[data-modal=\"".concat(modalName, "\"]"));
      if (!modal || modal.classList.contains('is-active')) {
        return;
      }
      document.removeEventListener('click', this._documentClickHandler);
      this._openedModalElement = document.querySelector('.modal.is-active');
      if (this._openedModalElement) {
        this._enableScrolling = false;
        this.close(this._openedModalElement.dataset.modal);
      }
      this._setSettings(modalName);
      modal.classList.add('is-active');
      if (!this._openedModalElement) {
        this._scrollLock.disableScrolling();
      }
      if (this._openCallback) {
        this._openCallback();
      }
      if (this._lockFocus) {
        this._focusLock.lock('.modal.is-active', this._startFocus);
      }
      setTimeout(function () {
        _this._addListeners(modal);
        _this._autoPlay(modal);
        document.addEventListener('click', _this._documentClickHandler);
      }, this._eventTimeout);
    }
  }, {
    key: "close",
    value: function close() {
      var _this2 = this;
      var modalName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._modalName;
      var modal = document.querySelector("[data-modal=\"".concat(modalName, "\"]"));
      document.removeEventListener('click', this._documentClickHandler);
      if (!modal || !modal.classList.contains('is-active')) {
        return;
      }
      if (this._lockFocus) {
        this._focusLock.unlock(this._focusBack);
      }
      modal.classList.remove('is-active');
      this._removeListeners(modal);
      this._stopInteractive(modal);
      if (this._closeCallback) {
        this._closeCallback();
      }
      if (this._enableScrolling) {
        setTimeout(function () {
          _this2._scrollLock.enableScrolling();
        }, this._eventTimeout);
      }
      setTimeout(function () {
        document.addEventListener('click', _this2._documentClickHandler);
      }, this._eventTimeout);
      this._setSettings('default');
      this._enableScrolling = true;
    }
  }]);
  return Modals;
}();

/***/ }),

/***/ "./js/utils/focus-lock.js":
/*!********************************!*\
  !*** ./js/utils/focus-lock.js ***!
  \********************************/
/*! exports provided: FocusLock */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FocusLock", function() { return FocusLock; });
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var SELECTORS = ['a[href]', 'area[href]', 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', 'select:not([disabled]):not([aria-hidden])', 'textarea:not([disabled]):not([aria-hidden])', 'button:not([disabled]):not([aria-hidden])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabindex]:not([tabindex^="-"])'];
var FocusLock = /*#__PURE__*/function () {
  function FocusLock() {
    _classCallCheck(this, FocusLock);
    this._lockedSelector = null;
    this._focusableElements = null;
    this._endElement = null;
    this._selectors = SELECTORS;
    this._documentKeydownHandler = this._documentKeydownHandler.bind(this);
  }
  _createClass(FocusLock, [{
    key: "_documentKeydownHandler",
    value: function _documentKeydownHandler(evt) {
      var activeElement = document.activeElement;
      if (evt.key === 'Tab') {
        if (!this._focusableElements.length) {
          evt.preventDefault();
          activeElement.blur();
          return;
        }
        if (this._focusableElements.length === 1) {
          evt.preventDefault();
          this._focusableElements[0].focus();
          return;
        }
        if (this._focusableElements.length > 1 && !activeElement.closest(this._lockedSelector)) {
          evt.preventDefault();
          this._focusableElements[0].focus();
          return;
        }
      }
      if (evt.key === 'Tab' && !evt.shiftKey && activeElement === this._focusableElements[this._focusableElements.length - 1]) {
        evt.preventDefault();
        this._focusableElements[0].focus();
      }
      if (evt.key === 'Tab' && evt.shiftKey && activeElement === this._focusableElements[0]) {
        evt.preventDefault();
        this._focusableElements[this._focusableElements.length - 1].focus();
      }
    }
  }, {
    key: "lock",
    value: function lock(lockedSelector) {
      var startFocus = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      this.unlock();
      this._lockedSelector = lockedSelector;
      var lockedElement = document.querySelector(this._lockedSelector);
      if (!lockedElement) {
        return;
      }
      this._focusableElements = lockedElement.querySelectorAll(this._selectors);
      this._endElement = document.activeElement;
      var startElement = lockedElement.querySelector('[data-focus]') || this._focusableElements[0];
      if (this._endElement) {
        this._endElement.blur();
      }
      if (startElement && startFocus) {
        setTimeout(function () {
          startElement.focus();
        }, 33);
      }
      document.addEventListener('keydown', this._documentKeydownHandler);
    }
  }, {
    key: "unlock",
    value: function unlock() {
      var returnFocus = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      if (this._endElement && returnFocus) {
        this._endElement.focus();
      }
      this._lockedSelector = null;
      this._focusableElements = null;
      this._endElement = null;
      document.removeEventListener('keydown', this._documentKeydownHandler);
    }
  }]);
  return FocusLock;
}();
window.focusLock = new FocusLock();

/***/ }),

/***/ "./js/utils/ios-checker.js":
/*!*********************************!*\
  !*** ./js/utils/ios-checker.js ***!
  \*********************************/
/*! exports provided: iosChecker */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "iosChecker", function() { return iosChecker; });
var iosChecker = function iosChecker() {
  return ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform)
  // iPad on iOS 13 detection
  || navigator.userAgent.includes('Mac') && 'ontouchend' in document;
};

/***/ }),

/***/ "./js/utils/ios-vh-fix.js":
/*!********************************!*\
  !*** ./js/utils/ios-vh-fix.js ***!
  \********************************/
/*! exports provided: iosVhFix */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "iosVhFix", function() { return iosVhFix; });
/* harmony import */ var _ios_checker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ios-checker */ "./js/utils/ios-checker.js");

var iosVhFix = function iosVhFix() {
  if (!(!!window.MSInputMethodContext && !!document.documentMode)) {
    if (Object(_ios_checker__WEBPACK_IMPORTED_MODULE_0__["iosChecker"])()) {
      var vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', "".concat(vh, "px"));
      window.addEventListener('resize', function () {
        vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', "".concat(vh, "px"));
      });
    }
  }
};


/***/ }),

/***/ "./js/utils/scroll-lock.js":
/*!*********************************!*\
  !*** ./js/utils/scroll-lock.js ***!
  \*********************************/
/*! exports provided: ScrollLock */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ScrollLock", function() { return ScrollLock; });
/* harmony import */ var _ios_checker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ios-checker */ "./js/utils/ios-checker.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }

var ScrollLock = /*#__PURE__*/function () {
  function ScrollLock() {
    _classCallCheck(this, ScrollLock);
    this._iosChecker = _ios_checker__WEBPACK_IMPORTED_MODULE_0__["iosChecker"];
    this._lockClass = this._iosChecker() ? 'scroll-lock-ios' : 'scroll-lock';
    this._scrollTop = null;
    this._fixedBlockElements = document.querySelectorAll('[data-fix-block]');
  }
  _createClass(ScrollLock, [{
    key: "_getScrollbarWidth",
    value: function _getScrollbarWidth() {
      return window.innerWidth - document.documentElement.clientWidth;
    }
  }, {
    key: "_getBodyScrollTop",
    value: function _getBodyScrollTop() {
      return self.pageYOffset || document.documentElement && document.documentElement.ScrollTop || document.body && document.body.scrollTop;
    }
  }, {
    key: "disableScrolling",
    value: function disableScrolling() {
      var _this = this;
      this._scrollTop = document.body.dataset.scroll = document.body.dataset.scroll ? document.body.dataset.scroll : this._getBodyScrollTop();
      if (this._getScrollbarWidth()) {
        document.body.style.paddingRight = "".concat(this._getScrollbarWidth(), "px");
        this._fixedBlockElements.forEach(function (block) {
          block.style.paddingRight = "".concat(_this._getScrollbarWidth(), "px");
        });
      }
      document.body.style.top = "-".concat(this._scrollTop, "px");
      document.body.classList.add(this._lockClass);
    }
  }, {
    key: "enableScrolling",
    value: function enableScrolling() {
      document.body.classList.remove(this._lockClass);
      window.scrollTo(0, +document.body.dataset.scroll);
      document.body.style.paddingRight = null;
      document.body.style.top = null;
      this._fixedBlockElements.forEach(function (block) {
        block.style.paddingRight = null;
      });
      document.body.removeAttribute('data-scroll');
      this._scrollTop = null;
    }
  }]);
  return ScrollLock;
}();
window.scrollLock = new ScrollLock();

/***/ }),

/***/ "./js/vendor/phone-mask.js":
/*!*********************************!*\
  !*** ./js/vendor/phone-mask.js ***!
  \*********************************/
/*! exports provided: initPhoneMask */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initPhoneMask", function() { return initPhoneMask; });
var phoneInputs = document.querySelectorAll('input[type="tel"]');
var COUNTRY_CODE = '+7';
var length = COUNTRY_CODE.length;
var replacePhoneValue = function replacePhoneValue(el) {
  var matrix = "".concat(COUNTRY_CODE, " (___) ___ __ __");
  var def = matrix.replace(/\D/g, '');
  var i = 0;
  var val = el.value.replace(/\D/g, '');
  if (def.length >= val.length) {
    val = def;
  }
  el.value = matrix.replace(/./g, function (a) {
    // eslint-disable-next-line no-nested-ternary
    return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? '' : a;
  });
};
var onInputPhoneInput = function onInputPhoneInput(_ref) {
  var target = _ref.target;
  replacePhoneValue(target);
};
var onFocusPhoneInput = function onFocusPhoneInput(_ref2) {
  var target = _ref2.target;
  if (!target.value) {
    target.value = COUNTRY_CODE;
    target.addEventListener('input', onInputPhoneInput);
    target.addEventListener('blur', onBlurPhoneInput);
    target.addEventListener('keydown', onKeydownPhoneInput);
  }
};
var onKeydownPhoneInput = function onKeydownPhoneInput(e) {
  if (e.target.selectionStart <= length && e.keyCode !== 8 && e.keyCode !== 46) {
    e.target.setSelectionRange(length, length);
  }
  if ((e.target.selectionStart === length || e.target.selectionStart === 1) && e.keyCode === 8) {
    e.preventDefault();
  }
  if (e.target.selectionStart === 1 && e.keyCode === 46) {
    e.preventDefault();
  }
};
var onBlurPhoneInput = function onBlurPhoneInput(_ref3) {
  var target = _ref3.target;
  if (target.value === COUNTRY_CODE) {
    target.value = '';
    target.removeEventListener('input', onInputPhoneInput);
    target.removeEventListener('blur', onBlurPhoneInput);
  }
};
var initPhoneMask = function initPhoneMask() {
  if (phoneInputs.length) {
    phoneInputs.forEach(function (input) {
      input.addEventListener('focus', onFocusPhoneInput);
      if (input.value) {
        replacePhoneValue(input);
        input.addEventListener('input', onInputPhoneInput);
        input.addEventListener('blur', onBlurPhoneInput);
        input.addEventListener('keydown', onKeydownPhoneInput);
      }
    });
  }
};


/***/ })

/******/ });
//# sourceMappingURL=main.min.js.map