(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["default~main"],{

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("async function getComponent() {\n  const {\n    default: _\n  } = await new Promise(resolve => {\n    __webpack_require__.e(/*! require.ensure */ 0).then((require => {\n      resolve(__webpack_require__(\n      /* webpackChunkName:\"lodash\" */\n      /*! lodash */ \"./node_modules/lodash/lodash.js\"));\n    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);\n  });\n  const element = document.createElement('div');\n  element.innerHTML = _.join(['hello', 'world'], '-');\n  return element;\n}\n\ngetComponent().then(element => {\n  document.body.appendChild(element);\n});\n\n//# sourceURL=webpack:///./index.js?");

/***/ })

}]);