"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/nas-logs";
exports.ids = ["pages/api/nas-logs"];
exports.modules = {

/***/ "moment-timezone":
/*!**********************************!*\
  !*** external "moment-timezone" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("moment-timezone");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "(api)/./pages/api/nas-logs.js":
/*!*******************************!*\
  !*** ./pages/api/nas-logs.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fs */ \"fs\");\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var moment_timezone__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! moment-timezone */ \"moment-timezone\");\n/* harmony import */ var moment_timezone__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(moment_timezone__WEBPACK_IMPORTED_MODULE_2__);\n// pages/api/nas-logs.js\n\n\n\nconst naslogDirectory = path__WEBPACK_IMPORTED_MODULE_1___default().join(__dirname, \"../../../n1/logs/all\");\nfunction getTodayLogPattern() {\n    const today = moment_timezone__WEBPACK_IMPORTED_MODULE_2___default()().tz(\"Asia/Seoul\").format(\"YYYYMMDD\");\n    return path__WEBPACK_IMPORTED_MODULE_1___default().join(naslogDirectory, `all-access-${today}.log`);\n}\nfunction handler(req, res) {\n    const logPath = getTodayLogPattern();\n    if (fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(logPath)) {\n        const logContent = fs__WEBPACK_IMPORTED_MODULE_0___default().readFileSync(logPath, \"utf8\");\n        res.status(200).send(logContent);\n    } else {\n        res.status(404).json({\n            message: \"The log file for today does not exist.\"\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvbmFzLWxvZ3MuanMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHdCQUF3QjtBQUNKO0FBQ0k7QUFDYTtBQUVyQyxNQUFNRyxlQUFlLEdBQUdGLGdEQUFTLENBQUNJLFNBQVMsRUFBRSxzQkFBc0IsQ0FBQztBQUVwRSxTQUFTQyxrQkFBa0IsR0FBRztJQUMxQixNQUFNQyxLQUFLLEdBQUdMLHNEQUFNLEVBQUUsQ0FBQ00sRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDQyxNQUFNLENBQUMsVUFBVSxDQUFDO0lBQzFELE9BQU9SLGdEQUFTLENBQUNFLGVBQWUsRUFBRSxDQUFDLFdBQVcsRUFBRUksS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDakUsQ0FBQztBQUVjLFNBQVNHLE9BQU8sQ0FBQ0MsR0FBRyxFQUFFQyxHQUFHLEVBQUU7SUFDdEMsTUFBTUMsT0FBTyxHQUFHUCxrQkFBa0IsRUFBRTtJQUVwQyxJQUFJTixvREFBYSxDQUFDYSxPQUFPLENBQUMsRUFBRTtRQUN4QixNQUFNRSxVQUFVLEdBQUdmLHNEQUFlLENBQUNhLE9BQU8sRUFBRSxNQUFNLENBQUM7UUFDbkRELEdBQUcsQ0FBQ0ssTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDQyxJQUFJLENBQUNILFVBQVUsQ0FBQyxDQUFDO0lBQ3JDLE9BQU87UUFDSEgsR0FBRyxDQUFDSyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUNFLElBQUksQ0FBQztZQUFFQyxPQUFPLEVBQUUsd0NBQXdDO1NBQUUsQ0FBQyxDQUFDO0lBQ2hGLENBQUM7QUFDTCxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcHJvamVjdDAxLy4vcGFnZXMvYXBpL25hcy1sb2dzLmpzPzZiMDciXSwic291cmNlc0NvbnRlbnQiOlsiLy8gcGFnZXMvYXBpL25hcy1sb2dzLmpzXHJcbmltcG9ydCBmcyBmcm9tICdmcyc7XHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudC10aW1lem9uZSc7XHJcblxyXG5jb25zdCBuYXNsb2dEaXJlY3RvcnkgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vLi4vLi4vbjEvbG9ncy9hbGwnKTtcclxuXHJcbmZ1bmN0aW9uIGdldFRvZGF5TG9nUGF0dGVybigpIHtcclxuICAgIGNvbnN0IHRvZGF5ID0gbW9tZW50KCkudHooJ0FzaWEvU2VvdWwnKS5mb3JtYXQoJ1lZWVlNTUREJyk7XHJcbiAgICByZXR1cm4gcGF0aC5qb2luKG5hc2xvZ0RpcmVjdG9yeSwgYGFsbC1hY2Nlc3MtJHt0b2RheX0ubG9nYCk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGhhbmRsZXIocmVxLCByZXMpIHtcclxuICAgIGNvbnN0IGxvZ1BhdGggPSBnZXRUb2RheUxvZ1BhdHRlcm4oKTtcclxuXHJcbiAgICBpZiAoZnMuZXhpc3RzU3luYyhsb2dQYXRoKSkge1xyXG4gICAgICAgIGNvbnN0IGxvZ0NvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMobG9nUGF0aCwgJ3V0ZjgnKTtcclxuICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZChsb2dDb250ZW50KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBtZXNzYWdlOiAnVGhlIGxvZyBmaWxlIGZvciB0b2RheSBkb2VzIG5vdCBleGlzdC4nIH0pO1xyXG4gICAgfVxyXG59XHJcbiJdLCJuYW1lcyI6WyJmcyIsInBhdGgiLCJtb21lbnQiLCJuYXNsb2dEaXJlY3RvcnkiLCJqb2luIiwiX19kaXJuYW1lIiwiZ2V0VG9kYXlMb2dQYXR0ZXJuIiwidG9kYXkiLCJ0eiIsImZvcm1hdCIsImhhbmRsZXIiLCJyZXEiLCJyZXMiLCJsb2dQYXRoIiwiZXhpc3RzU3luYyIsImxvZ0NvbnRlbnQiLCJyZWFkRmlsZVN5bmMiLCJzdGF0dXMiLCJzZW5kIiwianNvbiIsIm1lc3NhZ2UiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(api)/./pages/api/nas-logs.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/nas-logs.js"));
module.exports = __webpack_exports__;

})();