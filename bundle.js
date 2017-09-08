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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function (useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if (item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function (modules, mediaQuery) {
		if (typeof modules === "string") modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for (var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if (typeof id === "number") alreadyImportedModules[id] = true;
		}
		for (i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if (mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if (mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */';
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(20)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction) {
  isProduction = _isProduction

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[data-vue-ssr-id~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// this module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate
    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_router__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__routes_routes_js__ = __webpack_require__(27);

//定义的路由规则


var router = new __WEBPACK_IMPORTED_MODULE_0_vue_router__["a" /* default */]({
	routes: __WEBPACK_IMPORTED_MODULE_1__routes_routes_js__["a" /* default */]
});
/* harmony default export */ __webpack_exports__["a"] = (router);

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(15);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(6)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/_css-loader@0.28.5@css-loader/index.js!../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!./main.scss", function() {
			var newContent = require("!!../node_modules/_css-loader@0.28.5@css-loader/index.js!../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!./main.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_fetch_jsonp__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_fetch_jsonp___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_fetch_jsonp__);


/* harmony default export */ __webpack_exports__["a"] = ({
	zeptoAjax(obj, callback) {
		$.ajax({
			type: "get",
			url: obj.url,
			data: obj.data,
			dataType: obj.dataType,
			success: function (data) {
				callback(data);
			}
		});
	},
	fetch(url, successCallback, failCallBack) {
		fetch(url).then(function (response) {
			return response.json();
		}).then(function (data) {
			//成功的回调
			successCallback(data);
		}).catch(function (e) {
			//失败
			failCallBack(e);
		});
	},
	fetchJsonp(url, successCallback, failCallBack) {
		__WEBPACK_IMPORTED_MODULE_1_fetch_jsonp___default()(url).then(function (response) {
			return response.json();
		}).then(function (data) {
			//成功的回调
			successCallback(data);
		}).catch(function (e) {
			//失败
			failCallBack(e);
		});
	},
	vueJson(url, successCallback, failCallBack) {
		__WEBPACK_IMPORTED_MODULE_0_vue__["a" /* default */].http.get(url).then(function (response) {
			successCallback(response.body);
		}, function (err) {
			failCallBack(err);
		});
	},
	vueJsonp(url, successCallback, failCallBack) {
		__WEBPACK_IMPORTED_MODULE_0_vue__["a" /* default */].http.jsonp(url).then(function (response) {
			successCallback(response.body);
		}, function (err) {
			failCallBack(err);
		});
	},
	vueJsonpOpt(url, opt, successCallback, failCallBack) {
		__WEBPACK_IMPORTED_MODULE_0_vue__["a" /* default */].http.jsonp(url, opt).then(function (response) {
			successCallback(response.body);
		}, function (err) {
			failCallBack(err);
		});
	}
});

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(16);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process, global) {/*!
 * Vue.js v2.4.2
 * (c) 2014-2017 Evan You
 * Released under the MIT License.
 */
/*  */

// these helpers produces better vm code in JS engines due to their
// explicitness and function inlining
function isUndef(v) {
  return v === undefined || v === null;
}

function isDef(v) {
  return v !== undefined && v !== null;
}

function isTrue(v) {
  return v === true;
}

function isFalse(v) {
  return v === false;
}

/**
 * Check if value is primitive
 */
function isPrimitive(value) {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}

var _toString = Object.prototype.toString;

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}

function isRegExp(v) {
  return _toString.call(v) === '[object RegExp]';
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex(val) {
  var n = parseFloat(val);
  return n >= 0 && Math.floor(n) === n && isFinite(val);
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString(val) {
  return val == null ? '' : typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val);
}

/**
 * Convert a input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber(val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n;
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap(str, expectsLowerCase) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? function (val) {
    return map[val.toLowerCase()];
  } : function (val) {
    return map[val];
  };
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if a attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,is');

/**
 * Remove an item from an array
 */
function remove(arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1);
    }
  }
}

/**
 * Check whether the object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

/**
 * Create a cached version of a pure function.
 */
function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) {
    return c ? c.toUpperCase() : '';
  });
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /([^-])([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '$1-$2').replace(hyphenateRE, '$1-$2').toLowerCase();
});

/**
 * Simple bind, faster than native
 */
function bind(fn, ctx) {
  function boundFn(a) {
    var l = arguments.length;
    return l ? l > 1 ? fn.apply(ctx, arguments) : fn.call(ctx, a) : fn.call(ctx);
  }
  // record original fn length
  boundFn._length = fn.length;
  return boundFn;
}

/**
 * Convert an Array-like object to a real Array.
 */
function toArray(list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret;
}

/**
 * Mix properties into target object.
 */
function extend(to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to;
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject(arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res;
}

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/)
 */
function noop(a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) {
  return false;
};

/**
 * Return same value
 */
var identity = function (_) {
  return _;
};

/**
 * Generate a static keys string from compiler modules.
 */
function genStaticKeys(modules) {
  return modules.reduce(function (keys, m) {
    return keys.concat(m.staticKeys || []);
  }, []).join(',');
}

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual(a, b) {
  if (a === b) {
    return true;
  }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i]);
        });
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key]);
        });
      } else {
        /* istanbul ignore next */
        return false;
      }
    } catch (e) {
      /* istanbul ignore next */
      return false;
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b);
  } else {
    return false;
  }
}

function looseIndexOf(arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) {
      return i;
    }
  }
  return -1;
}

/**
 * Ensure a function is called only once.
 */
function once(fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  };
}

var SSR_ATTR = 'data-server-rendered';

var ASSET_TYPES = ['component', 'directive', 'filter'];

var LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed', 'activated', 'deactivated'];

/*  */

var config = {
  /**
   * Option merge strategies (used in core/util/options)
   */
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: process.env.NODE_ENV !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: process.env.NODE_ENV !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
};

/*  */

var emptyObject = Object.freeze({});

/**
 * Check if a string starts with $ or _
 */
function isReserved(str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F;
}

/**
 * Define a property.
 */
function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = /[^\w.$]/;
function parsePath(path) {
  if (bailRE.test(path)) {
    return;
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) {
        return;
      }
      obj = obj[segments[i]];
    }
    return obj;
  };
}

/*  */

var warn = noop;
var tip = noop;
var formatComponentName = null; // work around flow check

if (process.env.NODE_ENV !== 'production') {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) {
    return str.replace(classifyRE, function (c) {
      return c.toUpperCase();
    }).replace(/[-_]/g, '');
  };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && !config.silent) {
      console.error("[Vue warn]: " + msg + trace);
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && !config.silent) {
      console.warn("[Vue tip]: " + msg + (vm ? generateComponentTrace(vm) : ''));
    }
  };

  formatComponentName = function (vm, includeFile) {
    if (vm.$root === vm) {
      return '<Root>';
    }
    var name = typeof vm === 'string' ? vm : typeof vm === 'function' && vm.options ? vm.options.name : vm._isVue ? vm.$options.name || vm.$options._componentTag : vm.name;

    var file = vm._isVue && vm.$options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (name ? "<" + classify(name) + ">" : "<Anonymous>") + (file && includeFile !== false ? " at " + file : '');
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) {
        res += str;
      }
      if (n > 1) {
        str += str;
      }
      n >>= 1;
    }
    return res;
  };

  var generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue;
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree.map(function (vm, i) {
        return "" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm) ? formatComponentName(vm[0]) + "... (" + vm[1] + " recursive calls)" : formatComponentName(vm));
      }).join('\n');
    } else {
      return "\n\n(found in " + formatComponentName(vm) + ")";
    }
  };
}

/*  */

function handleError(err, vm, info) {
  if (config.errorHandler) {
    config.errorHandler.call(null, err, vm, info);
  } else {
    if (process.env.NODE_ENV !== 'production') {
      warn("Error in " + info + ": \"" + err.toString() + "\"", vm);
    }
    /* istanbul ignore else */
    if (inBrowser && typeof console !== 'undefined') {
      console.error(err);
    } else {
      throw err;
    }
  }
}

/*  */
/* globals MutationObserver */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = UA && UA.indexOf('android') > 0;
var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

// Firefix has a "watch" function on Object.prototype...
var nativeWatch = {}.watch;

var supportsPassive = false;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', {
      get: function get() {
        /* istanbul ignore next */
        supportsPassive = true;
      }
    }); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer;
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative(Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString());
}

var hasSymbol = typeof Symbol !== 'undefined' && isNative(Symbol) && typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

/**
 * Defer a task to execute it asynchronously.
 */
var nextTick = function () {
  var callbacks = [];
  var pending = false;
  var timerFunc;

  function nextTickHandler() {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks.length = 0;
    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }

  // the nextTick behavior leverages the microtask queue, which can be accessed
  // via either native Promise.then or MutationObserver.
  // MutationObserver has wider support, however it is seriously bugged in
  // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
  // completely stops working after triggering a few times... so, if native
  // Promise is available, we will use it:
  /* istanbul ignore if */
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
    var p = Promise.resolve();
    var logError = function (err) {
      console.error(err);
    };
    timerFunc = function () {
      p.then(nextTickHandler).catch(logError);
      // in problematic UIWebViews, Promise.then doesn't completely break, but
      // it can get stuck in a weird state where callbacks are pushed into the
      // microtask queue but the queue isn't being flushed, until the browser
      // needs to do some other work, e.g. handle a timer. Therefore we can
      // "force" the microtask queue to be flushed by adding an empty timer.
      if (isIOS) {
        setTimeout(noop);
      }
    };
  } else if (typeof MutationObserver !== 'undefined' && (isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]')) {
    // use MutationObserver where native Promise is not available,
    // e.g. PhantomJS IE11, iOS7, Android 4.4
    var counter = 1;
    var observer = new MutationObserver(nextTickHandler);
    var textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
      characterData: true
    });
    timerFunc = function () {
      counter = (counter + 1) % 2;
      textNode.data = String(counter);
    };
  } else {
    // fallback to setTimeout
    /* istanbul ignore next */
    timerFunc = function () {
      setTimeout(nextTickHandler, 0);
    };
  }

  return function queueNextTick(cb, ctx) {
    var _resolve;
    callbacks.push(function () {
      if (cb) {
        try {
          cb.call(ctx);
        } catch (e) {
          handleError(e, ctx, 'nextTick');
        }
      } else if (_resolve) {
        _resolve(ctx);
      }
    });
    if (!pending) {
      pending = true;
      timerFunc();
    }
    if (!cb && typeof Promise !== 'undefined') {
      return new Promise(function (resolve, reject) {
        _resolve = resolve;
      });
    }
  };
}();

var _Set;
/* istanbul ignore if */
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = function () {
    function Set() {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has(key) {
      return this.set[key] === true;
    };
    Set.prototype.add = function add(key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear() {
      this.set = Object.create(null);
    };

    return Set;
  }();
}

/*  */

var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep() {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub(sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub(sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend() {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify() {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null;
var targetStack = [];

function pushTarget(_target) {
  if (Dep.target) {
    targetStack.push(Dep.target);
  }
  Dep.target = _target;
}

function popTarget() {
  Dep.target = targetStack.pop();
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator() {
    var args = [],
        len = arguments.length;
    while (len--) args[len] = arguments[len];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2);
        break;
    }
    if (inserted) {
      ob.observeArray(inserted);
    }
    // notify change
    ob.dep.notify();
    return result;
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * By default, when a reactive property is set, the new value is
 * also converted to become reactive. However when passing down props,
 * we don't want to force conversion because the value may be a nested value
 * under a frozen data structure. Converting it would defeat the optimization.
 */
var observerState = {
  shouldConvert: true
};

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 */
var Observer = function Observer(value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    var augment = hasProto ? protoAugment : copyAugment;
    augment(value, arrayMethods, arrayKeys);
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk(obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i], obj[keys[i]]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray(items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment(target, src, keys) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment(target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe(value, asRootData) {
  if (!isObject(value)) {
    return;
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (observerState.shouldConvert && !isServerRendering() && (Array.isArray(value) || isPlainObject(value)) && Object.isExtensible(value) && !value._isVue) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob;
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1(obj, key, val, customSetter, shallow) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return;
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
        }
        if (Array.isArray(value)) {
          dependArray(value);
        }
      }
      return value;
    },
    set: function reactiveSetter(newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || newVal !== newVal && value !== value) {
        return;
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter();
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set(target, key, val) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val;
  }
  if (hasOwn(target, key)) {
    target[key] = val;
    return val;
  }
  var ob = target.__ob__;
  if (target._isVue || ob && ob.vmCount) {
    process.env.NODE_ENV !== 'production' && warn('Avoid adding reactive properties to a Vue instance or its root $data ' + 'at runtime - declare it upfront in the data option.');
    return val;
  }
  if (!ob) {
    target[key] = val;
    return val;
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val;
}

/**
 * Delete a property and trigger change if necessary.
 */
function del(target, key) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return;
  }
  var ob = target.__ob__;
  if (target._isVue || ob && ob.vmCount) {
    process.env.NODE_ENV !== 'production' && warn('Avoid deleting properties on a Vue instance or its root $data ' + '- just set it to null.');
    return;
  }
  if (!hasOwn(target, key)) {
    return;
  }
  delete target[key];
  if (!ob) {
    return;
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray(value) {
  for (var e = void 0, i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (process.env.NODE_ENV !== 'production') {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn("option \"" + key + "\" can only be used during instance " + 'creation with the `new` keyword.');
    }
    return defaultStrat(parent, child);
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData(to, from) {
  if (!from) {
    return to;
  }
  var key, toVal, fromVal;
  var keys = Object.keys(from);
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
      mergeData(toVal, fromVal);
    }
  }
  return to;
}

/**
 * Data
 */
function mergeDataOrFn(parentVal, childVal, vm) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal;
    }
    if (!parentVal) {
      return childVal;
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn() {
      return mergeData(typeof childVal === 'function' ? childVal.call(this) : childVal, typeof parentVal === 'function' ? parentVal.call(this) : parentVal);
    };
  } else if (parentVal || childVal) {
    return function mergedInstanceDataFn() {
      // instance merge
      var instanceData = typeof childVal === 'function' ? childVal.call(vm) : childVal;
      var defaultData = typeof parentVal === 'function' ? parentVal.call(vm) : undefined;
      if (instanceData) {
        return mergeData(instanceData, defaultData);
      } else {
        return defaultData;
      }
    };
  }
}

strats.data = function (parentVal, childVal, vm) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      process.env.NODE_ENV !== 'production' && warn('The "data" option should be a function ' + 'that returns a per-instance value in component ' + 'definitions.', vm);

      return parentVal;
    }
    return mergeDataOrFn.call(this, parentVal, childVal);
  }

  return mergeDataOrFn(parentVal, childVal, vm);
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook(parentVal, childVal) {
  return childVal ? parentVal ? parentVal.concat(childVal) : Array.isArray(childVal) ? childVal : [childVal] : parentVal;
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets(parentVal, childVal) {
  var res = Object.create(parentVal || null);
  return childVal ? extend(res, childVal) : res;
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (parentVal, childVal) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) {
    parentVal = undefined;
  }
  if (childVal === nativeWatch) {
    childVal = undefined;
  }
  /* istanbul ignore if */
  if (!childVal) {
    return Object.create(parentVal || null);
  }
  if (!parentVal) {
    return childVal;
  }
  var ret = {};
  extend(ret, parentVal);
  for (var key in childVal) {
    var parent = ret[key];
    var child = childVal[key];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key] = parent ? parent.concat(child) : Array.isArray(child) ? child : [child];
  }
  return ret;
};

/**
 * Other object hashes.
 */
strats.props = strats.methods = strats.inject = strats.computed = function (parentVal, childVal) {
  if (!parentVal) {
    return childVal;
  }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) {
    extend(ret, childVal);
  }
  return ret;
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined ? parentVal : childVal;
};

/**
 * Validate component names
 */
function checkComponents(options) {
  for (var key in options.components) {
    var lower = key.toLowerCase();
    if (isBuiltInTag(lower) || config.isReservedTag(lower)) {
      warn('Do not use built-in or reserved HTML elements as component ' + 'id: ' + key);
    }
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps(options) {
  var props = options.props;
  if (!props) {
    return;
  }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (process.env.NODE_ENV !== 'production') {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val) ? val : { type: val };
    }
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject(options) {
  var inject = options.inject;
  if (Array.isArray(inject)) {
    var normalized = options.inject = {};
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = inject[i];
    }
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives(options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def = dirs[key];
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def };
      }
    }
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions(parent, child, vm) {
  if (process.env.NODE_ENV !== 'production') {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child);
  normalizeInject(child);
  normalizeDirectives(child);
  var extendsFrom = child.extends;
  if (extendsFrom) {
    parent = mergeOptions(parent, extendsFrom, vm);
  }
  if (child.mixins) {
    for (var i = 0, l = child.mixins.length; i < l; i++) {
      parent = mergeOptions(parent, child.mixins[i], vm);
    }
  }
  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField(key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options;
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset(options, type, id, warnMissing) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return;
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) {
    return assets[id];
  }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) {
    return assets[camelizedId];
  }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) {
    return assets[PascalCaseId];
  }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if (process.env.NODE_ENV !== 'production' && warnMissing && !res) {
    warn('Failed to resolve ' + type.slice(0, -1) + ': ' + id, options);
  }
  return res;
}

/*  */

function validateProp(key, propOptions, propsData, vm) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // handle boolean props
  if (isType(Boolean, prop.type)) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (!isType(String, prop.type) && (value === '' || value === hyphenate(key))) {
      value = true;
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldConvert = observerState.shouldConvert;
    observerState.shouldConvert = true;
    observe(value);
    observerState.shouldConvert = prevShouldConvert;
  }
  if (process.env.NODE_ENV !== 'production') {
    assertProp(prop, key, value, vm, absent);
  }
  return value;
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue(vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined;
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if (process.env.NODE_ENV !== 'production' && isObject(def)) {
    warn('Invalid default value for prop "' + key + '": ' + 'Props with type Object/Array must use a factory function ' + 'to return the default value.', vm);
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData && vm.$options.propsData[key] === undefined && vm._props[key] !== undefined) {
    return vm._props[key];
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function' ? def.call(vm) : def;
}

/**
 * Assert whether a prop is valid.
 */
function assertProp(prop, name, value, vm, absent) {
  if (prop.required && absent) {
    warn('Missing required prop: "' + name + '"', vm);
    return;
  }
  if (value == null && !prop.required) {
    return;
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }
  if (!valid) {
    warn('Invalid prop: type check failed for prop "' + name + '".' + ' Expected ' + expectedTypes.map(capitalize).join(', ') + ', got ' + Object.prototype.toString.call(value).slice(8, -1) + '.', vm);
    return;
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn('Invalid prop: custom validator check failed for prop "' + name + '".', vm);
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType(value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    valid = typeof value === expectedType.toLowerCase();
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  };
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType(fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : '';
}

function isType(type, fn) {
  if (!Array.isArray(fn)) {
    return getType(fn) === getType(type);
  }
  for (var i = 0, len = fn.length; i < len; i++) {
    if (getType(fn[i]) === getType(type)) {
      return true;
    }
  }
  /* istanbul ignore next */
  return false;
}

/*  */

var mark;
var measure;

if (process.env.NODE_ENV !== 'production') {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (perf && perf.mark && perf.measure && perf.clearMarks && perf.clearMeasures) {
    mark = function (tag) {
      return perf.mark(tag);
    };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      perf.clearMeasures(name);
    };
  }
}

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (process.env.NODE_ENV !== 'production') {
  var allowedGlobals = makeMap('Infinity,undefined,NaN,isFinite,isNaN,' + 'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' + 'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' + 'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn("Property or method \"" + key + "\" is not defined on the instance but " + "referenced during render. Make sure to declare reactive data " + "properties in the data option.", target);
  };

  var hasProxy = typeof Proxy !== 'undefined' && Proxy.toString().match(/native code/);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set(target, key, value) {
        if (isBuiltInModifier(key)) {
          warn("Avoid overwriting built-in modifier in config.keyCodes: ." + key);
          return false;
        } else {
          target[key] = value;
          return true;
        }
      }
    });
  }

  var hasHandler = {
    has: function has(target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) || key.charAt(0) === '_';
      if (!has && !isAllowed) {
        warnNonPresent(target, key);
      }
      return has || !isAllowed;
    }
  };

  var getHandler = {
    get: function get(target, key) {
      if (typeof key === 'string' && !(key in target)) {
        warnNonPresent(target, key);
      }
      return target[key];
    }
  };

  initProxy = function initProxy(vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped ? getHandler : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var VNode = function VNode(tag, data, children, text, elm, context, componentOptions, asyncFactory) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.functionalContext = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: {} };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance;
};

Object.defineProperties(VNode.prototype, prototypeAccessors);

var createEmptyVNode = function (text) {
  if (text === void 0) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node;
};

function createTextVNode(val) {
  return new VNode(undefined, undefined, undefined, String(val));
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode(vnode) {
  var cloned = new VNode(vnode.tag, vnode.data, vnode.children, vnode.text, vnode.elm, vnode.context, vnode.componentOptions, vnode.asyncFactory);
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.isCloned = true;
  return cloned;
}

function cloneVNodes(vnodes) {
  var len = vnodes.length;
  var res = new Array(len);
  for (var i = 0; i < len; i++) {
    res[i] = cloneVNode(vnodes[i]);
  }
  return res;
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  };
});

function createFnInvoker(fns) {
  function invoker() {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        cloned[i].apply(null, arguments$1);
      }
    } else {
      // return handler return value for single handlers
      return fns.apply(null, arguments);
    }
  }
  invoker.fns = fns;
  return invoker;
}

function updateListeners(on, oldOn, add, remove$$1, vm) {
  var name, cur, old, event;
  for (name in on) {
    cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
      process.env.NODE_ENV !== 'production' && warn("Invalid handler for event \"" + event.name + "\": got " + String(cur), vm);
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur);
      }
      add(event.name, cur, event.once, event.capture, event.passive);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

function mergeVNodeHook(def, hookKey, hook) {
  var invoker;
  var oldHook = def[hookKey];

  function wrappedHook() {
    hook.apply(this, arguments);
    // important: remove merged hook to ensure it's called only once
    // and prevent memory leak
    remove(invoker.fns, wrappedHook);
  }

  if (isUndef(oldHook)) {
    // no existing hook
    invoker = createFnInvoker([wrappedHook]);
  } else {
    /* istanbul ignore if */
    if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
      // already a merged invoker
      invoker = oldHook;
      invoker.fns.push(wrappedHook);
    } else {
      // existing plain hook
      invoker = createFnInvoker([oldHook, wrappedHook]);
    }
  }

  invoker.merged = true;
  def[hookKey] = invoker;
}

/*  */

function extractPropsFromVNodeData(data, Ctor, tag) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    return;
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (process.env.NODE_ENV !== 'production') {
        var keyInLowerCase = key.toLowerCase();
        if (key !== keyInLowerCase && attrs && hasOwn(attrs, keyInLowerCase)) {
          tip("Prop \"" + keyInLowerCase + "\" is passed to component " + formatComponentName(tag || Ctor) + ", but the declared prop name is" + " \"" + key + "\". " + "Note that HTML attributes are case-insensitive and camelCased " + "props need to use their kebab-case equivalents when using in-DOM " + "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\".");
        }
      }
      checkProp(res, props, key, altKey, true) || checkProp(res, attrs, key, altKey, false);
    }
  }
  return res;
}

function checkProp(res, hash, key, altKey, preserve) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true;
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true;
    }
  }
  return false;
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren(children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children);
    }
  }
  return children;
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren(children) {
  return isPrimitive(children) ? [createTextVNode(children)] : Array.isArray(children) ? normalizeArrayChildren(children) : undefined;
}

function isTextNode(node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment);
}

function normalizeArrayChildren(children, nestedIndex) {
  var res = [];
  var i, c, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') {
      continue;
    }
    last = res[res.length - 1];
    //  nested
    if (Array.isArray(c)) {
      res.push.apply(res, normalizeArrayChildren(c, (nestedIndex || '') + "_" + i));
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        last.text += String(c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[res.length - 1] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) && isDef(c.tag) && isUndef(c.key) && isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res;
}

/*  */

function ensureCtor(comp, base) {
  if (comp.__esModule && comp.default) {
    comp = comp.default;
  }
  return isObject(comp) ? base.extend(comp) : comp;
}

function createAsyncPlaceholder(factory, data, context, children, tag) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node;
}

function resolveAsyncComponent(factory, baseCtor, context) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp;
  }

  if (isDef(factory.resolved)) {
    return factory.resolved;
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp;
  }

  if (isDef(factory.contexts)) {
    // already pending
    factory.contexts.push(context);
  } else {
    var contexts = factory.contexts = [context];
    var sync = true;

    var forceRender = function () {
      for (var i = 0, l = contexts.length; i < l; i++) {
        contexts[i].$forceUpdate();
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender();
      }
    });

    var reject = once(function (reason) {
      process.env.NODE_ENV !== 'production' && warn("Failed to resolve async component: " + String(factory) + (reason ? "\nReason: " + reason : ''));
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender();
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (typeof res.then === 'function') {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isDef(res.component) && typeof res.component.then === 'function') {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            setTimeout(function () {
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender();
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          setTimeout(function () {
            if (isUndef(factory.resolved)) {
              reject(process.env.NODE_ENV !== 'production' ? "timeout (" + res.timeout + "ms)" : null);
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading ? factory.loadingComp : factory.resolved;
  }
}

/*  */

function getFirstComponentChild(children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && isDef(c.componentOptions)) {
        return c;
      }
    }
  }
}

/*  */

/*  */

function initEvents(vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add(event, fn, once$$1) {
  if (once$$1) {
    target.$once(event, fn);
  } else {
    target.$on(event, fn);
  }
}

function remove$1(event, fn) {
  target.$off(event, fn);
}

function updateComponentListeners(vm, listeners, oldListeners) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, vm);
}

function eventsMixin(Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var this$1 = this;

    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm;
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on() {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm;
  };

  Vue.prototype.$off = function (event, fn) {
    var this$1 = this;

    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm;
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        this$1.$off(event[i$1], fn);
      }
      return vm;
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm;
    }
    if (arguments.length === 1) {
      vm._events[event] = null;
      return vm;
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break;
      }
    }
    return vm;
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (process.env.NODE_ENV !== 'production') {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip("Event \"" + lowerCaseEvent + "\" is emitted in component " + formatComponentName(vm) + " but the handler is registered for \"" + event + "\". " + "Note that HTML attributes are case-insensitive and you cannot use " + "v-on to listen to camelCase events when using in-DOM templates. " + "You should probably use \"" + hyphenate(event) + "\" instead of \"" + event + "\".");
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      for (var i = 0, l = cbs.length; i < l; i++) {
        try {
          cbs[i].apply(vm, args);
        } catch (e) {
          handleError(e, vm, "event handler for \"" + event + "\"");
        }
      }
    }
    return vm;
  };
}

/*  */

/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots(children, context) {
  var slots = {};
  if (!children) {
    return slots;
  }
  var defaultSlot = [];
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.functionalContext === context) && child.data && child.data.slot != null) {
      var name = child.data.slot;
      var slot = slots[name] || (slots[name] = []);
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children);
      } else {
        slot.push(child);
      }
    } else {
      defaultSlot.push(child);
    }
  }
  // ignore whitespace
  if (!defaultSlot.every(isWhitespace)) {
    slots.default = defaultSlot;
  }
  return slots;
}

function isWhitespace(node) {
  return node.isComment || node.text === ' ';
}

function resolveScopedSlots(fns, // see flow/vnode
res) {
  res = res || {};
  for (var i = 0; i < fns.length; i++) {
    if (Array.isArray(fns[i])) {
      resolveScopedSlots(fns[i], res);
    } else {
      res[fns[i].key] = fns[i].fn;
    }
  }
  return res;
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function initLifecycle(vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate');
    }
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var prevActiveInstance = activeInstance;
    activeInstance = vm;
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */
      , vm.$options._parentElm, vm.$options._refElm);
      // no need for the ref nodes after initial patch
      // this prevents keeping a detached DOM tree in memory (#5851)
      vm.$options._parentElm = vm.$options._refElm = null;
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    activeInstance = prevActiveInstance;
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return;
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
  };
}

function mountComponent(vm, el, hydrating) {
  vm.$el = el;
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;
    if (process.env.NODE_ENV !== 'production') {
      /* istanbul ignore if */
      if (vm.$options.template && vm.$options.template.charAt(0) !== '#' || vm.$options.el || el) {
        warn('You are using the runtime-only build of Vue where the template ' + 'compiler is not available. Either pre-compile the templates into ' + 'render functions, or use the compiler-included build.', vm);
      } else {
        warn('Failed to mount component: template or render function not defined.', vm);
      }
    }
  }
  callHook(vm, 'beforeMount');

  var updateComponent;
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    updateComponent = function () {
      var name = vm._name;
      var id = vm._uid;
      var startTag = "vue-perf-start:" + id;
      var endTag = "vue-perf-end:" + id;

      mark(startTag);
      var vnode = vm._render();
      mark(endTag);
      measure(name + " render", startTag, endTag);

      mark(startTag);
      vm._update(vnode, hydrating);
      mark(endTag);
      measure(name + " patch", startTag, endTag);
    };
  } else {
    updateComponent = function () {
      vm._update(vm._render(), hydrating);
    };
  }

  vm._watcher = new Watcher(vm, updateComponent, noop);
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }
  return vm;
}

function updateChildComponent(vm, propsData, listeners, parentVnode, renderChildren) {
  if (process.env.NODE_ENV !== 'production') {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren
  var hasChildren = !!(renderChildren || // has new static slots
  vm.$options._renderChildren || // has old static slots
  parentVnode.data.scopedSlots || // has new scoped slots
  vm.$scopedSlots !== emptyObject // has old scoped slots
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) {
    // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listensers hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data && parentVnode.data.attrs;
  vm.$listeners = listeners;

  // update props
  if (propsData && vm.$options.props) {
    observerState.shouldConvert = false;
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      props[key] = validateProp(key, vm.$options.props, propsData, vm);
    }
    observerState.shouldConvert = true;
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }

  // update listeners
  if (listeners) {
    var oldListeners = vm.$options._parentListeners;
    vm.$options._parentListeners = listeners;
    updateComponentListeners(vm, listeners, oldListeners);
  }
  // resolve slots + force update if has children
  if (hasChildren) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (process.env.NODE_ENV !== 'production') {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree(vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) {
      return true;
    }
  }
  return false;
}

function activateChildComponent(vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return;
    }
  } else if (vm._directInactive) {
    return;
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent(vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return;
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook(vm, hook) {
  var handlers = vm.$options[hook];
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      try {
        handlers[i].call(vm);
      } catch (e) {
        handleError(e, vm, hook + " hook");
      }
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
}

/*  */

var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState() {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (process.env.NODE_ENV !== 'production') {
    circular = {};
  }
  waiting = flushing = false;
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue() {
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) {
    return a.id - b.id;
  });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if (process.env.NODE_ENV !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn('You may have an infinite update loop ' + (watcher.user ? "in watcher with expression \"" + watcher.expression + "\"" : "in a component render function."), watcher.vm);
        break;
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks(queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent(vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks(queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher(watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */

var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher(vm, expOrFn, cb, options) {
  this.vm = vm;
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression = process.env.NODE_ENV !== 'production' ? expOrFn.toString() : '';
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = function () {};
      process.env.NODE_ENV !== 'production' && warn("Failed watching path: \"" + expOrFn + "\" " + 'Watcher only accepts simple dot-delimited paths. ' + 'For full control, use a function instead.', vm);
    }
  }
  this.value = this.lazy ? undefined : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get() {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, "getter for watcher \"" + this.expression + "\"");
    } else {
      throw e;
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value;
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep(dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps() {
  var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    var dep = this$1.deps[i];
    if (!this$1.newDepIds.has(dep.id)) {
      dep.removeSub(this$1);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update() {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run() {
  if (this.active) {
    var value = this.get();
    if (value !== this.value ||
    // Deep watchers and watchers on Object/Arrays should fire even
    // when the value is the same, because the value may
    // have mutated.
    isObject(value) || this.deep) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, "callback for watcher \"" + this.expression + "\"");
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate() {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend() {
  var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    this$1.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown() {
  var this$1 = this;

  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this$1.deps[i].removeSub(this$1);
    }
    this.active = false;
  }
};

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
var seenObjects = new _Set();
function traverse(val) {
  seenObjects.clear();
  _traverse(val, seenObjects);
}

function _traverse(val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if (!isA && !isObject(val) || !Object.isExtensible(val)) {
    return;
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return;
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) {
      _traverse(val[i], seen);
    }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) {
      _traverse(val[keys[i]], seen);
    }
  }
}

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy(target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter() {
    return this[sourceKey][key];
  };
  sharedPropertyDefinition.set = function proxySetter(val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState(vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) {
    initProps(vm, opts.props);
  }
  if (opts.methods) {
    initMethods(vm, opts.methods);
  }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) {
    initComputed(vm, opts.computed);
  }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function checkOptionType(vm, name) {
  var option = vm.$options[name];
  if (!isPlainObject(option)) {
    warn("component option \"" + name + "\" should be an object.", vm);
  }
}

function initProps(vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  observerState.shouldConvert = isRoot;
  var loop = function (key) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      if (isReservedAttribute(key) || config.isReservedAttr(key)) {
        warn("\"" + key + "\" is a reserved attribute and cannot be used as component prop.", vm);
      }
      defineReactive$$1(props, key, value, function () {
        if (vm.$parent && !isUpdatingChildComponent) {
          warn("Avoid mutating a prop directly since the value will be " + "overwritten whenever the parent component re-renders. " + "Instead, use a data or computed property based on the prop's " + "value. Prop being mutated: \"" + key + "\"", vm);
        }
      });
    } else {
      defineReactive$$1(props, key, value);
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop(key);
  observerState.shouldConvert = true;
}

function initData(vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function' ? getData(data, vm) : data || {};
  if (!isPlainObject(data)) {
    data = {};
    process.env.NODE_ENV !== 'production' && warn('data functions should return an object:\n' + 'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function', vm);
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (process.env.NODE_ENV !== 'production') {
      if (methods && hasOwn(methods, key)) {
        warn("method \"" + key + "\" has already been defined as a data property.", vm);
      }
    }
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== 'production' && warn("The data property \"" + key + "\" is already declared as a prop. " + "Use prop default value instead.", vm);
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData(data, vm) {
  try {
    return data.call(vm);
  } catch (e) {
    handleError(e, vm, "data()");
    return {};
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed(vm, computed) {
  process.env.NODE_ENV !== 'production' && checkOptionType(vm, 'computed');
  var watchers = vm._computedWatchers = Object.create(null);

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if (process.env.NODE_ENV !== 'production' && getter == null) {
      warn("Getter is missing for computed property \"" + key + "\".", vm);
    }
    // create internal watcher for the computed property.
    watchers[key] = new Watcher(vm, getter || noop, noop, computedWatcherOptions);

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (process.env.NODE_ENV !== 'production') {
      if (key in vm.$data) {
        warn("The computed property \"" + key + "\" is already defined in data.", vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn("The computed property \"" + key + "\" is already defined as a prop.", vm);
      }
    }
  }
}

function defineComputed(target, key, userDef) {
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = createComputedGetter(key);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get ? userDef.cache !== false ? createComputedGetter(key) : userDef.get : noop;
    sharedPropertyDefinition.set = userDef.set ? userDef.set : noop;
  }
  if (process.env.NODE_ENV !== 'production' && sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn("Computed property \"" + key + "\" was assigned to but it has no setter.", this);
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter(key) {
  return function computedGetter() {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value;
    }
  };
}

function initMethods(vm, methods) {
  process.env.NODE_ENV !== 'production' && checkOptionType(vm, 'methods');
  var props = vm.$options.props;
  for (var key in methods) {
    vm[key] = methods[key] == null ? noop : bind(methods[key], vm);
    if (process.env.NODE_ENV !== 'production') {
      if (methods[key] == null) {
        warn("method \"" + key + "\" has an undefined value in the component definition. " + "Did you reference the function correctly?", vm);
      }
      if (props && hasOwn(props, key)) {
        warn("method \"" + key + "\" has already been defined as a prop.", vm);
      }
    }
  }
}

function initWatch(vm, watch) {
  process.env.NODE_ENV !== 'production' && checkOptionType(vm, 'watch');
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher(vm, keyOrFn, handler, options) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(keyOrFn, handler, options);
}

function stateMixin(Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () {
    return this._data;
  };
  var propsDef = {};
  propsDef.get = function () {
    return this._props;
  };
  if (process.env.NODE_ENV !== 'production') {
    dataDef.set = function (newData) {
      warn('Avoid replacing instance root $data. ' + 'Use nested data properties instead.', this);
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (expOrFn, cb, options) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options);
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      cb.call(vm, watcher.value);
    }
    return function unwatchFn() {
      watcher.teardown();
    };
  };
}

/*  */

function initProvide(vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function' ? provide.call(vm) : provide;
  }
}

function initInjections(vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    observerState.shouldConvert = false;
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production') {
        defineReactive$$1(vm, key, result[key], function () {
          warn("Avoid mutating an injected value directly since the changes will be " + "overwritten whenever the provided component re-renders. " + "injection being mutated: \"" + key + "\"", vm);
        });
      } else {
        defineReactive$$1(vm, key, result[key]);
      }
    });
    observerState.shouldConvert = true;
  }
}

function resolveInject(inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol ? Reflect.ownKeys(inject) : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var provideKey = inject[key];
      var source = vm;
      while (source) {
        if (source._provided && provideKey in source._provided) {
          result[key] = source._provided[provideKey];
          break;
        }
        source = source.$parent;
      }
      if (process.env.NODE_ENV !== 'production' && !source) {
        warn("Injection \"" + key + "\" not found", vm);
      }
    }
    return result;
  }
}

/*  */

function createFunctionalComponent(Ctor, propsData, data, context, children) {
  var props = {};
  var propOptions = Ctor.options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || {});
    }
  } else {
    if (isDef(data.attrs)) {
      mergeProps(props, data.attrs);
    }
    if (isDef(data.props)) {
      mergeProps(props, data.props);
    }
  }
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var _context = Object.create(context);
  var h = function (a, b, c, d) {
    return createElement(_context, a, b, c, d, true);
  };
  var vnode = Ctor.options.render.call(null, h, {
    data: data,
    props: props,
    children: children,
    parent: context,
    listeners: data.on || {},
    injections: resolveInject(Ctor.options.inject, context),
    slots: function () {
      return resolveSlots(children, context);
    }
  });
  if (vnode instanceof VNode) {
    vnode.functionalContext = context;
    vnode.functionalOptions = Ctor.options;
    if (data.slot) {
      (vnode.data || (vnode.data = {})).slot = data.slot;
    }
  }
  return vnode;
}

function mergeProps(to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

// hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init(vnode, hydrating, parentElm, refElm) {
    if (!vnode.componentInstance || vnode.componentInstance._isDestroyed) {
      var child = vnode.componentInstance = createComponentInstanceForVnode(vnode, activeInstance, parentElm, refElm);
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    } else if (vnode.data.keepAlive) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    }
  },

  prepatch: function prepatch(oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(child, options.propsData, // updated props
    options.listeners, // updated listeners
    vnode, // new parent vnode
    options.children // new children
    );
  },

  insert: function insert(vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy(vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent(Ctor, data, context, children, tag) {
  if (isUndef(Ctor)) {
    return;
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (process.env.NODE_ENV !== 'production') {
      warn("Invalid Component definition: " + String(Ctor), context);
    }
    return;
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(asyncFactory, data, context, children, tag);
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children);
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // merge component management hooks onto the placeholder node
  mergeHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode("vue-component-" + Ctor.cid + (name ? "-" + name : ''), data, undefined, undefined, undefined, context, { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children }, asyncFactory);
  return vnode;
}

function createComponentInstanceForVnode(vnode, // we know it's MountedComponentVNode but flow doesn't
parent, // activeInstance in lifecycle state
parentElm, refElm) {
  var vnodeComponentOptions = vnode.componentOptions;
  var options = {
    _isComponent: true,
    parent: parent,
    propsData: vnodeComponentOptions.propsData,
    _componentTag: vnodeComponentOptions.tag,
    _parentVnode: vnode,
    _parentListeners: vnodeComponentOptions.listeners,
    _renderChildren: vnodeComponentOptions.children,
    _parentElm: parentElm || null,
    _refElm: refElm || null
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnodeComponentOptions.Ctor(options);
}

function mergeHooks(data) {
  if (!data.hook) {
    data.hook = {};
  }
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var fromParent = data.hook[key];
    var ours = componentVNodeHooks[key];
    data.hook[key] = fromParent ? mergeHook$1(ours, fromParent) : ours;
  }
}

function mergeHook$1(one, two) {
  return function (a, b, c, d) {
    one(a, b, c, d);
    two(a, b, c, d);
  };
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel(options, data) {
  var prop = options.model && options.model.prop || 'value';
  var event = options.model && options.model.event || 'input';(data.props || (data.props = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  if (isDef(on[event])) {
    on[event] = [data.model.callback].concat(on[event]);
  } else {
    on[event] = data.model.callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement(context, tag, data, children, normalizationType, alwaysNormalize) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType);
}

function _createElement(context, tag, data, children, normalizationType) {
  if (isDef(data) && isDef(data.__ob__)) {
    process.env.NODE_ENV !== 'production' && warn("Avoid using observed data object as vnode data: " + JSON.stringify(data) + "\n" + 'Always create fresh vnode data objects in each render!', context);
    return createEmptyVNode();
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode();
  }
  // warn against non-primitive key
  if (process.env.NODE_ENV !== 'production' && isDef(data) && isDef(data.key) && !isPrimitive(data.key)) {
    warn('Avoid using non-primitive value as key, ' + 'use string/number value instead.', context);
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) && typeof children[0] === 'function') {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(config.parsePlatformTagName(tag), data, children, undefined, undefined, context);
    } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(tag, data, children, undefined, undefined, context);
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (isDef(vnode)) {
    if (ns) {
      applyNS(vnode, ns);
    }
    return vnode;
  } else {
    return createEmptyVNode();
  }
}

function applyNS(vnode, ns) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    return;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && isUndef(child.ns)) {
        applyNS(child, ns);
      }
    }
  }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList(val, render) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    keys = Object.keys(val);
    ret = new Array(keys.length);
    for (i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      ret[i] = render(val[key], key, i);
    }
  }
  if (isDef(ret)) {
    ret._isVList = true;
  }
  return ret;
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot(name, fallback, props, bindObject) {
  var scopedSlotFn = this.$scopedSlots[name];
  if (scopedSlotFn) {
    // scoped slot
    props = props || {};
    if (bindObject) {
      props = extend(extend({}, bindObject), props);
    }
    return scopedSlotFn(props) || fallback;
  } else {
    var slotNodes = this.$slots[name];
    // warn duplicate slot usage
    if (slotNodes && process.env.NODE_ENV !== 'production') {
      slotNodes._rendered && warn("Duplicate presence of slot \"" + name + "\" found in the same render tree " + "- this will likely cause render errors.", this);
      slotNodes._rendered = true;
    }
    return slotNodes || fallback;
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter(id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity;
}

/*  */

/**
 * Runtime helper for checking keyCodes from config.
 */
function checkKeyCodes(eventKeyCode, key, builtInAlias) {
  var keyCodes = config.keyCodes[key] || builtInAlias;
  if (Array.isArray(keyCodes)) {
    return keyCodes.indexOf(eventKeyCode) === -1;
  } else {
    return keyCodes !== eventKeyCode;
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps(data, tag, value, asProp, isSync) {
  if (value) {
    if (!isObject(value)) {
      process.env.NODE_ENV !== 'production' && warn('v-bind without argument expects an Object or Array value', this);
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function (key) {
        if (key === 'class' || key === 'style' || isReservedAttribute(key)) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key) ? data.domProps || (data.domProps = {}) : data.attrs || (data.attrs = {});
        }
        if (!(key in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on["update:" + key] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop(key);
    }
  }
  return data;
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic(index, isInFor) {
  var tree = this._staticTrees[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree by doing a shallow clone.
  if (tree && !isInFor) {
    return Array.isArray(tree) ? cloneVNodes(tree) : cloneVNode(tree);
  }
  // otherwise, render a fresh tree.
  tree = this._staticTrees[index] = this.$options.staticRenderFns[index].call(this._renderProxy);
  markStatic(tree, "__static__" + index, false);
  return tree;
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce(tree, index, key) {
  markStatic(tree, "__once__" + index + (key ? "_" + key : ""), true);
  return tree;
}

function markStatic(tree, key, isOnce) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], key + "_" + i, isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode(node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners(data, value) {
  if (value) {
    if (!isPlainObject(value)) {
      process.env.NODE_ENV !== 'production' && warn('v-on without argument expects an Object value', this);
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(ours, existing) : ours;
      }
    }
  }
  return data;
}

/*  */

function initRender(vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null;
  var parentVnode = vm.$vnode = vm.$options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(vm.$options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) {
    return createElement(vm, a, b, c, d, false);
  };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) {
    return createElement(vm, a, b, c, d, true);
  };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;
  /* istanbul ignore else */
  if (process.env.NODE_ENV !== 'production') {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', vm.$options._parentListeners, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs, null, true);
    defineReactive$$1(vm, '$listeners', vm.$options._parentListeners, null, true);
  }
}

function renderMixin(Vue) {
  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this);
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var staticRenderFns = ref.staticRenderFns;
    var _parentVnode = ref._parentVnode;

    if (vm._isMounted) {
      // clone slot nodes on re-renders
      for (var key in vm.$slots) {
        vm.$slots[key] = cloneVNodes(vm.$slots[key]);
      }
    }

    vm.$scopedSlots = _parentVnode && _parentVnode.data.scopedSlots || emptyObject;

    if (staticRenderFns && !vm._staticTrees) {
      vm._staticTrees = [];
    }
    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render function");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production') {
        vnode = vm.$options.renderError ? vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e) : vm._vnode;
      } else {
        vnode = vm._vnode;
      }
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if (process.env.NODE_ENV !== 'production' && Array.isArray(vnode)) {
        warn('Multiple root nodes returned from render function. Render function ' + 'should return a single root node.', vm);
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode;
  };

  // internal render helpers.
  // these are exposed on the instance prototype to reduce generated render
  // code size.
  Vue.prototype._o = markOnce;
  Vue.prototype._n = toNumber;
  Vue.prototype._s = toString;
  Vue.prototype._l = renderList;
  Vue.prototype._t = renderSlot;
  Vue.prototype._q = looseEqual;
  Vue.prototype._i = looseIndexOf;
  Vue.prototype._m = renderStatic;
  Vue.prototype._f = resolveFilter;
  Vue.prototype._k = checkKeyCodes;
  Vue.prototype._b = bindObjectProps;
  Vue.prototype._v = createTextVNode;
  Vue.prototype._e = createEmptyVNode;
  Vue.prototype._u = resolveScopedSlots;
  Vue.prototype._g = bindObjectListeners;
}

/*  */

var uid$1 = 0;

function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$1++;

    var startTag, endTag;
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = "vue-perf-init:" + vm._uid;
      endTag = "vue-perf-end:" + vm._uid;
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(resolveConstructorOptions(vm.constructor), options || {}, vm);
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm);
    } else {
      vm._renderProxy = vm;
    }
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    initInjections(vm); // resolve injections before data/props
    initState(vm);
    initProvide(vm); // resolve provide after data/props
    callHook(vm, 'created');

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(vm._name + " init", startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent(vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  opts.parent = options.parent;
  opts.propsData = options.propsData;
  opts._parentVnode = options._parentVnode;
  opts._parentListeners = options._parentListeners;
  opts._renderChildren = options._renderChildren;
  opts._componentTag = options._componentTag;
  opts._parentElm = options._parentElm;
  opts._refElm = options._refElm;
  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions(Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options;
}

function resolveModifiedOptions(Ctor) {
  var modified;
  var latest = Ctor.options;
  var extended = Ctor.extendOptions;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) {
        modified = {};
      }
      modified[key] = dedupe(latest[key], extended[key], sealed[key]);
    }
  }
  return modified;
}

function dedupe(latest, extended, sealed) {
  // compare latest and sealed to ensure lifecycle hooks won't be duplicated
  // between merges
  if (Array.isArray(latest)) {
    var res = [];
    sealed = Array.isArray(sealed) ? sealed : [sealed];
    extended = Array.isArray(extended) ? extended : [extended];
    for (var i = 0; i < latest.length; i++) {
      // push original options and not sealed options to exclude duplicated options
      if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
        res.push(latest[i]);
      }
    }
    return res;
  } else {
    return latest;
  }
}

function Vue$3(options) {
  if (process.env.NODE_ENV !== 'production' && !(this instanceof Vue$3)) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue$3);
stateMixin(Vue$3);
eventsMixin(Vue$3);
lifecycleMixin(Vue$3);
renderMixin(Vue$3);

/*  */

function initUse(Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = this._installedPlugins || (this._installedPlugins = []);
    if (installedPlugins.indexOf(plugin) > -1) {
      return this;
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this;
  };
}

/*  */

function initMixin$1(Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this;
  };
}

/*  */

function initExtend(Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId];
    }

    var name = extendOptions.name || Super.options.name;
    if (process.env.NODE_ENV !== 'production') {
      if (!/^[a-zA-Z][\w-]*$/.test(name)) {
        warn('Invalid component name: "' + name + '". Component names ' + 'can only contain alphanumeric characters and the hyphen, ' + 'and must start with a letter.');
      }
    }

    var Sub = function VueComponent(options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(Super.options, extendOptions);
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub;
  };
}

function initProps$1(Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1(Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters(Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (id, definition) {
      if (!definition) {
        return this.options[type + 's'][id];
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production') {
          if (type === 'component' && config.isReservedTag(id)) {
            warn('Do not use built-in or reserved HTML elements as component ' + 'id: ' + id);
          }
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition;
      }
    };
  });
}

/*  */

var patternTypes = [String, RegExp, Array];

function getComponentName(opts) {
  return opts && (opts.Ctor.options.name || opts.tag);
}

function matches(pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1;
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1;
  } else if (isRegExp(pattern)) {
    return pattern.test(name);
  }
  /* istanbul ignore next */
  return false;
}

function pruneCache(cache, current, filter) {
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        if (cachedNode !== current) {
          pruneCacheEntry(cachedNode);
        }
        cache[key] = null;
      }
    }
  }
}

function pruneCacheEntry(vnode) {
  if (vnode) {
    vnode.componentInstance.$destroy();
  }
}

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes
  },

  created: function created() {
    this.cache = Object.create(null);
  },

  destroyed: function destroyed() {
    var this$1 = this;

    for (var key in this$1.cache) {
      pruneCacheEntry(this$1.cache[key]);
    }
  },

  watch: {
    include: function include(val) {
      pruneCache(this.cache, this._vnode, function (name) {
        return matches(val, name);
      });
    },
    exclude: function exclude(val) {
      pruneCache(this.cache, this._vnode, function (name) {
        return !matches(val, name);
      });
    }
  },

  render: function render() {
    var vnode = getFirstComponentChild(this.$slots.default);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      if (name && (this.include && !matches(this.include, name) || this.exclude && matches(this.exclude, name))) {
        return vnode;
      }
      var key = vnode.key == null
      // same constructor may get registered as different local components
      // so cid alone is not enough (#3269)
      ? componentOptions.Ctor.cid + (componentOptions.tag ? "::" + componentOptions.tag : '') : vnode.key;
      if (this.cache[key]) {
        vnode.componentInstance = this.cache[key].componentInstance;
      } else {
        this.cache[key] = vnode;
      }
      vnode.data.keepAlive = true;
    }
    return vnode;
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI(Vue) {
  // config
  var configDef = {};
  configDef.get = function () {
    return config;
  };
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = function () {
      warn('Do not replace the Vue.config object, set individual fields instead.');
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue$3);

Object.defineProperty(Vue$3.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue$3.prototype, '$ssrContext', {
  get: function get() {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext;
  }
});

Vue$3.version = '2.4.2';

/*  */

// these are reserved for web because they are directly compiled away
// during template compilation
var isReservedAttr = makeMap('style,class');

// attributes that should be using props for binding
var acceptValue = makeMap('input,textarea,option,select');
var mustUseProp = function (tag, type, attr) {
  return attr === 'value' && acceptValue(tag) && type !== 'button' || attr === 'selected' && tag === 'option' || attr === 'checked' && tag === 'input' || attr === 'muted' && tag === 'video';
};

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

var isBooleanAttr = makeMap('allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' + 'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' + 'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' + 'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' + 'required,reversed,scoped,seamless,selected,sortable,translate,' + 'truespeed,typemustmatch,visible');

var xlinkNS = 'http://www.w3.org/1999/xlink';

var isXlink = function (name) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink';
};

var getXlinkProp = function (name) {
  return isXlink(name) ? name.slice(6, name.length) : '';
};

var isFalsyAttrValue = function (val) {
  return val == null || val === false;
};

/*  */

function genClassForVnode(vnode) {
  var data = vnode.data;
  var parentNode = vnode;
  var childNode = vnode;
  while (isDef(childNode.componentInstance)) {
    childNode = childNode.componentInstance._vnode;
    if (childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }
  while (isDef(parentNode = parentNode.parent)) {
    if (parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }
  return renderClass(data.staticClass, data.class);
}

function mergeClassData(child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: isDef(child.class) ? [child.class, parent.class] : parent.class
  };
}

function renderClass(staticClass, dynamicClass) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass));
  }
  /* istanbul ignore next */
  return '';
}

function concat(a, b) {
  return a ? b ? a + ' ' + b : a : b || '';
}

function stringifyClass(value) {
  if (Array.isArray(value)) {
    return stringifyArray(value);
  }
  if (isObject(value)) {
    return stringifyObject(value);
  }
  if (typeof value === 'string') {
    return value;
  }
  /* istanbul ignore next */
  return '';
}

function stringifyArray(value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) {
        res += ' ';
      }
      res += stringified;
    }
  }
  return res;
}

function stringifyObject(value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) {
        res += ' ';
      }
      res += key;
    }
  }
  return res;
}

/*  */

var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
};

var isHTMLTag = makeMap('html,body,base,head,link,meta,style,title,' + 'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' + 'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' + 'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' + 's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' + 'embed,object,param,source,canvas,script,noscript,del,ins,' + 'caption,col,colgroup,table,thead,tbody,td,th,tr,' + 'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' + 'output,progress,select,textarea,' + 'details,dialog,menu,menuitem,summary,' + 'content,element,shadow,template,blockquote,iframe,tfoot');

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap('svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' + 'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' + 'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view', true);

var isPreTag = function (tag) {
  return tag === 'pre';
};

var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag);
};

function getTagNamespace(tag) {
  if (isSVG(tag)) {
    return 'svg';
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') {
    return 'math';
  }
}

var unknownElementCache = Object.create(null);
function isUnknownElement(tag) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return true;
  }
  if (isReservedTag(tag)) {
    return false;
  }
  tag = tag.toLowerCase();
  /* istanbul ignore if */
  if (unknownElementCache[tag] != null) {
    return unknownElementCache[tag];
  }
  var el = document.createElement(tag);
  if (tag.indexOf('-') > -1) {
    // http://stackoverflow.com/a/28210364/1070244
    return unknownElementCache[tag] = el.constructor === window.HTMLUnknownElement || el.constructor === window.HTMLElement;
  } else {
    return unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString());
  }
}

/*  */

/**
 * Query an element selector if it's not an element already.
 */
function query(el) {
  if (typeof el === 'string') {
    var selected = document.querySelector(el);
    if (!selected) {
      process.env.NODE_ENV !== 'production' && warn('Cannot find element: ' + el);
      return document.createElement('div');
    }
    return selected;
  } else {
    return el;
  }
}

/*  */

function createElement$1(tagName, vnode) {
  var elm = document.createElement(tagName);
  if (tagName !== 'select') {
    return elm;
  }
  // false or null will remove the attribute but undefined will not
  if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
    elm.setAttribute('multiple', 'multiple');
  }
  return elm;
}

function createElementNS(namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName);
}

function createTextNode(text) {
  return document.createTextNode(text);
}

function createComment(text) {
  return document.createComment(text);
}

function insertBefore(parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild(node, child) {
  node.removeChild(child);
}

function appendChild(node, child) {
  node.appendChild(child);
}

function parentNode(node) {
  return node.parentNode;
}

function nextSibling(node) {
  return node.nextSibling;
}

function tagName(node) {
  return node.tagName;
}

function setTextContent(node, text) {
  node.textContent = text;
}

function setAttribute(node, key, val) {
  node.setAttribute(key, val);
}

var nodeOps = Object.freeze({
  createElement: createElement$1,
  createElementNS: createElementNS,
  createTextNode: createTextNode,
  createComment: createComment,
  insertBefore: insertBefore,
  removeChild: removeChild,
  appendChild: appendChild,
  parentNode: parentNode,
  nextSibling: nextSibling,
  tagName: tagName,
  setTextContent: setTextContent,
  setAttribute: setAttribute
});

/*  */

var ref = {
  create: function create(_, vnode) {
    registerRef(vnode);
  },
  update: function update(oldVnode, vnode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true);
      registerRef(vnode);
    }
  },
  destroy: function destroy(vnode) {
    registerRef(vnode, true);
  }
};

function registerRef(vnode, isRemoval) {
  var key = vnode.data.ref;
  if (!key) {
    return;
  }

  var vm = vnode.context;
  var ref = vnode.componentInstance || vnode.elm;
  var refs = vm.$refs;
  if (isRemoval) {
    if (Array.isArray(refs[key])) {
      remove(refs[key], ref);
    } else if (refs[key] === ref) {
      refs[key] = undefined;
    }
  } else {
    if (vnode.data.refInFor) {
      if (!Array.isArray(refs[key])) {
        refs[key] = [ref];
      } else if (refs[key].indexOf(ref) < 0) {
        // $flow-disable-line
        refs[key].push(ref);
      }
    } else {
      refs[key] = ref;
    }
  }
}

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *

/*
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

var emptyNode = new VNode('', {}, []);

var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

function sameVnode(a, b) {
  return a.key === b.key && (a.tag === b.tag && a.isComment === b.isComment && isDef(a.data) === isDef(b.data) && sameInputType(a, b) || isTrue(a.isAsyncPlaceholder) && a.asyncFactory === b.asyncFactory && isUndef(b.asyncFactory.error));
}

// Some browsers do not support dynamically changing type for <input>
// so they need to be treated as different nodes
function sameInputType(a, b) {
  if (a.tag !== 'input') {
    return true;
  }
  var i;
  var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
  var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
  return typeA === typeB;
}

function createKeyToOldIdx(children, beginIdx, endIdx) {
  var i, key;
  var map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) {
      map[key] = i;
    }
  }
  return map;
}

function createPatchFunction(backend) {
  var i, j;
  var cbs = {};

  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }

  function emptyNodeAt(elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm);
  }

  function createRmCb(childElm, listeners) {
    function remove$$1() {
      if (--remove$$1.listeners === 0) {
        removeNode(childElm);
      }
    }
    remove$$1.listeners = listeners;
    return remove$$1;
  }

  function removeNode(el) {
    var parent = nodeOps.parentNode(el);
    // element may have already been removed due to v-html / v-text
    if (isDef(parent)) {
      nodeOps.removeChild(parent, el);
    }
  }

  var inPre = 0;
  function createElm(vnode, insertedVnodeQueue, parentElm, refElm, nested) {
    vnode.isRootInsert = !nested; // for transition enter check
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return;
    }

    var data = vnode.data;
    var children = vnode.children;
    var tag = vnode.tag;
    if (isDef(tag)) {
      if (process.env.NODE_ENV !== 'production') {
        if (data && data.pre) {
          inPre++;
        }
        if (!inPre && !vnode.ns && !(config.ignoredElements.length && config.ignoredElements.indexOf(tag) > -1) && config.isUnknownElement(tag)) {
          warn('Unknown custom element: <' + tag + '> - did you ' + 'register the component correctly? For recursive components, ' + 'make sure to provide the "name" option.', vnode.context);
        }
      }
      vnode.elm = vnode.ns ? nodeOps.createElementNS(vnode.ns, tag) : nodeOps.createElement(tag, vnode);
      setScope(vnode);

      /* istanbul ignore if */
      {
        createChildren(vnode, children, insertedVnodeQueue);
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
        insert(parentElm, vnode.elm, refElm);
      }

      if (process.env.NODE_ENV !== 'production' && data && data.pre) {
        inPre--;
      }
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }

  function createComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
    var i = vnode.data;
    if (isDef(i)) {
      var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false /* hydrating */, parentElm, refElm);
      }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue);
        if (isTrue(isReactivated)) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
        }
        return true;
      }
    }
  }

  function initComponent(vnode, insertedVnodeQueue) {
    if (isDef(vnode.data.pendingInsert)) {
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
      vnode.data.pendingInsert = null;
    }
    vnode.elm = vnode.componentInstance.$el;
    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue);
      setScope(vnode);
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode);
      // make sure to invoke the insert hook
      insertedVnodeQueue.push(vnode);
    }
  }

  function reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
    var i;
    // hack for #4339: a reactivated component with inner transition
    // does not trigger because the inner node's created hooks are not called
    // again. It's not ideal to involve module-specific logic in here but
    // there doesn't seem to be a better way to do it.
    var innerNode = vnode;
    while (innerNode.componentInstance) {
      innerNode = innerNode.componentInstance._vnode;
      if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
        for (i = 0; i < cbs.activate.length; ++i) {
          cbs.activate[i](emptyNode, innerNode);
        }
        insertedVnodeQueue.push(innerNode);
        break;
      }
    }
    // unlike a newly created component,
    // a reactivated keep-alive component doesn't insert itself
    insert(parentElm, vnode.elm, refElm);
  }

  function insert(parent, elm, ref$$1) {
    if (isDef(parent)) {
      if (isDef(ref$$1)) {
        if (ref$$1.parentNode === parent) {
          nodeOps.insertBefore(parent, elm, ref$$1);
        }
      } else {
        nodeOps.appendChild(parent, elm);
      }
    }
  }

  function createChildren(vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true);
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(vnode.text));
    }
  }

  function isPatchable(vnode) {
    while (vnode.componentInstance) {
      vnode = vnode.componentInstance._vnode;
    }
    return isDef(vnode.tag);
  }

  function invokeCreateHooks(vnode, insertedVnodeQueue) {
    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
      cbs.create[i$1](emptyNode, vnode);
    }
    i = vnode.data.hook; // Reuse variable
    if (isDef(i)) {
      if (isDef(i.create)) {
        i.create(emptyNode, vnode);
      }
      if (isDef(i.insert)) {
        insertedVnodeQueue.push(vnode);
      }
    }
  }

  // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.
  function setScope(vnode) {
    var i;
    var ancestor = vnode;
    while (ancestor) {
      if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
        nodeOps.setAttribute(vnode.elm, i, '');
      }
      ancestor = ancestor.parent;
    }
    // for slot content they should also get the scopeId from the host instance.
    if (isDef(i = activeInstance) && i !== vnode.context && isDef(i = i.$options._scopeId)) {
      nodeOps.setAttribute(vnode.elm, i, '');
    }
  }

  function addVnodes(parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm);
    }
  }

  function invokeDestroyHook(vnode) {
    var i, j;
    var data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) {
        i(vnode);
      }
      for (i = 0; i < cbs.destroy.length; ++i) {
        cbs.destroy[i](vnode);
      }
    }
    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j]);
      }
    }
  }

  function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch);
          invokeDestroyHook(ch);
        } else {
          // Text node
          removeNode(ch.elm);
        }
      }
    }
  }

  function removeAndInvokeRemoveHook(vnode, rm) {
    if (isDef(rm) || isDef(vnode.data)) {
      var i;
      var listeners = cbs.remove.length + 1;
      if (isDef(rm)) {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners;
      } else {
        // directly removing
        rm = createRmCb(vnode.elm, listeners);
      }
      // recursively invoke hooks on child component root node
      if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm);
      }
      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm);
      }
      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm);
      } else {
        rm();
      }
    } else {
      removeNode(vnode.elm);
    }
  }

  function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, elmToMove, refElm;

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    var canMove = !removeOnly;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) {
        // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) {
        // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) {
          oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
        }
        idxInOld = isDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : null;
        if (isUndef(idxInOld)) {
          // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
          newStartVnode = newCh[++newStartIdx];
        } else {
          elmToMove = oldCh[idxInOld];
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !elmToMove) {
            warn('It seems there are duplicate keys that is causing an update error. ' + 'Make sure each v-for item has a unique key.');
          }
          if (sameVnode(elmToMove, newStartVnode)) {
            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
            newStartVnode = newCh[++newStartIdx];
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
            newStartVnode = newCh[++newStartIdx];
          }
        }
      }
    }
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly) {
    if (oldVnode === vnode) {
      return;
    }

    var elm = vnode.elm = oldVnode.elm;

    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      if (isDef(vnode.asyncFactory.resolved)) {
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
      } else {
        vnode.isAsyncPlaceholder = true;
      }
      return;
    }

    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    if (isTrue(vnode.isStatic) && isTrue(oldVnode.isStatic) && vnode.key === oldVnode.key && (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))) {
      vnode.componentInstance = oldVnode.componentInstance;
      return;
    }

    var i;
    var data = vnode.data;
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode);
    }

    var oldCh = oldVnode.children;
    var ch = vnode.children;
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) {
        cbs.update[i](oldVnode, vnode);
      }
      if (isDef(i = data.hook) && isDef(i = i.update)) {
        i(oldVnode, vnode);
      }
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) {
          updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly);
        }
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text)) {
          nodeOps.setTextContent(elm, '');
        }
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text);
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) {
        i(oldVnode, vnode);
      }
    }
  }

  function invokeInsertHook(vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (isTrue(initial) && isDef(vnode.parent)) {
      vnode.parent.data.pendingInsert = queue;
    } else {
      for (var i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }

  var bailed = false;
  // list of modules that can skip create hook during hydration because they
  // are already rendered on the client or has no need for initialization
  var isRenderedModule = makeMap('attrs,style,class,staticClass,staticStyle,key');

  // Note: this is a browser-only function so we can assume elms are DOM nodes.
  function hydrate(elm, vnode, insertedVnodeQueue) {
    if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
      vnode.elm = elm;
      vnode.isAsyncPlaceholder = true;
      return true;
    }
    if (process.env.NODE_ENV !== 'production') {
      if (!assertNodeMatch(elm, vnode)) {
        return false;
      }
    }
    vnode.elm = elm;
    var tag = vnode.tag;
    var data = vnode.data;
    var children = vnode.children;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) {
        i(vnode, true /* hydrating */);
      }
      if (isDef(i = vnode.componentInstance)) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue);
        return true;
      }
    }
    if (isDef(tag)) {
      if (isDef(children)) {
        // empty element, allow client to pick up and populate children
        if (!elm.hasChildNodes()) {
          createChildren(vnode, children, insertedVnodeQueue);
        } else {
          var childrenMatch = true;
          var childNode = elm.firstChild;
          for (var i$1 = 0; i$1 < children.length; i$1++) {
            if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue)) {
              childrenMatch = false;
              break;
            }
            childNode = childNode.nextSibling;
          }
          // if childNode is not null, it means the actual childNodes list is
          // longer than the virtual children list.
          if (!childrenMatch || childNode) {
            if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined' && !bailed) {
              bailed = true;
              console.warn('Parent: ', elm);
              console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
            }
            return false;
          }
        }
      }
      if (isDef(data)) {
        for (var key in data) {
          if (!isRenderedModule(key)) {
            invokeCreateHooks(vnode, insertedVnodeQueue);
            break;
          }
        }
      }
    } else if (elm.data !== vnode.text) {
      elm.data = vnode.text;
    }
    return true;
  }

  function assertNodeMatch(node, vnode) {
    if (isDef(vnode.tag)) {
      return vnode.tag.indexOf('vue-component') === 0 || vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase());
    } else {
      return node.nodeType === (vnode.isComment ? 8 : 3);
    }
  }

  return function patch(oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) {
        invokeDestroyHook(oldVnode);
      }
      return;
    }

    var isInitialPatch = false;
    var insertedVnodeQueue = [];

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue, parentElm, refElm);
    } else {
      var isRealElement = isDef(oldVnode.nodeType);
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR);
            hydrating = true;
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true);
              return oldVnode;
            } else if (process.env.NODE_ENV !== 'production') {
              warn('The client-side rendered virtual DOM tree is not matching ' + 'server-rendered content. This is likely caused by incorrect ' + 'HTML markup, for example nesting block-level elements inside ' + '<p>, or missing <tbody>. Bailing hydration and performing ' + 'full client-side render.');
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode);
        }
        // replacing existing element
        var oldElm = oldVnode.elm;
        var parentElm$1 = nodeOps.parentNode(oldElm);
        createElm(vnode, insertedVnodeQueue,
        // extremely rare edge case: do not insert if old element is in a
        // leaving transition. Only happens when combining transition +
        // keep-alive + HOCs. (#4590)
        oldElm._leaveCb ? null : parentElm$1, nodeOps.nextSibling(oldElm));

        if (isDef(vnode.parent)) {
          // component root element replaced.
          // update parent placeholder node element, recursively
          var ancestor = vnode.parent;
          while (ancestor) {
            ancestor.elm = vnode.elm;
            ancestor = ancestor.parent;
          }
          if (isPatchable(vnode)) {
            for (var i = 0; i < cbs.create.length; ++i) {
              cbs.create[i](emptyNode, vnode.parent);
            }
          }
        }

        if (isDef(parentElm$1)) {
          removeVnodes(parentElm$1, [oldVnode], 0, 0);
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode);
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm;
  };
}

/*  */

var directives = {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives(vnode) {
    updateDirectives(vnode, emptyNode);
  }
};

function updateDirectives(oldVnode, vnode) {
  if (oldVnode.data.directives || vnode.data.directives) {
    _update(oldVnode, vnode);
  }
}

function _update(oldVnode, vnode) {
  var isCreate = oldVnode === emptyNode;
  var isDestroy = vnode === emptyNode;
  var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
  var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

  var dirsWithInsert = [];
  var dirsWithPostpatch = [];

  var key, oldDir, dir;
  for (key in newDirs) {
    oldDir = oldDirs[key];
    dir = newDirs[key];
    if (!oldDir) {
      // new directive, bind
      callHook$1(dir, 'bind', vnode, oldVnode);
      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir);
      }
    } else {
      // existing directive, update
      dir.oldValue = oldDir.value;
      callHook$1(dir, 'update', vnode, oldVnode);
      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir);
      }
    }
  }

  if (dirsWithInsert.length) {
    var callInsert = function () {
      for (var i = 0; i < dirsWithInsert.length; i++) {
        callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
      }
    };
    if (isCreate) {
      mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', callInsert);
    } else {
      callInsert();
    }
  }

  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'postpatch', function () {
      for (var i = 0; i < dirsWithPostpatch.length; i++) {
        callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
      }
    });
  }

  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        // no longer present, unbind
        callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
      }
    }
  }
}

var emptyModifiers = Object.create(null);

function normalizeDirectives$1(dirs, vm) {
  var res = Object.create(null);
  if (!dirs) {
    return res;
  }
  var i, dir;
  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];
    if (!dir.modifiers) {
      dir.modifiers = emptyModifiers;
    }
    res[getRawDirName(dir)] = dir;
    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
  }
  return res;
}

function getRawDirName(dir) {
  return dir.rawName || dir.name + "." + Object.keys(dir.modifiers || {}).join('.');
}

function callHook$1(dir, hook, vnode, oldVnode, isDestroy) {
  var fn = dir.def && dir.def[hook];
  if (fn) {
    try {
      fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
    } catch (e) {
      handleError(e, vnode.context, "directive " + dir.name + " " + hook + " hook");
    }
  }
}

var baseModules = [ref, directives];

/*  */

function updateAttrs(oldVnode, vnode) {
  var opts = vnode.componentOptions;
  if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
    return;
  }
  if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
    return;
  }
  var key, cur, old;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs || {};
  var attrs = vnode.data.attrs || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(attrs.__ob__)) {
    attrs = vnode.data.attrs = extend({}, attrs);
  }

  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      setAttr(elm, key, cur);
    }
  }
  // #4391: in IE9, setting type can reset value for input[type=radio]
  /* istanbul ignore if */
  if (isIE9 && attrs.value !== oldAttrs.value) {
    setAttr(elm, 'value', attrs.value);
  }
  for (key in oldAttrs) {
    if (isUndef(attrs[key])) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key);
      }
    }
  }
}

function setAttr(el, key, value) {
  if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, key);
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, value);
    }
  }
}

var attrs = {
  create: updateAttrs,
  update: updateAttrs
};

/*  */

function updateClass(oldVnode, vnode) {
  var el = vnode.elm;
  var data = vnode.data;
  var oldData = oldVnode.data;
  if (isUndef(data.staticClass) && isUndef(data.class) && (isUndef(oldData) || isUndef(oldData.staticClass) && isUndef(oldData.class))) {
    return;
  }

  var cls = genClassForVnode(vnode);

  // handle transition classes
  var transitionClass = el._transitionClasses;
  if (isDef(transitionClass)) {
    cls = concat(cls, stringifyClass(transitionClass));
  }

  // set the class
  if (cls !== el._prevClass) {
    el.setAttribute('class', cls);
    el._prevClass = cls;
  }
}

var klass = {
  create: updateClass,
  update: updateClass
};

/*  */

var validDivisionCharRE = /[\w).+\-_$\]]/;

function parseFilters(exp) {
  var inSingle = false;
  var inDouble = false;
  var inTemplateString = false;
  var inRegex = false;
  var curly = 0;
  var square = 0;
  var paren = 0;
  var lastFilterIndex = 0;
  var c, prev, i, expression, filters;

  for (i = 0; i < exp.length; i++) {
    prev = c;
    c = exp.charCodeAt(i);
    if (inSingle) {
      if (c === 0x27 && prev !== 0x5C) {
        inSingle = false;
      }
    } else if (inDouble) {
      if (c === 0x22 && prev !== 0x5C) {
        inDouble = false;
      }
    } else if (inTemplateString) {
      if (c === 0x60 && prev !== 0x5C) {
        inTemplateString = false;
      }
    } else if (inRegex) {
      if (c === 0x2f && prev !== 0x5C) {
        inRegex = false;
      }
    } else if (c === 0x7C && // pipe
    exp.charCodeAt(i + 1) !== 0x7C && exp.charCodeAt(i - 1) !== 0x7C && !curly && !square && !paren) {
      if (expression === undefined) {
        // first filter, end of expression
        lastFilterIndex = i + 1;
        expression = exp.slice(0, i).trim();
      } else {
        pushFilter();
      }
    } else {
      switch (c) {
        case 0x22:
          inDouble = true;break; // "
        case 0x27:
          inSingle = true;break; // '
        case 0x60:
          inTemplateString = true;break; // `
        case 0x28:
          paren++;break; // (
        case 0x29:
          paren--;break; // )
        case 0x5B:
          square++;break; // [
        case 0x5D:
          square--;break; // ]
        case 0x7B:
          curly++;break; // {
        case 0x7D:
          curly--;break; // }
      }
      if (c === 0x2f) {
        // /
        var j = i - 1;
        var p = void 0;
        // find first non-whitespace prev char
        for (; j >= 0; j--) {
          p = exp.charAt(j);
          if (p !== ' ') {
            break;
          }
        }
        if (!p || !validDivisionCharRE.test(p)) {
          inRegex = true;
        }
      }
    }
  }

  if (expression === undefined) {
    expression = exp.slice(0, i).trim();
  } else if (lastFilterIndex !== 0) {
    pushFilter();
  }

  function pushFilter() {
    (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
    lastFilterIndex = i + 1;
  }

  if (filters) {
    for (i = 0; i < filters.length; i++) {
      expression = wrapFilter(expression, filters[i]);
    }
  }

  return expression;
}

function wrapFilter(exp, filter) {
  var i = filter.indexOf('(');
  if (i < 0) {
    // _f: resolveFilter
    return "_f(\"" + filter + "\")(" + exp + ")";
  } else {
    var name = filter.slice(0, i);
    var args = filter.slice(i + 1);
    return "_f(\"" + name + "\")(" + exp + "," + args;
  }
}

/*  */

function baseWarn(msg) {
  console.error("[Vue compiler]: " + msg);
}

function pluckModuleFunction(modules, key) {
  return modules ? modules.map(function (m) {
    return m[key];
  }).filter(function (_) {
    return _;
  }) : [];
}

function addProp(el, name, value) {
  (el.props || (el.props = [])).push({ name: name, value: value });
}

function addAttr(el, name, value) {
  (el.attrs || (el.attrs = [])).push({ name: name, value: value });
}

function addDirective(el, name, rawName, value, arg, modifiers) {
  (el.directives || (el.directives = [])).push({ name: name, rawName: rawName, value: value, arg: arg, modifiers: modifiers });
}

function addHandler(el, name, value, modifiers, important, warn) {
  // warn prevent and passive modifier
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && warn && modifiers && modifiers.prevent && modifiers.passive) {
    warn('passive and prevent can\'t be used together. ' + 'Passive handler can\'t prevent default event.');
  }
  // check capture modifier
  if (modifiers && modifiers.capture) {
    delete modifiers.capture;
    name = '!' + name; // mark the event as captured
  }
  if (modifiers && modifiers.once) {
    delete modifiers.once;
    name = '~' + name; // mark the event as once
  }
  /* istanbul ignore if */
  if (modifiers && modifiers.passive) {
    delete modifiers.passive;
    name = '&' + name; // mark the event as passive
  }
  var events;
  if (modifiers && modifiers.native) {
    delete modifiers.native;
    events = el.nativeEvents || (el.nativeEvents = {});
  } else {
    events = el.events || (el.events = {});
  }
  var newHandler = { value: value, modifiers: modifiers };
  var handlers = events[name];
  /* istanbul ignore if */
  if (Array.isArray(handlers)) {
    important ? handlers.unshift(newHandler) : handlers.push(newHandler);
  } else if (handlers) {
    events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
  } else {
    events[name] = newHandler;
  }
}

function getBindingAttr(el, name, getStatic) {
  var dynamicValue = getAndRemoveAttr(el, ':' + name) || getAndRemoveAttr(el, 'v-bind:' + name);
  if (dynamicValue != null) {
    return parseFilters(dynamicValue);
  } else if (getStatic !== false) {
    var staticValue = getAndRemoveAttr(el, name);
    if (staticValue != null) {
      return JSON.stringify(staticValue);
    }
  }
}

function getAndRemoveAttr(el, name) {
  var val;
  if ((val = el.attrsMap[name]) != null) {
    var list = el.attrsList;
    for (var i = 0, l = list.length; i < l; i++) {
      if (list[i].name === name) {
        list.splice(i, 1);
        break;
      }
    }
  }
  return val;
}

/*  */

/**
 * Cross-platform code generation for component v-model
 */
function genComponentModel(el, value, modifiers) {
  var ref = modifiers || {};
  var number = ref.number;
  var trim = ref.trim;

  var baseValueExpression = '$$v';
  var valueExpression = baseValueExpression;
  if (trim) {
    valueExpression = "(typeof " + baseValueExpression + " === 'string'" + "? " + baseValueExpression + ".trim()" + ": " + baseValueExpression + ")";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }
  var assignment = genAssignmentCode(value, valueExpression);

  el.model = {
    value: "(" + value + ")",
    expression: "\"" + value + "\"",
    callback: "function (" + baseValueExpression + ") {" + assignment + "}"
  };
}

/**
 * Cross-platform codegen helper for generating v-model value assignment code.
 */
function genAssignmentCode(value, assignment) {
  var modelRs = parseModel(value);
  if (modelRs.idx === null) {
    return value + "=" + assignment;
  } else {
    return "$set(" + modelRs.exp + ", " + modelRs.idx + ", " + assignment + ")";
  }
}

/**
 * parse directive model to do the array update transform. a[idx] = val => $$a.splice($$idx, 1, val)
 *
 * for loop possible cases:
 *
 * - test
 * - test[idx]
 * - test[test1[idx]]
 * - test["a"][idx]
 * - xxx.test[a[a].test1[idx]]
 * - test.xxx.a["asa"][test1[idx]]
 *
 */

var len;
var str;
var chr;
var index$1;
var expressionPos;
var expressionEndPos;

function parseModel(val) {
  str = val;
  len = str.length;
  index$1 = expressionPos = expressionEndPos = 0;

  if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
    return {
      exp: val,
      idx: null
    };
  }

  while (!eof()) {
    chr = next();
    /* istanbul ignore if */
    if (isStringStart(chr)) {
      parseString(chr);
    } else if (chr === 0x5B) {
      parseBracket(chr);
    }
  }

  return {
    exp: val.substring(0, expressionPos),
    idx: val.substring(expressionPos + 1, expressionEndPos)
  };
}

function next() {
  return str.charCodeAt(++index$1);
}

function eof() {
  return index$1 >= len;
}

function isStringStart(chr) {
  return chr === 0x22 || chr === 0x27;
}

function parseBracket(chr) {
  var inBracket = 1;
  expressionPos = index$1;
  while (!eof()) {
    chr = next();
    if (isStringStart(chr)) {
      parseString(chr);
      continue;
    }
    if (chr === 0x5B) {
      inBracket++;
    }
    if (chr === 0x5D) {
      inBracket--;
    }
    if (inBracket === 0) {
      expressionEndPos = index$1;
      break;
    }
  }
}

function parseString(chr) {
  var stringQuote = chr;
  while (!eof()) {
    chr = next();
    if (chr === stringQuote) {
      break;
    }
  }
}

/*  */

var warn$1;

// in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.
var RANGE_TOKEN = '__r';
var CHECKBOX_RADIO_TOKEN = '__c';

function model(el, dir, _warn) {
  warn$1 = _warn;
  var value = dir.value;
  var modifiers = dir.modifiers;
  var tag = el.tag;
  var type = el.attrsMap.type;

  if (process.env.NODE_ENV !== 'production') {
    var dynamicType = el.attrsMap['v-bind:type'] || el.attrsMap[':type'];
    if (tag === 'input' && dynamicType) {
      warn$1("<input :type=\"" + dynamicType + "\" v-model=\"" + value + "\">:\n" + "v-model does not support dynamic input types. Use v-if branches instead.");
    }
    // inputs with type="file" are read only and setting the input's
    // value will throw an error.
    if (tag === 'input' && type === 'file') {
      warn$1("<" + el.tag + " v-model=\"" + value + "\" type=\"file\">:\n" + "File inputs are read only. Use a v-on:change listener instead.");
    }
  }

  if (el.component) {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false;
  } else if (tag === 'select') {
    genSelect(el, value, modifiers);
  } else if (tag === 'input' && type === 'checkbox') {
    genCheckboxModel(el, value, modifiers);
  } else if (tag === 'input' && type === 'radio') {
    genRadioModel(el, value, modifiers);
  } else if (tag === 'input' || tag === 'textarea') {
    genDefaultModel(el, value, modifiers);
  } else if (!config.isReservedTag(tag)) {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false;
  } else if (process.env.NODE_ENV !== 'production') {
    warn$1("<" + el.tag + " v-model=\"" + value + "\">: " + "v-model is not supported on this element type. " + 'If you are working with contenteditable, it\'s recommended to ' + 'wrap a library dedicated for that purpose inside a custom component.');
  }

  // ensure runtime directive metadata
  return true;
}

function genCheckboxModel(el, value, modifiers) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  var trueValueBinding = getBindingAttr(el, 'true-value') || 'true';
  var falseValueBinding = getBindingAttr(el, 'false-value') || 'false';
  addProp(el, 'checked', "Array.isArray(" + value + ")" + "?_i(" + value + "," + valueBinding + ")>-1" + (trueValueBinding === 'true' ? ":(" + value + ")" : ":_q(" + value + "," + trueValueBinding + ")"));
  addHandler(el, CHECKBOX_RADIO_TOKEN, "var $$a=" + value + "," + '$$el=$event.target,' + "$$c=$$el.checked?(" + trueValueBinding + "):(" + falseValueBinding + ");" + 'if(Array.isArray($$a)){' + "var $$v=" + (number ? '_n(' + valueBinding + ')' : valueBinding) + "," + '$$i=_i($$a,$$v);' + "if($$el.checked){$$i<0&&(" + value + "=$$a.concat($$v))}" + "else{$$i>-1&&(" + value + "=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}" + "}else{" + genAssignmentCode(value, '$$c') + "}", null, true);
}

function genRadioModel(el, value, modifiers) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  valueBinding = number ? "_n(" + valueBinding + ")" : valueBinding;
  addProp(el, 'checked', "_q(" + value + "," + valueBinding + ")");
  addHandler(el, CHECKBOX_RADIO_TOKEN, genAssignmentCode(value, valueBinding), null, true);
}

function genSelect(el, value, modifiers) {
  var number = modifiers && modifiers.number;
  var selectedVal = "Array.prototype.filter" + ".call($event.target.options,function(o){return o.selected})" + ".map(function(o){var val = \"_value\" in o ? o._value : o.value;" + "return " + (number ? '_n(val)' : 'val') + "})";

  var assignment = '$event.target.multiple ? $$selectedVal : $$selectedVal[0]';
  var code = "var $$selectedVal = " + selectedVal + ";";
  code = code + " " + genAssignmentCode(value, assignment);
  addHandler(el, 'change', code, null, true);
}

function genDefaultModel(el, value, modifiers) {
  var type = el.attrsMap.type;
  var ref = modifiers || {};
  var lazy = ref.lazy;
  var number = ref.number;
  var trim = ref.trim;
  var needCompositionGuard = !lazy && type !== 'range';
  var event = lazy ? 'change' : type === 'range' ? RANGE_TOKEN : 'input';

  var valueExpression = '$event.target.value';
  if (trim) {
    valueExpression = "$event.target.value.trim()";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }

  var code = genAssignmentCode(value, valueExpression);
  if (needCompositionGuard) {
    code = "if($event.target.composing)return;" + code;
  }

  addProp(el, 'value', "(" + value + ")");
  addHandler(el, event, code, null, true);
  if (trim || number) {
    addHandler(el, 'blur', '$forceUpdate()');
  }
}

/*  */

// normalize v-model event tokens that can only be determined at runtime.
// it's important to place the event as the first in the array because
// the whole point is ensuring the v-model callback gets called before
// user-attached handlers.
function normalizeEvents(on) {
  var event;
  /* istanbul ignore if */
  if (isDef(on[RANGE_TOKEN])) {
    // IE input[type=range] only supports `change` event
    event = isIE ? 'change' : 'input';
    on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
    delete on[RANGE_TOKEN];
  }
  if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
    // Chrome fires microtasks in between click/change, leads to #4521
    event = isChrome ? 'click' : 'change';
    on[event] = [].concat(on[CHECKBOX_RADIO_TOKEN], on[event] || []);
    delete on[CHECKBOX_RADIO_TOKEN];
  }
}

var target$1;

function add$1(event, handler, once$$1, capture, passive) {
  if (once$$1) {
    var oldHandler = handler;
    var _target = target$1; // save current target element in closure
    handler = function (ev) {
      var res = arguments.length === 1 ? oldHandler(ev) : oldHandler.apply(null, arguments);
      if (res !== null) {
        remove$2(event, handler, capture, _target);
      }
    };
  }
  target$1.addEventListener(event, handler, supportsPassive ? { capture: capture, passive: passive } : capture);
}

function remove$2(event, handler, capture, _target) {
  (_target || target$1).removeEventListener(event, handler, capture);
}

function updateDOMListeners(oldVnode, vnode) {
  if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
    return;
  }
  var on = vnode.data.on || {};
  var oldOn = oldVnode.data.on || {};
  target$1 = vnode.elm;
  normalizeEvents(on);
  updateListeners(on, oldOn, add$1, remove$2, vnode.context);
}

var events = {
  create: updateDOMListeners,
  update: updateDOMListeners
};

/*  */

function updateDOMProps(oldVnode, vnode) {
  if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
    return;
  }
  var key, cur;
  var elm = vnode.elm;
  var oldProps = oldVnode.data.domProps || {};
  var props = vnode.data.domProps || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(props.__ob__)) {
    props = vnode.data.domProps = extend({}, props);
  }

  for (key in oldProps) {
    if (isUndef(props[key])) {
      elm[key] = '';
    }
  }
  for (key in props) {
    cur = props[key];
    // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)
    if (key === 'textContent' || key === 'innerHTML') {
      if (vnode.children) {
        vnode.children.length = 0;
      }
      if (cur === oldProps[key]) {
        continue;
      }
    }

    if (key === 'value') {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur;
      // avoid resetting cursor position when value is the same
      var strCur = isUndef(cur) ? '' : String(cur);
      if (shouldUpdateValue(elm, vnode, strCur)) {
        elm.value = strCur;
      }
    } else {
      elm[key] = cur;
    }
  }
}

// check platforms/web/util/attrs.js acceptValue


function shouldUpdateValue(elm, vnode, checkVal) {
  return !elm.composing && (vnode.tag === 'option' || isDirty(elm, checkVal) || isInputChanged(elm, checkVal));
}

function isDirty(elm, checkVal) {
  // return true when textbox (.number and .trim) loses focus and its value is
  // not equal to the updated value
  var notInFocus = true;
  // #6157
  // work around IE bug when accessing document.activeElement in an iframe
  try {
    notInFocus = document.activeElement !== elm;
  } catch (e) {}
  return notInFocus && elm.value !== checkVal;
}

function isInputChanged(elm, newVal) {
  var value = elm.value;
  var modifiers = elm._vModifiers; // injected by v-model runtime
  if (isDef(modifiers) && modifiers.number) {
    return toNumber(value) !== toNumber(newVal);
  }
  if (isDef(modifiers) && modifiers.trim) {
    return value.trim() !== newVal.trim();
  }
  return value !== newVal;
}

var domProps = {
  create: updateDOMProps,
  update: updateDOMProps
};

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res;
});

// merge static and dynamic style data on the same vnode
function normalizeStyleData(data) {
  var style = normalizeStyleBinding(data.style);
  // static style is pre-processed into an object during compilation
  // and is always a fresh object, so it's safe to merge into it
  return data.staticStyle ? extend(data.staticStyle, style) : style;
}

// normalize possible array / string values into Object
function normalizeStyleBinding(bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle);
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle);
  }
  return bindingStyle;
}

/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */
function getStyle(vnode, checkChild) {
  var res = {};
  var styleData;

  if (checkChild) {
    var childNode = vnode;
    while (childNode.componentInstance) {
      childNode = childNode.componentInstance._vnode;
      if (childNode.data && (styleData = normalizeStyleData(childNode.data))) {
        extend(res, styleData);
      }
    }
  }

  if (styleData = normalizeStyleData(vnode.data)) {
    extend(res, styleData);
  }

  var parentNode = vnode;
  while (parentNode = parentNode.parent) {
    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
      extend(res, styleData);
    }
  }
  return res;
}

/*  */

var cssVarRE = /^--/;
var importantRE = /\s*!important$/;
var setProp = function (el, name, val) {
  /* istanbul ignore if */
  if (cssVarRE.test(name)) {
    el.style.setProperty(name, val);
  } else if (importantRE.test(val)) {
    el.style.setProperty(name, val.replace(importantRE, ''), 'important');
  } else {
    var normalizedName = normalize(name);
    if (Array.isArray(val)) {
      // Support values array created by autoprefixer, e.g.
      // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
      // Set them one by one, and the browser will only set those it can recognize
      for (var i = 0, len = val.length; i < len; i++) {
        el.style[normalizedName] = val[i];
      }
    } else {
      el.style[normalizedName] = val;
    }
  }
};

var vendorNames = ['Webkit', 'Moz', 'ms'];

var emptyStyle;
var normalize = cached(function (prop) {
  emptyStyle = emptyStyle || document.createElement('div').style;
  prop = camelize(prop);
  if (prop !== 'filter' && prop in emptyStyle) {
    return prop;
  }
  var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
  for (var i = 0; i < vendorNames.length; i++) {
    var name = vendorNames[i] + capName;
    if (name in emptyStyle) {
      return name;
    }
  }
});

function updateStyle(oldVnode, vnode) {
  var data = vnode.data;
  var oldData = oldVnode.data;

  if (isUndef(data.staticStyle) && isUndef(data.style) && isUndef(oldData.staticStyle) && isUndef(oldData.style)) {
    return;
  }

  var cur, name;
  var el = vnode.elm;
  var oldStaticStyle = oldData.staticStyle;
  var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

  // if static style exists, stylebinding already merged into it when doing normalizeStyleData
  var oldStyle = oldStaticStyle || oldStyleBinding;

  var style = normalizeStyleBinding(vnode.data.style) || {};

  // store normalized style under a different key for next diff
  // make sure to clone it if it's reactive, since the user likley wants
  // to mutate it.
  vnode.data.normalizedStyle = isDef(style.__ob__) ? extend({}, style) : style;

  var newStyle = getStyle(vnode, true);

  for (name in oldStyle) {
    if (isUndef(newStyle[name])) {
      setProp(el, name, '');
    }
  }
  for (name in newStyle) {
    cur = newStyle[name];
    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      setProp(el, name, cur == null ? '' : cur);
    }
  }
}

var style = {
  create: updateStyle,
  update: updateStyle
};

/*  */

/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function addClass(el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return;
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) {
        return el.classList.add(c);
      });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}

/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function removeClass(el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return;
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) {
        return el.classList.remove(c);
      });
    } else {
      el.classList.remove(cls);
    }
    if (!el.classList.length) {
      el.removeAttribute('class');
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    cur = cur.trim();
    if (cur) {
      el.setAttribute('class', cur);
    } else {
      el.removeAttribute('class');
    }
  }
}

/*  */

function resolveTransition(def$$1) {
  if (!def$$1) {
    return;
  }
  /* istanbul ignore else */
  if (typeof def$$1 === 'object') {
    var res = {};
    if (def$$1.css !== false) {
      extend(res, autoCssTransition(def$$1.name || 'v'));
    }
    extend(res, def$$1);
    return res;
  } else if (typeof def$$1 === 'string') {
    return autoCssTransition(def$$1);
  }
}

var autoCssTransition = cached(function (name) {
  return {
    enterClass: name + "-enter",
    enterToClass: name + "-enter-to",
    enterActiveClass: name + "-enter-active",
    leaveClass: name + "-leave",
    leaveToClass: name + "-leave-to",
    leaveActiveClass: name + "-leave-active"
  };
});

var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation';

// Transition property/event sniffing
var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';
if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined && window.onwebkittransitionend !== undefined) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }
  if (window.onanimationend === undefined && window.onwebkitanimationend !== undefined) {
    animationProp = 'WebkitAnimation';
    animationEndEvent = 'webkitAnimationEnd';
  }
}

// binding to window is necessary to make hot reload work in IE in strict mode
var raf = inBrowser && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : setTimeout;

function nextFrame(fn) {
  raf(function () {
    raf(fn);
  });
}

function addTransitionClass(el, cls) {
  var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
  if (transitionClasses.indexOf(cls) < 0) {
    transitionClasses.push(cls);
    addClass(el, cls);
  }
}

function removeTransitionClass(el, cls) {
  if (el._transitionClasses) {
    remove(el._transitionClasses, cls);
  }
  removeClass(el, cls);
}

function whenTransitionEnds(el, expectedType, cb) {
  var ref = getTransitionInfo(el, expectedType);
  var type = ref.type;
  var timeout = ref.timeout;
  var propCount = ref.propCount;
  if (!type) {
    return cb();
  }
  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var ended = 0;
  var end = function () {
    el.removeEventListener(event, onEnd);
    cb();
  };
  var onEnd = function (e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end();
      }
    }
  };
  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(event, onEnd);
}

var transformRE = /\b(transform|all)(,|$)/;

function getTransitionInfo(el, expectedType) {
  var styles = window.getComputedStyle(el);
  var transitionDelays = styles[transitionProp + 'Delay'].split(', ');
  var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
  var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  var animationDelays = styles[animationProp + 'Delay'].split(', ');
  var animationDurations = styles[animationProp + 'Duration'].split(', ');
  var animationTimeout = getTimeout(animationDelays, animationDurations);

  var type;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
    propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
  }
  var hasTransform = type === TRANSITION && transformRE.test(styles[transitionProp + 'Property']);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  };
}

function getTimeout(delays, durations) {
  /* istanbul ignore next */
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i]);
  }));
}

function toMs(s) {
  return Number(s.slice(0, -1)) * 1000;
}

/*  */

function enter(vnode, toggleDisplay) {
  var el = vnode.elm;

  // call leave callback now
  if (isDef(el._leaveCb)) {
    el._leaveCb.cancelled = true;
    el._leaveCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data)) {
    return;
  }

  /* istanbul ignore if */
  if (isDef(el._enterCb) || el.nodeType !== 1) {
    return;
  }

  var css = data.css;
  var type = data.type;
  var enterClass = data.enterClass;
  var enterToClass = data.enterToClass;
  var enterActiveClass = data.enterActiveClass;
  var appearClass = data.appearClass;
  var appearToClass = data.appearToClass;
  var appearActiveClass = data.appearActiveClass;
  var beforeEnter = data.beforeEnter;
  var enter = data.enter;
  var afterEnter = data.afterEnter;
  var enterCancelled = data.enterCancelled;
  var beforeAppear = data.beforeAppear;
  var appear = data.appear;
  var afterAppear = data.afterAppear;
  var appearCancelled = data.appearCancelled;
  var duration = data.duration;

  // activeInstance will always be the <transition> component managing this
  // transition. One edge case to check is when the <transition> is placed
  // as the root node of a child component. In that case we need to check
  // <transition>'s parent for appear check.
  var context = activeInstance;
  var transitionNode = activeInstance.$vnode;
  while (transitionNode && transitionNode.parent) {
    transitionNode = transitionNode.parent;
    context = transitionNode.context;
  }

  var isAppear = !context._isMounted || !vnode.isRootInsert;

  if (isAppear && !appear && appear !== '') {
    return;
  }

  var startClass = isAppear && appearClass ? appearClass : enterClass;
  var activeClass = isAppear && appearActiveClass ? appearActiveClass : enterActiveClass;
  var toClass = isAppear && appearToClass ? appearToClass : enterToClass;

  var beforeEnterHook = isAppear ? beforeAppear || beforeEnter : beforeEnter;
  var enterHook = isAppear ? typeof appear === 'function' ? appear : enter : enter;
  var afterEnterHook = isAppear ? afterAppear || afterEnter : afterEnter;
  var enterCancelledHook = isAppear ? appearCancelled || enterCancelled : enterCancelled;

  var explicitEnterDuration = toNumber(isObject(duration) ? duration.enter : duration);

  if (process.env.NODE_ENV !== 'production' && explicitEnterDuration != null) {
    checkDuration(explicitEnterDuration, 'enter', vnode);
  }

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(enterHook);

  var cb = el._enterCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass(el, toClass);
      removeTransitionClass(el, activeClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, startClass);
      }
      enterCancelledHook && enterCancelledHook(el);
    } else {
      afterEnterHook && afterEnterHook(el);
    }
    el._enterCb = null;
  });

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', function () {
      var parent = el.parentNode;
      var pendingNode = parent && parent._pending && parent._pending[vnode.key];
      if (pendingNode && pendingNode.tag === vnode.tag && pendingNode.elm._leaveCb) {
        pendingNode.elm._leaveCb();
      }
      enterHook && enterHook(el, cb);
    });
  }

  // start enter transition
  beforeEnterHook && beforeEnterHook(el);
  if (expectsCSS) {
    addTransitionClass(el, startClass);
    addTransitionClass(el, activeClass);
    nextFrame(function () {
      addTransitionClass(el, toClass);
      removeTransitionClass(el, startClass);
      if (!cb.cancelled && !userWantsControl) {
        if (isValidDuration(explicitEnterDuration)) {
          setTimeout(cb, explicitEnterDuration);
        } else {
          whenTransitionEnds(el, type, cb);
        }
      }
    });
  }

  if (vnode.data.show) {
    toggleDisplay && toggleDisplay();
    enterHook && enterHook(el, cb);
  }

  if (!expectsCSS && !userWantsControl) {
    cb();
  }
}

function leave(vnode, rm) {
  var el = vnode.elm;

  // call enter callback now
  if (isDef(el._enterCb)) {
    el._enterCb.cancelled = true;
    el._enterCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data)) {
    return rm();
  }

  /* istanbul ignore if */
  if (isDef(el._leaveCb) || el.nodeType !== 1) {
    return;
  }

  var css = data.css;
  var type = data.type;
  var leaveClass = data.leaveClass;
  var leaveToClass = data.leaveToClass;
  var leaveActiveClass = data.leaveActiveClass;
  var beforeLeave = data.beforeLeave;
  var leave = data.leave;
  var afterLeave = data.afterLeave;
  var leaveCancelled = data.leaveCancelled;
  var delayLeave = data.delayLeave;
  var duration = data.duration;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(leave);

  var explicitLeaveDuration = toNumber(isObject(duration) ? duration.leave : duration);

  if (process.env.NODE_ENV !== 'production' && isDef(explicitLeaveDuration)) {
    checkDuration(explicitLeaveDuration, 'leave', vnode);
  }

  var cb = el._leaveCb = once(function () {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null;
    }
    if (expectsCSS) {
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass);
      }
      leaveCancelled && leaveCancelled(el);
    } else {
      rm();
      afterLeave && afterLeave(el);
    }
    el._leaveCb = null;
  });

  if (delayLeave) {
    delayLeave(performLeave);
  } else {
    performLeave();
  }

  function performLeave() {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return;
    }
    // record leaving element
    if (!vnode.data.show) {
      (el.parentNode._pending || (el.parentNode._pending = {}))[vnode.key] = vnode;
    }
    beforeLeave && beforeLeave(el);
    if (expectsCSS) {
      addTransitionClass(el, leaveClass);
      addTransitionClass(el, leaveActiveClass);
      nextFrame(function () {
        addTransitionClass(el, leaveToClass);
        removeTransitionClass(el, leaveClass);
        if (!cb.cancelled && !userWantsControl) {
          if (isValidDuration(explicitLeaveDuration)) {
            setTimeout(cb, explicitLeaveDuration);
          } else {
            whenTransitionEnds(el, type, cb);
          }
        }
      });
    }
    leave && leave(el, cb);
    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }
}

// only used in dev mode
function checkDuration(val, name, vnode) {
  if (typeof val !== 'number') {
    warn("<transition> explicit " + name + " duration is not a valid number - " + "got " + JSON.stringify(val) + ".", vnode.context);
  } else if (isNaN(val)) {
    warn("<transition> explicit " + name + " duration is NaN - " + 'the duration expression might be incorrect.', vnode.context);
  }
}

function isValidDuration(val) {
  return typeof val === 'number' && !isNaN(val);
}

/**
 * Normalize a transition hook's argument length. The hook may be:
 * - a merged hook (invoker) with the original in .fns
 * - a wrapped component method (check ._length)
 * - a plain function (.length)
 */
function getHookArgumentsLength(fn) {
  if (isUndef(fn)) {
    return false;
  }
  var invokerFns = fn.fns;
  if (isDef(invokerFns)) {
    // invoker
    return getHookArgumentsLength(Array.isArray(invokerFns) ? invokerFns[0] : invokerFns);
  } else {
    return (fn._length || fn.length) > 1;
  }
}

function _enter(_, vnode) {
  if (vnode.data.show !== true) {
    enter(vnode);
  }
}

var transition = inBrowser ? {
  create: _enter,
  activate: _enter,
  remove: function remove$$1(vnode, rm) {
    /* istanbul ignore else */
    if (vnode.data.show !== true) {
      leave(vnode, rm);
    } else {
      rm();
    }
  }
} : {};

var platformModules = [attrs, klass, events, domProps, style, transition];

/*  */

// the directive module should be applied last, after all
// built-in modules have been applied.
var modules = platformModules.concat(baseModules);

var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */

var isTextInputType = makeMap('text,number,password,search,email,tel,url');

/* istanbul ignore if */
if (isIE9) {
  // http://www.matts411.com/post/internet-explorer-9-oninput/
  document.addEventListener('selectionchange', function () {
    var el = document.activeElement;
    if (el && el.vmodel) {
      trigger(el, 'input');
    }
  });
}

var model$1 = {
  inserted: function inserted(el, binding, vnode) {
    if (vnode.tag === 'select') {
      var cb = function () {
        setSelected(el, binding, vnode.context);
      };
      cb();
      /* istanbul ignore if */
      if (isIE || isEdge) {
        setTimeout(cb, 0);
      }
      el._vOptions = [].map.call(el.options, getValue);
    } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
      el._vModifiers = binding.modifiers;
      if (!binding.modifiers.lazy) {
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        el.addEventListener('change', onCompositionEnd);
        if (!isAndroid) {
          el.addEventListener('compositionstart', onCompositionStart);
          el.addEventListener('compositionend', onCompositionEnd);
        }
        /* istanbul ignore if */
        if (isIE9) {
          el.vmodel = true;
        }
      }
    }
  },
  componentUpdated: function componentUpdated(el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context);
      // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matching
      // option in the DOM.
      var prevOptions = el._vOptions;
      var curOptions = el._vOptions = [].map.call(el.options, getValue);
      if (curOptions.some(function (o, i) {
        return !looseEqual(o, prevOptions[i]);
      })) {
        trigger(el, 'change');
      }
    }
  }
};

function setSelected(el, binding, vm) {
  var value = binding.value;
  var isMultiple = el.multiple;
  if (isMultiple && !Array.isArray(value)) {
    process.env.NODE_ENV !== 'production' && warn("<select multiple v-model=\"" + binding.expression + "\"> " + "expects an Array value for its binding, but got " + Object.prototype.toString.call(value).slice(8, -1), vm);
    return;
  }
  var selected, option;
  for (var i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i];
    if (isMultiple) {
      selected = looseIndexOf(value, getValue(option)) > -1;
      if (option.selected !== selected) {
        option.selected = selected;
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i;
        }
        return;
      }
    }
  }
  if (!isMultiple) {
    el.selectedIndex = -1;
  }
}

function getValue(option) {
  return '_value' in option ? option._value : option.value;
}

function onCompositionStart(e) {
  e.target.composing = true;
}

function onCompositionEnd(e) {
  // prevent triggering an input event for no reason
  if (!e.target.composing) {
    return;
  }
  e.target.composing = false;
  trigger(e.target, 'input');
}

function trigger(el, type) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}

/*  */

// recursively search for possible transition defined inside the component root
function locateNode(vnode) {
  return vnode.componentInstance && (!vnode.data || !vnode.data.transition) ? locateNode(vnode.componentInstance._vnode) : vnode;
}

var show = {
  bind: function bind(el, ref, vnode) {
    var value = ref.value;

    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    var originalDisplay = el.__vOriginalDisplay = el.style.display === 'none' ? '' : el.style.display;
    if (value && transition$$1) {
      vnode.data.show = true;
      enter(vnode, function () {
        el.style.display = originalDisplay;
      });
    } else {
      el.style.display = value ? originalDisplay : 'none';
    }
  },

  update: function update(el, ref, vnode) {
    var value = ref.value;
    var oldValue = ref.oldValue;

    /* istanbul ignore if */
    if (value === oldValue) {
      return;
    }
    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    if (transition$$1) {
      vnode.data.show = true;
      if (value) {
        enter(vnode, function () {
          el.style.display = el.__vOriginalDisplay;
        });
      } else {
        leave(vnode, function () {
          el.style.display = 'none';
        });
      }
    } else {
      el.style.display = value ? el.__vOriginalDisplay : 'none';
    }
  },

  unbind: function unbind(el, binding, vnode, oldVnode, isDestroy) {
    if (!isDestroy) {
      el.style.display = el.__vOriginalDisplay;
    }
  }
};

var platformDirectives = {
  model: model$1,
  show: show
};

/*  */

// Provides transition support for a single element/component.
// supports transition mode (out-in / in-out)

var transitionProps = {
  name: String,
  appear: Boolean,
  css: Boolean,
  mode: String,
  type: String,
  enterClass: String,
  leaveClass: String,
  enterToClass: String,
  leaveToClass: String,
  enterActiveClass: String,
  leaveActiveClass: String,
  appearClass: String,
  appearActiveClass: String,
  appearToClass: String,
  duration: [Number, String, Object]
};

// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recursively retrieve the real component to be rendered
function getRealChild(vnode) {
  var compOptions = vnode && vnode.componentOptions;
  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children));
  } else {
    return vnode;
  }
}

function extractTransitionData(comp) {
  var data = {};
  var options = comp.$options;
  // props
  for (var key in options.propsData) {
    data[key] = comp[key];
  }
  // events.
  // extract listeners and pass them directly to the transition methods
  var listeners = options._parentListeners;
  for (var key$1 in listeners) {
    data[camelize(key$1)] = listeners[key$1];
  }
  return data;
}

function placeholder(h, rawChild) {
  if (/\d-keep-alive$/.test(rawChild.tag)) {
    return h('keep-alive', {
      props: rawChild.componentOptions.propsData
    });
  }
}

function hasParentTransition(vnode) {
  while (vnode = vnode.parent) {
    if (vnode.data.transition) {
      return true;
    }
  }
}

function isSameChild(child, oldChild) {
  return oldChild.key === child.key && oldChild.tag === child.tag;
}

function isAsyncPlaceholder(node) {
  return node.isComment && node.asyncFactory;
}

var Transition = {
  name: 'transition',
  props: transitionProps,
  abstract: true,

  render: function render(h) {
    var this$1 = this;

    var children = this.$options._renderChildren;
    if (!children) {
      return;
    }

    // filter out text nodes (possible whitespaces)
    children = children.filter(function (c) {
      return c.tag || isAsyncPlaceholder(c);
    });
    /* istanbul ignore if */
    if (!children.length) {
      return;
    }

    // warn multiple elements
    if (process.env.NODE_ENV !== 'production' && children.length > 1) {
      warn('<transition> can only be used on a single element. Use ' + '<transition-group> for lists.', this.$parent);
    }

    var mode = this.mode;

    // warn invalid mode
    if (process.env.NODE_ENV !== 'production' && mode && mode !== 'in-out' && mode !== 'out-in') {
      warn('invalid <transition> mode: ' + mode, this.$parent);
    }

    var rawChild = children[0];

    // if this is a component root node and the component's
    // parent container node also has transition, skip.
    if (hasParentTransition(this.$vnode)) {
      return rawChild;
    }

    // apply transition data to child
    // use getRealChild() to ignore abstract components e.g. keep-alive
    var child = getRealChild(rawChild);
    /* istanbul ignore if */
    if (!child) {
      return rawChild;
    }

    if (this._leaving) {
      return placeholder(h, rawChild);
    }

    // ensure a key that is unique to the vnode type and to this transition
    // component instance. This key will be used to remove pending leaving nodes
    // during entering.
    var id = "__transition-" + this._uid + "-";
    child.key = child.key == null ? child.isComment ? id + 'comment' : id + child.tag : isPrimitive(child.key) ? String(child.key).indexOf(id) === 0 ? child.key : id + child.key : child.key;

    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
    var oldRawChild = this._vnode;
    var oldChild = getRealChild(oldRawChild);

    // mark v-show
    // so that the transition module can hand over the control to the directive
    if (child.data.directives && child.data.directives.some(function (d) {
      return d.name === 'show';
    })) {
      child.data.show = true;
    }

    if (oldChild && oldChild.data && !isSameChild(child, oldChild) && !isAsyncPlaceholder(oldChild)) {
      // replace old child transition data with fresh one
      // important for dynamic transitions!
      var oldData = oldChild && (oldChild.data.transition = extend({}, data));
      // handle transition mode
      if (mode === 'out-in') {
        // return placeholder node and queue update when leave finishes
        this._leaving = true;
        mergeVNodeHook(oldData, 'afterLeave', function () {
          this$1._leaving = false;
          this$1.$forceUpdate();
        });
        return placeholder(h, rawChild);
      } else if (mode === 'in-out') {
        if (isAsyncPlaceholder(child)) {
          return oldRawChild;
        }
        var delayedLeave;
        var performLeave = function () {
          delayedLeave();
        };
        mergeVNodeHook(data, 'afterEnter', performLeave);
        mergeVNodeHook(data, 'enterCancelled', performLeave);
        mergeVNodeHook(oldData, 'delayLeave', function (leave) {
          delayedLeave = leave;
        });
      }
    }

    return rawChild;
  }
};

/*  */

// Provides transition support for list items.
// supports move transitions using the FLIP technique.

// Because the vdom's children update algorithm is "unstable" - i.e.
// it doesn't guarantee the relative positioning of removed elements,
// we force transition-group to update its children into two passes:
// in the first pass, we remove all nodes that need to be removed,
// triggering their leaving transition; in the second pass, we insert/move
// into the final desired state. This way in the second pass removed
// nodes will remain where they should be.

var props = extend({
  tag: String,
  moveClass: String
}, transitionProps);

delete props.mode;

var TransitionGroup = {
  props: props,

  render: function render(h) {
    var tag = this.tag || this.$vnode.data.tag || 'span';
    var map = Object.create(null);
    var prevChildren = this.prevChildren = this.children;
    var rawChildren = this.$slots.default || [];
    var children = this.children = [];
    var transitionData = extractTransitionData(this);

    for (var i = 0; i < rawChildren.length; i++) {
      var c = rawChildren[i];
      if (c.tag) {
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          children.push(c);
          map[c.key] = c;(c.data || (c.data = {})).transition = transitionData;
        } else if (process.env.NODE_ENV !== 'production') {
          var opts = c.componentOptions;
          var name = opts ? opts.Ctor.options.name || opts.tag || '' : c.tag;
          warn("<transition-group> children must be keyed: <" + name + ">");
        }
      }
    }

    if (prevChildren) {
      var kept = [];
      var removed = [];
      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
        var c$1 = prevChildren[i$1];
        c$1.data.transition = transitionData;
        c$1.data.pos = c$1.elm.getBoundingClientRect();
        if (map[c$1.key]) {
          kept.push(c$1);
        } else {
          removed.push(c$1);
        }
      }
      this.kept = h(tag, null, kept);
      this.removed = removed;
    }

    return h(tag, null, children);
  },

  beforeUpdate: function beforeUpdate() {
    // force removing pass
    this.__patch__(this._vnode, this.kept, false, // hydrating
    true // removeOnly (!important, avoids unnecessary moves)
    );
    this._vnode = this.kept;
  },

  updated: function updated() {
    var children = this.prevChildren;
    var moveClass = this.moveClass || (this.name || 'v') + '-move';
    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
      return;
    }

    // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.
    children.forEach(callPendingCbs);
    children.forEach(recordPosition);
    children.forEach(applyTranslation);

    // force reflow to put everything in position
    var body = document.body;
    var f = body.offsetHeight; // eslint-disable-line

    children.forEach(function (c) {
      if (c.data.moved) {
        var el = c.elm;
        var s = el.style;
        addTransitionClass(el, moveClass);
        s.transform = s.WebkitTransform = s.transitionDuration = '';
        el.addEventListener(transitionEndEvent, el._moveCb = function cb(e) {
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener(transitionEndEvent, cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        });
      }
    });
  },

  methods: {
    hasMove: function hasMove(el, moveClass) {
      /* istanbul ignore if */
      if (!hasTransition) {
        return false;
      }
      /* istanbul ignore if */
      if (this._hasMove) {
        return this._hasMove;
      }
      // Detect whether an element with the move class applied has
      // CSS transitions. Since the element may be inside an entering
      // transition at this very moment, we make a clone of it and remove
      // all other transition classes applied to ensure only the move class
      // is applied.
      var clone = el.cloneNode();
      if (el._transitionClasses) {
        el._transitionClasses.forEach(function (cls) {
          removeClass(clone, cls);
        });
      }
      addClass(clone, moveClass);
      clone.style.display = 'none';
      this.$el.appendChild(clone);
      var info = getTransitionInfo(clone);
      this.$el.removeChild(clone);
      return this._hasMove = info.hasTransform;
    }
  }
};

function callPendingCbs(c) {
  /* istanbul ignore if */
  if (c.elm._moveCb) {
    c.elm._moveCb();
  }
  /* istanbul ignore if */
  if (c.elm._enterCb) {
    c.elm._enterCb();
  }
}

function recordPosition(c) {
  c.data.newPos = c.elm.getBoundingClientRect();
}

function applyTranslation(c) {
  var oldPos = c.data.pos;
  var newPos = c.data.newPos;
  var dx = oldPos.left - newPos.left;
  var dy = oldPos.top - newPos.top;
  if (dx || dy) {
    c.data.moved = true;
    var s = c.elm.style;
    s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
    s.transitionDuration = '0s';
  }
}

var platformComponents = {
  Transition: Transition,
  TransitionGroup: TransitionGroup
};

/*  */

// install platform specific utils
Vue$3.config.mustUseProp = mustUseProp;
Vue$3.config.isReservedTag = isReservedTag;
Vue$3.config.isReservedAttr = isReservedAttr;
Vue$3.config.getTagNamespace = getTagNamespace;
Vue$3.config.isUnknownElement = isUnknownElement;

// install platform runtime directives & components
extend(Vue$3.options.directives, platformDirectives);
extend(Vue$3.options.components, platformComponents);

// install platform patch function
Vue$3.prototype.__patch__ = inBrowser ? patch : noop;

// public mount method
Vue$3.prototype.$mount = function (el, hydrating) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating);
};

// devtools global hook
/* istanbul ignore next */
setTimeout(function () {
  if (config.devtools) {
    if (devtools) {
      devtools.emit('init', Vue$3);
    } else if (process.env.NODE_ENV !== 'production' && isChrome) {
      console[console.info ? 'info' : 'log']('Download the Vue Devtools extension for a better development experience:\n' + 'https://github.com/vuejs/vue-devtools');
    }
  }
  if (process.env.NODE_ENV !== 'production' && config.productionTip !== false && inBrowser && typeof console !== 'undefined') {
    console[console.info ? 'info' : 'log']("You are running Vue in development mode.\n" + "Make sure to turn on production mode when deploying for production.\n" + "See more tips at https://vuejs.org/guide/deployment.html");
  }
}, 0);

/*  */

// check whether current browser encodes a char inside attribute values
function shouldDecode(content, encoded) {
  var div = document.createElement('div');
  div.innerHTML = "<div a=\"" + content + "\"/>";
  return div.innerHTML.indexOf(encoded) > 0;
}

// #3663
// IE encodes newlines inside attribute values while other browsers don't
var shouldDecodeNewlines = inBrowser ? shouldDecode('\n', '&#10;') : false;

/*  */

var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;
var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;

var buildRegex = cached(function (delimiters) {
  var open = delimiters[0].replace(regexEscapeRE, '\\$&');
  var close = delimiters[1].replace(regexEscapeRE, '\\$&');
  return new RegExp(open + '((?:.|\\n)+?)' + close, 'g');
});

function parseText(text, delimiters) {
  var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
  if (!tagRE.test(text)) {
    return;
  }
  var tokens = [];
  var lastIndex = tagRE.lastIndex = 0;
  var match, index;
  while (match = tagRE.exec(text)) {
    index = match.index;
    // push text token
    if (index > lastIndex) {
      tokens.push(JSON.stringify(text.slice(lastIndex, index)));
    }
    // tag token
    var exp = parseFilters(match[1].trim());
    tokens.push("_s(" + exp + ")");
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    tokens.push(JSON.stringify(text.slice(lastIndex)));
  }
  return tokens.join('+');
}

/*  */

function transformNode(el, options) {
  var warn = options.warn || baseWarn;
  var staticClass = getAndRemoveAttr(el, 'class');
  if (process.env.NODE_ENV !== 'production' && staticClass) {
    var expression = parseText(staticClass, options.delimiters);
    if (expression) {
      warn("class=\"" + staticClass + "\": " + 'Interpolation inside attributes has been removed. ' + 'Use v-bind or the colon shorthand instead. For example, ' + 'instead of <div class="{{ val }}">, use <div :class="val">.');
    }
  }
  if (staticClass) {
    el.staticClass = JSON.stringify(staticClass);
  }
  var classBinding = getBindingAttr(el, 'class', false /* getStatic */);
  if (classBinding) {
    el.classBinding = classBinding;
  }
}

function genData(el) {
  var data = '';
  if (el.staticClass) {
    data += "staticClass:" + el.staticClass + ",";
  }
  if (el.classBinding) {
    data += "class:" + el.classBinding + ",";
  }
  return data;
}

var klass$1 = {
  staticKeys: ['staticClass'],
  transformNode: transformNode,
  genData: genData
};

/*  */

function transformNode$1(el, options) {
  var warn = options.warn || baseWarn;
  var staticStyle = getAndRemoveAttr(el, 'style');
  if (staticStyle) {
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production') {
      var expression = parseText(staticStyle, options.delimiters);
      if (expression) {
        warn("style=\"" + staticStyle + "\": " + 'Interpolation inside attributes has been removed. ' + 'Use v-bind or the colon shorthand instead. For example, ' + 'instead of <div style="{{ val }}">, use <div :style="val">.');
      }
    }
    el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
  }

  var styleBinding = getBindingAttr(el, 'style', false /* getStatic */);
  if (styleBinding) {
    el.styleBinding = styleBinding;
  }
}

function genData$1(el) {
  var data = '';
  if (el.staticStyle) {
    data += "staticStyle:" + el.staticStyle + ",";
  }
  if (el.styleBinding) {
    data += "style:(" + el.styleBinding + "),";
  }
  return data;
}

var style$1 = {
  staticKeys: ['staticStyle'],
  transformNode: transformNode$1,
  genData: genData$1
};

var modules$1 = [klass$1, style$1];

/*  */

function text(el, dir) {
  if (dir.value) {
    addProp(el, 'textContent', "_s(" + dir.value + ")");
  }
}

/*  */

function html(el, dir) {
  if (dir.value) {
    addProp(el, 'innerHTML', "_s(" + dir.value + ")");
  }
}

var directives$1 = {
  model: model,
  text: text,
  html: html
};

/*  */

var isUnaryTag = makeMap('area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' + 'link,meta,param,source,track,wbr');

// Elements that you can, intentionally, leave open
// (and which close themselves)
var canBeLeftOpenTag = makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source');

// HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
// Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
var isNonPhrasingTag = makeMap('address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' + 'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' + 'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' + 'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' + 'title,tr,track');

/*  */

var baseOptions = {
  expectHTML: true,
  modules: modules$1,
  directives: directives$1,
  isPreTag: isPreTag,
  isUnaryTag: isUnaryTag,
  mustUseProp: mustUseProp,
  canBeLeftOpenTag: canBeLeftOpenTag,
  isReservedTag: isReservedTag,
  getTagNamespace: getTagNamespace,
  staticKeys: genStaticKeys(modules$1)
};

/*  */

var decoder;

var he = {
  decode: function decode(html) {
    decoder = decoder || document.createElement('div');
    decoder.innerHTML = html;
    return decoder.textContent;
  }
};

/**
 * Not type-checking this file because it's mostly vendor code.
 */

/*!
 * HTML Parser By John Resig (ejohn.org)
 * Modified by Juriy "kangax" Zaytsev
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 */

// Regular Expressions for parsing tags and attributes
var singleAttrIdentifier = /([^\s"'<>/=]+)/;
var singleAttrAssign = /(?:=)/;
var singleAttrValues = [
// attr value double quotes
/"([^"]*)"+/.source,
// attr value, single quotes
/'([^']*)'+/.source,
// attr value, no quotes
/([^\s"'=<>`]+)/.source];
var attribute = new RegExp('^\\s*' + singleAttrIdentifier.source + '(?:\\s*(' + singleAttrAssign.source + ')' + '\\s*(?:' + singleAttrValues.join('|') + '))?');

// could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
// but for Vue templates we can enforce a simple charset
var ncname = '[a-zA-Z_][\\w\\-\\.]*';
var qnameCapture = '((?:' + ncname + '\\:)?' + ncname + ')';
var startTagOpen = new RegExp('^<' + qnameCapture);
var startTagClose = /^\s*(\/?)>/;
var endTag = new RegExp('^<\\/' + qnameCapture + '[^>]*>');
var doctype = /^<!DOCTYPE [^>]+>/i;
var comment = /^<!--/;
var conditionalComment = /^<!\[/;

var IS_REGEX_CAPTURING_BROKEN = false;
'x'.replace(/x(.)?/g, function (m, g) {
  IS_REGEX_CAPTURING_BROKEN = g === '';
});

// Special Elements (can contain anything)
var isPlainTextElement = makeMap('script,style,textarea', true);
var reCache = {};

var decodingMap = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&amp;': '&',
  '&#10;': '\n'
};
var encodedAttr = /&(?:lt|gt|quot|amp);/g;
var encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#10);/g;

// #5992
var isIgnoreNewlineTag = makeMap('pre,textarea', true);
var shouldIgnoreFirstNewline = function (tag, html) {
  return tag && isIgnoreNewlineTag(tag) && html[0] === '\n';
};

function decodeAttr(value, shouldDecodeNewlines) {
  var re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
  return value.replace(re, function (match) {
    return decodingMap[match];
  });
}

function parseHTML(html, options) {
  var stack = [];
  var expectHTML = options.expectHTML;
  var isUnaryTag$$1 = options.isUnaryTag || no;
  var canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no;
  var index = 0;
  var last, lastTag;
  while (html) {
    last = html;
    // Make sure we're not in a plaintext content element like script/style
    if (!lastTag || !isPlainTextElement(lastTag)) {
      var textEnd = html.indexOf('<');
      if (textEnd === 0) {
        // Comment:
        if (comment.test(html)) {
          var commentEnd = html.indexOf('-->');

          if (commentEnd >= 0) {
            if (options.shouldKeepComment) {
              options.comment(html.substring(4, commentEnd));
            }
            advance(commentEnd + 3);
            continue;
          }
        }

        // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
        if (conditionalComment.test(html)) {
          var conditionalEnd = html.indexOf(']>');

          if (conditionalEnd >= 0) {
            advance(conditionalEnd + 2);
            continue;
          }
        }

        // Doctype:
        var doctypeMatch = html.match(doctype);
        if (doctypeMatch) {
          advance(doctypeMatch[0].length);
          continue;
        }

        // End tag:
        var endTagMatch = html.match(endTag);
        if (endTagMatch) {
          var curIndex = index;
          advance(endTagMatch[0].length);
          parseEndTag(endTagMatch[1], curIndex, index);
          continue;
        }

        // Start tag:
        var startTagMatch = parseStartTag();
        if (startTagMatch) {
          handleStartTag(startTagMatch);
          if (shouldIgnoreFirstNewline(lastTag, html)) {
            advance(1);
          }
          continue;
        }
      }

      var text = void 0,
          rest = void 0,
          next = void 0;
      if (textEnd >= 0) {
        rest = html.slice(textEnd);
        while (!endTag.test(rest) && !startTagOpen.test(rest) && !comment.test(rest) && !conditionalComment.test(rest)) {
          // < in plain text, be forgiving and treat it as text
          next = rest.indexOf('<', 1);
          if (next < 0) {
            break;
          }
          textEnd += next;
          rest = html.slice(textEnd);
        }
        text = html.substring(0, textEnd);
        advance(textEnd);
      }

      if (textEnd < 0) {
        text = html;
        html = '';
      }

      if (options.chars && text) {
        options.chars(text);
      }
    } else {
      var endTagLength = 0;
      var stackedTag = lastTag.toLowerCase();
      var reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
      var rest$1 = html.replace(reStackedTag, function (all, text, endTag) {
        endTagLength = endTag.length;
        if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
          text = text.replace(/<!--([\s\S]*?)-->/g, '$1').replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
        }
        if (shouldIgnoreFirstNewline(stackedTag, text)) {
          text = text.slice(1);
        }
        if (options.chars) {
          options.chars(text);
        }
        return '';
      });
      index += html.length - rest$1.length;
      html = rest$1;
      parseEndTag(stackedTag, index - endTagLength, index);
    }

    if (html === last) {
      options.chars && options.chars(html);
      if (process.env.NODE_ENV !== 'production' && !stack.length && options.warn) {
        options.warn("Mal-formatted tag at end of template: \"" + html + "\"");
      }
      break;
    }
  }

  // Clean up any remaining tags
  parseEndTag();

  function advance(n) {
    index += n;
    html = html.substring(n);
  }

  function parseStartTag() {
    var start = html.match(startTagOpen);
    if (start) {
      var match = {
        tagName: start[1],
        attrs: [],
        start: index
      };
      advance(start[0].length);
      var end, attr;
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length);
        match.attrs.push(attr);
      }
      if (end) {
        match.unarySlash = end[1];
        advance(end[0].length);
        match.end = index;
        return match;
      }
    }
  }

  function handleStartTag(match) {
    var tagName = match.tagName;
    var unarySlash = match.unarySlash;

    if (expectHTML) {
      if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
        parseEndTag(lastTag);
      }
      if (canBeLeftOpenTag$$1(tagName) && lastTag === tagName) {
        parseEndTag(tagName);
      }
    }

    var unary = isUnaryTag$$1(tagName) || !!unarySlash;

    var l = match.attrs.length;
    var attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      var args = match.attrs[i];
      // hackish work around FF bug https://bugzilla.mozilla.org/show_bug.cgi?id=369778
      if (IS_REGEX_CAPTURING_BROKEN && args[0].indexOf('""') === -1) {
        if (args[3] === '') {
          delete args[3];
        }
        if (args[4] === '') {
          delete args[4];
        }
        if (args[5] === '') {
          delete args[5];
        }
      }
      var value = args[3] || args[4] || args[5] || '';
      attrs[i] = {
        name: args[1],
        value: decodeAttr(value, options.shouldDecodeNewlines)
      };
    }

    if (!unary) {
      stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs });
      lastTag = tagName;
    }

    if (options.start) {
      options.start(tagName, attrs, unary, match.start, match.end);
    }
  }

  function parseEndTag(tagName, start, end) {
    var pos, lowerCasedTagName;
    if (start == null) {
      start = index;
    }
    if (end == null) {
      end = index;
    }

    if (tagName) {
      lowerCasedTagName = tagName.toLowerCase();
    }

    // Find the closest opened tag of the same type
    if (tagName) {
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos].lowerCasedTag === lowerCasedTagName) {
          break;
        }
      }
    } else {
      // If no tag name is provided, clean shop
      pos = 0;
    }

    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (var i = stack.length - 1; i >= pos; i--) {
        if (process.env.NODE_ENV !== 'production' && (i > pos || !tagName) && options.warn) {
          options.warn("tag <" + stack[i].tag + "> has no matching end tag.");
        }
        if (options.end) {
          options.end(stack[i].tag, start, end);
        }
      }

      // Remove the open elements from the stack
      stack.length = pos;
      lastTag = pos && stack[pos - 1].tag;
    } else if (lowerCasedTagName === 'br') {
      if (options.start) {
        options.start(tagName, [], true, start, end);
      }
    } else if (lowerCasedTagName === 'p') {
      if (options.start) {
        options.start(tagName, [], false, start, end);
      }
      if (options.end) {
        options.end(tagName, start, end);
      }
    }
  }
}

/*  */

var onRE = /^@|^v-on:/;
var dirRE = /^v-|^@|^:/;
var forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/;
var forIteratorRE = /\((\{[^}]*\}|[^,]*),([^,]*)(?:,([^,]*))?\)/;

var argRE = /:(.*)$/;
var bindRE = /^:|^v-bind:/;
var modifierRE = /\.[^.]+/g;

var decodeHTMLCached = cached(he.decode);

// configurable state
var warn$2;
var delimiters;
var transforms;
var preTransforms;
var postTransforms;
var platformIsPreTag;
var platformMustUseProp;
var platformGetTagNamespace;

/**
 * Convert HTML string to AST.
 */
function parse(template, options) {
  warn$2 = options.warn || baseWarn;

  platformIsPreTag = options.isPreTag || no;
  platformMustUseProp = options.mustUseProp || no;
  platformGetTagNamespace = options.getTagNamespace || no;

  transforms = pluckModuleFunction(options.modules, 'transformNode');
  preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
  postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');

  delimiters = options.delimiters;

  var stack = [];
  var preserveWhitespace = options.preserveWhitespace !== false;
  var root;
  var currentParent;
  var inVPre = false;
  var inPre = false;
  var warned = false;

  function warnOnce(msg) {
    if (!warned) {
      warned = true;
      warn$2(msg);
    }
  }

  function endPre(element) {
    // check pre state
    if (element.pre) {
      inVPre = false;
    }
    if (platformIsPreTag(element.tag)) {
      inPre = false;
    }
  }

  parseHTML(template, {
    warn: warn$2,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    canBeLeftOpenTag: options.canBeLeftOpenTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    shouldKeepComment: options.comments,
    start: function start(tag, attrs, unary) {
      // check namespace.
      // inherit parent ns if there is one
      var ns = currentParent && currentParent.ns || platformGetTagNamespace(tag);

      // handle IE svg bug
      /* istanbul ignore if */
      if (isIE && ns === 'svg') {
        attrs = guardIESVGBug(attrs);
      }

      var element = {
        type: 1,
        tag: tag,
        attrsList: attrs,
        attrsMap: makeAttrsMap(attrs),
        parent: currentParent,
        children: []
      };
      if (ns) {
        element.ns = ns;
      }

      if (isForbiddenTag(element) && !isServerRendering()) {
        element.forbidden = true;
        process.env.NODE_ENV !== 'production' && warn$2('Templates should only be responsible for mapping the state to the ' + 'UI. Avoid placing tags with side-effects in your templates, such as ' + "<" + tag + ">" + ', as they will not be parsed.');
      }

      // apply pre-transforms
      for (var i = 0; i < preTransforms.length; i++) {
        preTransforms[i](element, options);
      }

      if (!inVPre) {
        processPre(element);
        if (element.pre) {
          inVPre = true;
        }
      }
      if (platformIsPreTag(element.tag)) {
        inPre = true;
      }
      if (inVPre) {
        processRawAttrs(element);
      } else {
        processFor(element);
        processIf(element);
        processOnce(element);
        processKey(element);

        // determine whether this is a plain element after
        // removing structural attributes
        element.plain = !element.key && !attrs.length;

        processRef(element);
        processSlot(element);
        processComponent(element);
        for (var i$1 = 0; i$1 < transforms.length; i$1++) {
          transforms[i$1](element, options);
        }
        processAttrs(element);
      }

      function checkRootConstraints(el) {
        if (process.env.NODE_ENV !== 'production') {
          if (el.tag === 'slot' || el.tag === 'template') {
            warnOnce("Cannot use <" + el.tag + "> as component root element because it may " + 'contain multiple nodes.');
          }
          if (el.attrsMap.hasOwnProperty('v-for')) {
            warnOnce('Cannot use v-for on stateful component root element because ' + 'it renders multiple elements.');
          }
        }
      }

      // tree management
      if (!root) {
        root = element;
        checkRootConstraints(root);
      } else if (!stack.length) {
        // allow root elements with v-if, v-else-if and v-else
        if (root.if && (element.elseif || element.else)) {
          checkRootConstraints(element);
          addIfCondition(root, {
            exp: element.elseif,
            block: element
          });
        } else if (process.env.NODE_ENV !== 'production') {
          warnOnce("Component template should contain exactly one root element. " + "If you are using v-if on multiple elements, " + "use v-else-if to chain them instead.");
        }
      }
      if (currentParent && !element.forbidden) {
        if (element.elseif || element.else) {
          processIfConditions(element, currentParent);
        } else if (element.slotScope) {
          // scoped slot
          currentParent.plain = false;
          var name = element.slotTarget || '"default"';(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
        } else {
          currentParent.children.push(element);
          element.parent = currentParent;
        }
      }
      if (!unary) {
        currentParent = element;
        stack.push(element);
      } else {
        endPre(element);
      }
      // apply post-transforms
      for (var i$2 = 0; i$2 < postTransforms.length; i$2++) {
        postTransforms[i$2](element, options);
      }
    },

    end: function end() {
      // remove trailing whitespace
      var element = stack[stack.length - 1];
      var lastNode = element.children[element.children.length - 1];
      if (lastNode && lastNode.type === 3 && lastNode.text === ' ' && !inPre) {
        element.children.pop();
      }
      // pop stack
      stack.length -= 1;
      currentParent = stack[stack.length - 1];
      endPre(element);
    },

    chars: function chars(text) {
      if (!currentParent) {
        if (process.env.NODE_ENV !== 'production') {
          if (text === template) {
            warnOnce('Component template requires a root element, rather than just text.');
          } else if (text = text.trim()) {
            warnOnce("text \"" + text + "\" outside root element will be ignored.");
          }
        }
        return;
      }
      // IE textarea placeholder bug
      /* istanbul ignore if */
      if (isIE && currentParent.tag === 'textarea' && currentParent.attrsMap.placeholder === text) {
        return;
      }
      var children = currentParent.children;
      text = inPre || text.trim() ? isTextTag(currentParent) ? text : decodeHTMLCached(text)
      // only preserve whitespace if its not right after a starting tag
      : preserveWhitespace && children.length ? ' ' : '';
      if (text) {
        var expression;
        if (!inVPre && text !== ' ' && (expression = parseText(text, delimiters))) {
          children.push({
            type: 2,
            expression: expression,
            text: text
          });
        } else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
          children.push({
            type: 3,
            text: text
          });
        }
      }
    },
    comment: function comment(text) {
      currentParent.children.push({
        type: 3,
        text: text,
        isComment: true
      });
    }
  });
  return root;
}

function processPre(el) {
  if (getAndRemoveAttr(el, 'v-pre') != null) {
    el.pre = true;
  }
}

function processRawAttrs(el) {
  var l = el.attrsList.length;
  if (l) {
    var attrs = el.attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      attrs[i] = {
        name: el.attrsList[i].name,
        value: JSON.stringify(el.attrsList[i].value)
      };
    }
  } else if (!el.pre) {
    // non root node in pre blocks with no attributes
    el.plain = true;
  }
}

function processKey(el) {
  var exp = getBindingAttr(el, 'key');
  if (exp) {
    if (process.env.NODE_ENV !== 'production' && el.tag === 'template') {
      warn$2("<template> cannot be keyed. Place the key on real elements instead.");
    }
    el.key = exp;
  }
}

function processRef(el) {
  var ref = getBindingAttr(el, 'ref');
  if (ref) {
    el.ref = ref;
    el.refInFor = checkInFor(el);
  }
}

function processFor(el) {
  var exp;
  if (exp = getAndRemoveAttr(el, 'v-for')) {
    var inMatch = exp.match(forAliasRE);
    if (!inMatch) {
      process.env.NODE_ENV !== 'production' && warn$2("Invalid v-for expression: " + exp);
      return;
    }
    el.for = inMatch[2].trim();
    var alias = inMatch[1].trim();
    var iteratorMatch = alias.match(forIteratorRE);
    if (iteratorMatch) {
      el.alias = iteratorMatch[1].trim();
      el.iterator1 = iteratorMatch[2].trim();
      if (iteratorMatch[3]) {
        el.iterator2 = iteratorMatch[3].trim();
      }
    } else {
      el.alias = alias;
    }
  }
}

function processIf(el) {
  var exp = getAndRemoveAttr(el, 'v-if');
  if (exp) {
    el.if = exp;
    addIfCondition(el, {
      exp: exp,
      block: el
    });
  } else {
    if (getAndRemoveAttr(el, 'v-else') != null) {
      el.else = true;
    }
    var elseif = getAndRemoveAttr(el, 'v-else-if');
    if (elseif) {
      el.elseif = elseif;
    }
  }
}

function processIfConditions(el, parent) {
  var prev = findPrevElement(parent.children);
  if (prev && prev.if) {
    addIfCondition(prev, {
      exp: el.elseif,
      block: el
    });
  } else if (process.env.NODE_ENV !== 'production') {
    warn$2("v-" + (el.elseif ? 'else-if="' + el.elseif + '"' : 'else') + " " + "used on element <" + el.tag + "> without corresponding v-if.");
  }
}

function findPrevElement(children) {
  var i = children.length;
  while (i--) {
    if (children[i].type === 1) {
      return children[i];
    } else {
      if (process.env.NODE_ENV !== 'production' && children[i].text !== ' ') {
        warn$2("text \"" + children[i].text.trim() + "\" between v-if and v-else(-if) " + "will be ignored.");
      }
      children.pop();
    }
  }
}

function addIfCondition(el, condition) {
  if (!el.ifConditions) {
    el.ifConditions = [];
  }
  el.ifConditions.push(condition);
}

function processOnce(el) {
  var once$$1 = getAndRemoveAttr(el, 'v-once');
  if (once$$1 != null) {
    el.once = true;
  }
}

function processSlot(el) {
  if (el.tag === 'slot') {
    el.slotName = getBindingAttr(el, 'name');
    if (process.env.NODE_ENV !== 'production' && el.key) {
      warn$2("`key` does not work on <slot> because slots are abstract outlets " + "and can possibly expand into multiple elements. " + "Use the key on a wrapping element instead.");
    }
  } else {
    var slotTarget = getBindingAttr(el, 'slot');
    if (slotTarget) {
      el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
    }
    if (el.tag === 'template') {
      el.slotScope = getAndRemoveAttr(el, 'scope');
    }
  }
}

function processComponent(el) {
  var binding;
  if (binding = getBindingAttr(el, 'is')) {
    el.component = binding;
  }
  if (getAndRemoveAttr(el, 'inline-template') != null) {
    el.inlineTemplate = true;
  }
}

function processAttrs(el) {
  var list = el.attrsList;
  var i, l, name, rawName, value, modifiers, isProp;
  for (i = 0, l = list.length; i < l; i++) {
    name = rawName = list[i].name;
    value = list[i].value;
    if (dirRE.test(name)) {
      // mark element as dynamic
      el.hasBindings = true;
      // modifiers
      modifiers = parseModifiers(name);
      if (modifiers) {
        name = name.replace(modifierRE, '');
      }
      if (bindRE.test(name)) {
        // v-bind
        name = name.replace(bindRE, '');
        value = parseFilters(value);
        isProp = false;
        if (modifiers) {
          if (modifiers.prop) {
            isProp = true;
            name = camelize(name);
            if (name === 'innerHtml') {
              name = 'innerHTML';
            }
          }
          if (modifiers.camel) {
            name = camelize(name);
          }
          if (modifiers.sync) {
            addHandler(el, "update:" + camelize(name), genAssignmentCode(value, "$event"));
          }
        }
        if (isProp || !el.component && platformMustUseProp(el.tag, el.attrsMap.type, name)) {
          addProp(el, name, value);
        } else {
          addAttr(el, name, value);
        }
      } else if (onRE.test(name)) {
        // v-on
        name = name.replace(onRE, '');
        addHandler(el, name, value, modifiers, false, warn$2);
      } else {
        // normal directives
        name = name.replace(dirRE, '');
        // parse arg
        var argMatch = name.match(argRE);
        var arg = argMatch && argMatch[1];
        if (arg) {
          name = name.slice(0, -(arg.length + 1));
        }
        addDirective(el, name, rawName, value, arg, modifiers);
        if (process.env.NODE_ENV !== 'production' && name === 'model') {
          checkForAliasModel(el, value);
        }
      }
    } else {
      // literal attribute
      if (process.env.NODE_ENV !== 'production') {
        var expression = parseText(value, delimiters);
        if (expression) {
          warn$2(name + "=\"" + value + "\": " + 'Interpolation inside attributes has been removed. ' + 'Use v-bind or the colon shorthand instead. For example, ' + 'instead of <div id="{{ val }}">, use <div :id="val">.');
        }
      }
      addAttr(el, name, JSON.stringify(value));
    }
  }
}

function checkInFor(el) {
  var parent = el;
  while (parent) {
    if (parent.for !== undefined) {
      return true;
    }
    parent = parent.parent;
  }
  return false;
}

function parseModifiers(name) {
  var match = name.match(modifierRE);
  if (match) {
    var ret = {};
    match.forEach(function (m) {
      ret[m.slice(1)] = true;
    });
    return ret;
  }
}

function makeAttrsMap(attrs) {
  var map = {};
  for (var i = 0, l = attrs.length; i < l; i++) {
    if (process.env.NODE_ENV !== 'production' && map[attrs[i].name] && !isIE && !isEdge) {
      warn$2('duplicate attribute: ' + attrs[i].name);
    }
    map[attrs[i].name] = attrs[i].value;
  }
  return map;
}

// for script (e.g. type="x/template") or style, do not decode content
function isTextTag(el) {
  return el.tag === 'script' || el.tag === 'style';
}

function isForbiddenTag(el) {
  return el.tag === 'style' || el.tag === 'script' && (!el.attrsMap.type || el.attrsMap.type === 'text/javascript');
}

var ieNSBug = /^xmlns:NS\d+/;
var ieNSPrefix = /^NS\d+:/;

/* istanbul ignore next */
function guardIESVGBug(attrs) {
  var res = [];
  for (var i = 0; i < attrs.length; i++) {
    var attr = attrs[i];
    if (!ieNSBug.test(attr.name)) {
      attr.name = attr.name.replace(ieNSPrefix, '');
      res.push(attr);
    }
  }
  return res;
}

function checkForAliasModel(el, value) {
  var _el = el;
  while (_el) {
    if (_el.for && _el.alias === value) {
      warn$2("<" + el.tag + " v-model=\"" + value + "\">: " + "You are binding v-model directly to a v-for iteration alias. " + "This will not be able to modify the v-for source array because " + "writing to the alias is like modifying a function local variable. " + "Consider using an array of objects and use v-model on an object property instead.");
    }
    _el = _el.parent;
  }
}

/*  */

var isStaticKey;
var isPlatformReservedTag;

var genStaticKeysCached = cached(genStaticKeys$1);

/**
 * Goal of the optimizer: walk the generated template AST tree
 * and detect sub-trees that are purely static, i.e. parts of
 * the DOM that never needs to change.
 *
 * Once we detect these sub-trees, we can:
 *
 * 1. Hoist them into constants, so that we no longer need to
 *    create fresh nodes for them on each re-render;
 * 2. Completely skip them in the patching process.
 */
function optimize(root, options) {
  if (!root) {
    return;
  }
  isStaticKey = genStaticKeysCached(options.staticKeys || '');
  isPlatformReservedTag = options.isReservedTag || no;
  // first pass: mark all non-static nodes.
  markStatic$1(root);
  // second pass: mark static roots.
  markStaticRoots(root, false);
}

function genStaticKeys$1(keys) {
  return makeMap('type,tag,attrsList,attrsMap,plain,parent,children,attrs' + (keys ? ',' + keys : ''));
}

function markStatic$1(node) {
  node.static = isStatic(node);
  if (node.type === 1) {
    // do not make component slot content static. this avoids
    // 1. components not able to mutate slot nodes
    // 2. static slot content fails for hot-reloading
    if (!isPlatformReservedTag(node.tag) && node.tag !== 'slot' && node.attrsMap['inline-template'] == null) {
      return;
    }
    for (var i = 0, l = node.children.length; i < l; i++) {
      var child = node.children[i];
      markStatic$1(child);
      if (!child.static) {
        node.static = false;
      }
    }
    if (node.ifConditions) {
      for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
        var block = node.ifConditions[i$1].block;
        markStatic$1(block);
        if (!block.static) {
          node.static = false;
        }
      }
    }
  }
}

function markStaticRoots(node, isInFor) {
  if (node.type === 1) {
    if (node.static || node.once) {
      node.staticInFor = isInFor;
    }
    // For a node to qualify as a static root, it should have children that
    // are not just static text. Otherwise the cost of hoisting out will
    // outweigh the benefits and it's better off to just always render it fresh.
    if (node.static && node.children.length && !(node.children.length === 1 && node.children[0].type === 3)) {
      node.staticRoot = true;
      return;
    } else {
      node.staticRoot = false;
    }
    if (node.children) {
      for (var i = 0, l = node.children.length; i < l; i++) {
        markStaticRoots(node.children[i], isInFor || !!node.for);
      }
    }
    if (node.ifConditions) {
      for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
        markStaticRoots(node.ifConditions[i$1].block, isInFor);
      }
    }
  }
}

function isStatic(node) {
  if (node.type === 2) {
    // expression
    return false;
  }
  if (node.type === 3) {
    // text
    return true;
  }
  return !!(node.pre || !node.hasBindings && // no dynamic bindings
  !node.if && !node.for && // not v-if or v-for or v-else
  !isBuiltInTag(node.tag) && // not a built-in
  isPlatformReservedTag(node.tag) && // not a component
  !isDirectChildOfTemplateFor(node) && Object.keys(node).every(isStaticKey));
}

function isDirectChildOfTemplateFor(node) {
  while (node.parent) {
    node = node.parent;
    if (node.tag !== 'template') {
      return false;
    }
    if (node.for) {
      return true;
    }
  }
  return false;
}

/*  */

var fnExpRE = /^\s*([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/;
var simplePathRE = /^\s*[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?']|\[".*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*\s*$/;

// keyCode aliases
var keyCodes = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  up: 38,
  left: 37,
  right: 39,
  down: 40,
  'delete': [8, 46]
};

// #4868: modifiers that prevent the execution of the listener
// need to explicitly return null so that we can determine whether to remove
// the listener for .once
var genGuard = function (condition) {
  return "if(" + condition + ")return null;";
};

var modifierCode = {
  stop: '$event.stopPropagation();',
  prevent: '$event.preventDefault();',
  self: genGuard("$event.target !== $event.currentTarget"),
  ctrl: genGuard("!$event.ctrlKey"),
  shift: genGuard("!$event.shiftKey"),
  alt: genGuard("!$event.altKey"),
  meta: genGuard("!$event.metaKey"),
  left: genGuard("'button' in $event && $event.button !== 0"),
  middle: genGuard("'button' in $event && $event.button !== 1"),
  right: genGuard("'button' in $event && $event.button !== 2")
};

function genHandlers(events, isNative, warn) {
  var res = isNative ? 'nativeOn:{' : 'on:{';
  for (var name in events) {
    var handler = events[name];
    // #5330: warn click.right, since right clicks do not actually fire click events.
    if (process.env.NODE_ENV !== 'production' && name === 'click' && handler && handler.modifiers && handler.modifiers.right) {
      warn("Use \"contextmenu\" instead of \"click.right\" since right clicks " + "do not actually fire \"click\" events.");
    }
    res += "\"" + name + "\":" + genHandler(name, handler) + ",";
  }
  return res.slice(0, -1) + '}';
}

function genHandler(name, handler) {
  if (!handler) {
    return 'function(){}';
  }

  if (Array.isArray(handler)) {
    return "[" + handler.map(function (handler) {
      return genHandler(name, handler);
    }).join(',') + "]";
  }

  var isMethodPath = simplePathRE.test(handler.value);
  var isFunctionExpression = fnExpRE.test(handler.value);

  if (!handler.modifiers) {
    return isMethodPath || isFunctionExpression ? handler.value : "function($event){" + handler.value + "}"; // inline statement
  } else {
    var code = '';
    var genModifierCode = '';
    var keys = [];
    for (var key in handler.modifiers) {
      if (modifierCode[key]) {
        genModifierCode += modifierCode[key];
        // left/right
        if (keyCodes[key]) {
          keys.push(key);
        }
      } else {
        keys.push(key);
      }
    }
    if (keys.length) {
      code += genKeyFilter(keys);
    }
    // Make sure modifiers like prevent and stop get executed after key filtering
    if (genModifierCode) {
      code += genModifierCode;
    }
    var handlerCode = isMethodPath ? handler.value + '($event)' : isFunctionExpression ? "(" + handler.value + ")($event)" : handler.value;
    return "function($event){" + code + handlerCode + "}";
  }
}

function genKeyFilter(keys) {
  return "if(!('button' in $event)&&" + keys.map(genFilterCode).join('&&') + ")return null;";
}

function genFilterCode(key) {
  var keyVal = parseInt(key, 10);
  if (keyVal) {
    return "$event.keyCode!==" + keyVal;
  }
  var alias = keyCodes[key];
  return "_k($event.keyCode," + JSON.stringify(key) + (alias ? ',' + JSON.stringify(alias) : '') + ")";
}

/*  */

function on(el, dir) {
  if (process.env.NODE_ENV !== 'production' && dir.modifiers) {
    warn("v-on without argument does not support modifiers.");
  }
  el.wrapListeners = function (code) {
    return "_g(" + code + "," + dir.value + ")";
  };
}

/*  */

function bind$1(el, dir) {
  el.wrapData = function (code) {
    return "_b(" + code + ",'" + el.tag + "'," + dir.value + "," + (dir.modifiers && dir.modifiers.prop ? 'true' : 'false') + (dir.modifiers && dir.modifiers.sync ? ',true' : '') + ")";
  };
}

/*  */

var baseDirectives = {
  on: on,
  bind: bind$1,
  cloak: noop
};

/*  */

var CodegenState = function CodegenState(options) {
  this.options = options;
  this.warn = options.warn || baseWarn;
  this.transforms = pluckModuleFunction(options.modules, 'transformCode');
  this.dataGenFns = pluckModuleFunction(options.modules, 'genData');
  this.directives = extend(extend({}, baseDirectives), options.directives);
  var isReservedTag = options.isReservedTag || no;
  this.maybeComponent = function (el) {
    return !isReservedTag(el.tag);
  };
  this.onceId = 0;
  this.staticRenderFns = [];
};

function generate(ast, options) {
  var state = new CodegenState(options);
  var code = ast ? genElement(ast, state) : '_c("div")';
  return {
    render: "with(this){return " + code + "}",
    staticRenderFns: state.staticRenderFns
  };
}

function genElement(el, state) {
  if (el.staticRoot && !el.staticProcessed) {
    return genStatic(el, state);
  } else if (el.once && !el.onceProcessed) {
    return genOnce(el, state);
  } else if (el.for && !el.forProcessed) {
    return genFor(el, state);
  } else if (el.if && !el.ifProcessed) {
    return genIf(el, state);
  } else if (el.tag === 'template' && !el.slotTarget) {
    return genChildren(el, state) || 'void 0';
  } else if (el.tag === 'slot') {
    return genSlot(el, state);
  } else {
    // component or element
    var code;
    if (el.component) {
      code = genComponent(el.component, el, state);
    } else {
      var data = el.plain ? undefined : genData$2(el, state);

      var children = el.inlineTemplate ? null : genChildren(el, state, true);
      code = "_c('" + el.tag + "'" + (data ? "," + data : '') + (children ? "," + children : '') + ")";
    }
    // module transforms
    for (var i = 0; i < state.transforms.length; i++) {
      code = state.transforms[i](el, code);
    }
    return code;
  }
}

// hoist static sub-trees out
function genStatic(el, state) {
  el.staticProcessed = true;
  state.staticRenderFns.push("with(this){return " + genElement(el, state) + "}");
  return "_m(" + (state.staticRenderFns.length - 1) + (el.staticInFor ? ',true' : '') + ")";
}

// v-once
function genOnce(el, state) {
  el.onceProcessed = true;
  if (el.if && !el.ifProcessed) {
    return genIf(el, state);
  } else if (el.staticInFor) {
    var key = '';
    var parent = el.parent;
    while (parent) {
      if (parent.for) {
        key = parent.key;
        break;
      }
      parent = parent.parent;
    }
    if (!key) {
      process.env.NODE_ENV !== 'production' && state.warn("v-once can only be used inside v-for that is keyed. ");
      return genElement(el, state);
    }
    return "_o(" + genElement(el, state) + "," + state.onceId++ + (key ? "," + key : "") + ")";
  } else {
    return genStatic(el, state);
  }
}

function genIf(el, state, altGen, altEmpty) {
  el.ifProcessed = true; // avoid recursion
  return genIfConditions(el.ifConditions.slice(), state, altGen, altEmpty);
}

function genIfConditions(conditions, state, altGen, altEmpty) {
  if (!conditions.length) {
    return altEmpty || '_e()';
  }

  var condition = conditions.shift();
  if (condition.exp) {
    return "(" + condition.exp + ")?" + genTernaryExp(condition.block) + ":" + genIfConditions(conditions, state, altGen, altEmpty);
  } else {
    return "" + genTernaryExp(condition.block);
  }

  // v-if with v-once should generate code like (a)?_m(0):_m(1)
  function genTernaryExp(el) {
    return altGen ? altGen(el, state) : el.once ? genOnce(el, state) : genElement(el, state);
  }
}

function genFor(el, state, altGen, altHelper) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? "," + el.iterator1 : '';
  var iterator2 = el.iterator2 ? "," + el.iterator2 : '';

  if (process.env.NODE_ENV !== 'production' && state.maybeComponent(el) && el.tag !== 'slot' && el.tag !== 'template' && !el.key) {
    state.warn("<" + el.tag + " v-for=\"" + alias + " in " + exp + "\">: component lists rendered with " + "v-for should have explicit keys. " + "See https://vuejs.org/guide/list.html#key for more info.", true /* tip */
    );
  }

  el.forProcessed = true; // avoid recursion
  return (altHelper || '_l') + "((" + exp + ")," + "function(" + alias + iterator1 + iterator2 + "){" + "return " + (altGen || genElement)(el, state) + '})';
}

function genData$2(el, state) {
  var data = '{';

  // directives first.
  // directives may mutate the el's other properties before they are generated.
  var dirs = genDirectives(el, state);
  if (dirs) {
    data += dirs + ',';
  }

  // key
  if (el.key) {
    data += "key:" + el.key + ",";
  }
  // ref
  if (el.ref) {
    data += "ref:" + el.ref + ",";
  }
  if (el.refInFor) {
    data += "refInFor:true,";
  }
  // pre
  if (el.pre) {
    data += "pre:true,";
  }
  // record original tag name for components using "is" attribute
  if (el.component) {
    data += "tag:\"" + el.tag + "\",";
  }
  // module data generation functions
  for (var i = 0; i < state.dataGenFns.length; i++) {
    data += state.dataGenFns[i](el);
  }
  // attributes
  if (el.attrs) {
    data += "attrs:{" + genProps(el.attrs) + "},";
  }
  // DOM props
  if (el.props) {
    data += "domProps:{" + genProps(el.props) + "},";
  }
  // event handlers
  if (el.events) {
    data += genHandlers(el.events, false, state.warn) + ",";
  }
  if (el.nativeEvents) {
    data += genHandlers(el.nativeEvents, true, state.warn) + ",";
  }
  // slot target
  if (el.slotTarget) {
    data += "slot:" + el.slotTarget + ",";
  }
  // scoped slots
  if (el.scopedSlots) {
    data += genScopedSlots(el.scopedSlots, state) + ",";
  }
  // component v-model
  if (el.model) {
    data += "model:{value:" + el.model.value + ",callback:" + el.model.callback + ",expression:" + el.model.expression + "},";
  }
  // inline-template
  if (el.inlineTemplate) {
    var inlineTemplate = genInlineTemplate(el, state);
    if (inlineTemplate) {
      data += inlineTemplate + ",";
    }
  }
  data = data.replace(/,$/, '') + '}';
  // v-bind data wrap
  if (el.wrapData) {
    data = el.wrapData(data);
  }
  // v-on data wrap
  if (el.wrapListeners) {
    data = el.wrapListeners(data);
  }
  return data;
}

function genDirectives(el, state) {
  var dirs = el.directives;
  if (!dirs) {
    return;
  }
  var res = 'directives:[';
  var hasRuntime = false;
  var i, l, dir, needRuntime;
  for (i = 0, l = dirs.length; i < l; i++) {
    dir = dirs[i];
    needRuntime = true;
    var gen = state.directives[dir.name];
    if (gen) {
      // compile-time directive that manipulates AST.
      // returns true if it also needs a runtime counterpart.
      needRuntime = !!gen(el, dir, state.warn);
    }
    if (needRuntime) {
      hasRuntime = true;
      res += "{name:\"" + dir.name + "\",rawName:\"" + dir.rawName + "\"" + (dir.value ? ",value:(" + dir.value + "),expression:" + JSON.stringify(dir.value) : '') + (dir.arg ? ",arg:\"" + dir.arg + "\"" : '') + (dir.modifiers ? ",modifiers:" + JSON.stringify(dir.modifiers) : '') + "},";
    }
  }
  if (hasRuntime) {
    return res.slice(0, -1) + ']';
  }
}

function genInlineTemplate(el, state) {
  var ast = el.children[0];
  if (process.env.NODE_ENV !== 'production' && (el.children.length > 1 || ast.type !== 1)) {
    state.warn('Inline-template components must have exactly one child element.');
  }
  if (ast.type === 1) {
    var inlineRenderFns = generate(ast, state.options);
    return "inlineTemplate:{render:function(){" + inlineRenderFns.render + "},staticRenderFns:[" + inlineRenderFns.staticRenderFns.map(function (code) {
      return "function(){" + code + "}";
    }).join(',') + "]}";
  }
}

function genScopedSlots(slots, state) {
  return "scopedSlots:_u([" + Object.keys(slots).map(function (key) {
    return genScopedSlot(key, slots[key], state);
  }).join(',') + "])";
}

function genScopedSlot(key, el, state) {
  if (el.for && !el.forProcessed) {
    return genForScopedSlot(key, el, state);
  }
  return "{key:" + key + ",fn:function(" + String(el.attrsMap.scope) + "){" + "return " + (el.tag === 'template' ? genChildren(el, state) || 'void 0' : genElement(el, state)) + "}}";
}

function genForScopedSlot(key, el, state) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? "," + el.iterator1 : '';
  var iterator2 = el.iterator2 ? "," + el.iterator2 : '';
  el.forProcessed = true; // avoid recursion
  return "_l((" + exp + ")," + "function(" + alias + iterator1 + iterator2 + "){" + "return " + genScopedSlot(key, el, state) + '})';
}

function genChildren(el, state, checkSkip, altGenElement, altGenNode) {
  var children = el.children;
  if (children.length) {
    var el$1 = children[0];
    // optimize single v-for
    if (children.length === 1 && el$1.for && el$1.tag !== 'template' && el$1.tag !== 'slot') {
      return (altGenElement || genElement)(el$1, state);
    }
    var normalizationType = checkSkip ? getNormalizationType(children, state.maybeComponent) : 0;
    var gen = altGenNode || genNode;
    return "[" + children.map(function (c) {
      return gen(c, state);
    }).join(',') + "]" + (normalizationType ? "," + normalizationType : '');
  }
}

// determine the normalization needed for the children array.
// 0: no normalization needed
// 1: simple normalization needed (possible 1-level deep nested array)
// 2: full normalization needed
function getNormalizationType(children, maybeComponent) {
  var res = 0;
  for (var i = 0; i < children.length; i++) {
    var el = children[i];
    if (el.type !== 1) {
      continue;
    }
    if (needsNormalization(el) || el.ifConditions && el.ifConditions.some(function (c) {
      return needsNormalization(c.block);
    })) {
      res = 2;
      break;
    }
    if (maybeComponent(el) || el.ifConditions && el.ifConditions.some(function (c) {
      return maybeComponent(c.block);
    })) {
      res = 1;
    }
  }
  return res;
}

function needsNormalization(el) {
  return el.for !== undefined || el.tag === 'template' || el.tag === 'slot';
}

function genNode(node, state) {
  if (node.type === 1) {
    return genElement(node, state);
  }if (node.type === 3 && node.isComment) {
    return genComment(node);
  } else {
    return genText(node);
  }
}

function genText(text) {
  return "_v(" + (text.type === 2 ? text.expression // no need for () because already wrapped in _s()
  : transformSpecialNewlines(JSON.stringify(text.text))) + ")";
}

function genComment(comment) {
  return "_e(" + JSON.stringify(comment.text) + ")";
}

function genSlot(el, state) {
  var slotName = el.slotName || '"default"';
  var children = genChildren(el, state);
  var res = "_t(" + slotName + (children ? "," + children : '');
  var attrs = el.attrs && "{" + el.attrs.map(function (a) {
    return camelize(a.name) + ":" + a.value;
  }).join(',') + "}";
  var bind$$1 = el.attrsMap['v-bind'];
  if ((attrs || bind$$1) && !children) {
    res += ",null";
  }
  if (attrs) {
    res += "," + attrs;
  }
  if (bind$$1) {
    res += (attrs ? '' : ',null') + "," + bind$$1;
  }
  return res + ')';
}

// componentName is el.component, take it as argument to shun flow's pessimistic refinement
function genComponent(componentName, el, state) {
  var children = el.inlineTemplate ? null : genChildren(el, state, true);
  return "_c(" + componentName + "," + genData$2(el, state) + (children ? "," + children : '') + ")";
}

function genProps(props) {
  var res = '';
  for (var i = 0; i < props.length; i++) {
    var prop = props[i];
    res += "\"" + prop.name + "\":" + transformSpecialNewlines(prop.value) + ",";
  }
  return res.slice(0, -1);
}

// #3895, #4268
function transformSpecialNewlines(text) {
  return text.replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
}

/*  */

// these keywords should not appear inside expressions, but operators like
// typeof, instanceof and in are allowed
var prohibitedKeywordRE = new RegExp('\\b' + ('do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' + 'super,throw,while,yield,delete,export,import,return,switch,default,' + 'extends,finally,continue,debugger,function,arguments').split(',').join('\\b|\\b') + '\\b');

// these unary operators should not be used as property/method names
var unaryOperatorsRE = new RegExp('\\b' + 'delete,typeof,void'.split(',').join('\\s*\\([^\\)]*\\)|\\b') + '\\s*\\([^\\)]*\\)');

// check valid identifier for v-for
var identRE = /[A-Za-z_$][\w$]*/;

// strip strings in expressions
var stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;

// detect problematic expressions in a template
function detectErrors(ast) {
  var errors = [];
  if (ast) {
    checkNode(ast, errors);
  }
  return errors;
}

function checkNode(node, errors) {
  if (node.type === 1) {
    for (var name in node.attrsMap) {
      if (dirRE.test(name)) {
        var value = node.attrsMap[name];
        if (value) {
          if (name === 'v-for') {
            checkFor(node, "v-for=\"" + value + "\"", errors);
          } else if (onRE.test(name)) {
            checkEvent(value, name + "=\"" + value + "\"", errors);
          } else {
            checkExpression(value, name + "=\"" + value + "\"", errors);
          }
        }
      }
    }
    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        checkNode(node.children[i], errors);
      }
    }
  } else if (node.type === 2) {
    checkExpression(node.expression, node.text, errors);
  }
}

function checkEvent(exp, text, errors) {
  var stipped = exp.replace(stripStringRE, '');
  var keywordMatch = stipped.match(unaryOperatorsRE);
  if (keywordMatch && stipped.charAt(keywordMatch.index - 1) !== '$') {
    errors.push("avoid using JavaScript unary operator as property name: " + "\"" + keywordMatch[0] + "\" in expression " + text.trim());
  }
  checkExpression(exp, text, errors);
}

function checkFor(node, text, errors) {
  checkExpression(node.for || '', text, errors);
  checkIdentifier(node.alias, 'v-for alias', text, errors);
  checkIdentifier(node.iterator1, 'v-for iterator', text, errors);
  checkIdentifier(node.iterator2, 'v-for iterator', text, errors);
}

function checkIdentifier(ident, type, text, errors) {
  if (typeof ident === 'string' && !identRE.test(ident)) {
    errors.push("invalid " + type + " \"" + ident + "\" in expression: " + text.trim());
  }
}

function checkExpression(exp, text, errors) {
  try {
    new Function("return " + exp);
  } catch (e) {
    var keywordMatch = exp.replace(stripStringRE, '').match(prohibitedKeywordRE);
    if (keywordMatch) {
      errors.push("avoid using JavaScript keyword as property name: " + "\"" + keywordMatch[0] + "\" in expression " + text.trim());
    } else {
      errors.push("invalid expression: " + text.trim());
    }
  }
}

/*  */

function createFunction(code, errors) {
  try {
    return new Function(code);
  } catch (err) {
    errors.push({ err: err, code: code });
    return noop;
  }
}

function createCompileToFunctionFn(compile) {
  var cache = Object.create(null);

  return function compileToFunctions(template, options, vm) {
    options = options || {};

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production') {
      // detect possible CSP restriction
      try {
        new Function('return 1');
      } catch (e) {
        if (e.toString().match(/unsafe-eval|CSP/)) {
          warn('It seems you are using the standalone build of Vue.js in an ' + 'environment with Content Security Policy that prohibits unsafe-eval. ' + 'The template compiler cannot work in this environment. Consider ' + 'relaxing the policy to allow unsafe-eval or pre-compiling your ' + 'templates into render functions.');
        }
      }
    }

    // check cache
    var key = options.delimiters ? String(options.delimiters) + template : template;
    if (cache[key]) {
      return cache[key];
    }

    // compile
    var compiled = compile(template, options);

    // check compilation errors/tips
    if (process.env.NODE_ENV !== 'production') {
      if (compiled.errors && compiled.errors.length) {
        warn("Error compiling template:\n\n" + template + "\n\n" + compiled.errors.map(function (e) {
          return "- " + e;
        }).join('\n') + '\n', vm);
      }
      if (compiled.tips && compiled.tips.length) {
        compiled.tips.forEach(function (msg) {
          return tip(msg, vm);
        });
      }
    }

    // turn code into functions
    var res = {};
    var fnGenErrors = [];
    res.render = createFunction(compiled.render, fnGenErrors);
    res.staticRenderFns = compiled.staticRenderFns.map(function (code) {
      return createFunction(code, fnGenErrors);
    });

    // check function generation errors.
    // this should only happen if there is a bug in the compiler itself.
    // mostly for codegen development use
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production') {
      if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
        warn("Failed to generate render function:\n\n" + fnGenErrors.map(function (ref) {
          var err = ref.err;
          var code = ref.code;

          return err.toString() + " in\n\n" + code + "\n";
        }).join('\n'), vm);
      }
    }

    return cache[key] = res;
  };
}

/*  */

function createCompilerCreator(baseCompile) {
  return function createCompiler(baseOptions) {
    function compile(template, options) {
      var finalOptions = Object.create(baseOptions);
      var errors = [];
      var tips = [];
      finalOptions.warn = function (msg, tip) {
        (tip ? tips : errors).push(msg);
      };

      if (options) {
        // merge custom modules
        if (options.modules) {
          finalOptions.modules = (baseOptions.modules || []).concat(options.modules);
        }
        // merge custom directives
        if (options.directives) {
          finalOptions.directives = extend(Object.create(baseOptions.directives), options.directives);
        }
        // copy other options
        for (var key in options) {
          if (key !== 'modules' && key !== 'directives') {
            finalOptions[key] = options[key];
          }
        }
      }

      var compiled = baseCompile(template, finalOptions);
      if (process.env.NODE_ENV !== 'production') {
        errors.push.apply(errors, detectErrors(compiled.ast));
      }
      compiled.errors = errors;
      compiled.tips = tips;
      return compiled;
    }

    return {
      compile: compile,
      compileToFunctions: createCompileToFunctionFn(compile)
    };
  };
}

/*  */

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
var createCompiler = createCompilerCreator(function baseCompile(template, options) {
  var ast = parse(template.trim(), options);
  optimize(ast, options);
  var code = generate(ast, options);
  return {
    ast: ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  };
});

/*  */

var ref$1 = createCompiler(baseOptions);
var compileToFunctions = ref$1.compileToFunctions;

/*  */

var idToTemplate = cached(function (id) {
  var el = query(id);
  return el && el.innerHTML;
});

var mount = Vue$3.prototype.$mount;
Vue$3.prototype.$mount = function (el, hydrating) {
  el = el && query(el);

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn("Do not mount Vue to <html> or <body> - mount to normal elements instead.");
    return this;
  }

  var options = this.$options;
  // resolve template/el and convert to render function
  if (!options.render) {
    var template = options.template;
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template);
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !template) {
            warn("Template element not found or is empty: " + options.template, this);
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML;
      } else {
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this);
        }
        return this;
      }
    } else if (el) {
      template = getOuterHTML(el);
    }
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile');
      }

      var ref = compileToFunctions(template, {
        shouldDecodeNewlines: shouldDecodeNewlines,
        delimiters: options.delimiters,
        comments: options.comments
      }, this);
      var render = ref.render;
      var staticRenderFns = ref.staticRenderFns;
      options.render = render;
      options.staticRenderFns = staticRenderFns;

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile end');
        measure(this._name + " compile", 'compile', 'compile end');
      }
    }
  }
  return mount.call(this, el, hydrating);
};

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML(el) {
  if (el.outerHTML) {
    return el.outerHTML;
  } else {
    var container = document.createElement('div');
    container.appendChild(el.cloneNode(true));
    return container.innerHTML;
  }
}

Vue$3.compile = compileToFunctions;

/* harmony default export */ __webpack_exports__["a"] = (Vue$3);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(8), __webpack_require__(12)))

/***/ }),
/* 8 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
    return [];
};

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () {
    return '/';
};
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function () {
    return 0;
};

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
  * vue-router v2.7.0
  * (c) 2017 Evan You
  * @license MIT
  */
/*  */

function assert(condition, message) {
  if (!condition) {
    throw new Error("[vue-router] " + message);
  }
}

function warn(condition, message) {
  if (process.env.NODE_ENV !== 'production' && !condition) {
    typeof console !== 'undefined' && console.warn("[vue-router] " + message);
  }
}

function isError(err) {
  return Object.prototype.toString.call(err).indexOf('Error') > -1;
}

var View = {
  name: 'router-view',
  functional: true,
  props: {
    name: {
      type: String,
      default: 'default'
    }
  },
  render: function render(_, ref) {
    var props = ref.props;
    var children = ref.children;
    var parent = ref.parent;
    var data = ref.data;

    data.routerView = true;

    // directly use parent context's createElement() function
    // so that components rendered by router-view can resolve named slots
    var h = parent.$createElement;
    var name = props.name;
    var route = parent.$route;
    var cache = parent._routerViewCache || (parent._routerViewCache = {});

    // determine current view depth, also check to see if the tree
    // has been toggled inactive but kept-alive.
    var depth = 0;
    var inactive = false;
    while (parent && parent._routerRoot !== parent) {
      if (parent.$vnode && parent.$vnode.data.routerView) {
        depth++;
      }
      if (parent._inactive) {
        inactive = true;
      }
      parent = parent.$parent;
    }
    data.routerViewDepth = depth;

    // render previous view if the tree is inactive and kept-alive
    if (inactive) {
      return h(cache[name], data, children);
    }

    var matched = route.matched[depth];
    // render empty node if no matched route
    if (!matched) {
      cache[name] = null;
      return h();
    }

    var component = cache[name] = matched.components[name];

    // attach instance registration hook
    // this will be called in the instance's injected lifecycle hooks
    data.registerRouteInstance = function (vm, val) {
      // val could be undefined for unregistration
      var current = matched.instances[name];
      if (val && current !== vm || !val && current === vm) {
        matched.instances[name] = val;
      }
    }

    // also regiseter instance in prepatch hook
    // in case the same component instance is reused across different routes
    ;(data.hook || (data.hook = {})).prepatch = function (_, vnode) {
      matched.instances[name] = vnode.componentInstance;
    };

    // resolve props
    data.props = resolveProps(route, matched.props && matched.props[name]);

    return h(component, data, children);
  }
};

function resolveProps(route, config) {
  switch (typeof config) {
    case 'undefined':
      return;
    case 'object':
      return config;
    case 'function':
      return config(route);
    case 'boolean':
      return config ? route.params : undefined;
    default:
      if (process.env.NODE_ENV !== 'production') {
        warn(false, "props in \"" + route.path + "\" is a " + typeof config + ", " + "expecting an object, function or boolean.");
      }
  }
}

/*  */

var encodeReserveRE = /[!'()*]/g;
var encodeReserveReplacer = function (c) {
  return '%' + c.charCodeAt(0).toString(16);
};
var commaRE = /%2C/g;

// fixed encodeURIComponent which is more conformant to RFC3986:
// - escapes [!'()*]
// - preserve commas
var encode = function (str) {
  return encodeURIComponent(str).replace(encodeReserveRE, encodeReserveReplacer).replace(commaRE, ',');
};

var decode = decodeURIComponent;

function resolveQuery(query, extraQuery, _parseQuery) {
  if (extraQuery === void 0) extraQuery = {};

  var parse = _parseQuery || parseQuery;
  var parsedQuery;
  try {
    parsedQuery = parse(query || '');
  } catch (e) {
    process.env.NODE_ENV !== 'production' && warn(false, e.message);
    parsedQuery = {};
  }
  for (var key in extraQuery) {
    var val = extraQuery[key];
    parsedQuery[key] = Array.isArray(val) ? val.slice() : val;
  }
  return parsedQuery;
}

function parseQuery(query) {
  var res = {};

  query = query.trim().replace(/^(\?|#|&)/, '');

  if (!query) {
    return res;
  }

  query.split('&').forEach(function (param) {
    var parts = param.replace(/\+/g, ' ').split('=');
    var key = decode(parts.shift());
    var val = parts.length > 0 ? decode(parts.join('=')) : null;

    if (res[key] === undefined) {
      res[key] = val;
    } else if (Array.isArray(res[key])) {
      res[key].push(val);
    } else {
      res[key] = [res[key], val];
    }
  });

  return res;
}

function stringifyQuery(obj) {
  var res = obj ? Object.keys(obj).map(function (key) {
    var val = obj[key];

    if (val === undefined) {
      return '';
    }

    if (val === null) {
      return encode(key);
    }

    if (Array.isArray(val)) {
      var result = [];
      val.forEach(function (val2) {
        if (val2 === undefined) {
          return;
        }
        if (val2 === null) {
          result.push(encode(key));
        } else {
          result.push(encode(key) + '=' + encode(val2));
        }
      });
      return result.join('&');
    }

    return encode(key) + '=' + encode(val);
  }).filter(function (x) {
    return x.length > 0;
  }).join('&') : null;
  return res ? "?" + res : '';
}

/*  */

var trailingSlashRE = /\/?$/;

function createRoute(record, location, redirectedFrom, router) {
  var stringifyQuery$$1 = router && router.options.stringifyQuery;
  var route = {
    name: location.name || record && record.name,
    meta: record && record.meta || {},
    path: location.path || '/',
    hash: location.hash || '',
    query: location.query || {},
    params: location.params || {},
    fullPath: getFullPath(location, stringifyQuery$$1),
    matched: record ? formatMatch(record) : []
  };
  if (redirectedFrom) {
    route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery$$1);
  }
  return Object.freeze(route);
}

// the starting route that represents the initial state
var START = createRoute(null, {
  path: '/'
});

function formatMatch(record) {
  var res = [];
  while (record) {
    res.unshift(record);
    record = record.parent;
  }
  return res;
}

function getFullPath(ref, _stringifyQuery) {
  var path = ref.path;
  var query = ref.query;if (query === void 0) query = {};
  var hash = ref.hash;if (hash === void 0) hash = '';

  var stringify = _stringifyQuery || stringifyQuery;
  return (path || '/') + stringify(query) + hash;
}

function isSameRoute(a, b) {
  if (b === START) {
    return a === b;
  } else if (!b) {
    return false;
  } else if (a.path && b.path) {
    return a.path.replace(trailingSlashRE, '') === b.path.replace(trailingSlashRE, '') && a.hash === b.hash && isObjectEqual(a.query, b.query);
  } else if (a.name && b.name) {
    return a.name === b.name && a.hash === b.hash && isObjectEqual(a.query, b.query) && isObjectEqual(a.params, b.params);
  } else {
    return false;
  }
}

function isObjectEqual(a, b) {
  if (a === void 0) a = {};
  if (b === void 0) b = {};

  var aKeys = Object.keys(a);
  var bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) {
    return false;
  }
  return aKeys.every(function (key) {
    var aVal = a[key];
    var bVal = b[key];
    // check nested equality
    if (typeof aVal === 'object' && typeof bVal === 'object') {
      return isObjectEqual(aVal, bVal);
    }
    return String(aVal) === String(bVal);
  });
}

function isIncludedRoute(current, target) {
  return current.path.replace(trailingSlashRE, '/').indexOf(target.path.replace(trailingSlashRE, '/')) === 0 && (!target.hash || current.hash === target.hash) && queryIncludes(current.query, target.query);
}

function queryIncludes(current, target) {
  for (var key in target) {
    if (!(key in current)) {
      return false;
    }
  }
  return true;
}

/*  */

// work around weird flow bug
var toTypes = [String, Object];
var eventTypes = [String, Array];

var Link = {
  name: 'router-link',
  props: {
    to: {
      type: toTypes,
      required: true
    },
    tag: {
      type: String,
      default: 'a'
    },
    exact: Boolean,
    append: Boolean,
    replace: Boolean,
    activeClass: String,
    exactActiveClass: String,
    event: {
      type: eventTypes,
      default: 'click'
    }
  },
  render: function render(h) {
    var this$1 = this;

    var router = this.$router;
    var current = this.$route;
    var ref = router.resolve(this.to, current, this.append);
    var location = ref.location;
    var route = ref.route;
    var href = ref.href;

    var classes = {};
    var globalActiveClass = router.options.linkActiveClass;
    var globalExactActiveClass = router.options.linkExactActiveClass;
    // Support global empty active class
    var activeClassFallback = globalActiveClass == null ? 'router-link-active' : globalActiveClass;
    var exactActiveClassFallback = globalExactActiveClass == null ? 'router-link-exact-active' : globalExactActiveClass;
    var activeClass = this.activeClass == null ? activeClassFallback : this.activeClass;
    var exactActiveClass = this.exactActiveClass == null ? exactActiveClassFallback : this.exactActiveClass;
    var compareTarget = location.path ? createRoute(null, location, null, router) : route;

    classes[exactActiveClass] = isSameRoute(current, compareTarget);
    classes[activeClass] = this.exact ? classes[exactActiveClass] : isIncludedRoute(current, compareTarget);

    var handler = function (e) {
      if (guardEvent(e)) {
        if (this$1.replace) {
          router.replace(location);
        } else {
          router.push(location);
        }
      }
    };

    var on = { click: guardEvent };
    if (Array.isArray(this.event)) {
      this.event.forEach(function (e) {
        on[e] = handler;
      });
    } else {
      on[this.event] = handler;
    }

    var data = {
      class: classes
    };

    if (this.tag === 'a') {
      data.on = on;
      data.attrs = { href: href };
    } else {
      // find the first <a> child and apply listener and href
      var a = findAnchor(this.$slots.default);
      if (a) {
        // in case the <a> is a static node
        a.isStatic = false;
        var extend = _Vue.util.extend;
        var aData = a.data = extend({}, a.data);
        aData.on = on;
        var aAttrs = a.data.attrs = extend({}, a.data.attrs);
        aAttrs.href = href;
      } else {
        // doesn't have <a> child, apply listener to self
        data.on = on;
      }
    }

    return h(this.tag, data, this.$slots.default);
  }
};

function guardEvent(e) {
  // don't redirect with control keys
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) {
    return;
  }
  // don't redirect when preventDefault called
  if (e.defaultPrevented) {
    return;
  }
  // don't redirect on right click
  if (e.button !== undefined && e.button !== 0) {
    return;
  }
  // don't redirect if `target="_blank"`
  if (e.currentTarget && e.currentTarget.getAttribute) {
    var target = e.currentTarget.getAttribute('target');
    if (/\b_blank\b/i.test(target)) {
      return;
    }
  }
  // this may be a Weex event which doesn't have this method
  if (e.preventDefault) {
    e.preventDefault();
  }
  return true;
}

function findAnchor(children) {
  if (children) {
    var child;
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      if (child.tag === 'a') {
        return child;
      }
      if (child.children && (child = findAnchor(child.children))) {
        return child;
      }
    }
  }
}

var _Vue;

function install(Vue) {
  if (install.installed) {
    return;
  }
  install.installed = true;

  _Vue = Vue;

  var isDef = function (v) {
    return v !== undefined;
  };

  var registerInstance = function (vm, callVal) {
    var i = vm.$options._parentVnode;
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal);
    }
  };

  Vue.mixin({
    beforeCreate: function beforeCreate() {
      if (isDef(this.$options.router)) {
        this._routerRoot = this;
        this._router = this.$options.router;
        this._router.init(this);
        Vue.util.defineReactive(this, '_route', this._router.history.current);
      } else {
        this._routerRoot = this.$parent && this.$parent._routerRoot || this;
      }
      registerInstance(this, this);
    },
    destroyed: function destroyed() {
      registerInstance(this);
    }
  });

  Object.defineProperty(Vue.prototype, '$router', {
    get: function get() {
      return this._routerRoot._router;
    }
  });

  Object.defineProperty(Vue.prototype, '$route', {
    get: function get() {
      return this._routerRoot._route;
    }
  });

  Vue.component('router-view', View);
  Vue.component('router-link', Link);

  var strats = Vue.config.optionMergeStrategies;
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created;
}

/*  */

var inBrowser = typeof window !== 'undefined';

/*  */

function resolvePath(relative, base, append) {
  var firstChar = relative.charAt(0);
  if (firstChar === '/') {
    return relative;
  }

  if (firstChar === '?' || firstChar === '#') {
    return base + relative;
  }

  var stack = base.split('/');

  // remove trailing segment if:
  // - not appending
  // - appending to trailing slash (last segment is empty)
  if (!append || !stack[stack.length - 1]) {
    stack.pop();
  }

  // resolve relative path
  var segments = relative.replace(/^\//, '').split('/');
  for (var i = 0; i < segments.length; i++) {
    var segment = segments[i];
    if (segment === '..') {
      stack.pop();
    } else if (segment !== '.') {
      stack.push(segment);
    }
  }

  // ensure leading slash
  if (stack[0] !== '') {
    stack.unshift('');
  }

  return stack.join('/');
}

function parsePath(path) {
  var hash = '';
  var query = '';

  var hashIndex = path.indexOf('#');
  if (hashIndex >= 0) {
    hash = path.slice(hashIndex);
    path = path.slice(0, hashIndex);
  }

  var queryIndex = path.indexOf('?');
  if (queryIndex >= 0) {
    query = path.slice(queryIndex + 1);
    path = path.slice(0, queryIndex);
  }

  return {
    path: path,
    query: query,
    hash: hash
  };
}

function cleanPath(path) {
  return path.replace(/\/\//g, '/');
}

var index$1 = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

/**
 * Expose `pathToRegexp`.
 */
var index = pathToRegexp;
var parse_1 = parse;
var compile_1 = compile;
var tokensToFunction_1 = tokensToFunction;
var tokensToRegExp_1 = tokensToRegExp;

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
// Match escaped characters that would otherwise appear in future matches.
// This allows the user to escape special characters that won't transform.
'(\\\\.)',
// Match Express-style parameters and un-named parameters with a prefix
// and optional suffixes. Matches appear as:
//
// "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
// "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
// "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
'([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'].join('|'), 'g');

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse(str, options) {
  var tokens = [];
  var key = 0;
  var index = 0;
  var path = '';
  var defaultDelimiter = options && options.delimiter || '/';
  var res;

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0];
    var escaped = res[1];
    var offset = res.index;
    path += str.slice(index, offset);
    index = offset + m.length;

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1];
      continue;
    }

    var next = str[index];
    var prefix = res[2];
    var name = res[3];
    var capture = res[4];
    var group = res[5];
    var modifier = res[6];
    var asterisk = res[7];

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path);
      path = '';
    }

    var partial = prefix != null && next != null && next !== prefix;
    var repeat = modifier === '+' || modifier === '*';
    var optional = modifier === '?' || modifier === '*';
    var delimiter = res[2] || defaultDelimiter;
    var pattern = capture || group;

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      partial: partial,
      asterisk: !!asterisk,
      pattern: pattern ? escapeGroup(pattern) : asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?'
    });
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index);
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path);
  }

  return tokens;
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */
function compile(str, options) {
  return tokensToFunction(parse(str, options));
}

/**
 * Prettier encoding of URI path segments.
 *
 * @param  {string}
 * @return {string}
 */
function encodeURIComponentPretty(str) {
  return encodeURI(str).replace(/[\/?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase();
  });
}

/**
 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
 *
 * @param  {string}
 * @return {string}
 */
function encodeAsterisk(str) {
  return encodeURI(str).replace(/[?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase();
  });
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction(tokens) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length);

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$');
    }
  }

  return function (obj, opts) {
    var path = '';
    var data = obj || {};
    var options = opts || {};
    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent;

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (typeof token === 'string') {
        path += token;

        continue;
      }

      var value = data[token.name];
      var segment;

      if (value == null) {
        if (token.optional) {
          // Prepend partial segment prefixes.
          if (token.partial) {
            path += token.prefix;
          }

          continue;
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined');
        }
      }

      if (index$1(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`');
        }

        if (value.length === 0) {
          if (token.optional) {
            continue;
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty');
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j]);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`');
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment;
        }

        continue;
      }

      segment = token.asterisk ? encodeAsterisk(value) : encode(value);

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"');
      }

      path += token.prefix + segment;
    }

    return path;
  };
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1');
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup(group) {
  return group.replace(/([=!:$\/()])/g, '\\$1');
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {!RegExp} re
 * @param  {Array}   keys
 * @return {!RegExp}
 */
function attachKeys(re, keys) {
  re.keys = keys;
  return re;
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags(options) {
  return options.sensitive ? '' : 'i';
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {!Array}  keys
 * @return {!RegExp}
 */
function regexpToRegexp(path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g);

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        partial: false,
        asterisk: false,
        pattern: null
      });
    }
  }

  return attachKeys(path, keys);
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array}   keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function arrayToRegexp(path, keys, options) {
  var parts = [];

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source);
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

  return attachKeys(regexp, keys);
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {!Array}  keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function stringToRegexp(path, keys, options) {
  return tokensToRegExp(parse(path, options), keys, options);
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}          tokens
 * @param  {(Array|Object)=} keys
 * @param  {Object=}         options
 * @return {!RegExp}
 */
function tokensToRegExp(tokens, keys, options) {
  if (!index$1(keys)) {
    options = /** @type {!Object} */keys || options;
    keys = [];
  }

  options = options || {};

  var strict = options.strict;
  var end = options.end !== false;
  var route = '';

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];

    if (typeof token === 'string') {
      route += escapeString(token);
    } else {
      var prefix = escapeString(token.prefix);
      var capture = '(?:' + token.pattern + ')';

      keys.push(token);

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*';
      }

      if (token.optional) {
        if (!token.partial) {
          capture = '(?:' + prefix + '(' + capture + '))?';
        } else {
          capture = prefix + '(' + capture + ')?';
        }
      } else {
        capture = prefix + '(' + capture + ')';
      }

      route += capture;
    }
  }

  var delimiter = escapeString(options.delimiter || '/');
  var endsWithDelimiter = route.slice(-delimiter.length) === delimiter;

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?';
  }

  if (end) {
    route += '$';
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)';
  }

  return attachKeys(new RegExp('^' + route, flags(options)), keys);
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {(Array|Object)=}       keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp(path, keys, options) {
  if (!index$1(keys)) {
    options = /** @type {!Object} */keys || options;
    keys = [];
  }

  options = options || {};

  if (path instanceof RegExp) {
    return regexpToRegexp(path, /** @type {!Array} */keys);
  }

  if (index$1(path)) {
    return arrayToRegexp( /** @type {!Array} */path, /** @type {!Array} */keys, options);
  }

  return stringToRegexp( /** @type {string} */path, /** @type {!Array} */keys, options);
}

index.parse = parse_1;
index.compile = compile_1;
index.tokensToFunction = tokensToFunction_1;
index.tokensToRegExp = tokensToRegExp_1;

/*  */

var regexpCompileCache = Object.create(null);

function fillParams(path, params, routeMsg) {
  try {
    var filler = regexpCompileCache[path] || (regexpCompileCache[path] = index.compile(path));
    return filler(params || {}, { pretty: true });
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      warn(false, "missing param for " + routeMsg + ": " + e.message);
    }
    return '';
  }
}

/*  */

function createRouteMap(routes, oldPathList, oldPathMap, oldNameMap) {
  // the path list is used to control path matching priority
  var pathList = oldPathList || [];
  var pathMap = oldPathMap || Object.create(null);
  var nameMap = oldNameMap || Object.create(null);

  routes.forEach(function (route) {
    addRouteRecord(pathList, pathMap, nameMap, route);
  });

  // ensure wildcard routes are always at the end
  for (var i = 0, l = pathList.length; i < l; i++) {
    if (pathList[i] === '*') {
      pathList.push(pathList.splice(i, 1)[0]);
      l--;
      i--;
    }
  }

  return {
    pathList: pathList,
    pathMap: pathMap,
    nameMap: nameMap
  };
}

function addRouteRecord(pathList, pathMap, nameMap, route, parent, matchAs) {
  var path = route.path;
  var name = route.name;
  if (process.env.NODE_ENV !== 'production') {
    assert(path != null, "\"path\" is required in a route configuration.");
    assert(typeof route.component !== 'string', "route config \"component\" for path: " + String(path || name) + " cannot be a " + "string id. Use an actual component instead.");
  }

  var normalizedPath = normalizePath(path, parent);
  var pathToRegexpOptions = route.pathToRegexpOptions || {};

  if (typeof route.caseSensitive === 'boolean') {
    pathToRegexpOptions.sensitive = route.caseSensitive;
  }

  var record = {
    path: normalizedPath,
    regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
    components: route.components || { default: route.component },
    instances: {},
    name: name,
    parent: parent,
    matchAs: matchAs,
    redirect: route.redirect,
    beforeEnter: route.beforeEnter,
    meta: route.meta || {},
    props: route.props == null ? {} : route.components ? route.props : { default: route.props }
  };

  if (route.children) {
    // Warn if route is named, does not redirect and has a default child route.
    // If users navigate to this route by name, the default child will
    // not be rendered (GH Issue #629)
    if (process.env.NODE_ENV !== 'production') {
      if (route.name && !route.redirect && route.children.some(function (child) {
        return (/^\/?$/.test(child.path)
        );
      })) {
        warn(false, "Named Route '" + route.name + "' has a default child route. " + "When navigating to this named route (:to=\"{name: '" + route.name + "'\"), " + "the default child route will not be rendered. Remove the name from " + "this route and use the name of the default child route for named " + "links instead.");
      }
    }
    route.children.forEach(function (child) {
      var childMatchAs = matchAs ? cleanPath(matchAs + "/" + child.path) : undefined;
      addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs);
    });
  }

  if (route.alias !== undefined) {
    var aliases = Array.isArray(route.alias) ? route.alias : [route.alias];

    aliases.forEach(function (alias) {
      var aliasRoute = {
        path: alias,
        children: route.children
      };
      addRouteRecord(pathList, pathMap, nameMap, aliasRoute, parent, record.path || '/' // matchAs
      );
    });
  }

  if (!pathMap[record.path]) {
    pathList.push(record.path);
    pathMap[record.path] = record;
  }

  if (name) {
    if (!nameMap[name]) {
      nameMap[name] = record;
    } else if (process.env.NODE_ENV !== 'production' && !matchAs) {
      warn(false, "Duplicate named routes definition: " + "{ name: \"" + name + "\", path: \"" + record.path + "\" }");
    }
  }
}

function compileRouteRegex(path, pathToRegexpOptions) {
  var regex = index(path, [], pathToRegexpOptions);
  if (process.env.NODE_ENV !== 'production') {
    var keys = {};
    regex.keys.forEach(function (key) {
      warn(!keys[key.name], "Duplicate param keys in route with path: \"" + path + "\"");
      keys[key.name] = true;
    });
  }
  return regex;
}

function normalizePath(path, parent) {
  path = path.replace(/\/$/, '');
  if (path[0] === '/') {
    return path;
  }
  if (parent == null) {
    return path;
  }
  return cleanPath(parent.path + "/" + path);
}

/*  */

function normalizeLocation(raw, current, append, router) {
  var next = typeof raw === 'string' ? { path: raw } : raw;
  // named target
  if (next.name || next._normalized) {
    return next;
  }

  // relative params
  if (!next.path && next.params && current) {
    next = assign({}, next);
    next._normalized = true;
    var params = assign(assign({}, current.params), next.params);
    if (current.name) {
      next.name = current.name;
      next.params = params;
    } else if (current.matched.length) {
      var rawPath = current.matched[current.matched.length - 1].path;
      next.path = fillParams(rawPath, params, "path " + current.path);
    } else if (process.env.NODE_ENV !== 'production') {
      warn(false, "relative params navigation requires a current route.");
    }
    return next;
  }

  var parsedPath = parsePath(next.path || '');
  var basePath = current && current.path || '/';
  var path = parsedPath.path ? resolvePath(parsedPath.path, basePath, append || next.append) : basePath;

  var query = resolveQuery(parsedPath.query, next.query, router && router.options.parseQuery);

  var hash = next.hash || parsedPath.hash;
  if (hash && hash.charAt(0) !== '#') {
    hash = "#" + hash;
  }

  return {
    _normalized: true,
    path: path,
    query: query,
    hash: hash
  };
}

function assign(a, b) {
  for (var key in b) {
    a[key] = b[key];
  }
  return a;
}

/*  */

function createMatcher(routes, router) {
  var ref = createRouteMap(routes);
  var pathList = ref.pathList;
  var pathMap = ref.pathMap;
  var nameMap = ref.nameMap;

  function addRoutes(routes) {
    createRouteMap(routes, pathList, pathMap, nameMap);
  }

  function match(raw, currentRoute, redirectedFrom) {
    var location = normalizeLocation(raw, currentRoute, false, router);
    var name = location.name;

    if (name) {
      var record = nameMap[name];
      if (process.env.NODE_ENV !== 'production') {
        warn(record, "Route with name '" + name + "' does not exist");
      }
      if (!record) {
        return _createRoute(null, location);
      }
      var paramNames = record.regex.keys.filter(function (key) {
        return !key.optional;
      }).map(function (key) {
        return key.name;
      });

      if (typeof location.params !== 'object') {
        location.params = {};
      }

      if (currentRoute && typeof currentRoute.params === 'object') {
        for (var key in currentRoute.params) {
          if (!(key in location.params) && paramNames.indexOf(key) > -1) {
            location.params[key] = currentRoute.params[key];
          }
        }
      }

      if (record) {
        location.path = fillParams(record.path, location.params, "named route \"" + name + "\"");
        return _createRoute(record, location, redirectedFrom);
      }
    } else if (location.path) {
      location.params = {};
      for (var i = 0; i < pathList.length; i++) {
        var path = pathList[i];
        var record$1 = pathMap[path];
        if (matchRoute(record$1.regex, location.path, location.params)) {
          return _createRoute(record$1, location, redirectedFrom);
        }
      }
    }
    // no match
    return _createRoute(null, location);
  }

  function redirect(record, location) {
    var originalRedirect = record.redirect;
    var redirect = typeof originalRedirect === 'function' ? originalRedirect(createRoute(record, location, null, router)) : originalRedirect;

    if (typeof redirect === 'string') {
      redirect = { path: redirect };
    }

    if (!redirect || typeof redirect !== 'object') {
      if (process.env.NODE_ENV !== 'production') {
        warn(false, "invalid redirect option: " + JSON.stringify(redirect));
      }
      return _createRoute(null, location);
    }

    var re = redirect;
    var name = re.name;
    var path = re.path;
    var query = location.query;
    var hash = location.hash;
    var params = location.params;
    query = re.hasOwnProperty('query') ? re.query : query;
    hash = re.hasOwnProperty('hash') ? re.hash : hash;
    params = re.hasOwnProperty('params') ? re.params : params;

    if (name) {
      // resolved named direct
      var targetRecord = nameMap[name];
      if (process.env.NODE_ENV !== 'production') {
        assert(targetRecord, "redirect failed: named route \"" + name + "\" not found.");
      }
      return match({
        _normalized: true,
        name: name,
        query: query,
        hash: hash,
        params: params
      }, undefined, location);
    } else if (path) {
      // 1. resolve relative redirect
      var rawPath = resolveRecordPath(path, record);
      // 2. resolve params
      var resolvedPath = fillParams(rawPath, params, "redirect route with path \"" + rawPath + "\"");
      // 3. rematch with existing query and hash
      return match({
        _normalized: true,
        path: resolvedPath,
        query: query,
        hash: hash
      }, undefined, location);
    } else {
      if (process.env.NODE_ENV !== 'production') {
        warn(false, "invalid redirect option: " + JSON.stringify(redirect));
      }
      return _createRoute(null, location);
    }
  }

  function alias(record, location, matchAs) {
    var aliasedPath = fillParams(matchAs, location.params, "aliased route with path \"" + matchAs + "\"");
    var aliasedMatch = match({
      _normalized: true,
      path: aliasedPath
    });
    if (aliasedMatch) {
      var matched = aliasedMatch.matched;
      var aliasedRecord = matched[matched.length - 1];
      location.params = aliasedMatch.params;
      return _createRoute(aliasedRecord, location);
    }
    return _createRoute(null, location);
  }

  function _createRoute(record, location, redirectedFrom) {
    if (record && record.redirect) {
      return redirect(record, redirectedFrom || location);
    }
    if (record && record.matchAs) {
      return alias(record, location, record.matchAs);
    }
    return createRoute(record, location, redirectedFrom, router);
  }

  return {
    match: match,
    addRoutes: addRoutes
  };
}

function matchRoute(regex, path, params) {
  var m = path.match(regex);

  if (!m) {
    return false;
  } else if (!params) {
    return true;
  }

  for (var i = 1, len = m.length; i < len; ++i) {
    var key = regex.keys[i - 1];
    var val = typeof m[i] === 'string' ? decodeURIComponent(m[i]) : m[i];
    if (key) {
      params[key.name] = val;
    }
  }

  return true;
}

function resolveRecordPath(path, record) {
  return resolvePath(path, record.parent ? record.parent.path : '/', true);
}

/*  */

var positionStore = Object.create(null);

function setupScroll() {
  window.addEventListener('popstate', function (e) {
    saveScrollPosition();
    if (e.state && e.state.key) {
      setStateKey(e.state.key);
    }
  });
}

function handleScroll(router, to, from, isPop) {
  if (!router.app) {
    return;
  }

  var behavior = router.options.scrollBehavior;
  if (!behavior) {
    return;
  }

  if (process.env.NODE_ENV !== 'production') {
    assert(typeof behavior === 'function', "scrollBehavior must be a function");
  }

  // wait until re-render finishes before scrolling
  router.app.$nextTick(function () {
    var position = getScrollPosition();
    var shouldScroll = behavior(to, from, isPop ? position : null);
    if (!shouldScroll) {
      return;
    }
    var isObject = typeof shouldScroll === 'object';
    if (isObject && typeof shouldScroll.selector === 'string') {
      var el = document.querySelector(shouldScroll.selector);
      if (el) {
        var offset = shouldScroll.offset && typeof shouldScroll.offset === 'object' ? shouldScroll.offset : {};
        offset = normalizeOffset(offset);
        position = getElementPosition(el, offset);
      } else if (isValidPosition(shouldScroll)) {
        position = normalizePosition(shouldScroll);
      }
    } else if (isObject && isValidPosition(shouldScroll)) {
      position = normalizePosition(shouldScroll);
    }

    if (position) {
      window.scrollTo(position.x, position.y);
    }
  });
}

function saveScrollPosition() {
  var key = getStateKey();
  if (key) {
    positionStore[key] = {
      x: window.pageXOffset,
      y: window.pageYOffset
    };
  }
}

function getScrollPosition() {
  var key = getStateKey();
  if (key) {
    return positionStore[key];
  }
}

function getElementPosition(el, offset) {
  var docEl = document.documentElement;
  var docRect = docEl.getBoundingClientRect();
  var elRect = el.getBoundingClientRect();
  return {
    x: elRect.left - docRect.left - offset.x,
    y: elRect.top - docRect.top - offset.y
  };
}

function isValidPosition(obj) {
  return isNumber(obj.x) || isNumber(obj.y);
}

function normalizePosition(obj) {
  return {
    x: isNumber(obj.x) ? obj.x : window.pageXOffset,
    y: isNumber(obj.y) ? obj.y : window.pageYOffset
  };
}

function normalizeOffset(obj) {
  return {
    x: isNumber(obj.x) ? obj.x : 0,
    y: isNumber(obj.y) ? obj.y : 0
  };
}

function isNumber(v) {
  return typeof v === 'number';
}

/*  */

var supportsPushState = inBrowser && function () {
  var ua = window.navigator.userAgent;

  if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) && ua.indexOf('Mobile Safari') !== -1 && ua.indexOf('Chrome') === -1 && ua.indexOf('Windows Phone') === -1) {
    return false;
  }

  return window.history && 'pushState' in window.history;
}();

// use User Timing api (if present) for more accurate key precision
var Time = inBrowser && window.performance && window.performance.now ? window.performance : Date;

var _key = genKey();

function genKey() {
  return Time.now().toFixed(3);
}

function getStateKey() {
  return _key;
}

function setStateKey(key) {
  _key = key;
}

function pushState(url, replace) {
  saveScrollPosition();
  // try...catch the pushState call to get around Safari
  // DOM Exception 18 where it limits to 100 pushState calls
  var history = window.history;
  try {
    if (replace) {
      history.replaceState({ key: _key }, '', url);
    } else {
      _key = genKey();
      history.pushState({ key: _key }, '', url);
    }
  } catch (e) {
    window.location[replace ? 'replace' : 'assign'](url);
  }
}

function replaceState(url) {
  pushState(url, true);
}

/*  */

function runQueue(queue, fn, cb) {
  var step = function (index) {
    if (index >= queue.length) {
      cb();
    } else {
      if (queue[index]) {
        fn(queue[index], function () {
          step(index + 1);
        });
      } else {
        step(index + 1);
      }
    }
  };
  step(0);
}

/*  */

function resolveAsyncComponents(matched) {
  return function (to, from, next) {
    var hasAsync = false;
    var pending = 0;
    var error = null;

    flatMapComponents(matched, function (def, _, match, key) {
      // if it's a function and doesn't have cid attached,
      // assume it's an async component resolve function.
      // we are not using Vue's default async resolving mechanism because
      // we want to halt the navigation until the incoming component has been
      // resolved.
      if (typeof def === 'function' && def.cid === undefined) {
        hasAsync = true;
        pending++;

        var resolve = once(function (resolvedDef) {
          if (resolvedDef.__esModule && resolvedDef.default) {
            resolvedDef = resolvedDef.default;
          }
          // save resolved on async factory in case it's used elsewhere
          def.resolved = typeof resolvedDef === 'function' ? resolvedDef : _Vue.extend(resolvedDef);
          match.components[key] = resolvedDef;
          pending--;
          if (pending <= 0) {
            next();
          }
        });

        var reject = once(function (reason) {
          var msg = "Failed to resolve async component " + key + ": " + reason;
          process.env.NODE_ENV !== 'production' && warn(false, msg);
          if (!error) {
            error = isError(reason) ? reason : new Error(msg);
            next(error);
          }
        });

        var res;
        try {
          res = def(resolve, reject);
        } catch (e) {
          reject(e);
        }
        if (res) {
          if (typeof res.then === 'function') {
            res.then(resolve, reject);
          } else {
            // new syntax in Vue 2.3
            var comp = res.component;
            if (comp && typeof comp.then === 'function') {
              comp.then(resolve, reject);
            }
          }
        }
      }
    });

    if (!hasAsync) {
      next();
    }
  };
}

function flatMapComponents(matched, fn) {
  return flatten(matched.map(function (m) {
    return Object.keys(m.components).map(function (key) {
      return fn(m.components[key], m.instances[key], m, key);
    });
  }));
}

function flatten(arr) {
  return Array.prototype.concat.apply([], arr);
}

// in Webpack 2, require.ensure now also returns a Promise
// so the resolve/reject functions may get called an extra time
// if the user uses an arrow function shorthand that happens to
// return that Promise.
function once(fn) {
  var called = false;
  return function () {
    var args = [],
        len = arguments.length;
    while (len--) args[len] = arguments[len];

    if (called) {
      return;
    }
    called = true;
    return fn.apply(this, args);
  };
}

/*  */

var History = function History(router, base) {
  this.router = router;
  this.base = normalizeBase(base);
  // start with a route object that stands for "nowhere"
  this.current = START;
  this.pending = null;
  this.ready = false;
  this.readyCbs = [];
  this.readyErrorCbs = [];
  this.errorCbs = [];
};

History.prototype.listen = function listen(cb) {
  this.cb = cb;
};

History.prototype.onReady = function onReady(cb, errorCb) {
  if (this.ready) {
    cb();
  } else {
    this.readyCbs.push(cb);
    if (errorCb) {
      this.readyErrorCbs.push(errorCb);
    }
  }
};

History.prototype.onError = function onError(errorCb) {
  this.errorCbs.push(errorCb);
};

History.prototype.transitionTo = function transitionTo(location, onComplete, onAbort) {
  var this$1 = this;

  var route = this.router.match(location, this.current);
  this.confirmTransition(route, function () {
    this$1.updateRoute(route);
    onComplete && onComplete(route);
    this$1.ensureURL();

    // fire ready cbs once
    if (!this$1.ready) {
      this$1.ready = true;
      this$1.readyCbs.forEach(function (cb) {
        cb(route);
      });
    }
  }, function (err) {
    if (onAbort) {
      onAbort(err);
    }
    if (err && !this$1.ready) {
      this$1.ready = true;
      this$1.readyErrorCbs.forEach(function (cb) {
        cb(err);
      });
    }
  });
};

History.prototype.confirmTransition = function confirmTransition(route, onComplete, onAbort) {
  var this$1 = this;

  var current = this.current;
  var abort = function (err) {
    if (isError(err)) {
      if (this$1.errorCbs.length) {
        this$1.errorCbs.forEach(function (cb) {
          cb(err);
        });
      } else {
        warn(false, 'uncaught error during route navigation:');
        console.error(err);
      }
    }
    onAbort && onAbort(err);
  };
  if (isSameRoute(route, current) &&
  // in the case the route map has been dynamically appended to
  route.matched.length === current.matched.length) {
    this.ensureURL();
    return abort();
  }

  var ref = resolveQueue(this.current.matched, route.matched);
  var updated = ref.updated;
  var deactivated = ref.deactivated;
  var activated = ref.activated;

  var queue = [].concat(
  // in-component leave guards
  extractLeaveGuards(deactivated),
  // global before hooks
  this.router.beforeHooks,
  // in-component update hooks
  extractUpdateHooks(updated),
  // in-config enter guards
  activated.map(function (m) {
    return m.beforeEnter;
  }),
  // async components
  resolveAsyncComponents(activated));

  this.pending = route;
  var iterator = function (hook, next) {
    if (this$1.pending !== route) {
      return abort();
    }
    try {
      hook(route, current, function (to) {
        if (to === false || isError(to)) {
          // next(false) -> abort navigation, ensure current URL
          this$1.ensureURL(true);
          abort(to);
        } else if (typeof to === 'string' || typeof to === 'object' && (typeof to.path === 'string' || typeof to.name === 'string')) {
          // next('/') or next({ path: '/' }) -> redirect
          abort();
          if (typeof to === 'object' && to.replace) {
            this$1.replace(to);
          } else {
            this$1.push(to);
          }
        } else {
          // confirm transition and pass on the value
          next(to);
        }
      });
    } catch (e) {
      abort(e);
    }
  };

  runQueue(queue, iterator, function () {
    var postEnterCbs = [];
    var isValid = function () {
      return this$1.current === route;
    };
    // wait until async components are resolved before
    // extracting in-component enter guards
    var enterGuards = extractEnterGuards(activated, postEnterCbs, isValid);
    var queue = enterGuards.concat(this$1.router.resolveHooks);
    runQueue(queue, iterator, function () {
      if (this$1.pending !== route) {
        return abort();
      }
      this$1.pending = null;
      onComplete(route);
      if (this$1.router.app) {
        this$1.router.app.$nextTick(function () {
          postEnterCbs.forEach(function (cb) {
            cb();
          });
        });
      }
    });
  });
};

History.prototype.updateRoute = function updateRoute(route) {
  var prev = this.current;
  this.current = route;
  this.cb && this.cb(route);
  this.router.afterHooks.forEach(function (hook) {
    hook && hook(route, prev);
  });
};

function normalizeBase(base) {
  if (!base) {
    if (inBrowser) {
      // respect <base> tag
      var baseEl = document.querySelector('base');
      base = baseEl && baseEl.getAttribute('href') || '/';
      // strip full URL origin
      base = base.replace(/^https?:\/\/[^\/]+/, '');
    } else {
      base = '/';
    }
  }
  // make sure there's the starting slash
  if (base.charAt(0) !== '/') {
    base = '/' + base;
  }
  // remove trailing slash
  return base.replace(/\/$/, '');
}

function resolveQueue(current, next) {
  var i;
  var max = Math.max(current.length, next.length);
  for (i = 0; i < max; i++) {
    if (current[i] !== next[i]) {
      break;
    }
  }
  return {
    updated: next.slice(0, i),
    activated: next.slice(i),
    deactivated: current.slice(i)
  };
}

function extractGuards(records, name, bind, reverse) {
  var guards = flatMapComponents(records, function (def, instance, match, key) {
    var guard = extractGuard(def, name);
    if (guard) {
      return Array.isArray(guard) ? guard.map(function (guard) {
        return bind(guard, instance, match, key);
      }) : bind(guard, instance, match, key);
    }
  });
  return flatten(reverse ? guards.reverse() : guards);
}

function extractGuard(def, key) {
  if (typeof def !== 'function') {
    // extend now so that global mixins are applied.
    def = _Vue.extend(def);
  }
  return def.options[key];
}

function extractLeaveGuards(deactivated) {
  return extractGuards(deactivated, 'beforeRouteLeave', bindGuard, true);
}

function extractUpdateHooks(updated) {
  return extractGuards(updated, 'beforeRouteUpdate', bindGuard);
}

function bindGuard(guard, instance) {
  if (instance) {
    return function boundRouteGuard() {
      return guard.apply(instance, arguments);
    };
  }
}

function extractEnterGuards(activated, cbs, isValid) {
  return extractGuards(activated, 'beforeRouteEnter', function (guard, _, match, key) {
    return bindEnterGuard(guard, match, key, cbs, isValid);
  });
}

function bindEnterGuard(guard, match, key, cbs, isValid) {
  return function routeEnterGuard(to, from, next) {
    return guard(to, from, function (cb) {
      next(cb);
      if (typeof cb === 'function') {
        cbs.push(function () {
          // #750
          // if a router-view is wrapped with an out-in transition,
          // the instance may not have been registered at this time.
          // we will need to poll for registration until current route
          // is no longer valid.
          poll(cb, match.instances, key, isValid);
        });
      }
    });
  };
}

function poll(cb, // somehow flow cannot infer this is a function
instances, key, isValid) {
  if (instances[key]) {
    cb(instances[key]);
  } else if (isValid()) {
    setTimeout(function () {
      poll(cb, instances, key, isValid);
    }, 16);
  }
}

/*  */

var HTML5History = function (History$$1) {
  function HTML5History(router, base) {
    var this$1 = this;

    History$$1.call(this, router, base);

    var expectScroll = router.options.scrollBehavior;

    if (expectScroll) {
      setupScroll();
    }

    window.addEventListener('popstate', function (e) {
      var current = this$1.current;
      this$1.transitionTo(getLocation(this$1.base), function (route) {
        if (expectScroll) {
          handleScroll(router, route, current, true);
        }
      });
    });
  }

  if (History$$1) HTML5History.__proto__ = History$$1;
  HTML5History.prototype = Object.create(History$$1 && History$$1.prototype);
  HTML5History.prototype.constructor = HTML5History;

  HTML5History.prototype.go = function go(n) {
    window.history.go(n);
  };

  HTML5History.prototype.push = function push(location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      pushState(cleanPath(this$1.base + route.fullPath));
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HTML5History.prototype.replace = function replace(location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      replaceState(cleanPath(this$1.base + route.fullPath));
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HTML5History.prototype.ensureURL = function ensureURL(push) {
    if (getLocation(this.base) !== this.current.fullPath) {
      var current = cleanPath(this.base + this.current.fullPath);
      push ? pushState(current) : replaceState(current);
    }
  };

  HTML5History.prototype.getCurrentLocation = function getCurrentLocation() {
    return getLocation(this.base);
  };

  return HTML5History;
}(History);

function getLocation(base) {
  var path = window.location.pathname;
  if (base && path.indexOf(base) === 0) {
    path = path.slice(base.length);
  }
  return (path || '/') + window.location.search + window.location.hash;
}

/*  */

var HashHistory = function (History$$1) {
  function HashHistory(router, base, fallback) {
    History$$1.call(this, router, base);
    // check history fallback deeplinking
    if (fallback && checkFallback(this.base)) {
      return;
    }
    ensureSlash();
  }

  if (History$$1) HashHistory.__proto__ = History$$1;
  HashHistory.prototype = Object.create(History$$1 && History$$1.prototype);
  HashHistory.prototype.constructor = HashHistory;

  // this is delayed until the app mounts
  // to avoid the hashchange listener being fired too early
  HashHistory.prototype.setupListeners = function setupListeners() {
    var this$1 = this;

    window.addEventListener('hashchange', function () {
      if (!ensureSlash()) {
        return;
      }
      this$1.transitionTo(getHash(), function (route) {
        replaceHash(route.fullPath);
      });
    });
  };

  HashHistory.prototype.push = function push(location, onComplete, onAbort) {
    this.transitionTo(location, function (route) {
      pushHash(route.fullPath);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HashHistory.prototype.replace = function replace(location, onComplete, onAbort) {
    this.transitionTo(location, function (route) {
      replaceHash(route.fullPath);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HashHistory.prototype.go = function go(n) {
    window.history.go(n);
  };

  HashHistory.prototype.ensureURL = function ensureURL(push) {
    var current = this.current.fullPath;
    if (getHash() !== current) {
      push ? pushHash(current) : replaceHash(current);
    }
  };

  HashHistory.prototype.getCurrentLocation = function getCurrentLocation() {
    return getHash();
  };

  return HashHistory;
}(History);

function checkFallback(base) {
  var location = getLocation(base);
  if (!/^\/#/.test(location)) {
    window.location.replace(cleanPath(base + '/#' + location));
    return true;
  }
}

function ensureSlash() {
  var path = getHash();
  if (path.charAt(0) === '/') {
    return true;
  }
  replaceHash('/' + path);
  return false;
}

function getHash() {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  var href = window.location.href;
  var index = href.indexOf('#');
  return index === -1 ? '' : href.slice(index + 1);
}

function pushHash(path) {
  window.location.hash = path;
}

function replaceHash(path) {
  var href = window.location.href;
  var i = href.indexOf('#');
  var base = i >= 0 ? href.slice(0, i) : href;
  window.location.replace(base + "#" + path);
}

/*  */

var AbstractHistory = function (History$$1) {
  function AbstractHistory(router, base) {
    History$$1.call(this, router, base);
    this.stack = [];
    this.index = -1;
  }

  if (History$$1) AbstractHistory.__proto__ = History$$1;
  AbstractHistory.prototype = Object.create(History$$1 && History$$1.prototype);
  AbstractHistory.prototype.constructor = AbstractHistory;

  AbstractHistory.prototype.push = function push(location, onComplete, onAbort) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index + 1).concat(route);
      this$1.index++;
      onComplete && onComplete(route);
    }, onAbort);
  };

  AbstractHistory.prototype.replace = function replace(location, onComplete, onAbort) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index).concat(route);
      onComplete && onComplete(route);
    }, onAbort);
  };

  AbstractHistory.prototype.go = function go(n) {
    var this$1 = this;

    var targetIndex = this.index + n;
    if (targetIndex < 0 || targetIndex >= this.stack.length) {
      return;
    }
    var route = this.stack[targetIndex];
    this.confirmTransition(route, function () {
      this$1.index = targetIndex;
      this$1.updateRoute(route);
    });
  };

  AbstractHistory.prototype.getCurrentLocation = function getCurrentLocation() {
    var current = this.stack[this.stack.length - 1];
    return current ? current.fullPath : '/';
  };

  AbstractHistory.prototype.ensureURL = function ensureURL() {
    // noop
  };

  return AbstractHistory;
}(History);

/*  */

var VueRouter = function VueRouter(options) {
  if (options === void 0) options = {};

  this.app = null;
  this.apps = [];
  this.options = options;
  this.beforeHooks = [];
  this.resolveHooks = [];
  this.afterHooks = [];
  this.matcher = createMatcher(options.routes || [], this);

  var mode = options.mode || 'hash';
  this.fallback = mode === 'history' && !supportsPushState && options.fallback !== false;
  if (this.fallback) {
    mode = 'hash';
  }
  if (!inBrowser) {
    mode = 'abstract';
  }
  this.mode = mode;

  switch (mode) {
    case 'history':
      this.history = new HTML5History(this, options.base);
      break;
    case 'hash':
      this.history = new HashHistory(this, options.base, this.fallback);
      break;
    case 'abstract':
      this.history = new AbstractHistory(this, options.base);
      break;
    default:
      if (process.env.NODE_ENV !== 'production') {
        assert(false, "invalid mode: " + mode);
      }
  }
};

var prototypeAccessors = { currentRoute: {} };

VueRouter.prototype.match = function match(raw, current, redirectedFrom) {
  return this.matcher.match(raw, current, redirectedFrom);
};

prototypeAccessors.currentRoute.get = function () {
  return this.history && this.history.current;
};

VueRouter.prototype.init = function init(app /* Vue component instance */) {
  var this$1 = this;

  process.env.NODE_ENV !== 'production' && assert(install.installed, "not installed. Make sure to call `Vue.use(VueRouter)` " + "before creating root instance.");

  this.apps.push(app);

  // main app already initialized.
  if (this.app) {
    return;
  }

  this.app = app;

  var history = this.history;

  if (history instanceof HTML5History) {
    history.transitionTo(history.getCurrentLocation());
  } else if (history instanceof HashHistory) {
    var setupHashListener = function () {
      history.setupListeners();
    };
    history.transitionTo(history.getCurrentLocation(), setupHashListener, setupHashListener);
  }

  history.listen(function (route) {
    this$1.apps.forEach(function (app) {
      app._route = route;
    });
  });
};

VueRouter.prototype.beforeEach = function beforeEach(fn) {
  return registerHook(this.beforeHooks, fn);
};

VueRouter.prototype.beforeResolve = function beforeResolve(fn) {
  return registerHook(this.resolveHooks, fn);
};

VueRouter.prototype.afterEach = function afterEach(fn) {
  return registerHook(this.afterHooks, fn);
};

VueRouter.prototype.onReady = function onReady(cb, errorCb) {
  this.history.onReady(cb, errorCb);
};

VueRouter.prototype.onError = function onError(errorCb) {
  this.history.onError(errorCb);
};

VueRouter.prototype.push = function push(location, onComplete, onAbort) {
  this.history.push(location, onComplete, onAbort);
};

VueRouter.prototype.replace = function replace(location, onComplete, onAbort) {
  this.history.replace(location, onComplete, onAbort);
};

VueRouter.prototype.go = function go(n) {
  this.history.go(n);
};

VueRouter.prototype.back = function back() {
  this.go(-1);
};

VueRouter.prototype.forward = function forward() {
  this.go(1);
};

VueRouter.prototype.getMatchedComponents = function getMatchedComponents(to) {
  var route = to ? to.matched ? to : this.resolve(to).route : this.currentRoute;
  if (!route) {
    return [];
  }
  return [].concat.apply([], route.matched.map(function (m) {
    return Object.keys(m.components).map(function (key) {
      return m.components[key];
    });
  }));
};

VueRouter.prototype.resolve = function resolve(to, current, append) {
  var location = normalizeLocation(to, current || this.history.current, append, this);
  var route = this.match(location, current);
  var fullPath = route.redirectedFrom || route.fullPath;
  var base = this.history.base;
  var href = createHref(base, fullPath, this.mode);
  return {
    location: location,
    route: route,
    href: href,
    // for backwards compat
    normalizedTo: location,
    resolved: route
  };
};

VueRouter.prototype.addRoutes = function addRoutes(routes) {
  this.matcher.addRoutes(routes);
  if (this.history.current !== START) {
    this.history.transitionTo(this.history.getCurrentLocation());
  }
};

Object.defineProperties(VueRouter.prototype, prototypeAccessors);

function registerHook(list, fn) {
  list.push(fn);
  return function () {
    var i = list.indexOf(fn);
    if (i > -1) {
      list.splice(i, 1);
    }
  };
}

function createHref(base, fullPath, mode) {
  var path = mode === 'hash' ? '#' + fullPath : fullPath;
  return base ? cleanPath(base + '/' + path) : path;
}

VueRouter.install = install;
VueRouter.version = '2.7.0';

if (inBrowser && window.Vue) {
  window.Vue.use(VueRouter);
}

/* harmony default export */ __webpack_exports__["a"] = (VueRouter);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(8)))

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_MainFooter_vue__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_64a42bb4_hasScoped_true_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_MainFooter_vue__ = __webpack_require__(25);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(22)
}
var normalizeComponent = __webpack_require__(2)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-64a42bb4"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_MainFooter_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_64a42bb4_hasScoped_true_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_MainFooter_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "com\\MainFooter.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] MainFooter.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-64a42bb4", Component.options)
  } else {
    hotAPI.reload("data-v-64a42bb4", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_router__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vue_resource__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__scss_main_scss__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__scss_main_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__scss_main_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__com_App_vue__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__router_router_js__ = __webpack_require__(3);



__WEBPACK_IMPORTED_MODULE_0_vue__["a" /* default */].use(__WEBPACK_IMPORTED_MODULE_1_vue_router__["a" /* default */]);
__WEBPACK_IMPORTED_MODULE_0_vue__["a" /* default */].use(__WEBPACK_IMPORTED_MODULE_2_vue_resource__["a" /* default */]);





new __WEBPACK_IMPORTED_MODULE_0_vue__["a" /* default */]({
	el: "#app",
	router: __WEBPACK_IMPORTED_MODULE_5__router_router_js__["a" /* default */],
	data: {},
	methods: {},
	components: {
		"v-app": __WEBPACK_IMPORTED_MODULE_4__com_App_vue__["a" /* default */]
	},
	computed: {},
	watch: {},
	mounted() {}
});

/***/ }),
/* 12 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export Url */
/* unused harmony export Http */
/* unused harmony export Resource */
/*!
 * vue-resource v1.3.4
 * https://github.com/pagekit/vue-resource
 * Released under the MIT License.
 */

/**
 * Promises/A+ polyfill v1.1.4 (https://github.com/bramstein/promis)
 */

var RESOLVED = 0;
var REJECTED = 1;
var PENDING = 2;

function Promise$1(executor) {

    this.state = PENDING;
    this.value = undefined;
    this.deferred = [];

    var promise = this;

    try {
        executor(function (x) {
            promise.resolve(x);
        }, function (r) {
            promise.reject(r);
        });
    } catch (e) {
        promise.reject(e);
    }
}

Promise$1.reject = function (r) {
    return new Promise$1(function (resolve, reject) {
        reject(r);
    });
};

Promise$1.resolve = function (x) {
    return new Promise$1(function (resolve, reject) {
        resolve(x);
    });
};

Promise$1.all = function all(iterable) {
    return new Promise$1(function (resolve, reject) {
        var count = 0,
            result = [];

        if (iterable.length === 0) {
            resolve(result);
        }

        function resolver(i) {
            return function (x) {
                result[i] = x;
                count += 1;

                if (count === iterable.length) {
                    resolve(result);
                }
            };
        }

        for (var i = 0; i < iterable.length; i += 1) {
            Promise$1.resolve(iterable[i]).then(resolver(i), reject);
        }
    });
};

Promise$1.race = function race(iterable) {
    return new Promise$1(function (resolve, reject) {
        for (var i = 0; i < iterable.length; i += 1) {
            Promise$1.resolve(iterable[i]).then(resolve, reject);
        }
    });
};

var p$1 = Promise$1.prototype;

p$1.resolve = function resolve(x) {
    var promise = this;

    if (promise.state === PENDING) {
        if (x === promise) {
            throw new TypeError('Promise settled with itself.');
        }

        var called = false;

        try {
            var then = x && x['then'];

            if (x !== null && typeof x === 'object' && typeof then === 'function') {
                then.call(x, function (x) {
                    if (!called) {
                        promise.resolve(x);
                    }
                    called = true;
                }, function (r) {
                    if (!called) {
                        promise.reject(r);
                    }
                    called = true;
                });
                return;
            }
        } catch (e) {
            if (!called) {
                promise.reject(e);
            }
            return;
        }

        promise.state = RESOLVED;
        promise.value = x;
        promise.notify();
    }
};

p$1.reject = function reject(reason) {
    var promise = this;

    if (promise.state === PENDING) {
        if (reason === promise) {
            throw new TypeError('Promise settled with itself.');
        }

        promise.state = REJECTED;
        promise.value = reason;
        promise.notify();
    }
};

p$1.notify = function notify() {
    var promise = this;

    nextTick(function () {
        if (promise.state !== PENDING) {
            while (promise.deferred.length) {
                var deferred = promise.deferred.shift(),
                    onResolved = deferred[0],
                    onRejected = deferred[1],
                    resolve = deferred[2],
                    reject = deferred[3];

                try {
                    if (promise.state === RESOLVED) {
                        if (typeof onResolved === 'function') {
                            resolve(onResolved.call(undefined, promise.value));
                        } else {
                            resolve(promise.value);
                        }
                    } else if (promise.state === REJECTED) {
                        if (typeof onRejected === 'function') {
                            resolve(onRejected.call(undefined, promise.value));
                        } else {
                            reject(promise.value);
                        }
                    }
                } catch (e) {
                    reject(e);
                }
            }
        }
    });
};

p$1.then = function then(onResolved, onRejected) {
    var promise = this;

    return new Promise$1(function (resolve, reject) {
        promise.deferred.push([onResolved, onRejected, resolve, reject]);
        promise.notify();
    });
};

p$1.catch = function (onRejected) {
    return this.then(undefined, onRejected);
};

/**
 * Promise adapter.
 */

if (typeof Promise === 'undefined') {
    window.Promise = Promise$1;
}

function PromiseObj(executor, context) {

    if (executor instanceof Promise) {
        this.promise = executor;
    } else {
        this.promise = new Promise(executor.bind(context));
    }

    this.context = context;
}

PromiseObj.all = function (iterable, context) {
    return new PromiseObj(Promise.all(iterable), context);
};

PromiseObj.resolve = function (value, context) {
    return new PromiseObj(Promise.resolve(value), context);
};

PromiseObj.reject = function (reason, context) {
    return new PromiseObj(Promise.reject(reason), context);
};

PromiseObj.race = function (iterable, context) {
    return new PromiseObj(Promise.race(iterable), context);
};

var p = PromiseObj.prototype;

p.bind = function (context) {
    this.context = context;
    return this;
};

p.then = function (fulfilled, rejected) {

    if (fulfilled && fulfilled.bind && this.context) {
        fulfilled = fulfilled.bind(this.context);
    }

    if (rejected && rejected.bind && this.context) {
        rejected = rejected.bind(this.context);
    }

    return new PromiseObj(this.promise.then(fulfilled, rejected), this.context);
};

p.catch = function (rejected) {

    if (rejected && rejected.bind && this.context) {
        rejected = rejected.bind(this.context);
    }

    return new PromiseObj(this.promise.catch(rejected), this.context);
};

p.finally = function (callback) {

    return this.then(function (value) {
        callback.call(this);
        return value;
    }, function (reason) {
        callback.call(this);
        return Promise.reject(reason);
    });
};

/**
 * Utility functions.
 */

var ref = {};
var hasOwnProperty = ref.hasOwnProperty;

var ref$1 = [];
var slice = ref$1.slice;
var debug = false;
var ntick;

var inBrowser = typeof window !== 'undefined';

var Util = function (ref) {
    var config = ref.config;
    var nextTick = ref.nextTick;

    ntick = nextTick;
    debug = config.debug || !config.silent;
};

function warn(msg) {
    if (typeof console !== 'undefined' && debug) {
        console.warn('[VueResource warn]: ' + msg);
    }
}

function error(msg) {
    if (typeof console !== 'undefined') {
        console.error(msg);
    }
}

function nextTick(cb, ctx) {
    return ntick(cb, ctx);
}

function trim(str) {
    return str ? str.replace(/^\s*|\s*$/g, '') : '';
}

function trimEnd(str, chars) {

    if (str && chars === undefined) {
        return str.replace(/\s+$/, '');
    }

    if (!str || !chars) {
        return str;
    }

    return str.replace(new RegExp("[" + chars + "]+$"), '');
}

function toLower(str) {
    return str ? str.toLowerCase() : '';
}

function toUpper(str) {
    return str ? str.toUpperCase() : '';
}

var isArray = Array.isArray;

function isString(val) {
    return typeof val === 'string';
}

function isFunction(val) {
    return typeof val === 'function';
}

function isObject(obj) {
    return obj !== null && typeof obj === 'object';
}

function isPlainObject(obj) {
    return isObject(obj) && Object.getPrototypeOf(obj) == Object.prototype;
}

function isBlob(obj) {
    return typeof Blob !== 'undefined' && obj instanceof Blob;
}

function isFormData(obj) {
    return typeof FormData !== 'undefined' && obj instanceof FormData;
}

function when(value, fulfilled, rejected) {

    var promise = PromiseObj.resolve(value);

    if (arguments.length < 2) {
        return promise;
    }

    return promise.then(fulfilled, rejected);
}

function options(fn, obj, opts) {

    opts = opts || {};

    if (isFunction(opts)) {
        opts = opts.call(obj);
    }

    return merge(fn.bind({ $vm: obj, $options: opts }), fn, { $options: opts });
}

function each(obj, iterator) {

    var i, key;

    if (isArray(obj)) {
        for (i = 0; i < obj.length; i++) {
            iterator.call(obj[i], obj[i], i);
        }
    } else if (isObject(obj)) {
        for (key in obj) {
            if (hasOwnProperty.call(obj, key)) {
                iterator.call(obj[key], obj[key], key);
            }
        }
    }

    return obj;
}

var assign = Object.assign || _assign;

function merge(target) {

    var args = slice.call(arguments, 1);

    args.forEach(function (source) {
        _merge(target, source, true);
    });

    return target;
}

function defaults(target) {

    var args = slice.call(arguments, 1);

    args.forEach(function (source) {

        for (var key in source) {
            if (target[key] === undefined) {
                target[key] = source[key];
            }
        }
    });

    return target;
}

function _assign(target) {

    var args = slice.call(arguments, 1);

    args.forEach(function (source) {
        _merge(target, source);
    });

    return target;
}

function _merge(target, source, deep) {
    for (var key in source) {
        if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
            if (isPlainObject(source[key]) && !isPlainObject(target[key])) {
                target[key] = {};
            }
            if (isArray(source[key]) && !isArray(target[key])) {
                target[key] = [];
            }
            _merge(target[key], source[key], deep);
        } else if (source[key] !== undefined) {
            target[key] = source[key];
        }
    }
}

/**
 * Root Prefix Transform.
 */

var root = function (options$$1, next) {

    var url = next(options$$1);

    if (isString(options$$1.root) && !/^(https?:)?\//.test(url)) {
        url = trimEnd(options$$1.root, '/') + '/' + url;
    }

    return url;
};

/**
 * Query Parameter Transform.
 */

var query = function (options$$1, next) {

    var urlParams = Object.keys(Url.options.params),
        query = {},
        url = next(options$$1);

    each(options$$1.params, function (value, key) {
        if (urlParams.indexOf(key) === -1) {
            query[key] = value;
        }
    });

    query = Url.params(query);

    if (query) {
        url += (url.indexOf('?') == -1 ? '?' : '&') + query;
    }

    return url;
};

/**
 * URL Template v2.0.6 (https://github.com/bramstein/url-template)
 */

function expand(url, params, variables) {

    var tmpl = parse(url),
        expanded = tmpl.expand(params);

    if (variables) {
        variables.push.apply(variables, tmpl.vars);
    }

    return expanded;
}

function parse(template) {

    var operators = ['+', '#', '.', '/', ';', '?', '&'],
        variables = [];

    return {
        vars: variables,
        expand: function expand(context) {
            return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function (_, expression, literal) {
                if (expression) {

                    var operator = null,
                        values = [];

                    if (operators.indexOf(expression.charAt(0)) !== -1) {
                        operator = expression.charAt(0);
                        expression = expression.substr(1);
                    }

                    expression.split(/,/g).forEach(function (variable) {
                        var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
                        values.push.apply(values, getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
                        variables.push(tmp[1]);
                    });

                    if (operator && operator !== '+') {

                        var separator = ',';

                        if (operator === '?') {
                            separator = '&';
                        } else if (operator !== '#') {
                            separator = operator;
                        }

                        return (values.length !== 0 ? operator : '') + values.join(separator);
                    } else {
                        return values.join(',');
                    }
                } else {
                    return encodeReserved(literal);
                }
            });
        }
    };
}

function getValues(context, operator, key, modifier) {

    var value = context[key],
        result = [];

    if (isDefined(value) && value !== '') {
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            value = value.toString();

            if (modifier && modifier !== '*') {
                value = value.substring(0, parseInt(modifier, 10));
            }

            result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : null));
        } else {
            if (modifier === '*') {
                if (Array.isArray(value)) {
                    value.filter(isDefined).forEach(function (value) {
                        result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : null));
                    });
                } else {
                    Object.keys(value).forEach(function (k) {
                        if (isDefined(value[k])) {
                            result.push(encodeValue(operator, value[k], k));
                        }
                    });
                }
            } else {
                var tmp = [];

                if (Array.isArray(value)) {
                    value.filter(isDefined).forEach(function (value) {
                        tmp.push(encodeValue(operator, value));
                    });
                } else {
                    Object.keys(value).forEach(function (k) {
                        if (isDefined(value[k])) {
                            tmp.push(encodeURIComponent(k));
                            tmp.push(encodeValue(operator, value[k].toString()));
                        }
                    });
                }

                if (isKeyOperator(operator)) {
                    result.push(encodeURIComponent(key) + '=' + tmp.join(','));
                } else if (tmp.length !== 0) {
                    result.push(tmp.join(','));
                }
            }
        }
    } else {
        if (operator === ';') {
            result.push(encodeURIComponent(key));
        } else if (value === '' && (operator === '&' || operator === '?')) {
            result.push(encodeURIComponent(key) + '=');
        } else if (value === '') {
            result.push('');
        }
    }

    return result;
}

function isDefined(value) {
    return value !== undefined && value !== null;
}

function isKeyOperator(operator) {
    return operator === ';' || operator === '&' || operator === '?';
}

function encodeValue(operator, value, key) {

    value = operator === '+' || operator === '#' ? encodeReserved(value) : encodeURIComponent(value);

    if (key) {
        return encodeURIComponent(key) + '=' + value;
    } else {
        return value;
    }
}

function encodeReserved(str) {
    return str.split(/(%[0-9A-Fa-f]{2})/g).map(function (part) {
        if (!/%[0-9A-Fa-f]/.test(part)) {
            part = encodeURI(part);
        }
        return part;
    }).join('');
}

/**
 * URL Template (RFC 6570) Transform.
 */

var template = function (options) {

    var variables = [],
        url = expand(options.url, options.params, variables);

    variables.forEach(function (key) {
        delete options.params[key];
    });

    return url;
};

/**
 * Service for URL templating.
 */

function Url(url, params) {

    var self = this || {},
        options$$1 = url,
        transform;

    if (isString(url)) {
        options$$1 = { url: url, params: params };
    }

    options$$1 = merge({}, Url.options, self.$options, options$$1);

    Url.transforms.forEach(function (handler) {

        if (isString(handler)) {
            handler = Url.transform[handler];
        }

        if (isFunction(handler)) {
            transform = factory(handler, transform, self.$vm);
        }
    });

    return transform(options$$1);
}

/**
 * Url options.
 */

Url.options = {
    url: '',
    root: null,
    params: {}
};

/**
 * Url transforms.
 */

Url.transform = { template: template, query: query, root: root };
Url.transforms = ['template', 'query', 'root'];

/**
 * Encodes a Url parameter string.
 *
 * @param {Object} obj
 */

Url.params = function (obj) {

    var params = [],
        escape = encodeURIComponent;

    params.add = function (key, value) {

        if (isFunction(value)) {
            value = value();
        }

        if (value === null) {
            value = '';
        }

        this.push(escape(key) + '=' + escape(value));
    };

    serialize(params, obj);

    return params.join('&').replace(/%20/g, '+');
};

/**
 * Parse a URL and return its components.
 *
 * @param {String} url
 */

Url.parse = function (url) {

    var el = document.createElement('a');

    if (document.documentMode) {
        el.href = url;
        url = el.href;
    }

    el.href = url;

    return {
        href: el.href,
        protocol: el.protocol ? el.protocol.replace(/:$/, '') : '',
        port: el.port,
        host: el.host,
        hostname: el.hostname,
        pathname: el.pathname.charAt(0) === '/' ? el.pathname : '/' + el.pathname,
        search: el.search ? el.search.replace(/^\?/, '') : '',
        hash: el.hash ? el.hash.replace(/^#/, '') : ''
    };
};

function factory(handler, next, vm) {
    return function (options$$1) {
        return handler.call(vm, options$$1, next);
    };
}

function serialize(params, obj, scope) {

    var array = isArray(obj),
        plain = isPlainObject(obj),
        hash;

    each(obj, function (value, key) {

        hash = isObject(value) || isArray(value);

        if (scope) {
            key = scope + '[' + (plain || hash ? key : '') + ']';
        }

        if (!scope && array) {
            params.add(value.name, value.value);
        } else if (hash) {
            serialize(params, value, key);
        } else {
            params.add(key, value);
        }
    });
}

/**
 * XDomain client (Internet Explorer).
 */

var xdrClient = function (request) {
    return new PromiseObj(function (resolve) {

        var xdr = new XDomainRequest(),
            handler = function (ref) {
            var type = ref.type;

            var status = 0;

            if (type === 'load') {
                status = 200;
            } else if (type === 'error') {
                status = 500;
            }

            resolve(request.respondWith(xdr.responseText, { status: status }));
        };

        request.abort = function () {
            return xdr.abort();
        };

        xdr.open(request.method, request.getUrl());

        if (request.timeout) {
            xdr.timeout = request.timeout;
        }

        xdr.onload = handler;
        xdr.onabort = handler;
        xdr.onerror = handler;
        xdr.ontimeout = handler;
        xdr.onprogress = function () {};
        xdr.send(request.getBody());
    });
};

/**
 * CORS Interceptor.
 */

var SUPPORTS_CORS = inBrowser && 'withCredentials' in new XMLHttpRequest();

var cors = function (request, next) {

    if (inBrowser) {

        var orgUrl = Url.parse(location.href);
        var reqUrl = Url.parse(request.getUrl());

        if (reqUrl.protocol !== orgUrl.protocol || reqUrl.host !== orgUrl.host) {

            request.crossOrigin = true;
            request.emulateHTTP = false;

            if (!SUPPORTS_CORS) {
                request.client = xdrClient;
            }
        }
    }

    next();
};

/**
 * Form data Interceptor.
 */

var form = function (request, next) {

    if (isFormData(request.body)) {

        request.headers.delete('Content-Type');
    } else if (isObject(request.body) && request.emulateJSON) {

        request.body = Url.params(request.body);
        request.headers.set('Content-Type', 'application/x-www-form-urlencoded');
    }

    next();
};

/**
 * JSON Interceptor.
 */

var json = function (request, next) {

    var type = request.headers.get('Content-Type') || '';

    if (isObject(request.body) && type.indexOf('application/json') === 0) {
        request.body = JSON.stringify(request.body);
    }

    next(function (response) {

        return response.bodyText ? when(response.text(), function (text) {

            type = response.headers.get('Content-Type') || '';

            if (type.indexOf('application/json') === 0 || isJson(text)) {

                try {
                    response.body = JSON.parse(text);
                } catch (e) {
                    response.body = null;
                }
            } else {
                response.body = text;
            }

            return response;
        }) : response;
    });
};

function isJson(str) {

    var start = str.match(/^\[|^\{(?!\{)/),
        end = { '[': /]$/, '{': /}$/ };

    return start && end[start[0]].test(str);
}

/**
 * JSONP client (Browser).
 */

var jsonpClient = function (request) {
    return new PromiseObj(function (resolve) {

        var name = request.jsonp || 'callback',
            callback = request.jsonpCallback || '_jsonp' + Math.random().toString(36).substr(2),
            body = null,
            handler,
            script;

        handler = function (ref) {
            var type = ref.type;

            var status = 0;

            if (type === 'load' && body !== null) {
                status = 200;
            } else if (type === 'error') {
                status = 500;
            }

            if (status && window[callback]) {
                delete window[callback];
                document.body.removeChild(script);
            }

            resolve(request.respondWith(body, { status: status }));
        };

        window[callback] = function (result) {
            body = JSON.stringify(result);
        };

        request.abort = function () {
            handler({ type: 'abort' });
        };

        request.params[name] = callback;

        if (request.timeout) {
            setTimeout(request.abort, request.timeout);
        }

        script = document.createElement('script');
        script.src = request.getUrl();
        script.type = 'text/javascript';
        script.async = true;
        script.onload = handler;
        script.onerror = handler;

        document.body.appendChild(script);
    });
};

/**
 * JSONP Interceptor.
 */

var jsonp = function (request, next) {

    if (request.method == 'JSONP') {
        request.client = jsonpClient;
    }

    next();
};

/**
 * Before Interceptor.
 */

var before = function (request, next) {

    if (isFunction(request.before)) {
        request.before.call(this, request);
    }

    next();
};

/**
 * HTTP method override Interceptor.
 */

var method = function (request, next) {

    if (request.emulateHTTP && /^(PUT|PATCH|DELETE)$/i.test(request.method)) {
        request.headers.set('X-HTTP-Method-Override', request.method);
        request.method = 'POST';
    }

    next();
};

/**
 * Header Interceptor.
 */

var header = function (request, next) {

    var headers = assign({}, Http.headers.common, !request.crossOrigin ? Http.headers.custom : {}, Http.headers[toLower(request.method)]);

    each(headers, function (value, name) {
        if (!request.headers.has(name)) {
            request.headers.set(name, value);
        }
    });

    next();
};

/**
 * XMLHttp client (Browser).
 */

var xhrClient = function (request) {
    return new PromiseObj(function (resolve) {

        var xhr = new XMLHttpRequest(),
            handler = function (event) {

            var response = request.respondWith('response' in xhr ? xhr.response : xhr.responseText, {
                status: xhr.status === 1223 ? 204 : xhr.status, // IE9 status bug
                statusText: xhr.status === 1223 ? 'No Content' : trim(xhr.statusText)
            });

            each(trim(xhr.getAllResponseHeaders()).split('\n'), function (row) {
                response.headers.append(row.slice(0, row.indexOf(':')), row.slice(row.indexOf(':') + 1));
            });

            resolve(response);
        };

        request.abort = function () {
            return xhr.abort();
        };

        if (request.progress) {
            if (request.method === 'GET') {
                xhr.addEventListener('progress', request.progress);
            } else if (/^(POST|PUT)$/i.test(request.method)) {
                xhr.upload.addEventListener('progress', request.progress);
            }
        }

        xhr.open(request.method, request.getUrl(), true);

        if (request.timeout) {
            xhr.timeout = request.timeout;
        }

        if (request.responseType && 'responseType' in xhr) {
            xhr.responseType = request.responseType;
        }

        if (request.withCredentials || request.credentials) {
            xhr.withCredentials = true;
        }

        if (!request.crossOrigin) {
            request.headers.set('X-Requested-With', 'XMLHttpRequest');
        }

        request.headers.forEach(function (value, name) {
            xhr.setRequestHeader(name, value);
        });

        xhr.onload = handler;
        xhr.onabort = handler;
        xhr.onerror = handler;
        xhr.ontimeout = handler;
        xhr.send(request.getBody());
    });
};

/**
 * Http client (Node).
 */

var nodeClient = function (request) {

    var client = __webpack_require__(14);

    return new PromiseObj(function (resolve) {

        var url = request.getUrl();
        var body = request.getBody();
        var method = request.method;
        var headers = {},
            handler;

        request.headers.forEach(function (value, name) {
            headers[name] = value;
        });

        client(url, { body: body, method: method, headers: headers }).then(handler = function (resp) {

            var response = request.respondWith(resp.body, {
                status: resp.statusCode,
                statusText: trim(resp.statusMessage)
            });

            each(resp.headers, function (value, name) {
                response.headers.set(name, value);
            });

            resolve(response);
        }, function (error$$1) {
            return handler(error$$1.response);
        });
    });
};

/**
 * Base client.
 */

var Client = function (context) {

    var reqHandlers = [sendRequest],
        resHandlers = [],
        handler;

    if (!isObject(context)) {
        context = null;
    }

    function Client(request) {
        return new PromiseObj(function (resolve, reject) {

            function exec() {

                handler = reqHandlers.pop();

                if (isFunction(handler)) {
                    handler.call(context, request, next);
                } else {
                    warn("Invalid interceptor of type " + typeof handler + ", must be a function");
                    next();
                }
            }

            function next(response) {

                if (isFunction(response)) {

                    resHandlers.unshift(response);
                } else if (isObject(response)) {

                    resHandlers.forEach(function (handler) {
                        response = when(response, function (response) {
                            return handler.call(context, response) || response;
                        }, reject);
                    });

                    when(response, resolve, reject);

                    return;
                }

                exec();
            }

            exec();
        }, context);
    }

    Client.use = function (handler) {
        reqHandlers.push(handler);
    };

    return Client;
};

function sendRequest(request, resolve) {

    var client = request.client || (inBrowser ? xhrClient : nodeClient);

    resolve(client(request));
}

/**
 * HTTP Headers.
 */

var Headers = function Headers(headers) {
    var this$1 = this;

    this.map = {};

    each(headers, function (value, name) {
        return this$1.append(name, value);
    });
};

Headers.prototype.has = function has(name) {
    return getName(this.map, name) !== null;
};

Headers.prototype.get = function get(name) {

    var list = this.map[getName(this.map, name)];

    return list ? list.join() : null;
};

Headers.prototype.getAll = function getAll(name) {
    return this.map[getName(this.map, name)] || [];
};

Headers.prototype.set = function set(name, value) {
    this.map[normalizeName(getName(this.map, name) || name)] = [trim(value)];
};

Headers.prototype.append = function append(name, value) {

    var list = this.map[getName(this.map, name)];

    if (list) {
        list.push(trim(value));
    } else {
        this.set(name, value);
    }
};

Headers.prototype.delete = function delete$1(name) {
    delete this.map[getName(this.map, name)];
};

Headers.prototype.deleteAll = function deleteAll() {
    this.map = {};
};

Headers.prototype.forEach = function forEach(callback, thisArg) {
    var this$1 = this;

    each(this.map, function (list, name) {
        each(list, function (value) {
            return callback.call(thisArg, value, name, this$1);
        });
    });
};

function getName(map, name) {
    return Object.keys(map).reduce(function (prev, curr) {
        return toLower(name) === toLower(curr) ? curr : prev;
    }, null);
}

function normalizeName(name) {

    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
        throw new TypeError('Invalid character in header field name');
    }

    return trim(name);
}

/**
 * HTTP Response.
 */

var Response = function Response(body, ref) {
    var url = ref.url;
    var headers = ref.headers;
    var status = ref.status;
    var statusText = ref.statusText;

    this.url = url;
    this.ok = status >= 200 && status < 300;
    this.status = status || 0;
    this.statusText = statusText || '';
    this.headers = new Headers(headers);
    this.body = body;

    if (isString(body)) {

        this.bodyText = body;
    } else if (isBlob(body)) {

        this.bodyBlob = body;

        if (isBlobText(body)) {
            this.bodyText = blobText(body);
        }
    }
};

Response.prototype.blob = function blob() {
    return when(this.bodyBlob);
};

Response.prototype.text = function text() {
    return when(this.bodyText);
};

Response.prototype.json = function json() {
    return when(this.text(), function (text) {
        return JSON.parse(text);
    });
};

Object.defineProperty(Response.prototype, 'data', {

    get: function get() {
        return this.body;
    },

    set: function set(body) {
        this.body = body;
    }

});

function blobText(body) {
    return new PromiseObj(function (resolve) {

        var reader = new FileReader();

        reader.readAsText(body);
        reader.onload = function () {
            resolve(reader.result);
        };
    });
}

function isBlobText(body) {
    return body.type.indexOf('text') === 0 || body.type.indexOf('json') !== -1;
}

/**
 * HTTP Request.
 */

var Request = function Request(options$$1) {

    this.body = null;
    this.params = {};

    assign(this, options$$1, {
        method: toUpper(options$$1.method || 'GET')
    });

    if (!(this.headers instanceof Headers)) {
        this.headers = new Headers(this.headers);
    }
};

Request.prototype.getUrl = function getUrl() {
    return Url(this);
};

Request.prototype.getBody = function getBody() {
    return this.body;
};

Request.prototype.respondWith = function respondWith(body, options$$1) {
    return new Response(body, assign(options$$1 || {}, { url: this.getUrl() }));
};

/**
 * Service for sending network requests.
 */

var COMMON_HEADERS = { 'Accept': 'application/json, text/plain, */*' };
var JSON_CONTENT_TYPE = { 'Content-Type': 'application/json;charset=utf-8' };

function Http(options$$1) {

    var self = this || {},
        client = Client(self.$vm);

    defaults(options$$1 || {}, self.$options, Http.options);

    Http.interceptors.forEach(function (handler) {

        if (isString(handler)) {
            handler = Http.interceptor[handler];
        }

        if (isFunction(handler)) {
            client.use(handler);
        }
    });

    return client(new Request(options$$1)).then(function (response) {

        return response.ok ? response : PromiseObj.reject(response);
    }, function (response) {

        if (response instanceof Error) {
            error(response);
        }

        return PromiseObj.reject(response);
    });
}

Http.options = {};

Http.headers = {
    put: JSON_CONTENT_TYPE,
    post: JSON_CONTENT_TYPE,
    patch: JSON_CONTENT_TYPE,
    delete: JSON_CONTENT_TYPE,
    common: COMMON_HEADERS,
    custom: {}
};

Http.interceptor = { before: before, method: method, jsonp: jsonp, json: json, form: form, header: header, cors: cors };
Http.interceptors = ['before', 'method', 'jsonp', 'json', 'form', 'header', 'cors'];

['get', 'delete', 'head', 'jsonp'].forEach(function (method$$1) {

    Http[method$$1] = function (url, options$$1) {
        return this(assign(options$$1 || {}, { url: url, method: method$$1 }));
    };
});

['post', 'put', 'patch'].forEach(function (method$$1) {

    Http[method$$1] = function (url, body, options$$1) {
        return this(assign(options$$1 || {}, { url: url, method: method$$1, body: body }));
    };
});

/**
 * Service for interacting with RESTful services.
 */

function Resource(url, params, actions, options$$1) {

    var self = this || {},
        resource = {};

    actions = assign({}, Resource.actions, actions);

    each(actions, function (action, name) {

        action = merge({ url: url, params: assign({}, params) }, options$$1, action);

        resource[name] = function () {
            return (self.$http || Http)(opts(action, arguments));
        };
    });

    return resource;
}

function opts(action, args) {

    var options$$1 = assign({}, action),
        params = {},
        body;

    switch (args.length) {

        case 2:

            params = args[0];
            body = args[1];

            break;

        case 1:

            if (/^(POST|PUT|PATCH)$/i.test(options$$1.method)) {
                body = args[0];
            } else {
                params = args[0];
            }

            break;

        case 0:

            break;

        default:

            throw 'Expected up to 2 arguments [params, body], got ' + args.length + ' arguments';
    }

    options$$1.body = body;
    options$$1.params = assign({}, options$$1.params, params);

    return options$$1;
}

Resource.actions = {

    get: { method: 'GET' },
    save: { method: 'POST' },
    query: { method: 'GET' },
    update: { method: 'PUT' },
    remove: { method: 'DELETE' },
    delete: { method: 'DELETE' }

};

/**
 * Install plugin.
 */

function plugin(Vue) {

    if (plugin.installed) {
        return;
    }

    Util(Vue);

    Vue.url = Url;
    Vue.http = Http;
    Vue.resource = Resource;
    Vue.Promise = PromiseObj;

    Object.defineProperties(Vue.prototype, {

        $url: {
            get: function get() {
                return options(Vue.url, this, this.$options.url);
            }
        },

        $http: {
            get: function get() {
                return options(Vue.http, this, this.$options.http);
            }
        },

        $resource: {
            get: function get() {
                return Vue.resource.bind(this);
            }
        },

        $promise: {
            get: function get() {
                var this$1 = this;

                return function (executor) {
                    return new Vue.Promise(executor, this$1);
                };
            }
        }

    });
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(plugin);
}

/* harmony default export */ __webpack_exports__["a"] = (plugin);


/***/ }),
/* 14 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "body,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\np,\nblockquote,\ndl,\ndt,\ndd,\nul,\nol,\nli,\npre,\nform,\nfieldset,\nlegend,\nbutton,\ninput,\ntextarea,\nth,\ntd {\n  margin: 0;\n  padding: 0; }\n\nbody,\nbutton,\ninput,\nselect,\ntextarea {\n  font: 12px/1.5tahoma, arial, \\5b8b\\4f53; }\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: 100%; }\n\naddress,\ncite,\ndfn,\nem,\nvar {\n  font-style: normal; }\n\ncode,\nkbd,\npre,\nsamp {\n  font-family: couriernew, courier, monospace; }\n\nsmall {\n  font-size: 12px; }\n\nul,\nol {\n  list-style: none; }\n\na {\n  text-decoration: none; }\n\nsup {\n  vertical-align: text-top; }\n\nsub {\n  vertical-align: text-bottom; }\n\nlegend {\n  color: #000; }\n\nfieldset,\nimg {\n  border: 0; }\n\nbutton,\ninput,\nselect,\ntextarea {\n  font-size: 100%; }\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n@font-face {\n  font-family: 'iconfont';\n  /* project id 365740 */\n  src: url(\"//at.alicdn.com/t/font_365740_2xpy985zqjckgldi.eot\");\n  src: url(\"//at.alicdn.com/t/font_365740_2xpy985zqjckgldi.eot?#iefix\") format(\"embedded-opentype\"), url(\"//at.alicdn.com/t/font_365740_2xpy985zqjckgldi.woff\") format(\"woff\"), url(\"//at.alicdn.com/t/font_365740_2xpy985zqjckgldi.ttf\") format(\"truetype\"), url(\"//at.alicdn.com/t/font_365740_2xpy985zqjckgldi.svg#iconfont\") format(\"svg\"); }\n\n.iconfont {\n  font-family: iconfont; }\n\nhtml, body, #app {\n  width: 100%;\n  height: 100%;\n  overflow: hidden; }\n\n.container {\n  width: 100%;\n  max-width: 640px;\n  margin: 0 auto;\n  height: 100%;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  flex-direction: column; }\n  .container .header {\n    height: 44px;\n    width: 100%;\n    background-color: #000;\n    font-size: 18px;\n    font-weight: bold;\n    color: #fff; }\n    .container .header .commonHeader {\n      width: 100%;\n      height: 100%;\n      display: -webkit-box;\n      display: flex;\n      -webkit-box-orient: horizontal;\n      flex-direction: row;\n      text-align: center; }\n      .container .header .commonHeader .back {\n        width: 100px;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n      .container .header .commonHeader .title {\n        flex: 1;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center;\n        -webkit-box-orient: horizontal;\n        flex-direction: row; }\n      .container .header .commonHeader .moreInfo {\n        width: 100px;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center;\n        -webkit-box-orient: horizontal;\n        flex-direction: row; }\n  .container #content {\n    width: 100%;\n    overflow-y: auto;\n    -webkit-box-flex: 1;\n    flex: 1; }\n  .container .footer {\n    height: 50px;\n    width: 100%;\n    background-color: #eee; }\n    .container .footer ul {\n      width: 100%;\n      height: 100%;\n      display: -webkit-box;\n      display: flex; }\n      .container .footer ul li {\n        -webkit-box-flex: 1;\n        flex: 1;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n        .container .footer ul li.active {\n          color: #f66; }\n", ""]);

// exports


/***/ }),
/* 16 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
	// get current location
	var location = typeof window !== "undefined" && window.location;

	if (!location) {
		throw new Error("fixUrls requires window.location");
	}

	// blank or null?
	if (!css || typeof css !== "string") {
		return css;
	}

	var baseUrl = location.protocol + "//" + location.host;
	var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
 This regular expression is just a way to recursively match brackets within
 a string.
 	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
    (  = Start a capturing group
      (?:  = Start a non-capturing group
          [^)(]  = Match anything that isn't a parentheses
          |  = OR
          \(  = Match a start parentheses
              (?:  = Start another non-capturing groups
                  [^)(]+  = Match anything that isn't a parentheses
                  |  = OR
                  \(  = Match a start parentheses
                      [^)(]*  = Match anything that isn't a parentheses
                  \)  = Match a end parentheses
              )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
  \)  = Match a close parens
 	 /gi  = Get all matches, not the first.  Be case insensitive.
  */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function (fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl.trim().replace(/^"(.*)"$/, function (o, $1) {
			return $1;
		}).replace(/^'(.*)'$/, function (o, $1) {
			return $1;
		});

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
			return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
			//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_App_vue__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_4fea5ed1_hasScoped_false_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_App_vue__ = __webpack_require__(26);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(18)
}
var normalizeComponent = __webpack_require__(2)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_App_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_4fea5ed1_hasScoped_false_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_App_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "com\\App.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] App.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4fea5ed1", Component.options)
  } else {
    hotAPI.reload("data-v-4fea5ed1", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(19);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("94e137d2", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../node_modules/_css-loader@0.28.5@css-loader/index.js?sourceMap!../node_modules/_vue-loader@13.0.4@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4fea5ed1\",\"scoped\":false,\"hasInlineConfig\":false}!../node_modules/_vue-loader@13.0.4@vue-loader/lib/selector.js?type=styles&index=0!./App.vue", function() {
     var newContent = require("!!../node_modules/_css-loader@0.28.5@css-loader/index.js?sourceMap!../node_modules/_vue-loader@13.0.4@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4fea5ed1\",\"scoped\":false,\"hasInlineConfig\":false}!../node_modules/_vue-loader@13.0.4@vue-loader/lib/selector.js?type=styles&index=0!./App.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", "", {"version":3,"sources":[],"names":[],"mappings":"","file":"App.vue","sourceRoot":""}]);

// exports


/***/ }),
/* 20 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles(parentId, list) {
  var styles = [];
  var newStyles = {};
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = item[0];
    var css = item[1];
    var media = item[2];
    var sourceMap = item[3];
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    };
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] });
    } else {
      newStyles[id].parts.push(part);
    }
  }
  return styles;
};

/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__MainFooter_vue__ = __webpack_require__(10);
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
	data() {
		return {};
	},
	methods: {},
	components: {
		"v-footer": __WEBPACK_IMPORTED_MODULE_0__MainFooter_vue__["a" /* default */]
	}

});

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(23);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("1607ea49", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../node_modules/_css-loader@0.28.5@css-loader/index.js?sourceMap!../node_modules/_vue-loader@13.0.4@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-64a42bb4\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/_vue-loader@13.0.4@vue-loader/lib/selector.js?type=styles&index=0!./MainFooter.vue", function() {
     var newContent = require("!!../node_modules/_css-loader@0.28.5@css-loader/index.js?sourceMap!../node_modules/_vue-loader@13.0.4@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-64a42bb4\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/_vue-loader@13.0.4@vue-loader/lib/selector.js?type=styles&index=0!./MainFooter.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n.foor li a i[data-v-64a42bb4]{\n\t\t\tcolor: #222;\n}\n.router-link-exact-active.router-link-active[data-v-64a42bb4]{\n\t\tcolor:#f66;\n}\n.iconfont[data-v-64a42bb4]{\n\t\t\tfont-size: 20px;\n\t\t\tfont-style: inherit;\n}\n\t\t\n", "", {"version":3,"sources":["G:/enjoy/com/com/MainFooter.vue?ef1e4cf8"],"names":[],"mappings":";AA4CA;GACA,YAAA;CACA;AAEA;EACA,WAAA;CACA;AAEA;GACA,gBAAA;GACA,oBAAA;CACA","file":"MainFooter.vue","sourcesContent":["<template>\r\n\t<ul class=\"foor\">\r\n\t\t<li> <router-link to=\"./home\"><i class=\"iconfont\">&#xe617;</i></router-link> </li>\r\n\t\t<li> <router-link to=\"./kind\"><i class=\"iconfont\">&#xe627;</i></router-link> </li>\r\n\t\t<li @click = \"hasLogin\"> <router-link to=\"./user\"><i class=\"iconfont\">&#xe603;</i></router-link> </li>\r\n\t\t<li @click = \"hasMore\"> <router-link to=\"./more\"><i class=\"iconfont\">&#xe602;</i></router-link> </li>\r\n\t</ul>\r\n</template>\r\n\r\n<script>\r\n\timport \"./../scss/main.scss\";\r\n\texport default{\r\n\t\tdata(){\r\n\t\t\treturn{\r\n\t\t\t\t\r\n\t\t\t}\r\n\t\t},\r\n\t\tmethods:{\r\n\t\t\thasLogin(){\r\n\t\t\t\tvar that = this;\r\n\t\t\t\tvar isLogin = localStorage.getItem(\"isLogin\");\r\n\t\t\t\tif(isLogin == \"1\"){\r\n\t\t\t\t\tthat.$router.push({path:\"/user\"})\r\n\t\t\t\t}else{\r\n\t\t\t\t\tthat.$router.push({path:\"/login\"})\r\n\t\t\t\t}\r\n\t\t\t},\r\n\t\t\thasMore(){\r\n\t\t\t\tvar that = this;\r\n\t\t\t\tvar isLogin = localStorage.getItem(\"isLogin\");\r\n\t\t\t\tif(isLogin == \"1\"){\r\n\t\t\t\t\tthat.$router.push({path:\"/more\"})\r\n\t\t\t\t}else{\r\n\t\t\t\t\tthat.$router.push({path:\"/login\"})\r\n\t\t\t\t}\r\n\t\t\t}\r\n\t\t},\r\n\t\tmounted(){\r\n\t\t\t\r\n\t\t}\r\n\t}\r\n</script>\r\n\r\n<style scoped>\r\n\t.foor li a i{\r\n\t\t\tcolor: #222;\r\n\t\t}\r\n\t\r\n.router-link-exact-active.router-link-active{\r\n\t\tcolor:#f66;\r\n\t}\r\n\t\r\n\t\t.iconfont{\r\n\t\t\tfont-size: 20px;\r\n\t\t\tfont-style: inherit;\r\n\t\t}\r\n\t\t\r\n</style>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scss_main_scss__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scss_main_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__scss_main_scss__);
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["a"] = ({
	data() {
		return {};
	},
	methods: {
		hasLogin() {
			var that = this;
			var isLogin = localStorage.getItem("isLogin");
			if (isLogin == "1") {
				that.$router.push({ path: "/user" });
			} else {
				that.$router.push({ path: "/login" });
			}
		},
		hasMore() {
			var that = this;
			var isLogin = localStorage.getItem("isLogin");
			if (isLogin == "1") {
				that.$router.push({ path: "/more" });
			} else {
				that.$router.push({ path: "/login" });
			}
		}
	},
	mounted() {}
});

/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('ul', {
    staticClass: "foor"
  }, [_c('li', [_c('router-link', {
    attrs: {
      "to": "./home"
    }
  }, [_c('i', {
    staticClass: "iconfont"
  }, [_vm._v("")])])], 1), _vm._v(" "), _c('li', [_c('router-link', {
    attrs: {
      "to": "./kind"
    }
  }, [_c('i', {
    staticClass: "iconfont"
  }, [_vm._v("")])])], 1), _vm._v(" "), _c('li', {
    on: {
      "click": _vm.hasLogin
    }
  }, [_c('router-link', {
    attrs: {
      "to": "./user"
    }
  }, [_c('i', {
    staticClass: "iconfont"
  }, [_vm._v("")])])], 1), _vm._v(" "), _c('li', {
    on: {
      "click": _vm.hasMore
    }
  }, [_c('router-link', {
    attrs: {
      "to": "./more"
    }
  }, [_c('i', {
    staticClass: "iconfont"
  }, [_vm._v("")])])], 1)])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-64a42bb4", esExports)
  }
}

/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "container"
  }, [_c('header', {
    staticClass: "header"
  }, [_c('router-view', {
    attrs: {
      "name": "header"
    }
  })], 1), _vm._v(" "), _c('div', {
    attrs: {
      "id": "content"
    }
  }, [_c('router-view')], 1), _vm._v(" "), _c('footer', {
    staticClass: "footer",
    attrs: {
      "id": "footer"
    }
  }, [_c('router-view', {
    attrs: {
      "name": "footer"
    }
  })], 1)])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-4fea5ed1", esExports)
  }
}

/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__com_Home_vue__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__com_Kind_vue__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__com_User_vue__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__com_More_vue__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__com_Cart_vue__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__com_HomeHeader_vue__ = __webpack_require__(61);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__com_KindHeader_vue__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__com_UserHeader_vue__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__com_MoreHeader_vue__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__com_MainFooter_vue__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__com_MapChoose_vue__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__com_BuyHeader_vue__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__com_Login_vue__ = __webpack_require__(91);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__com_Detail_vue__ = __webpack_require__(98);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__com_CartHeader_vue__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__com_LoginHeader_vue__ = __webpack_require__(108);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__com_MapNewDetail_vue__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__com_Search_vue__ = __webpack_require__(118);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__com_Buy_vue__ = __webpack_require__(123);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__com_MapDetail_vue__ = __webpack_require__(128);





















const routes = [{ path: "/", redirect: "/home" }, { path: "/home", components: {
		default: __WEBPACK_IMPORTED_MODULE_0__com_Home_vue__["a" /* default */],
		header: __WEBPACK_IMPORTED_MODULE_5__com_HomeHeader_vue__["a" /* default */],
		footer: __WEBPACK_IMPORTED_MODULE_9__com_MainFooter_vue__["a" /* default */]
	} }, { path: "/home/:cityid", name: 'home', components: {
		default: __WEBPACK_IMPORTED_MODULE_0__com_Home_vue__["a" /* default */],
		header: __WEBPACK_IMPORTED_MODULE_5__com_HomeHeader_vue__["a" /* default */],
		footer: __WEBPACK_IMPORTED_MODULE_9__com_MainFooter_vue__["a" /* default */]
	} }, { path: "/kind", components: {
		default: __WEBPACK_IMPORTED_MODULE_1__com_Kind_vue__["a" /* default */],
		header: __WEBPACK_IMPORTED_MODULE_6__com_KindHeader_vue__["a" /* default */],
		footer: __WEBPACK_IMPORTED_MODULE_9__com_MainFooter_vue__["a" /* default */]

	} }, { path: "/user", components: {
		default: __WEBPACK_IMPORTED_MODULE_2__com_User_vue__["a" /* default */],
		header: __WEBPACK_IMPORTED_MODULE_7__com_UserHeader_vue__["a" /* default */],
		footer: __WEBPACK_IMPORTED_MODULE_9__com_MainFooter_vue__["a" /* default */]
	} }, { path: "/prochoose", components: {
		default: __WEBPACK_IMPORTED_MODULE_10__com_MapChoose_vue__["a" /* default */],
		header: __WEBPACK_IMPORTED_MODULE_6__com_KindHeader_vue__["a" /* default */],
		footer: __WEBPACK_IMPORTED_MODULE_9__com_MainFooter_vue__["a" /* default */]
	} }, { path: "/login", components: {
		default: __WEBPACK_IMPORTED_MODULE_12__com_Login_vue__["a" /* default */],
		header: __WEBPACK_IMPORTED_MODULE_15__com_LoginHeader_vue__["a" /* default */],
		footer: __WEBPACK_IMPORTED_MODULE_9__com_MainFooter_vue__["a" /* default */]
	} }, { path: "/detail", components: {
		default: __WEBPACK_IMPORTED_MODULE_13__com_Detail_vue__["a" /* default */],
		header: __WEBPACK_IMPORTED_MODULE_6__com_KindHeader_vue__["a" /* default */]
	} }, { path: "/mapdetail", components: {
		default: __WEBPACK_IMPORTED_MODULE_19__com_MapDetail_vue__["a" /* default */],
		header: __WEBPACK_IMPORTED_MODULE_6__com_KindHeader_vue__["a" /* default */],
		footer: __WEBPACK_IMPORTED_MODULE_9__com_MainFooter_vue__["a" /* default */]
	} }, { path: "/mapnewdetail", components: {
		default: __WEBPACK_IMPORTED_MODULE_16__com_MapNewDetail_vue__["a" /* default */],
		header: __WEBPACK_IMPORTED_MODULE_6__com_KindHeader_vue__["a" /* default */]
	} }, { path: "/search", components: {
		default: __WEBPACK_IMPORTED_MODULE_17__com_Search_vue__["a" /* default */],
		header: __WEBPACK_IMPORTED_MODULE_6__com_KindHeader_vue__["a" /* default */],
		footer: __WEBPACK_IMPORTED_MODULE_9__com_MainFooter_vue__["a" /* default */]
	} }, { path: "/cart", components: {
		default: __WEBPACK_IMPORTED_MODULE_4__com_Cart_vue__["a" /* default */],
		header: __WEBPACK_IMPORTED_MODULE_14__com_CartHeader_vue__["a" /* default */],
		footer: __WEBPACK_IMPORTED_MODULE_9__com_MainFooter_vue__["a" /* default */]

	} }, { path: "/more", components: {
		default: __WEBPACK_IMPORTED_MODULE_3__com_More_vue__["a" /* default */],
		header: __WEBPACK_IMPORTED_MODULE_8__com_MoreHeader_vue__["a" /* default */],
		footer: __WEBPACK_IMPORTED_MODULE_9__com_MainFooter_vue__["a" /* default */]

	} }, { path: "/buy", components: {
		default: __WEBPACK_IMPORTED_MODULE_18__com_Buy_vue__["a" /* default */],
		header: __WEBPACK_IMPORTED_MODULE_11__com_BuyHeader_vue__["a" /* default */]
	} }];

/* harmony default export */ __webpack_exports__["a"] = (routes);

/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_Home_vue__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_4d6b485f_hasScoped_true_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_Home_vue__ = __webpack_require__(33);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(29)
}
var normalizeComponent = __webpack_require__(2)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-4d6b485f"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_Home_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_4d6b485f_hasScoped_true_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_Home_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "com\\Home.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] Home.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4d6b485f", Component.options)
  } else {
    hotAPI.reload("data-v-4d6b485f", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(30);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("047e7c80", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../node_modules/_css-loader@0.28.5@css-loader/index.js?sourceMap!../node_modules/_vue-loader@13.0.4@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4d6b485f\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/_vue-loader@13.0.4@vue-loader/lib/selector.js?type=styles&index=0!./Home.vue", function() {
     var newContent = require("!!../node_modules/_css-loader@0.28.5@css-loader/index.js?sourceMap!../node_modules/_vue-loader@13.0.4@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4d6b485f\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/_vue-loader@13.0.4@vue-loader/lib/selector.js?type=styles&index=0!./Home.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n.homecontent[data-v-4d6b485f]{\n\twidth: 90%;\n\theight: 90%;\n\tmargin: 5%;\n\toverflow-y: auto;\n}\n.homecontent[data-v-4d6b485f]::-webkit-scrollbar {display: none;\n}\n.homecon h3[data-v-4d6b485f]{\n\twidth: 100%;\n\theight: 20px;\n\tline-height: 20px;\n\tmargin-top: 10px;\n\tfont-size: 18px;\n}\n.date[data-v-4d6b485f]{\n \twidth: 100%;\n \theight: 20px;\n \tfont-size: 12px;\n \tcolor: #f66;\n}\n.homecon li img[data-v-4d6b485f]{\n \tmargin-top: 10px;\n \tmargin-bottom: 10px;\n \twidth: 100%;\n \theight: 190px;\n}\n.lititle[data-v-4d6b485f]{\n \twidth: 100%;\n \tline-height: 20px;\n \tfont-size: 14px;\n}\n.lidesc[data-v-4d6b485f]{\n \twidth: 100%;\n \theight: 20px;\n \tline-height: 20px;\n \tfont-size: 8px;\n \tcolor: #555;\n \t-webkit-transform: scale(0.8);\n \tmargin-left: -8%;\n}\n.city[data-v-4d6b485f]{\n \twidth: 100%;\n \theight: 100%;\n}\n.citytitle[data-v-4d6b485f]{\n\twidth: 100%;\n\theight: 20px;\n\tline-height: 20px;\n\tmargin-top:10px ;\n}\n.cityname a[data-v-4d6b485f]{\n\tcolor: #555;\n}\n.cityname li[data-v-4d6b485f]{\n\twidth: 30%;\n\tline-height: 30px;\n\tborder: 1px solid #ccc;\n\ttext-align: center;\n\tfloat:left;\n\tmargin: 2% 1% ;\n\tfont-size: 14px;\n}\n", "", {"version":3,"sources":["G:/enjoy/com/com/Home.vue?2d1797e8"],"names":[],"mappings":";AAwHA;CACA,WAAA;CACA,YAAA;CACA,WAAA;CACA,iBAAA;CACA;AACA,kDAAA,cAAA;CAAA;AACA;CACA,YAAA;CACA,aAAA;CACA,kBAAA;CACA,iBAAA;CACA,gBAAA;CACA;AACA;EACA,YAAA;EACA,aAAA;EACA,gBAAA;EACA,YAAA;CACA;AACA;EACA,iBAAA;EACA,oBAAA;EACA,YAAA;EACA,cAAA;CACA;AACA;EACA,YAAA;EACA,kBAAA;EACA,gBAAA;CAEA;AACA;EACA,YAAA;EACA,aAAA;EACA,kBAAA;EACA,eAAA;EACA,YAAA;EACA,8BAAA;EACA,iBAAA;CACA;AACA;EACA,YAAA;EACA,aAAA;CACA;AACA;CACA,YAAA;CACA,aAAA;CACA,kBAAA;CACA,iBAAA;CACA;AACA;CACA,YAAA;CACA;AACA;CACA,WAAA;CACA,kBAAA;CACA,uBAAA;CACA,mBAAA;CACA,WAAA;CACA,eAAA;CACA,gBAAA;CAEA","file":"Home.vue","sourcesContent":["<template>\r\n\t<div class=\"homecontent\">\r\n\t\t<ul v-for = \"item in proList\" class=\"homecon\" v-show =\"listshow\">\r\n\t\t\t<h3>{{item.group_section.title}}</h3>\r\n\t\t\t<div class=\"date\">{{item.group_section.desc}}</div>\r\n\t\t\t<li v-for=\"per in classList\" @click = \"todetail(per.enjoy_url)\">\t\t\t\t\r\n\t\t\t\t\t<img v-bind:src=per.url> \r\n\t\t\t\t\t<div class=\"lititle\">{{per.title}}</div>\r\n\t\t\t\t\t<div class=\"lidesc\">{{per.desc}}</div>\t\t\t\t\r\n\t\t\t</li>\r\n\t\t</ul>\r\n\t\t<div class=\"city\" v-show=\"cityshow\">\r\n\t\t\t<div class=\"citytitle\">本地服务开通城市</div>\r\n\t\t\t<ul class=\"cityname\" >\r\n\t\t\t\t<li class=\"cityitem\" v-for=\"item in list\" @click = \"tocity()\">\r\n\t\t\t\t\t<router-link :to = \"{name:'home',params:{cityid:item.id,proname:item.name}}\">{{item.name}}</router-link>\r\n\t\t\t\t</li>\r\n\t\t\t</ul>\r\n\t</div>\r\n</div>\r\n</template>\r\n\r\n<script>\r\n\timport MyAjax from \"./../md/MyAjax.js\";\r\n\timport router from \"./../router/router.js\";\r\n\texport default {\r\n\t\tdata(){\r\n\t\t\treturn {\r\n\t\t\t\tlistshow:true,\r\n\t\t\t\tcityshow:false,\r\n\t\t\t\tproList:[],\r\n\t\t\t\tclassList:[],\r\n\t\t\t\tcityid:104,\r\n\t\t\t\tcity:\"\",\r\n\t\t\t\tlist:[\r\n\t\t\t\t{name:'上海',id:104},\r\n\t\t\t\t{name:'北京',id:140},\r\n\t\t\t\t{name:'南京',id:144},\r\n\t\t\t\t{name:'天津',id:185},\r\n\t\t\t\t{name:'广州',id:216},\r\n\t\t\t\t{name:'成都',id:235},\r\n\t\t\t\t{name:'杭州',id:260},\r\n\t\t\t\t{name:'深圳',id:299},\r\n\t\t\t\t{name:'苏州',id:347},\r\n\t\t\t\t{name:'西安',id:362},\r\n\t\t\t\t{name:'重庆',id:388},\r\n\t\t\t\t{name:'长沙',id:401}\r\n\t\t\t\t]\r\n\t\t\t\t\r\n\t\t\t} \r\n\t\t},\r\n\t\twatch:{\r\n\t\t\t'$route':function(newRoute){\t\t\t\t\r\n\t\t\t\tthis.listshow = false;\r\n\t\t\t\tthis.cityshow= true;\r\n\t\t\t\tvar that = this;\r\n\t\t\t\tvar cityid= newRoute.params.cityid;\r\n\t\t\t\tvar url = \"https://api.ricebook.com/hub/home/v1/web/week_choice.json?city_id=\"+cityid+\"&page=0\";\r\n\t\t\t\tMyAjax.vueJson(url,function(data){\r\n\t\t\t\t\tthat.proList = data;\r\n\t\t\t\t\tfor(var i in data){\r\n\t\t\t\t\t\tvar list = data[i].tabs;\r\n\t\t\t\t\t}\r\n\t\t\t\t\tthat.classList = list;\t\t\t\t\t\r\n\t\t\t\t},function(err){\r\n\t\t\t\t\tconsole.log(err)\r\n\t\t\t\t})\r\n\t\t\t}\r\n\t\t},\r\n\t\t\tmounted(){\r\n\t\t\t\tvar that = this;\r\n\t\t\t\tvar cityid = that.cityid;\r\n\t\t\t\tvar proname = that.proname;\r\n\t\t\t\tvar url = \"https://api.ricebook.com/hub/home/v1/web/week_choice.json?city_id=\"+cityid+\"&page=0\";\r\n\t\t\t\tMyAjax.vueJson(url,function(data){\r\n\t\t\t\t\tthat.proList = data;\r\n\t\t\t\t\tfor(var i in data){\r\n\t\t\t\t\t\tvar list = data[i].tabs;\r\n\t\t\t\t\t}\r\n\t\t\t\t\tthat.classList = list;\r\n\t\t\t\t},function(err){\r\n\t\t\t\t\tconsole.log(err)\r\n\t\t\t\t});\r\n\t\t\t\t\r\n\t\t\t},\r\n\t\t\tmethods:{\r\n\t\t\t\ttodetail(data){\r\n\t\t\t\t\tvar that = this;\r\n\t\t\t\t\tvar arr = data.slice(29)\r\n\t\t\t\t\tthat.$router.push({path:'/detail',query:{allid:arr}});\t\t\t\t\t\r\n\t\t\t\t},\r\n\t\t\t\ttocity(){\r\n\t\t\t\t\tthis.listshow = true;\r\n\t\t\t\t    this.cityshow= false;\r\n\t\t\t\t\tvar that = this;\r\n\t\t\t\t\tvar cityid = that.$route.params.cityid;\r\n\t\t\t\t\tvar proname = that.$route.params.proname;\t\t\t\t\t\r\n\t\t\t\t\tlocalStorage.setItem('id',cityid);\r\n\t\t\t\t\tlocalStorage.setItem(\"name1\",proname)\t\t\t\t\t\r\n\t\t\t\t\t$(\".citynames\").html(proname);\r\n\t\t\t\t\tvar url = \"https://api.ricebook.com/hub/home/v1/web/week_choice.json?city_id=\"+cityid+\"&page=0\";\r\n\t\t\t\t\tMyAjax.vueJson(url,function(data){\r\n\t\t\t\t\t\tconsole.log(data)\r\n\t\t\t\t\t\t\r\n\t\t\t\t\tthat.proList = data;\r\n\t\t\t\t\tfor(var i in data){\r\n\t\t\t\t\t\tvar list = data[i].tabs;\r\n\t\t\t\t\t}\r\n\t\t\t\t\tthat.classList = list;\r\n\t\t\t\t\t\r\n\t\t\t\t},function(err){\r\n\t\t\t\t\tconsole.log(err)\r\n\t\t\t\t})\r\n\t\t\t\t}\r\n\t\t\t}\r\n\t\t}\r\n\t\r\n</script>\r\n\r\n<style scoped>\r\n\t.homecontent{\r\n\t\twidth: 90%;\r\n\t\theight: 90%;\r\n\t\tmargin: 5%;\r\n\t\toverflow-y: auto;\t\t\r\n\t}\r\n\t.homecontent::-webkit-scrollbar {display: none;}\r\n\t.homecon h3{\r\n\t\twidth: 100%;\r\n\t\theight: 20px;\r\n\t\tline-height: 20px;\r\n\t\tmargin-top: 10px;\r\n\t\tfont-size: 18px;\r\n\t}\r\n\t .date{\r\n\t \twidth: 100%;\r\n\t \theight: 20px;\r\n\t \tfont-size: 12px;\r\n\t \tcolor: #f66;\r\n\t }\r\n\t .homecon li img{\r\n\t \tmargin-top: 10px;\r\n\t \tmargin-bottom: 10px;\r\n\t \twidth: 100%;\r\n\t \theight: 190px;\r\n\t }\r\n\t .lititle{\r\n\t \twidth: 100%;\r\n\t \tline-height: 20px;\r\n\t \tfont-size: 14px;\r\n\t \t\r\n\t }\r\n\t .lidesc{\r\n\t \twidth: 100%;\r\n\t \theight: 20px;\r\n\t \tline-height: 20px;\r\n\t \tfont-size: 8px;\r\n\t \tcolor: #555;\r\n\t \t-webkit-transform: scale(0.8);\r\n\t \tmargin-left: -8%;\r\n\t }\r\n\t .city{\r\n\t \twidth: 100%;\r\n\t \theight: 100%;\r\n\t }\r\n\t.citytitle{\r\n\t\twidth: 100%;\r\n\t\theight: 20px;\r\n\t\tline-height: 20px;\r\n\t\tmargin-top:10px ;\r\n\t}\r\n\t.cityname a{\r\n\t\tcolor: #555;\r\n\t}\r\n\t.cityname li{\r\n\t\twidth: 30%;\r\n\t\tline-height: 30px;\r\n\t\tborder: 1px solid #ccc;\r\n\t\ttext-align: center;\r\n\t\tfloat:left;\r\n\t\tmargin: 2% 1% ;\r\n\t\tfont-size: 14px;\r\n\t\r\n\t}\r\n</style>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__md_MyAjax_js__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__router_router_js__ = __webpack_require__(3);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
	data() {
		return {
			listshow: true,
			cityshow: false,
			proList: [],
			classList: [],
			cityid: 104,
			city: "",
			list: [{ name: '上海', id: 104 }, { name: '北京', id: 140 }, { name: '南京', id: 144 }, { name: '天津', id: 185 }, { name: '广州', id: 216 }, { name: '成都', id: 235 }, { name: '杭州', id: 260 }, { name: '深圳', id: 299 }, { name: '苏州', id: 347 }, { name: '西安', id: 362 }, { name: '重庆', id: 388 }, { name: '长沙', id: 401 }]

		};
	},
	watch: {
		'$route': function (newRoute) {
			this.listshow = false;
			this.cityshow = true;
			var that = this;
			var cityid = newRoute.params.cityid;
			var url = "https://api.ricebook.com/hub/home/v1/web/week_choice.json?city_id=" + cityid + "&page=0";
			__WEBPACK_IMPORTED_MODULE_0__md_MyAjax_js__["a" /* default */].vueJson(url, function (data) {
				that.proList = data;
				for (var i in data) {
					var list = data[i].tabs;
				}
				that.classList = list;
			}, function (err) {
				console.log(err);
			});
		}
	},
	mounted() {
		var that = this;
		var cityid = that.cityid;
		var proname = that.proname;
		var url = "https://api.ricebook.com/hub/home/v1/web/week_choice.json?city_id=" + cityid + "&page=0";
		__WEBPACK_IMPORTED_MODULE_0__md_MyAjax_js__["a" /* default */].vueJson(url, function (data) {
			that.proList = data;
			for (var i in data) {
				var list = data[i].tabs;
			}
			that.classList = list;
		}, function (err) {
			console.log(err);
		});
	},
	methods: {
		todetail(data) {
			var that = this;
			var arr = data.slice(29);
			that.$router.push({ path: '/detail', query: { allid: arr } });
		},
		tocity() {
			this.listshow = true;
			this.cityshow = false;
			var that = this;
			var cityid = that.$route.params.cityid;
			var proname = that.$route.params.proname;
			localStorage.setItem('id', cityid);
			localStorage.setItem("name1", proname);
			$(".citynames").html(proname);
			var url = "https://api.ricebook.com/hub/home/v1/web/week_choice.json?city_id=" + cityid + "&page=0";
			__WEBPACK_IMPORTED_MODULE_0__md_MyAjax_js__["a" /* default */].vueJson(url, function (data) {
				console.log(data);

				that.proList = data;
				for (var i in data) {
					var list = data[i].tabs;
				}
				that.classList = list;
			}, function (err) {
				console.log(err);
			});
		}
	}
});

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, module], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.fetchJsonp = mod.exports;
  }
})(this, function (exports, module) {
  'use strict';

  var defaultOptions = {
    timeout: 5000,
    jsonpCallback: 'callback',
    jsonpCallbackFunction: null
  };

  function generateCallbackFunction() {
    return 'jsonp_' + Date.now() + '_' + Math.ceil(Math.random() * 100000);
  }

  function clearFunction(functionName) {
    // IE8 throws an exception when you try to delete a property on window
    // http://stackoverflow.com/a/1824228/751089
    try {
      delete window[functionName];
    } catch (e) {
      window[functionName] = undefined;
    }
  }

  function removeScript(scriptId) {
    var script = document.getElementById(scriptId);
    if (script) {
      document.getElementsByTagName('head')[0].removeChild(script);
    }
  }

  function fetchJsonp(_url) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    // to avoid param reassign
    var url = _url;
    var timeout = options.timeout || defaultOptions.timeout;
    var jsonpCallback = options.jsonpCallback || defaultOptions.jsonpCallback;

    var timeoutId = undefined;

    return new Promise(function (resolve, reject) {
      var callbackFunction = options.jsonpCallbackFunction || generateCallbackFunction();
      var scriptId = jsonpCallback + '_' + callbackFunction;

      window[callbackFunction] = function (response) {
        resolve({
          ok: true,
          // keep consistent with fetch API
          json: function json() {
            return Promise.resolve(response);
          }
        });

        if (timeoutId) clearTimeout(timeoutId);

        removeScript(scriptId);

        clearFunction(callbackFunction);
      };

      // Check if the user set their own params, and if not add a ? to start a list of params
      url += url.indexOf('?') === -1 ? '?' : '&';

      var jsonpScript = document.createElement('script');
      jsonpScript.setAttribute('src', '' + url + jsonpCallback + '=' + callbackFunction);
      if (options.charset) {
        jsonpScript.setAttribute('charset', options.charset);
      }
      jsonpScript.id = scriptId;
      document.getElementsByTagName('head')[0].appendChild(jsonpScript);

      timeoutId = setTimeout(function () {
        reject(new Error('JSONP request to ' + _url + ' timed out'));

        clearFunction(callbackFunction);
        removeScript(scriptId);
      }, timeout);

      // Caught if got 404/500
      jsonpScript.onerror = function () {
        reject(new Error('JSONP request to ' + _url + ' failed'));

        clearFunction(callbackFunction);
        removeScript(scriptId);
        if (timeoutId) clearTimeout(timeoutId);
      };
    });
  }

  // export as global function
  /*
  let local;
  if (typeof global !== 'undefined') {
    local = global;
  } else if (typeof self !== 'undefined') {
    local = self;
  } else {
    try {
      local = Function('return this')();
    } catch (e) {
      throw new Error('polyfill failed because global object is unavailable in this environment');
    }
  }
  local.fetchJsonp = fetchJsonp;
  */

  module.exports = fetchJsonp;
});

/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "homecontent"
  }, [_vm._l((_vm.proList), function(item) {
    return _c('ul', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: (_vm.listshow),
        expression: "listshow"
      }],
      staticClass: "homecon"
    }, [_c('h3', [_vm._v(_vm._s(item.group_section.title))]), _vm._v(" "), _c('div', {
      staticClass: "date"
    }, [_vm._v(_vm._s(item.group_section.desc))]), _vm._v(" "), _vm._l((_vm.classList), function(per) {
      return _c('li', {
        on: {
          "click": function($event) {
            _vm.todetail(per.enjoy_url)
          }
        }
      }, [_c('img', {
        attrs: {
          "src": per.url
        }
      }), _vm._v(" "), _c('div', {
        staticClass: "lititle"
      }, [_vm._v(_vm._s(per.title))]), _vm._v(" "), _c('div', {
        staticClass: "lidesc"
      }, [_vm._v(_vm._s(per.desc))])])
    })], 2)
  }), _vm._v(" "), _c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.cityshow),
      expression: "cityshow"
    }],
    staticClass: "city"
  }, [_c('div', {
    staticClass: "citytitle"
  }, [_vm._v("本地服务开通城市")]), _vm._v(" "), _c('ul', {
    staticClass: "cityname"
  }, _vm._l((_vm.list), function(item) {
    return _c('li', {
      staticClass: "cityitem",
      on: {
        "click": function($event) {
          _vm.tocity()
        }
      }
    }, [_c('router-link', {
      attrs: {
        "to": {
          name: 'home',
          params: {
            cityid: item.id,
            proname: item.name
          }
        }
      }
    }, [_vm._v(_vm._s(item.name))])], 1)
  }))])], 2)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-4d6b485f", esExports)
  }
}

/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_Kind_vue__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_49502c94_hasScoped_true_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_Kind_vue__ = __webpack_require__(40);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(35)
}
var normalizeComponent = __webpack_require__(2)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-49502c94"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_Kind_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_49502c94_hasScoped_true_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_Kind_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "com\\Kind.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] Kind.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-49502c94", Component.options)
  } else {
    hotAPI.reload("data-v-49502c94", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(36);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("2910bc10", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../node_modules/_css-loader@0.28.5@css-loader/index.js?sourceMap!../node_modules/_vue-loader@13.0.4@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-49502c94\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/_vue-loader@13.0.4@vue-loader/lib/selector.js?type=styles&index=0!./Kind.vue", function() {
     var newContent = require("!!../node_modules/_css-loader@0.28.5@css-loader/index.js?sourceMap!../node_modules/_vue-loader@13.0.4@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-49502c94\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/_vue-loader@13.0.4@vue-loader/lib/selector.js?type=styles&index=0!./Kind.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n.swiper-container-horizontal>.swiper-pagination-bullets[data-v-49502c94], .swiper-pagination-custom[data-v-49502c94], .swiper-pagination-fraction[data-v-49502c94]{\r\n    text-align: right;\r\n    bottom: 100px;\r\n    position: absolute;\r\n    z-index: 3;\r\n    top:0px; \r\n    width: 90%;\n}\n#other_list .swiper-slide-active[data-v-49502c94]{\r\n\twidth: 20%;\n}\r\n\r\n", "", {"version":3,"sources":["G:/enjoy/com/com/Kind.vue?1650bcf4"],"names":[],"mappings":";AA+HA;IACA,kBAAA;IACA,cAAA;IACA,mBAAA;IACA,WAAA;IACA,QAAA;IACA,WAAA;CACA;AACA;CACA,WAAA;CACA","file":"Kind.vue","sourcesContent":["<template>\r\n\t<div id=\"dis_Cont\">\r\n\t\t<div class=\"titles\">\r\n\t\t\t<h2>今日推荐</h2>\r\n\t\t\t<p>每天告诉你大家爱吃的和最近值得吃的</p>\t\r\n\t\t</div>\t\t\t\t\r\n\t\t<div class=\"swiper-container\">\r\n        <div class=\"swiper-wrapper\">        \t\r\n            <div class=\"swiper-slide\" v-for=\"item in picList.tabs\">\r\n            \t<img v-bind:src=item.url>\r\n            \t<span>{{item.tag}}</span>\r\n            \t<h3>{{item.title}}</h3>\r\n            \t<p>{{item.desc}}</p>\r\n            </div>\t              \r\n        </div>\r\n    <div class=\"paginations\"></div>      \r\n</div>\t\r\n\t\r\n\t\r\n<div id=\"other_list\"> \t\t\r\n\t<div class=\"swiper-containers\" id=\"bbb\">\r\n        <div class=\"swiper-wrapper\">\r\n            <div class=\"swiper-slide\" v-for=\"item in picList1.tabs\">\r\n\t            <h4>{{item.title}}</h4>\r\n\t            <p>{{item.desc}}</p>\r\n            </div>         \r\n        </div>\r\n\t</div>\t\t\r\n</div>\t\t\t\r\n\t\t\r\n\t\t\r\n\t\t\r\n\t\t\r\n      \r\n\t\t\r\n\t\t\r\n<div class=\"choicelist\">\r\n\t<div class=\"choic\">\r\n\t\t<h5>{{picDetial.title}}</h5>\r\n\t\t<p>{{picDetial.desc}}</p>\r\n\t\t<span>{{picDetial.enjoy_url_text}}</span>\r\n\t</div>\r\n\t<ul>\r\n\t\t<li v-for=\"item in picList2.tabs\">\r\n\t\t\t<img v-bind:src=item.url>\r\n\t\t</li>\r\n\t</ul>\t\r\n</div>\t\t\r\n\t\r\n\t<div class=\"choicelist\">\r\n\t<div class=\"choic\">\r\n\t\t<h5>{{picDetial3.title}}</h5>\r\n\t\t<p>{{picDetial3.desc}}</p>\r\n\t\t<span>{{picDetial3.enjoy_url_text}}</span>\r\n\t</div>\r\n\t<ul>\r\n\t\t<li v-for=\"item in picList3.tabs\">\r\n\t\t\t<img v-bind:src=item.url>\r\n\t\t</li>\r\n\t</ul>\t\r\n</div>\t\t\r\n\t\t\r\n<div class=\"choicelist\">\r\n\t<div class=\"choic\">\r\n\t\t<h5>{{picDetial4.title}}</h5>\r\n\t\t<p>{{picDetial4.desc}}</p>\r\n\t\t<span>{{picDetial4.enjoy_url_text}}</span>\r\n\t</div>\r\n\t<ul>\r\n\t\t<li v-for=\"item in picList4.tabs\">\r\n\t\t\t<img v-bind:src=item.url>\r\n\t\t</li>\r\n\t</ul>\t\r\n</div>\t\t\t\t\t\t\r\n\t</div>\r\n</template>\r\n\r\n<script>\r\n\t\timport MyAjax from \"./../md/MyAjax.js\";\r\n\t\timport \"./../scss/Discovery.scss\";\r\n\texport default {\r\n\t\tdata(){\r\n\t\t\treturn {\r\n\t\t\t\tid:\"\",\r\n\t\t\t\tpicList:[],\r\n\t\t\t\tpicList1:[],\r\n\t\t\t\tpicList2:[],\r\n\t\t\t\tpicDetial:[],\r\n\t\t\t\tpicList3:[],\r\n\t\t\t\tpicDetial3:[],\r\n\t\t\t\tpicList4:[],\r\n\t\t\t\tpicDetial4:[]\r\n\t\t\t}\r\n\t\t},\r\n\t\tmounted(){\r\n\t\t\tvar that = this;\r\n\t\t\tvar id =localStorage.getItem(\"id\");\r\n\t\t\tthat.id=id;\r\n\t\t\tvar url = \"https://api.ricebook.com/hub/home/v1/web/explore.json?city_id=\"+id;\r\n\t\t\t\tMyAjax.vueJson(url,function(data){\r\n\t\t\t\tthat.picList=data[0].data;\r\n\t\t\t\tthat.picList1=data[1].data;\r\n\t\t\t\tthat.picList2=data[2].data;\r\n\t\t\t\tthat.picDetial=data[2].data.group_section;\t\t\t\t\r\n\t\t\t\tthat.picList3=data[3].data;\r\n\t\t\t\tthat.picDetial3=data[3].data.group_section;\t\t\t\t\r\n\t\t\t\tthat.picList4=data[4].data;\r\n\t\t\t\tthat.picDetial4=data[4].data.group_section;\r\n\t\t\t},function(err){\r\n\t\t\t\tconsole.log(err)\r\n\t\t\t});\r\n\t\t\tvar swiper = new Swiper('.swiper-container', {  \r\n        \t\tobserver:true,\r\n        \t\tpagination: '.paginations',\r\n        \t\tpaginationType:'fraction',\r\n        \t\t\r\n   \t\t\t});\r\n   \t\t\tvar swipers = new Swiper('#bbb', {\r\n        slidesPerView: 2,\r\n        paginationClickable: true,\r\n\t\tobserver:true\r\n    });\r\n\t\t}\r\n\t}\r\n</script>\r\n\r\n<style scoped>\r\n.swiper-container-horizontal>.swiper-pagination-bullets, .swiper-pagination-custom, .swiper-pagination-fraction{\r\n    text-align: right;\r\n    bottom: 100px;\r\n    position: absolute;\r\n    z-index: 3;\r\n    top:0px; \r\n    width: 90%;\r\n}\r\n#other_list .swiper-slide-active{\r\n\twidth: 20%;\r\n}\r\n\r\n</style>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__md_MyAjax_js__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scss_Discovery_scss__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scss_Discovery_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__scss_Discovery_scss__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
	data() {
		return {
			id: "",
			picList: [],
			picList1: [],
			picList2: [],
			picDetial: [],
			picList3: [],
			picDetial3: [],
			picList4: [],
			picDetial4: []
		};
	},
	mounted() {
		var that = this;
		var id = localStorage.getItem("id");
		that.id = id;
		var url = "https://api.ricebook.com/hub/home/v1/web/explore.json?city_id=" + id;
		__WEBPACK_IMPORTED_MODULE_0__md_MyAjax_js__["a" /* default */].vueJson(url, function (data) {
			that.picList = data[0].data;
			that.picList1 = data[1].data;
			that.picList2 = data[2].data;
			that.picDetial = data[2].data.group_section;
			that.picList3 = data[3].data;
			that.picDetial3 = data[3].data.group_section;
			that.picList4 = data[4].data;
			that.picDetial4 = data[4].data.group_section;
		}, function (err) {
			console.log(err);
		});
		var swiper = new Swiper('.swiper-container', {
			observer: true,
			pagination: '.paginations',
			paginationType: 'fraction'

		});
		var swipers = new Swiper('#bbb', {
			slidesPerView: 2,
			paginationClickable: true,
			observer: true
		});
	}
});

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(39);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(6)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/_css-loader@0.28.5@css-loader/index.js!../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!./Discovery.scss", function() {
			var newContent = require("!!../node_modules/_css-loader@0.28.5@css-loader/index.js!../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!./Discovery.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "#content {\n  width: 100%; }\n\n#dis_Cont {\n  width: 100%;\n  overflow: hidden; }\n  #dis_Cont .titles {\n    width: 90%;\n    padding: 5%; }\n    #dis_Cont .titles h2 {\n      font-size: 20px; }\n    #dis_Cont .titles p {\n      font-size: 0.5rem; }\n\n.swiper-container {\n  width: 100%; }\n  .swiper-container .swiper-slide {\n    float: left;\n    width: 100%;\n    height: 235px;\n    margin-top: 3%;\n    overflow: hidden; }\n    .swiper-container .swiper-slide img {\n      margin-top: 4%;\n      padding: 0 4%;\n      width: 90%;\n      height: 10rem; }\n    .swiper-container .swiper-slide span {\n      font-size: 0.4rem;\n      -webkit-transform: scale(0.8);\n      margin-left: 4%;\n      color: red; }\n    .swiper-container .swiper-slide h3 {\n      font-size: 0.8rem;\n      text-indent: 4%; }\n    .swiper-container .swiper-slide p {\n      font-size: 0.4rem;\n      color: #666;\n      -webkit-transform: scale(0.9); }\n\n#other_list {\n  width: 100%;\n  height: 4rem;\n  overflow: hidden;\n  padding: 2%;\n  border-top: 1px solid #ccc;\n  border-bottom: 1px solid #ccc;\n  font-size: 0.6rem; }\n  #other_list .swiper-slide {\n    margin-left: 2%;\n    height: 3rem;\n    padding: 2% 2% 1% 1%;\n    border: 1px solid #ccc;\n    float: left;\n    background: #555;\n    opacity: .4;\n    color: #fff;\n    text-align: center; }\n    #other_list .swiper-slide p {\n      font-size: 0.3rem;\n      -webkit-transform: scale(0.8); }\n\n.choicelist {\n  width: 100%;\n  border-bottom: 1px solid #ccc;\n  height: 8rem; }\n  .choicelist .choic {\n    width: 100%;\n    position: relative;\n    margin-top: 4%;\n    height: 3rem; }\n    .choicelist .choic h5 {\n      font-size: 1rem;\n      margin-left: 4%;\n      font-weight: 900; }\n    .choicelist .choic p {\n      font-size: 0.4rem;\n      -webkit-transform: scale(0.9);\n      color: #ccc; }\n    .choicelist .choic span {\n      display: block;\n      position: absolute;\n      top: 2%;\n      right: 0;\n      color: #f00;\n      font-size: 0.8rem;\n      margin-right: 3%; }\n  .choicelist ul {\n    width: 100%; }\n  .choicelist li {\n    width: 30%;\n    float: left; }\n    .choicelist li img {\n      width: 100%;\n      height: 100%; }\n", ""]);

// exports


/***/ }),
/* 40 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    attrs: {
      "id": "dis_Cont"
    }
  }, [_vm._m(0), _vm._v(" "), _c('div', {
    staticClass: "swiper-container"
  }, [_c('div', {
    staticClass: "swiper-wrapper"
  }, _vm._l((_vm.picList.tabs), function(item) {
    return _c('div', {
      staticClass: "swiper-slide"
    }, [_c('img', {
      attrs: {
        "src": item.url
      }
    }), _vm._v(" "), _c('span', [_vm._v(_vm._s(item.tag))]), _vm._v(" "), _c('h3', [_vm._v(_vm._s(item.title))]), _vm._v(" "), _c('p', [_vm._v(_vm._s(item.desc))])])
  })), _vm._v(" "), _c('div', {
    staticClass: "paginations"
  })]), _vm._v(" "), _c('div', {
    attrs: {
      "id": "other_list"
    }
  }, [_c('div', {
    staticClass: "swiper-containers",
    attrs: {
      "id": "bbb"
    }
  }, [_c('div', {
    staticClass: "swiper-wrapper"
  }, _vm._l((_vm.picList1.tabs), function(item) {
    return _c('div', {
      staticClass: "swiper-slide"
    }, [_c('h4', [_vm._v(_vm._s(item.title))]), _vm._v(" "), _c('p', [_vm._v(_vm._s(item.desc))])])
  }))])]), _vm._v(" "), _c('div', {
    staticClass: "choicelist"
  }, [_c('div', {
    staticClass: "choic"
  }, [_c('h5', [_vm._v(_vm._s(_vm.picDetial.title))]), _vm._v(" "), _c('p', [_vm._v(_vm._s(_vm.picDetial.desc))]), _vm._v(" "), _c('span', [_vm._v(_vm._s(_vm.picDetial.enjoy_url_text))])]), _vm._v(" "), _c('ul', _vm._l((_vm.picList2.tabs), function(item) {
    return _c('li', [_c('img', {
      attrs: {
        "src": item.url
      }
    })])
  }))]), _vm._v(" "), _c('div', {
    staticClass: "choicelist"
  }, [_c('div', {
    staticClass: "choic"
  }, [_c('h5', [_vm._v(_vm._s(_vm.picDetial3.title))]), _vm._v(" "), _c('p', [_vm._v(_vm._s(_vm.picDetial3.desc))]), _vm._v(" "), _c('span', [_vm._v(_vm._s(_vm.picDetial3.enjoy_url_text))])]), _vm._v(" "), _c('ul', _vm._l((_vm.picList3.tabs), function(item) {
    return _c('li', [_c('img', {
      attrs: {
        "src": item.url
      }
    })])
  }))]), _vm._v(" "), _c('div', {
    staticClass: "choicelist"
  }, [_c('div', {
    staticClass: "choic"
  }, [_c('h5', [_vm._v(_vm._s(_vm.picDetial4.title))]), _vm._v(" "), _c('p', [_vm._v(_vm._s(_vm.picDetial4.desc))]), _vm._v(" "), _c('span', [_vm._v(_vm._s(_vm.picDetial4.enjoy_url_text))])]), _vm._v(" "), _c('ul', _vm._l((_vm.picList4.tabs), function(item) {
    return _c('li', [_c('img', {
      attrs: {
        "src": item.url
      }
    })])
  }))])])
}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "titles"
  }, [_c('h2', [_vm._v("今日推荐")]), _vm._v(" "), _c('p', [_vm._v("每天告诉你大家爱吃的和最近值得吃的")])])
}]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-49502c94", esExports)
  }
}

/***/ }),
/* 41 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_User_vue__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_5a83e94b_hasScoped_true_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_User_vue__ = __webpack_require__(45);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(42)
}
var normalizeComponent = __webpack_require__(2)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-5a83e94b"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_User_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_5a83e94b_hasScoped_true_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_User_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "com\\User.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] User.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5a83e94b", Component.options)
  } else {
    hotAPI.reload("data-v-5a83e94b", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(43);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("0d4ffddc", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../node_modules/_css-loader@0.28.5@css-loader/index.js?sourceMap!../node_modules/_vue-loader@13.0.4@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-5a83e94b\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/_vue-loader@13.0.4@vue-loader/lib/selector.js?type=styles&index=0!./User.vue", function() {
     var newContent = require("!!../node_modules/_css-loader@0.28.5@css-loader/index.js?sourceMap!../node_modules/_vue-loader@13.0.4@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-5a83e94b\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/_vue-loader@13.0.4@vue-loader/lib/selector.js?type=styles&index=0!./User.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n.usercontent[data-v-5a83e94b]{\n\twidth: 100%;\n\theight: 100%;\n}\n.usercontent img[data-v-5a83e94b]{\n\twidth: 100%;\n\theight: 110px;\n}\n.usercon[data-v-5a83e94b]{\n\twidth:90%;\n\tpadding: 5%;\n}\n.description[data-v-5a83e94b]{\n\twidth: 100%;\n\tfont-size: 14px;\n\tline-height: 20px;\n\tpadding-bottom: 30px;\n}\n#submit[data-v-5a83e94b]{\n\twidth: 30%;\n\theight: 40px;\n\tline-height: 40px;\n\tdisplay: block;\n\tmargin-left: 33%;\n\tbackground-color: #f66;\n\tcolor: #fff;\n\tborder: none;\n\tmargin-bottom: 30px;\n}\n.success[data-v-5a83e94b]{\n\twidth: 100%;\n\ttext-align: center;\n\tline-height: 20px;\n\tmargin-bottom: 20px;\n}\n.success span[data-v-5a83e94b]{\n\tcolor: red;\n}\n.kong[data-v-5a83e94b]{\n\twidth: 100%;\n\theight: 20px;\n\tborder: 1px solid #ccc;\n\tborder-radius: 12px;\n\tmargin-bottom: 20px;\n}\n.num[data-v-5a83e94b]{\n\twidth: 100%;\n\tcolor: #ccc;\n\theight: 20px;\n}\n.num span[data-v-5a83e94b]:nth-of-type(1){\n\twidth: 5%;\n\ttext-align: center;\n\tdisplay: inline-block;\n}\n.num span[data-v-5a83e94b]:nth-of-type(2){\n\twidth: 10%;\n\ttext-align: center;\n\tdisplay: inline-block;\n}\n.num span[data-v-5a83e94b]:nth-of-type(3){\n\twidth: 20%;\n\ttext-align: center;\n\tdisplay: inline-block;\n}\n.num span[data-v-5a83e94b]:nth-of-type(4){\n\twidth: 25%;\n\ttext-align: center;\n\tdisplay: inline-block;\n}\n.num span[data-v-5a83e94b]:nth-of-type(5){\n\twidth: 30%;\n\ttext-align: center;\n\tdisplay: inline-block;\n}\n.man1[data-v-5a83e94b]{\n\twidth: 100%;\n\tcolor: #ccc;\n}\n.man1 li[data-v-5a83e94b]{\n\twidth: 100%;\n\theight: 30px;\n\tline-height: 30px;\n\tfont-size: 14px;\n\tcolor: #555;\n}\n.man1 li span[data-v-5a83e94b]:nth-of-type(1){\n\twidth: 15%;\n\tdisplay: inline-block;\n\ttext-align: center;\n\tmargin-right: 30%;\n}\n.man1 li span[data-v-5a83e94b]:nth-of-type(2){\n\twidth: 20%;\n\tdisplay: inline-block;\n\ttext-align: center;\n\tmargin-right: 10%;\n}\n.man1 li span[data-v-5a83e94b]:nth-of-type(3){\n\ttext-align: center;\n\tdisplay: inline-block;\n\twidth: 20%;\n}\n.detail[data-v-5a83e94b]{\n\twidth: 100%;\n\ttext-align: center;\n}\n", "", {"version":3,"sources":["G:/enjoy/com/com/User.vue?7ae45b12"],"names":[],"mappings":";AA4CA;CACA,YAAA;CACA,aAAA;CAEA;AACA;CACA,YAAA;CACA,cAAA;CACA;AACA;CACA,UAAA;CACA,YAAA;CACA;AACA;CACA,YAAA;CACA,gBAAA;CACA,kBAAA;CACA,qBAAA;CACA;AACA;CACA,WAAA;CACA,aAAA;CACA,kBAAA;CACA,eAAA;CACA,iBAAA;CACA,uBAAA;CACA,YAAA;CACA,aAAA;CACA,oBAAA;CACA;AACA;CACA,YAAA;CACA,mBAAA;CACA,kBAAA;CACA,oBAAA;CACA;AACA;CACA,WAAA;CACA;AACA;CACA,YAAA;CACA,aAAA;CACA,uBAAA;CACA,oBAAA;CACA,oBAAA;CAEA;AACA;CACA,YAAA;CACA,YAAA;CACA,aAAA;CACA;AACA;CACA,UAAA;CACA,mBAAA;CACA,sBAAA;CACA;AACA;CACA,WAAA;CACA,mBAAA;CACA,sBAAA;CACA;AACA;CACA,WAAA;CACA,mBAAA;CACA,sBAAA;CACA;AACA;CACA,WAAA;CACA,mBAAA;CACA,sBAAA;CACA;AACA;CACA,WAAA;CACA,mBAAA;CACA,sBAAA;CACA;AACA;CACA,YAAA;CACA,YAAA;CACA;AACA;CACA,YAAA;CACA,aAAA;CACA,kBAAA;CACA,gBAAA;CACA,YAAA;CACA;AACA;CACA,WAAA;CACA,sBAAA;CACA,mBAAA;CACA,kBAAA;CACA;AACA;CACA,WAAA;CACA,sBAAA;CACA,mBAAA;CACA,kBAAA;CACA;AACA;CACA,mBAAA;CACA,sBAAA;CACA,WAAA;CACA;AACA;CACA,YAAA;CACA,mBAAA;CACA","file":"User.vue","sourcesContent":["<template>\r\n\t<div class=\"usercontent\">\r\n\t\t<img  src=\"../img/user.jpg\"/>\r\n\t\t<div class = \"usercon\">\r\n\t\t\t<div class=\"description\">邀请好友加入ENJOY，给TA发放价值50元礼券。好友完成首单消费后，你亦可获得价值50元礼券。</div>\r\n\t\t\t<input type=\"submit\" name=\"\" id=\"submit\" value=\"即刻邀请\" />\r\n\t\t\t<div class=\"success\">已成功邀请了<span>0</span>位好友|获得<span>0</span>元礼券</div>\r\n\t\t\t<div class=\"kong\"></div>\r\n\t\t\t<div class=\"num\">\r\n\t\t\t\t<span>1</span>\r\n\t\t\t\t<span>5</span>\r\n\t\t\t\t<span>10</span>\r\n\t\t\t\t<span>25</span>\r\n\t\t\t\t<span>50</span>\r\n\t\t\t</div>\r\n\t\t\t<ul class=\"man1\">\r\n\t\t\t\t<li><span>5人</span><span>额外奖励</span><span>100元</span></li>\r\n\t\t\t\t<li><span>10人</span><span>额外奖励</span><span>100元</span></li>\r\n\t\t\t\t<li><span>25人</span><span>额外奖励</span><span>750元</span></li>\r\n\t\t\t\t<li><span>50人</span><span>额外奖励</span><span>2000元</span></li>\r\n\t\t\t</ul>\r\n\t\t\t<div class=\"detail\">奖励明细</div>\r\n\t\t</div>\r\n\t</div>\r\n</template>\r\n\r\n<script>\r\n\timport \"./../scss/main.scss\";\r\n\timport router from \"./../router/router.js\";\r\n\timport MyAjax from \"./../md/MyAjax.js\";\r\n\texport default {\r\n\t\tdata(){\r\n\t\t\treturn {\r\n\t\t\t\t\r\n\t\t\t}\r\n\t\t},\r\n\t\tmounted(){\r\n\t\t\tvar that = this;\r\n\t\t\t//var url = \"https://api.ricebook.com/meereen/v1/invitation_code/detail.json\";\r\n\t\t}\r\n\t}\r\n</script>\r\n\r\n<style scoped>\r\n\t.usercontent{\r\n\t\twidth: 100%;\r\n\t\theight: 100%;\r\n\t\t\r\n\t}\r\n\t.usercontent img{\r\n\t\twidth: 100%;\r\n\t\theight: 110px;\r\n\t}\r\n\t.usercon{\r\n\t\twidth:90%;\r\n\t\tpadding: 5%;\r\n\t}\r\n\t.description{\r\n\t\twidth: 100%;\r\n\t\tfont-size: 14px;\r\n\t\tline-height: 20px;\r\n\t\tpadding-bottom: 30px;\r\n\t}\r\n\t#submit{\r\n\t\twidth: 30%;\r\n\t\theight: 40px;\r\n\t\tline-height: 40px;\r\n\t\tdisplay: block;\r\n\t\tmargin-left: 33%;\r\n\t\tbackground-color: #f66;\r\n\t\tcolor: #fff;\r\n\t\tborder: none;\r\n\t\tmargin-bottom: 30px;\r\n\t}\r\n\t.success{\r\n\t\twidth: 100%;\r\n\t\ttext-align: center;\r\n\t\tline-height: 20px;\r\n\t\tmargin-bottom: 20px;\r\n\t}\r\n\t.success span{\r\n\t\tcolor: red;\r\n\t}\r\n\t.kong{\r\n\t\twidth: 100%;\r\n\t\theight: 20px;\r\n\t\tborder: 1px solid #ccc;\r\n\t\tborder-radius: 12px;\r\n\t\tmargin-bottom: 20px;\r\n\t\t\r\n\t}\r\n\t.num{\r\n\t\twidth: 100%;\r\n\t\tcolor: #ccc;\r\n\t\theight: 20px;\r\n\t}\r\n\t.num span:nth-of-type(1){\r\n\t\twidth: 5%;\r\n\t\ttext-align: center;\r\n\t\tdisplay: inline-block;\r\n\t}\r\n\t.num span:nth-of-type(2){\r\n\t\twidth: 10%;\r\n\t\ttext-align: center;\r\n\t\tdisplay: inline-block;\r\n\t}\r\n\t.num span:nth-of-type(3){\r\n\t\twidth: 20%;\r\n\t\ttext-align: center;\r\n\t\tdisplay: inline-block;\r\n\t}\r\n\t.num span:nth-of-type(4){\r\n\t\twidth: 25%;\r\n\t\ttext-align: center;\r\n\t\tdisplay: inline-block;\r\n\t}\r\n\t.num span:nth-of-type(5){\r\n\t\twidth: 30%;\r\n\t\ttext-align: center;\r\n\t\tdisplay: inline-block;\r\n\t}\r\n\t.man1{\r\n\t\twidth: 100%;\r\n\t\tcolor: #ccc;\r\n\t}\r\n\t.man1 li{\r\n\t\twidth: 100%;\r\n\t\theight: 30px;\r\n\t\tline-height: 30px;\r\n\t\tfont-size: 14px;\r\n\t\tcolor: #555;\r\n\t}\r\n\t.man1 li span:nth-of-type(1){\r\n\t\twidth: 15%;\r\n\t\tdisplay: inline-block;\r\n\t\ttext-align: center;\r\n\t\tmargin-right: 30%;\r\n\t}\r\n\t.man1 li span:nth-of-type(2){\r\n\t\twidth: 20%;\r\n\t\tdisplay: inline-block;\r\n\t\ttext-align: center;\r\n\t\tmargin-right: 10%;\r\n\t}\r\n\t.man1 li span:nth-of-type(3){\r\n\t\ttext-align: center;\r\n\t\tdisplay: inline-block;\r\n\t\twidth: 20%;\r\n\t}\r\n\t.detail{\r\n\t\twidth: 100%;\r\n\t\ttext-align: center;\r\n\t}\r\n</style>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 44 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scss_main_scss__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scss_main_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__scss_main_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__router_router_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__md_MyAjax_js__ = __webpack_require__(5);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
	data() {
		return {};
	},
	mounted() {
		var that = this;
		//var url = "https://api.ricebook.com/meereen/v1/invitation_code/detail.json";
	}
});

/***/ }),
/* 45 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _vm._m(0)
}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "usercontent"
  }, [_c('img', {
    attrs: {
      "src": __webpack_require__(46)
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "usercon"
  }, [_c('div', {
    staticClass: "description"
  }, [_vm._v("邀请好友加入ENJOY，给TA发放价值50元礼券。好友完成首单消费后，你亦可获得价值50元礼券。")]), _vm._v(" "), _c('input', {
    attrs: {
      "type": "submit",
      "name": "",
      "id": "submit",
      "value": "即刻邀请"
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "success"
  }, [_vm._v("已成功邀请了"), _c('span', [_vm._v("0")]), _vm._v("位好友|获得"), _c('span', [_vm._v("0")]), _vm._v("元礼券")]), _vm._v(" "), _c('div', {
    staticClass: "kong"
  }), _vm._v(" "), _c('div', {
    staticClass: "num"
  }, [_c('span', [_vm._v("1")]), _vm._v(" "), _c('span', [_vm._v("5")]), _vm._v(" "), _c('span', [_vm._v("10")]), _vm._v(" "), _c('span', [_vm._v("25")]), _vm._v(" "), _c('span', [_vm._v("50")])]), _vm._v(" "), _c('ul', {
    staticClass: "man1"
  }, [_c('li', [_c('span', [_vm._v("5人")]), _c('span', [_vm._v("额外奖励")]), _c('span', [_vm._v("100元")])]), _vm._v(" "), _c('li', [_c('span', [_vm._v("10人")]), _c('span', [_vm._v("额外奖励")]), _c('span', [_vm._v("100元")])]), _vm._v(" "), _c('li', [_c('span', [_vm._v("25人")]), _c('span', [_vm._v("额外奖励")]), _c('span', [_vm._v("750元")])]), _vm._v(" "), _c('li', [_c('span', [_vm._v("50人")]), _c('span', [_vm._v("额外奖励")]), _c('span', [_vm._v("2000元")])])]), _vm._v(" "), _c('div', {
    staticClass: "detail"
  }, [_vm._v("奖励明细")])])])
}]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-5a83e94b", esExports)
  }
}

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "45982ff5b898a9672eb45e7eb7ba1970.jpg";

/***/ }),
/* 47 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_More_vue__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_5d5963d5_hasScoped_true_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_More_vue__ = __webpack_require__(51);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(48)
}
var normalizeComponent = __webpack_require__(2)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-5d5963d5"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_More_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_5d5963d5_hasScoped_true_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_More_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "com\\More.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] More.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5d5963d5", Component.options)
  } else {
    hotAPI.reload("data-v-5d5963d5", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(49);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("f1cb020c", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../node_modules/_css-loader@0.28.5@css-loader/index.js?sourceMap!../node_modules/_vue-loader@13.0.4@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-5d5963d5\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/_vue-loader@13.0.4@vue-loader/lib/selector.js?type=styles&index=0!./More.vue", function() {
     var newContent = require("!!../node_modules/_css-loader@0.28.5@css-loader/index.js?sourceMap!../node_modules/_vue-loader@13.0.4@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-5d5963d5\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/_vue-loader@13.0.4@vue-loader/lib/selector.js?type=styles&index=0!./More.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n.morecontent[data-v-5d5963d5]{\n\twidth:100%;\n\theight: 100%;\n}\n.img[data-v-5d5963d5]{\n\twidth:100%;\n\theight: 178px;\n\tposition: relative;\n}\n.img img[data-v-5d5963d5]:nth-of-type(1){\n\twidth: 100%;\n\theight: 178px;\n}\n.img img[data-v-5d5963d5]:nth-of-type(2){\n\twidth: 18%;\n\tfont-size: 30px;\n\theight: 60px;\n\tposition: absolute;\n\ttop: 50%;\n\tleft: 50%;\n\tmargin-left: -10%;\n\tmargin-top: -45px;\n}\n.img p[data-v-5d5963d5]{\n\twidth: 100%;\n\ttext-align: center;\n\tfont-size: 14px;\n\tcolor: #fff;\n\tposition: absolute;\n\ttop: 50%;\n\tleft: 0;\n\tmargin-top: 50px;\n}\n.code1[data-v-5d5963d5]{\n\twidth: 100%;\n\theight: 50px;\n\tline-height: 50px;\n\tborder-top: 10px solid #ccc;\n\tbackground-color: #fff;\n\tborder-bottom: 10px solid #ccc;\n}\n.code1 p[data-v-5d5963d5] {\n\tpadding-left: 30px;\n}\n.code2[data-v-5d5963d5]{\n\twidth: 100%;\n\theight: 50px;\n\tline-height: 50px;\n\tbackground-color: #fff;\n\tborder-bottom: 1px solid #ccc;\n}\n.code2 p[data-v-5d5963d5] {\n\tpadding-left: 30px;\n}\n.code3[data-v-5d5963d5]{\n\twidth: 100%;\n\theight: 50px;\n\tline-height: 50px;\n\tbackground-color: #fff;\n\tborder-bottom: 1px solid #ccc;\n}\n.code3 p[data-v-5d5963d5] {\n\tpadding-left: 30px;\n}\n", "", {"version":3,"sources":["G:/enjoy/com/com/More.vue?a94011c4"],"names":[],"mappings":";AAwBA;CACA,WAAA;CACA,aAAA;CACA;AACA;CACA,WAAA;CACA,cAAA;CACA,mBAAA;CACA;AACA;CACA,YAAA;CACA,cAAA;CACA;AACA;CACA,WAAA;CACA,gBAAA;CACA,aAAA;CACA,mBAAA;CACA,SAAA;CACA,UAAA;CACA,kBAAA;CACA,kBAAA;CACA;AACA;CACA,YAAA;CACA,mBAAA;CACA,gBAAA;CACA,YAAA;CACA,mBAAA;CACA,SAAA;CACA,QAAA;CACA,iBAAA;CACA;AACA;CACA,YAAA;CACA,aAAA;CACA,kBAAA;CACA,4BAAA;CACA,uBAAA;CACA,+BAAA;CAEA;AACA;CACA,mBAAA;CACA;AACA;CACA,YAAA;CACA,aAAA;CACA,kBAAA;CACA,uBAAA;CACA,8BAAA;CAEA;AACA;CACA,mBAAA;CACA;AACA;CACA,YAAA;CACA,aAAA;CACA,kBAAA;CACA,uBAAA;CACA,8BAAA;CAEA;AACA;CACA,mBAAA;CACA","file":"More.vue","sourcesContent":["<template>\r\n\t<div class=\"morecontent\">\r\n\t\t<div class=\"img\">\r\n\t\t\t<img src=\"../img/more.png\" />\r\n\t\t\t<img src=\"../img/more1.png\" />\r\n\t\t\t<p>ENJOY_XIXIHAHA</p>\r\n\t\t</div>\r\n\t\t<div class=\"code1\"><p>code消费码</p></div>\r\n\t\t<div class=\"code2\"><p>我的礼券</p></div>\r\n\t\t<div class=\"code3\"><p>地址管理</p></div>\r\n\t</div>\r\n</template>\r\n\r\n<script>\r\n\texport default {\r\n\t\tdata(){\r\n\t\t\treturn {\r\n\t\t\t\t\r\n\t\t\t}\r\n\t\t}\r\n\t}\r\n</script>\r\n\r\n<style scoped>\r\n\t.morecontent{\r\n\t\twidth:100%;\r\n\t\theight: 100%;\r\n\t}\r\n\t.img{\r\n\t\twidth:100%;\r\n\t\theight: 178px;\r\n\t\tposition: relative;\r\n\t}\r\n\t.img img:nth-of-type(1){\r\n\t\twidth: 100%;\r\n\t\theight: 178px;\r\n\t}\r\n\t.img img:nth-of-type(2){\r\n\t\twidth: 18%;\r\n\t\tfont-size: 30px;\r\n\t\theight: 60px;\r\n\t\tposition: absolute;\r\n\t\ttop: 50%;\r\n\t\tleft: 50%;\r\n\t\tmargin-left: -10%;\r\n\t\tmargin-top: -45px;\r\n\t}\r\n\t.img p{\r\n\t\twidth: 100%;\r\n\t\ttext-align: center;\r\n\t\tfont-size: 14px;\r\n\t\tcolor: #fff;\r\n\t\tposition: absolute;\r\n\t\ttop: 50%;\r\n\t\tleft: 0;\r\n\t\tmargin-top: 50px;\r\n\t}\r\n\t.code1{\r\n\t\twidth: 100%;\r\n\t\theight: 50px;\r\n\t\tline-height: 50px;\r\n\t\tborder-top: 10px solid #ccc;\r\n\t\tbackground-color: #fff;\r\n\t\tborder-bottom: 10px solid #ccc;\r\n\t\r\n\t}\r\n\t.code1 p {\r\n\t\tpadding-left: 30px;\r\n\t}\r\n\t.code2{\r\n\t\twidth: 100%;\r\n\t\theight: 50px;\r\n\t\tline-height: 50px;\r\n\t\tbackground-color: #fff;\r\n\t\tborder-bottom: 1px solid #ccc;\r\n\t\r\n\t}\r\n\t.code2 p {\r\n\t\tpadding-left: 30px;\r\n\t}\r\n\t.code3{\r\n\t\twidth: 100%;\r\n\t\theight: 50px;\r\n\t\tline-height: 50px;\r\n\t\tbackground-color: #fff;\r\n\t\tborder-bottom: 1px solid #ccc;\r\n\t\r\n\t}\r\n\t.code3 p {\r\n\t\tpadding-left: 30px;\r\n\t}\r\n</style>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
	data() {
		return {};
	}
});

/***/ }),
/* 51 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _vm._m(0)
}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "morecontent"
  }, [_c('div', {
    staticClass: "img"
  }, [_c('img', {
    attrs: {
      "src": __webpack_require__(52)
    }
  }), _vm._v(" "), _c('img', {
    attrs: {
      "src": __webpack_require__(53)
    }
  }), _vm._v(" "), _c('p', [_vm._v("ENJOY_XIXIHAHA")])]), _vm._v(" "), _c('div', {
    staticClass: "code1"
  }, [_c('p', [_vm._v("code消费码")])]), _vm._v(" "), _c('div', {
    staticClass: "code2"
  }, [_c('p', [_vm._v("我的礼券")])]), _vm._v(" "), _c('div', {
    staticClass: "code3"
  }, [_c('p', [_vm._v("地址管理")])])])
}]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-5d5963d5", esExports)
  }
}

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "9013f951f15c2f7cd0ad4f526adb0007.png";

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "e40b176269428958a922e3b8edf9a65a.png";

/***/ }),
/* 54 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_Cart_vue__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_6ac9c620_hasScoped_true_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_Cart_vue__ = __webpack_require__(60);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(55)
}
var normalizeComponent = __webpack_require__(2)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-6ac9c620"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_Cart_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_6ac9c620_hasScoped_true_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_Cart_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "com\\Cart.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] Cart.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6ac9c620", Component.options)
  } else {
    hotAPI.reload("data-v-6ac9c620", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(56);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("37209fde", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../node_modules/_css-loader@0.28.5@css-loader/index.js?sourceMap!../node_modules/_vue-loader@13.0.4@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6ac9c620\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/_vue-loader@13.0.4@vue-loader/lib/selector.js?type=styles&index=0!./Cart.vue", function() {
     var newContent = require("!!../node_modules/_css-loader@0.28.5@css-loader/index.js?sourceMap!../node_modules/_vue-loader@13.0.4@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6ac9c620\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/_vue-loader@13.0.4@vue-loader/lib/selector.js?type=styles&index=0!./Cart.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n.cartcontent[data-v-6ac9c620]{\n\twidth: 90%;\n\theight: 100%;\n\tpadding: 5%;\n}\n.cartpro[data-v-6ac9c620]{\n\twidth: 100%;\n\theight: 150px;\n\tposition: relative;\n}\n.checkes[data-v-6ac9c620]{\n\tdisplay: block;\n\tposition: absolute;\n\tleft: 0;\n\ttop: 18%;\n}\n.cartpro img[data-v-6ac9c620]{\n\tmargin-left: 10%;\n\tdisplay: block;\n\tfloat: left;\n\twidth: 28%;\n\theight: 85px;\n\tmargin-right: 10%;\n\tposition: relative;\n}\n.cartright[data-v-6ac9c620]{\n\twidth: 50%;\n\theight: 130px;\n\tfloat: left;\n}\n.cartright div[data-v-6ac9c620]:nth-of-type(1){\n\twidth: 100%;\n\tfont-size: 12px;\n\twhite-space: nowrap;\n\ttext-overflow: ellipsis;\n\toverflow: hidden;\n}\n.cartright div[data-v-6ac9c620]:nth-of-type(2){\n\twidth: 100%;\n\tfont-size: 12px;\n\tcolor: #f00;\n\tline-height: 30px;\n}\n.cartright div[data-v-6ac9c620]:nth-of-type(3){\n\twidth: 100%;\n\tfont-size: 12px;\n\tcolor: #f66;\n}\n.tocountreduce[data-v-6ac9c620]{\n\twidth: 15%;\n\theight: 30px;\n\tdisplay: inline-block;\n\tbackground-color: #eee;\n\ttext-align: center;\n\tline-height: 30px;\n}\n.count[data-v-6ac9c620]{\n\twidth: 15%;\n\theight: 30px;\n\tdisplay: inline-block;\n\ttext-align: center;\n\tline-height: 30px;\n\tcolor: #f66;\n}\n.tocountadd[data-v-6ac9c620]{\n\twidth: 15%;\n\theight: 30px;\n\tdisplay: inline-block;\n\tbackground-color: #eee;\n\ttext-align: center;\n\tline-height: 30px;\n\tmargin-right: 10%;\n}\n.todel[data-v-6ac9c620]{\n\twidth: 20%;\n\theight: 30px;\n\tdisplay: inline-block;\n\ttext-align: center;\n\tline-height: 30px;\n\tcolor: #ccc;\n\tfont-size: 12px;\n}\n\n\n", "", {"version":3,"sources":["G:/enjoy/com/com/Cart.vue?77988eb0"],"names":[],"mappings":";AA0LA;CACA,WAAA;CACA,aAAA;CACA,YAAA;CACA;AACA;CACA,YAAA;CACA,cAAA;CACA,mBAAA;CACA;AACA;CACA,eAAA;CACA,mBAAA;CACA,QAAA;CACA,SAAA;CACA;AACA;CACA,iBAAA;CACA,eAAA;CACA,YAAA;CACA,WAAA;CACA,aAAA;CACA,kBAAA;CACA,mBAAA;CAEA;AAEA;CACA,WAAA;CACA,cAAA;CACA,YAAA;CACA;AACA;CACA,YAAA;CACA,gBAAA;CACA,oBAAA;CACA,wBAAA;CACA,iBAAA;CACA;AACA;CACA,YAAA;CACA,gBAAA;CACA,YAAA;CACA,kBAAA;CAEA;AACA;CACA,YAAA;CACA,gBAAA;CACA,YAAA;CACA;AACA;CACA,WAAA;CACA,aAAA;CACA,sBAAA;CACA,uBAAA;CACA,mBAAA;CACA,kBAAA;CACA;AACA;CACA,WAAA;CACA,aAAA;CACA,sBAAA;CACA,mBAAA;CACA,kBAAA;CACA,YAAA;CACA;AACA;CACA,WAAA;CACA,aAAA;CACA,sBAAA;CACA,uBAAA;CACA,mBAAA;CACA,kBAAA;CACA,kBAAA;CACA;AACA;CACA,WAAA;CACA,aAAA;CACA,sBAAA;CACA,mBAAA;CACA,kBAAA;CACA,YAAA;CACA,gBAAA;CACA","file":"Cart.vue","sourcesContent":["<template>\r\n\t<div class=\"cartcontent\">\r\n\t<div class=\"cartpro\" v-for = \"(it,index) in prolist\">\r\n\t\t<div class=\"checkes\">\r\n\t\t\t\t<input type=\"checkbox\" @click=\"check(index)\" :checked=\"money[index].s\"/> \r\n\t\t\t</div>\r\n\t\t\t<img  :src=it.pic>\r\n\t\t\t<div class=\"cartright\">\r\n\t\t\t\t<div>{{it.name1}}</div>\r\n\t\t\t\t<div>单价：{{it.price1/100}}</div>\r\n\t\t\t\t<div>\r\n\t\t\t\t\t<span class=\"tocountreduce\" @click = \"tocountreduce(it,index)\">-</span>\r\n\t\t\t\t\t<span  class =\"count\" ref=\"count\">{{it.num}}</span>\r\n\t\t\t\t\t<span class=\"tocountadd\" @click = \"tocountadd(it,index)\">+</span>\r\n\t\t\t\t\t<span class = \"todel\" @click = \"todel(index)\">移除</span>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t\t<div class=\"caiLike\">\r\n\t\t<h1>猜你喜欢</h1>\t\r\n\t\t\t<div v-for=\"item in datalist\" class=\"likeList\">\r\n\t\t\t\t<img v-bind:src=item.product_image>\r\n\t\t\t\t<p>{{item.short_name}}</p>\r\n\t\t\t\t<p class=\"pricess\">\r\n\t\t\t\t\t{{item.price/100}}元\r\n\t\t\t\t\t<span>{{item.storage_state}}</span>\r\n\t\t\t\t\t/{{item.show_entity_name}}\r\n\t\t\t\t</p>\r\n\t\t\t</div>\r\n\t\r\n\t</div>\t\r\n\t\t<div class=\"cartfooters\">\r\n\t\t\t<div class=\"foochex\">\r\n\t\t\t\t<input type=\"checkbox\" @click=\"checkedAll()\" v-model=\"checkAll\"/>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"point\">\r\n\t\t\t\t全选\r\n\t\t\t</div>\r\n\t\t\t<div class=\"totalyun\">\r\n\t\t\t\t合计:\t\t\t\t\r\n\t\t\t\t<span  class=\"allMony\">\r\n\t\t\t\t\t{{totalMoney}}元\t\t\t\t\t\t\r\n\t\t\t\t</span>\t\t\t\t\r\n\t\t\t</div>\r\n\t\t\t<div class=\"zhifu\" @click=\"zhifu\">\r\n\t\t\t\t去结算\r\n\t\t\t</div>\r\n\t\t</div>\t\r\n\t</div>\r\n</template>\r\n\r\n<script>\r\n\timport MyAjax from \"./../md/MyAjax.js\";\r\n\timport \"./../scss/cart.scss\";\r\n\timport router from \"./../router/router.js\";\r\n\texport default{\r\n\t\tdata(){\r\n\t\t\treturn{\r\n\t\t\t\tprolist:[],\r\n\t\t\t\tdatalist:[],\r\n\t\t\t\tmoney : [],\r\n\t\t\t\ttotalMoney:0,\r\n\t\t\t\tcheckAll : false\r\n\t\t\t}\r\n\t\t},\r\n\t\tmethods:{\r\n\t\t\tcountMoney(){\r\n\t\t\t\tthis.totalMoney = 0;\r\n\t\t\t\tfor(let i=0; i < this.money.length; i++){\r\n\t\t\t\t\tif(this.money[i].s){\r\n\t\t\t\t\t\tthis.totalMoney += this.money[i].m;\r\n\t\t\t\t\t\tconsole.log(this.totalMoney)\r\n\t\t\t\t\t}\r\n\t\t\t\t}\r\n\t\t\t},\r\n\t\t\tcheck(index){\r\n\t\t\t\t\tvar num = 0;\r\n\t\t\t\tif(this.money[index].s == false){\r\n\t\t\t\t\tthis.money[index].s = true;\r\n\t\t\t\t}else{\r\n\t\t\t\t\tthis.money[index].s = false\r\n\t\t\t\t}\r\n\t\t\t\tfor(let i = 0; i < this.money.length; i++){\r\n\t\t\t\t\tif(this.money[i].s){\r\n\t\t\t\t\t\tnum++\r\n\t\t\t\t\t}\r\n\t\t\t\t}\r\n\t\t\t\tconsole.log(num,this.money.length)\r\n\t\t\t\tif(num==this.money.length){\r\n\t\t\t\t\tconsole.log(\"true\")\r\n\t\t\t\t\tthis.checkAll = true;\r\n\t\t\t\t}else{\r\n\t\t\t\t\tthis.checkAll = false;\r\n\t\t\t\t}\r\n\t\t\t\tthis.countMoney();\r\n\t\t\t},\r\n\t\t\tcheckedAll(){\r\n\t\t\t\tif(this.checkAll){\r\n\t\t\t\t\tthis.checkAll = false;\r\n\t\t\t\t}else{\r\n\t\t\t\t\tthis.checkAll = true;\r\n\t\t\t\t}\r\n\t\t\t\tfor(let i = 0; i < this.money.length; i++){\r\n\t\t\t\t\tthis.money[i].s = this.checkAll;\r\n\t\t\t\t}\r\n\t\t\t\tthis.countMoney();\r\n\t\t\t},\r\n\t\t\ttocountreduce(item,index){\r\n\t\t\t\tvar proList=this.prolist;\t\r\n\t\t\t\tvar num = proList[index].num;\t\t\t\t\r\n\t\t\t\tif(num > 1){\r\n\t\t\t\t\tnum--;\r\n\t\t\t\t\tproList[index].num=num;\r\n\t\t\t\t\tvar goods=JSON.parse(localStorage.getItem(\"goods\"));\r\n\t\t\t\t\tgoods[index].num=num;\r\n\t\t\t\t\tlocalStorage.setItem(\"goods\",JSON.stringify(goods));\r\n\t\t\t\t\tthis.money[index].m = item.num*item.price1/100;\r\n\t\t\t\t\tthis.countMoney();\r\n\t\t\t\t}\r\n\t\t\t\t\r\n\t\t\t},\r\n\t\t\ttocountadd(item,index){\r\n\t\t\t\tvar proList=this.prolist;\r\n\t\t\t\tvar num=proList[index].num;\r\n\t\t\t\tnum++;\r\n\t\t\t\tproList[index].num=num;\r\n\t\t\t\tvar goods=JSON.parse(localStorage.getItem(\"goods\"));\r\n\t\t\t\tgoods[index].num=num;\r\n\t\t\t\tlocalStorage.setItem(\"goods\",JSON.stringify(goods));\r\n\t\t\t\tthis.proList=proList;\r\n\t\t\t\tconsole.log(item,index)\r\n\t\t\t\tthis.money[index].m = item.num*item.price1/100;\r\n\t\t\t\tthis.countMoney();\r\n\t\t\t},\r\n\t\ttodel(index){\r\n\t\t\tconsole.log(index)\r\n\t\t\t\tvar proList=this.prolist;\r\n\t\t\t\tproList.splice(index,1);\r\n\t\t\t\tthis.proList=proList;\r\n\t\t\t\tvar goods=JSON.parse(localStorage.getItem(\"goods\"));\r\n\t\t\t\tif(goods==1){\r\n\t\t\t\t\tlocalStorage.removeItem(\"goods\");\t\t\t\t\t\r\n\t\t\t\t}else{\r\n\t\t\t\t\tgoods.splice(index,1);\r\n\t\t\t\t\tlocalStorage.setItem(\"goods\",JSON.stringify(goods))\r\n\t\t\t\t}\r\n//\t\t\t\tthis.money[index].m = item.num*item.price1/100;\r\n\t\t\t\tthis.countMoney();\r\n\t\t},\r\n\t\t\tzhifu(){\r\n\t\t\t\t/*if(){\r\n\t\t\t\t\t\r\n\t\t\t\t}else{\r\n\t\t\t\t\t\r\n\t\t\t\t}\r\n\t\t\t\t*/\r\n\t\t\t\t\r\n\t\t\t\tthis.$router.push(\"/buy\")\r\n\t\t\t}\r\n\t\t},\r\n\t\tmounted(){\r\n\t\t\tvar that = this;\r\n\t\t\tthat.prolist = JSON.parse(localStorage.getItem(\"goods\"));\t\r\n\t\t\tfor(var i in that.prolist){\r\n\t\t\t\tvar num = that.prolist[i].num;\r\n\t\t\t\tvar price = that.prolist[i].price1;\r\n\t\t\t\tthat.money[i] = {\r\n\t\t\t\t\ts:false,\r\n\t\t\t\t\tm:num*price/100\r\n\t\t\t\t}\r\n\t\t\t}\r\n\t\t\t\r\n\t\t\tvar url=\"https://api.ricebook.com/3/enjoy_product/cart_recommend_product.json?city_id=1\";\r\n\t\t\tMyAjax.vueJson(url,function(data){\r\n\t\t\t\tthat.datalist=data.content;\r\n\t\t\t\t\r\n\t\t\t},function(err){\r\n\t\t\t\tconsole.log(err)\r\n\t\t\t});\t\t\t\r\n\t\t},\r\n\t\t\r\n\t}\r\n</script>\r\n\r\n\r\n<style scoped>\r\n\t.cartcontent{\r\n\t\twidth: 90%;\r\n\t\theight: 100%;\r\n\t\tpadding: 5%;\r\n\t}\r\n\t.cartpro{\r\n\t\twidth: 100%;\r\n\t\theight: 150px;\r\n\t\tposition: relative;\r\n\t}\r\n\t.checkes{\r\n\t\tdisplay: block;\r\n\t\tposition: absolute;\r\n\t\tleft: 0;\r\n\t\ttop: 18%;\r\n\t}\r\n\t.cartpro img{\r\n\t\tmargin-left: 10%;\r\n\t\tdisplay: block;\r\n\t\tfloat: left;\r\n\t\twidth: 28%;\r\n\t\theight: 85px;\r\n\t\tmargin-right: 10%;\r\n\t\tposition: relative;\r\n\t\t\r\n\t}\r\n\r\n\t.cartright{\r\n\t\twidth: 50%;\r\n\t\theight: 130px;\r\n\t\tfloat: left;\r\n\t}\r\n\t.cartright div:nth-of-type(1){\r\n\t\twidth: 100%;\r\n\t\tfont-size: 12px;\r\n\t\twhite-space: nowrap;\r\n\t\ttext-overflow: ellipsis;\r\n\t\toverflow: hidden;\r\n\t}\r\n\t.cartright div:nth-of-type(2){\r\n\t\twidth: 100%;\r\n\t\tfont-size: 12px;\r\n\t\tcolor: #f00;\r\n\t\tline-height: 30px;\r\n\t\t\r\n\t}\r\n\t.cartright div:nth-of-type(3){\r\n\t\twidth: 100%;\r\n\t\tfont-size: 12px;\r\n\t\tcolor: #f66;\r\n\t}\r\n\t.tocountreduce{\r\n\t\twidth: 15%;\r\n\t\theight: 30px;\r\n\t\tdisplay: inline-block;\r\n\t\tbackground-color: #eee;\r\n\t\ttext-align: center;\r\n\t\tline-height: 30px;\r\n\t}\r\n\t.count{\r\n\t\twidth: 15%;\r\n\t\theight: 30px;\r\n\t\tdisplay: inline-block;\r\n\t\ttext-align: center;\r\n\t\tline-height: 30px;\r\n\t\tcolor: #f66;\r\n\t}\r\n\t.tocountadd{\r\n\t\twidth: 15%;\r\n\t\theight: 30px;\r\n\t\tdisplay: inline-block;\r\n\t\tbackground-color: #eee;\r\n\t\ttext-align: center;\r\n\t\tline-height: 30px;\r\n\t\tmargin-right: 10%;\r\n\t}\r\n\t.todel{\r\n\t\twidth: 20%;\r\n\t\theight: 30px;\r\n\t\tdisplay: inline-block;\r\n\t\ttext-align: center;\r\n\t\tline-height: 30px;\r\n\t\tcolor: #ccc;\r\n\t\tfont-size: 12px;\r\n\t}\r\n\t\r\n\t\r\n</style>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 57 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__md_MyAjax_js__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scss_cart_scss__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scss_cart_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__scss_cart_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__router_router_js__ = __webpack_require__(3);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
	data() {
		return {
			prolist: [],
			datalist: [],
			money: [],
			totalMoney: 0,
			checkAll: false
		};
	},
	methods: {
		countMoney() {
			this.totalMoney = 0;
			for (let i = 0; i < this.money.length; i++) {
				if (this.money[i].s) {
					this.totalMoney += this.money[i].m;
					console.log(this.totalMoney);
				}
			}
		},
		check(index) {
			var num = 0;
			if (this.money[index].s == false) {
				this.money[index].s = true;
			} else {
				this.money[index].s = false;
			}
			for (let i = 0; i < this.money.length; i++) {
				if (this.money[i].s) {
					num++;
				}
			}
			console.log(num, this.money.length);
			if (num == this.money.length) {
				console.log("true");
				this.checkAll = true;
			} else {
				this.checkAll = false;
			}
			this.countMoney();
		},
		checkedAll() {
			if (this.checkAll) {
				this.checkAll = false;
			} else {
				this.checkAll = true;
			}
			for (let i = 0; i < this.money.length; i++) {
				this.money[i].s = this.checkAll;
			}
			this.countMoney();
		},
		tocountreduce(item, index) {
			var proList = this.prolist;
			var num = proList[index].num;
			if (num > 1) {
				num--;
				proList[index].num = num;
				var goods = JSON.parse(localStorage.getItem("goods"));
				goods[index].num = num;
				localStorage.setItem("goods", JSON.stringify(goods));
				this.money[index].m = item.num * item.price1 / 100;
				this.countMoney();
			}
		},
		tocountadd(item, index) {
			var proList = this.prolist;
			var num = proList[index].num;
			num++;
			proList[index].num = num;
			var goods = JSON.parse(localStorage.getItem("goods"));
			goods[index].num = num;
			localStorage.setItem("goods", JSON.stringify(goods));
			this.proList = proList;
			console.log(item, index);
			this.money[index].m = item.num * item.price1 / 100;
			this.countMoney();
		},
		todel(index) {
			console.log(index);
			var proList = this.prolist;
			proList.splice(index, 1);
			this.proList = proList;
			var goods = JSON.parse(localStorage.getItem("goods"));
			if (goods == 1) {
				localStorage.removeItem("goods");
			} else {
				goods.splice(index, 1);
				localStorage.setItem("goods", JSON.stringify(goods));
			}
			//				this.money[index].m = item.num*item.price1/100;
			this.countMoney();
		},
		zhifu() {
			/*if(){
   	
   }else{
   	
   }
   */

			this.$router.push("/buy");
		}
	},
	mounted() {
		var that = this;
		that.prolist = JSON.parse(localStorage.getItem("goods"));
		for (var i in that.prolist) {
			var num = that.prolist[i].num;
			var price = that.prolist[i].price1;
			that.money[i] = {
				s: false,
				m: num * price / 100
			};
		}

		var url = "https://api.ricebook.com/3/enjoy_product/cart_recommend_product.json?city_id=1";
		__WEBPACK_IMPORTED_MODULE_0__md_MyAjax_js__["a" /* default */].vueJson(url, function (data) {
			that.datalist = data.content;
		}, function (err) {
			console.log(err);
		});
	}

});

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(59);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(6)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/_css-loader@0.28.5@css-loader/index.js!../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!./cart.scss", function() {
			var newContent = require("!!../node_modules/_css-loader@0.28.5@css-loader/index.js!../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!./cart.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".caiLike {\n  width: 100%; }\n  .caiLike h1 {\n    width: 100%;\n    font-size: 1.0rem;\n    text-align: center;\n    line-height: 2rem; }\n  .caiLike .likeList {\n    width: 50%;\n    height: 12rem;\n    float: left;\n    font-size: 0.6rem; }\n    .caiLike .likeList img {\n      width: 90%;\n      padding: 4%; }\n    .caiLike .likeList p {\n      padding: 4%; }\n  .caiLike .pricess {\n    color: #f00; }\n\n.cartfooters {\n  width: 100%;\n  height: 3.3rem;\n  line-height: 3.3rem;\n  background: #fff;\n  position: fixed;\n  bottom: 0;\n  left: 0;\n  font-size: 0.6rem;\n  border-top: 1px solid #eee; }\n  .cartfooters .foochex {\n    position: absolute;\n    left: 8%;\n    top: 6%; }\n  .cartfooters .point,\n  .cartfooters .totalyun,\n  .cartfooters .zhifu {\n    width: 33.3%;\n    float: left;\n    text-align: center;\n    color: #f00; }\n  .cartfooters #xunazho {\n    color: #f00; }\n  .cartfooters .zhifu {\n    background: #f00;\n    color: #fff;\n    font-size: 0.8rem; }\n", ""]);

// exports


/***/ }),
/* 60 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "cartcontent"
  }, [_vm._l((_vm.prolist), function(it, index) {
    return _c('div', {
      staticClass: "cartpro"
    }, [_c('div', {
      staticClass: "checkes"
    }, [_c('input', {
      attrs: {
        "type": "checkbox"
      },
      domProps: {
        "checked": _vm.money[index].s
      },
      on: {
        "click": function($event) {
          _vm.check(index)
        }
      }
    })]), _vm._v(" "), _c('img', {
      attrs: {
        "src": it.pic
      }
    }), _vm._v(" "), _c('div', {
      staticClass: "cartright"
    }, [_c('div', [_vm._v(_vm._s(it.name1))]), _vm._v(" "), _c('div', [_vm._v("单价：" + _vm._s(it.price1 / 100))]), _vm._v(" "), _c('div', [_c('span', {
      staticClass: "tocountreduce",
      on: {
        "click": function($event) {
          _vm.tocountreduce(it, index)
        }
      }
    }, [_vm._v("-")]), _vm._v(" "), _c('span', {
      ref: "count",
      refInFor: true,
      staticClass: "count"
    }, [_vm._v(_vm._s(it.num))]), _vm._v(" "), _c('span', {
      staticClass: "tocountadd",
      on: {
        "click": function($event) {
          _vm.tocountadd(it, index)
        }
      }
    }, [_vm._v("+")]), _vm._v(" "), _c('span', {
      staticClass: "todel",
      on: {
        "click": function($event) {
          _vm.todel(index)
        }
      }
    }, [_vm._v("移除")])])])])
  }), _vm._v(" "), _c('div', {
    staticClass: "caiLike"
  }, [_c('h1', [_vm._v("猜你喜欢")]), _vm._v(" "), _vm._l((_vm.datalist), function(item) {
    return _c('div', {
      staticClass: "likeList"
    }, [_c('img', {
      attrs: {
        "src": item.product_image
      }
    }), _vm._v(" "), _c('p', [_vm._v(_vm._s(item.short_name))]), _vm._v(" "), _c('p', {
      staticClass: "pricess"
    }, [_vm._v("\n\t\t\t\t" + _vm._s(item.price / 100) + "元\n\t\t\t\t"), _c('span', [_vm._v(_vm._s(item.storage_state))]), _vm._v("\n\t\t\t\t/" + _vm._s(item.show_entity_name) + "\n\t\t\t")])])
  })], 2), _vm._v(" "), _c('div', {
    staticClass: "cartfooters"
  }, [_c('div', {
    staticClass: "foochex"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.checkAll),
      expression: "checkAll"
    }],
    attrs: {
      "type": "checkbox"
    },
    domProps: {
      "checked": Array.isArray(_vm.checkAll) ? _vm._i(_vm.checkAll, null) > -1 : (_vm.checkAll)
    },
    on: {
      "click": function($event) {
        _vm.checkedAll()
      },
      "__c": function($event) {
        var $$a = _vm.checkAll,
          $$el = $event.target,
          $$c = $$el.checked ? (true) : (false);
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && (_vm.checkAll = $$a.concat($$v))
          } else {
            $$i > -1 && (_vm.checkAll = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))
          }
        } else {
          _vm.checkAll = $$c
        }
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "point"
  }, [_vm._v("\n\t\t\t全选\n\t\t")]), _vm._v(" "), _c('div', {
    staticClass: "totalyun"
  }, [_vm._v("\n\t\t\t合计:\t\t\t\t\n\t\t\t"), _c('span', {
    staticClass: "allMony"
  }, [_vm._v("\n\t\t\t\t" + _vm._s(_vm.totalMoney) + "元\t\t\t\t\t\t\n\t\t\t")])]), _vm._v(" "), _c('div', {
    staticClass: "zhifu",
    on: {
      "click": _vm.zhifu
    }
  }, [_vm._v("\n\t\t\t去结算\n\t\t")])])], 2)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-6ac9c620", esExports)
  }
}

/***/ }),
/* 61 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_HomeHeader_vue__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_0a68474c_hasScoped_true_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_HomeHeader_vue__ = __webpack_require__(65);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(62)
}
var normalizeComponent = __webpack_require__(2)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-0a68474c"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_HomeHeader_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_0a68474c_hasScoped_true_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_HomeHeader_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "com\\HomeHeader.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] HomeHeader.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0a68474c", Component.options)
  } else {
    hotAPI.reload("data-v-0a68474c", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(63);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("3a10b97f", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../node_modules/_css-loader@0.28.5@css-loader/index.js?sourceMap!../node_modules/_vue-loader@13.0.4@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0a68474c\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/_vue-loader@13.0.4@vue-loader/lib/selector.js?type=styles&index=0!./HomeHeader.vue", function() {
     var newContent = require("!!../node_modules/_css-loader@0.28.5@css-loader/index.js?sourceMap!../node_modules/_vue-loader@13.0.4@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0a68474c\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/_vue-loader@13.0.4@vue-loader/lib/selector.js?type=styles&index=0!./HomeHeader.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n.commonHeader[data-v-0a68474c]{\n\tposition: relative;\n}\n.back[data-v-0a68474c]{\n\tfont-size: 14px;\n}\n.title[data-v-0a68474c]{\n\tfont-size: 14px;\n}\n.title span[data-v-0a68474c]:nth-of-type(1){\n\tfont-size: 8px;\n}\n.title i[data-v-0a68474c]{\n\tfont-style: inherit;\n}\n.moreInfo .iconfont[data-v-0a68474c]{\n\t\tdisplay: inline-block;\n\t\tfont-size: 14px;\n\t\twidth: 50px;\n\t\tfloat: left;\n\t\tfont-style: inherit;\n}\n.searchbox[data-v-0a68474c]{\n\twidth: 100%;\n\theight: 45px;\n\tposition: fixed;\n\ttop: 40px;\n\tleft: 0;\n\tz-index: 100;\n}\n#search[data-v-0a68474c]{\n\ttext-indent: 12px;\n\tdisplay: block;\n\theight: 25px;\n\twidth: 70%;\n\tmargin-left: 10%;\n\tfloat: left;\n\tfont-size: 12px;\n\tbackground-color: #eee;\n\tborder: none;\n\tmargin-top: 4%;\n\toutline: none;\n}\n.searchbox span[data-v-0a68474c]{\n\twidth: 10%;\n\tdisplay: inline-block;\n\tfloat: left;\n\tcolor: #000000;\n\tfont-size: 12px;\n\tmargin-top: 5%;\n}\n.denglu[data-v-0a68474c]{\n\twidth: 80px;\n\theight: 80px;\n\tfont-size: 14px;\n\tbackground:#fff;\n\tposition: absolute;\n\tz-index: 100;\n\tcolor: #666;\n\ttop: 45px;\n}\n.denglu li[data-v-0a68474c]{\n\tline-height: 26px;\n\tborder-bottom: 1px solid #eee;\n}\n\n", "", {"version":3,"sources":["G:/enjoy/com/com/HomeHeader.vue?64d5a10e"],"names":[],"mappings":";AA4EA;CACA,mBAAA;CACA;AAEA;CACA,gBAAA;CACA;AACA;CACA,gBAAA;CACA;AACA;CACA,eAAA;CACA;AACA;CACA,oBAAA;CAEA;AACA;EACA,sBAAA;EACA,gBAAA;EACA,YAAA;EACA,YAAA;EACA,oBAAA;CACA;AACA;CACA,YAAA;CACA,aAAA;CACA,gBAAA;CACA,UAAA;CACA,QAAA;CACA,aAAA;CACA;AACA;CACA,kBAAA;CACA,eAAA;CACA,aAAA;CACA,WAAA;CACA,iBAAA;CACA,YAAA;CACA,gBAAA;CACA,uBAAA;CACA,aAAA;CACA,eAAA;CACA,cAAA;CACA;AACA;CACA,WAAA;CACA,sBAAA;CACA,YAAA;CACA,eAAA;CACA,gBAAA;CACA,eAAA;CACA;AACA;CACA,YAAA;CACA,aAAA;CACA,gBAAA;CACA,gBAAA;CACA,mBAAA;CACA,aAAA;CACA,YAAA;CACA,UAAA;CACA;AACA;CACA,kBAAA;CACA,8BAAA;CACA","file":"HomeHeader.vue","sourcesContent":["<template>\r\n\t<div class=\"commonHeader\">\r\n\t\t<div class=\"back\" @click=\"gokind()\">分类</div>\r\n\t\t<div class=\"title\" @click=\"gowhere()\">ENJOY<span class=\"citynames\">{{proname}}</span><span><i class=\"iconfont\">&#xe643;</i> </span></div>\r\n\t\t<div class=\"moreInfo\">\r\n\t\t\t<i class=\"iconfont\" @click=\"goLogin\">登录\r\n\t\t\t<div class=\"denglu\" v-if=\"chu\">\r\n\t\t\t\t<ul>\r\n\t\t\t\t\t<li>我的订单</li>\r\n\t\t\t\t\t<li>我的礼券</li>\t\t\t\t\t\t\r\n\t\t\t\t\t<li class=\"out\" @click=\"goout\">登出</li>\t\t\t\t\t\t\r\n\t\t\t\t</ul>\r\n\t\t\t</div>\t\t\t\r\n\t\t\t</i>\r\n\t\t\t<i class=\"iconfont\" @click = \"gosearch()\">&#xe651;</i>\r\n\t\t</div>\r\n\t\t<div class=\"searchbox\" v-show = \"auto\">\r\n\t\t\t<input type=\"text\" name=\"search\" id=\"search\" value=\"\" placeholder=\"搜索本地精选/快递到家\" />\r\n\t\t\t<span @click = \"checksearch()\">搜索</span>\r\n\t\t</div>\r\n\t</div>\r\n</template>\r\n\r\n<script>\r\n\timport \"./../scss/main.scss\";\r\n\timport router from \"./../router/router.js\";\r\n\texport default {\r\n\t\tdata(){\r\n\t\t\treturn {\r\n\t\t\t\tproname:\"上海\",\r\n\t\t\t\tauto:false,\r\n\t\t\t\tkeyword:\"\",\r\n\t\t\t\tchu:false\t\t\t\t\r\n\t\t\t}\r\n\t\t},\r\n\t\tmethods:{\r\n\t\t\tgokind(){\r\n\t\t\t\trouter.push({path:\"prochoose\"})\r\n\t\t\t},\r\n\t\t\tgowhere(){\r\n\t\t\t\t$(\".city\").toggle(),\r\n\t\t\t\t$(\".homecon\").toggle()\r\n\t\t\t},\r\n\t\t\tgoLogin(event){\r\n\t\t\t\tvar that=this;\r\n\t\t\t\tvar aaa=localStorage.getItem(\"isLogin\")\r\n\t\t\t\t\r\n\t\t\t\tif(aaa==\"1\"){\r\n\t\t\t\tthat.chu=true;\r\n\t\t\t\t}else{\r\n\t\t\t\t\t\trouter.push({path:\"login\"})\r\n\t\t\t\t}\t\t\r\n\t\t\t},\r\n\t\t\tgoout(){\r\n\t\t\t\tvar that=this;\r\n\t\t\t\tlocalStorage.removeItem(\"isLogin\");\r\n\t\t\t\tlocalStorage.removeItem(\"userID\");\t\t\t\t\r\n\t\t\t},\t\t\t\r\n\t\t\tgosearch(){\r\n\t\t\t\tvar that = this;\r\n\t\t\t \tif(that.auto == false){\r\n\t\t\t \t\tthat.auto = true;\r\n\t\t\t \t}else{\r\n\t\t\t \t\tthat.auto = false;\r\n\t\t\t \t}\r\n\t\t\t},\r\n\t\t\tchecksearch(){\r\n\t\t\t\tvar that = this;\r\n\t\t\t\tthat.keyword = $(\"#search\").val();\r\n\t\t\t\tthat.$router.push({path:\"/search\",query:{keyword:that.keyword}});\r\n\t\t\t}\r\n\t\t}\r\n\t}\r\n</script>\r\n\t\r\n<style scoped>\r\n\t.commonHeader{\r\n\t\tposition: relative;\r\n\t}\r\n\t\r\n\t.back{\r\n\t\tfont-size: 14px;\r\n\t}\r\n\t.title{\r\n\t\tfont-size: 14px;\r\n\t}\r\n\t.title span:nth-of-type(1){\r\n\t\tfont-size: 8px;\r\n\t}\r\n\t.title i{\r\n\t\tfont-style: inherit;\r\n\t\t\r\n\t}\r\n\t.moreInfo .iconfont{\r\n\t\t\tdisplay: inline-block;\r\n\t\t\tfont-size: 14px;\r\n\t\t\twidth: 50px;\r\n\t\t\tfloat: left;\r\n\t\t\tfont-style: inherit;\r\n\t}\r\n\t.searchbox{\r\n\t\twidth: 100%;\r\n\t\theight: 45px;\r\n\t\tposition: fixed;\r\n\t\ttop: 40px;\r\n\t\tleft: 0;\r\n\t\tz-index: 100;\r\n\t}\r\n\t#search{\r\n\t\ttext-indent: 12px;\r\n\t\tdisplay: block;\r\n\t\theight: 25px;\r\n\t\twidth: 70%;\r\n\t\tmargin-left: 10%;\r\n\t\tfloat: left;\r\n\t\tfont-size: 12px;\r\n\t\tbackground-color: #eee;\r\n\t\tborder: none;\r\n\t\tmargin-top: 4%;\r\n\t\toutline: none;\r\n\t}\r\n\t.searchbox span{\r\n\t\twidth: 10%;\r\n\t\tdisplay: inline-block;\r\n\t\tfloat: left;\r\n\t\tcolor: #000000;\r\n\t\tfont-size: 12px;\r\n\t\tmargin-top: 5%;\r\n\t}\r\n\t.denglu{\r\n\t\twidth: 80px;\r\n\t\theight: 80px;\r\n\t\tfont-size: 14px;\r\n\t\tbackground:#fff;\r\n\t\tposition: absolute;\r\n\t\tz-index: 100;\r\n\t\tcolor: #666;\r\n\t\ttop: 45px;\r\n\t}\r\n\t.denglu li{\r\n\t\tline-height: 26px;\r\n\t\tborder-bottom: 1px solid #eee;\r\n\t}\r\n\t\r\n</style>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 64 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scss_main_scss__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scss_main_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__scss_main_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__router_router_js__ = __webpack_require__(3);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
	data() {
		return {
			proname: "上海",
			auto: false,
			keyword: "",
			chu: false
		};
	},
	methods: {
		gokind() {
			__WEBPACK_IMPORTED_MODULE_1__router_router_js__["a" /* default */].push({ path: "prochoose" });
		},
		gowhere() {
			$(".city").toggle(), $(".homecon").toggle();
		},
		goLogin(event) {
			var that = this;
			var aaa = localStorage.getItem("isLogin");

			if (aaa == "1") {
				that.chu = true;
			} else {
				__WEBPACK_IMPORTED_MODULE_1__router_router_js__["a" /* default */].push({ path: "login" });
			}
		},
		goout() {
			var that = this;
			localStorage.removeItem("isLogin");
			localStorage.removeItem("userID");
		},
		gosearch() {
			var that = this;
			if (that.auto == false) {
				that.auto = true;
			} else {
				that.auto = false;
			}
		},
		checksearch() {
			var that = this;
			that.keyword = $("#search").val();
			that.$router.push({ path: "/search", query: { keyword: that.keyword } });
		}
	}
});

/***/ }),
/* 65 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "commonHeader"
  }, [_c('div', {
    staticClass: "back",
    on: {
      "click": function($event) {
        _vm.gokind()
      }
    }
  }, [_vm._v("分类")]), _vm._v(" "), _c('div', {
    staticClass: "title",
    on: {
      "click": function($event) {
        _vm.gowhere()
      }
    }
  }, [_vm._v("ENJOY"), _c('span', {
    staticClass: "citynames"
  }, [_vm._v(_vm._s(_vm.proname))]), _vm._m(0)]), _vm._v(" "), _c('div', {
    staticClass: "moreInfo"
  }, [_c('i', {
    staticClass: "iconfont",
    on: {
      "click": _vm.goLogin
    }
  }, [_vm._v("登录\n\t\t"), (_vm.chu) ? _c('div', {
    staticClass: "denglu"
  }, [_c('ul', [_c('li', [_vm._v("我的订单")]), _vm._v(" "), _c('li', [_vm._v("我的礼券")]), _vm._v(" "), _c('li', {
    staticClass: "out",
    on: {
      "click": _vm.goout
    }
  }, [_vm._v("登出")])])]) : _vm._e()]), _vm._v(" "), _c('i', {
    staticClass: "iconfont",
    on: {
      "click": function($event) {
        _vm.gosearch()
      }
    }
  }, [_vm._v("")])]), _vm._v(" "), _c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.auto),
      expression: "auto"
    }],
    staticClass: "searchbox"
  }, [_c('input', {
    attrs: {
      "type": "text",
      "name": "search",
      "id": "search",
      "value": "",
      "placeholder": "搜索本地精选/快递到家"
    }
  }), _vm._v(" "), _c('span', {
    on: {
      "click": function($event) {
        _vm.checksearch()
      }
    }
  }, [_vm._v("搜索")])])])
}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('span', [_c('i', {
    staticClass: "iconfont"
  }, [_vm._v("")])])
}]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-0a68474c", esExports)
  }
}

/***/ }),
/* 66 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_KindHeader_vue__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_e887207e_hasScoped_false_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_KindHeader_vue__ = __webpack_require__(70);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(67)
}
var normalizeComponent = __webpack_require__(2)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_KindHeader_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_e887207e_hasScoped_false_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_KindHeader_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "com\\KindHeader.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] KindHeader.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-e887207e", Component.options)
  } else {
    hotAPI.reload("data-v-e887207e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(68);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("7a1efa24", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../node_modules/_css-loader@0.28.5@css-loader/index.js?sourceMap!../node_modules/_vue-loader@13.0.4@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-e887207e\",\"scoped\":false,\"hasInlineConfig\":false}!../node_modules/_vue-loader@13.0.4@vue-loader/lib/selector.js?type=styles&index=0!./KindHeader.vue", function() {
     var newContent = require("!!../node_modules/_css-loader@0.28.5@css-loader/index.js?sourceMap!../node_modules/_vue-loader@13.0.4@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-e887207e\",\"scoped\":false,\"hasInlineConfig\":false}!../node_modules/_vue-loader@13.0.4@vue-loader/lib/selector.js?type=styles&index=0!./KindHeader.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n.back{\n\tfont-size: 14px;\n}\n.title{\n\tfont-size: 14px;\n}\n.title span:nth-of-type(1){\n\tfont-size: 8px;\n}\n.title i{\n\tfont-style: inherit;\n}\n.moreInfo .iconfont{\n\t\tdisplay: inline-block;\n\t\tfont-size: 14px;\n\t\twidth: 50px;\n\t\tfloat: left;\n\t\tfont-style: inherit;\n}\n.searchbox{\n\twidth: 100%;\n\theight: 45px;\n\tposition: fixed;\n\ttop: 40px;\n\tleft: 0;\n\tz-index: 100;\n\tbackground: #fff;\n}\n#search{\n\ttext-indent: 12px;\n\tdisplay: block;\n\theight: 25px;\n\twidth: 70%;\n\tmargin-left: 10%;\n\tfloat: left;\n\tfont-size: 12px;\n\tbackground-color: #eee;\n\tborder: none;\n\tmargin-top: 4%;\n\toutline: none;\n}\n.searchbox span{\n\twidth: 10%;\n\tpadding-left: 4%;\n\tdisplay: inline-block;\n\tfloat: left;\n\tcolor: #000;\n\tfont-size: 12px;\n\tmargin-top: 6%;\n}\n", "", {"version":3,"sources":["G:/enjoy/com/com/KindHeader.vue?70b1e148"],"names":[],"mappings":";AA2DA;CACA,gBAAA;CACA;AACA;CACA,gBAAA;CACA;AACA;CACA,eAAA;CACA;AACA;CACA,oBAAA;CAEA;AACA;EACA,sBAAA;EACA,gBAAA;EACA,YAAA;EACA,YAAA;EACA,oBAAA;CACA;AACA;CACA,YAAA;CACA,aAAA;CACA,gBAAA;CACA,UAAA;CACA,QAAA;CACA,aAAA;CACA,iBAAA;CACA;AACA;CACA,kBAAA;CACA,eAAA;CACA,aAAA;CACA,WAAA;CACA,iBAAA;CACA,YAAA;CACA,gBAAA;CACA,uBAAA;CACA,aAAA;CACA,eAAA;CACA,cAAA;CACA;AACA;CACA,WAAA;CACA,iBAAA;CACA,sBAAA;CACA,YAAA;CACA,YAAA;CACA,gBAAA;CACA,eAAA;CACA","file":"KindHeader.vue","sourcesContent":["<template>\r\n\t<div class=\"commonHeader\">\r\n\t\t<div class=\"back\" @click=\"gohome()\">首页</div>\r\n\t\t<div class=\"title\">ENJOY<span class=\"citynames\">{{name}}</span><span><i class=\"iconfont\">&#xe643;</i> </span></div>\r\n\t\t<div class=\"moreInfo\">\r\n\t\t\t<i class=\"iconfont\" @click=\"goLogin\">登录</i>\r\n\t\t\t<i class=\"iconfont\" @click = \"gosearch()\">&#xe651;</i>\r\n\t\t</div>\r\n\t\t<div class=\"searchbox\" v-show = \"auto\">\r\n\t\t\t<input type=\"text\" name=\"search\" id=\"search\" value=\"\" placeholder=\"搜索本地精选/快递到家\" />\r\n\t\t\t<span @click = \"checksearch()\">搜索</span>\r\n\t\t</div>\r\n\t</div>\r\n</template>\r\n\r\n<script>\r\n\timport \"./../scss/main.scss\";\r\n\timport router from \"./../router/router.js\";\r\n\texport default {\r\n\t\tdata(){\r\n\t\t\treturn {\r\n\t\t\t\tid:\"\",\r\n\t\t\t\tname:\"\",\r\n\t\t\t\tauto:false,\r\n\t\t\t\tkeyword:\"\"\r\n\t\t\t}\r\n\t\t},\r\n\t\tmethods:{\r\n\t\t\tgohome(){\r\n\t\t\t\trouter.push({path:\"home\"})\r\n\t\t\t},\r\n\t\t\tgoLogin(){\r\n\t\t\t\trouter.push({path:\"login\"})\r\n\t\t\t},\r\n\t\t\tgosearch(){\r\n\t\t\t\tvar that = this;\r\n\t\t\t \tif(that.auto == false){\r\n\t\t\t \t\tthat.auto = true;\r\n\t\t\t \t}else{\r\n\t\t\t \t\tthat.auto = false;\r\n\t\t\t \t}\r\n\t\t\t},\r\n\t\t\tchecksearch(){\r\n\t\t\t\tvar that = this;\r\n\t\t\t\tthat.keyword = $(\"#search\").val();\r\n\t\t\t\tthat.$router.push({path:\"/search\",query:{keyword:that.keyword}});\r\n\t\t\t}\r\n\t\t},\r\n\t\tmounted(){\r\n\t\t\tvar that=this;\r\n\t\t\tvar id =localStorage.getItem(\"id\");\r\n\t\t\tvar name =localStorage.getItem(\"name1\");\r\n\t\t\tthat.id=id;\r\n\t\t\tthat.name=name;\r\n\t\t}\r\n\t}\r\n</script>\r\n\r\n<style>\r\n\t.back{\r\n\t\tfont-size: 14px;\r\n\t}\r\n\t.title{\r\n\t\tfont-size: 14px;\r\n\t}\r\n\t.title span:nth-of-type(1){\r\n\t\tfont-size: 8px;\r\n\t}\r\n\t.title i{\r\n\t\tfont-style: inherit;\r\n\t\t\r\n\t}\r\n\t.moreInfo .iconfont{\r\n\t\t\tdisplay: inline-block;\r\n\t\t\tfont-size: 14px;\r\n\t\t\twidth: 50px;\r\n\t\t\tfloat: left;\r\n\t\t\tfont-style: inherit;\r\n\t}\r\n\t.searchbox{\r\n\t\twidth: 100%;\r\n\t\theight: 45px;\r\n\t\tposition: fixed;\r\n\t\ttop: 40px;\r\n\t\tleft: 0;\r\n\t\tz-index: 100;\r\n\t\tbackground: #fff;\r\n\t}\r\n\t#search{\r\n\t\ttext-indent: 12px;\r\n\t\tdisplay: block;\r\n\t\theight: 25px;\r\n\t\twidth: 70%;\r\n\t\tmargin-left: 10%;\r\n\t\tfloat: left;\r\n\t\tfont-size: 12px;\r\n\t\tbackground-color: #eee;\r\n\t\tborder: none;\r\n\t\tmargin-top: 4%;\r\n\t\toutline: none;\r\n\t}\r\n\t.searchbox span{\r\n\t\twidth: 10%;\r\n\t\tpadding-left: 4%;\r\n\t\tdisplay: inline-block;\r\n\t\tfloat: left;\r\n\t\tcolor: #000;\r\n\t\tfont-size: 12px;\r\n\t\tmargin-top: 6%;\r\n\t}\r\n</style>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 69 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scss_main_scss__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scss_main_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__scss_main_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__router_router_js__ = __webpack_require__(3);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
	data() {
		return {
			id: "",
			name: "",
			auto: false,
			keyword: ""
		};
	},
	methods: {
		gohome() {
			__WEBPACK_IMPORTED_MODULE_1__router_router_js__["a" /* default */].push({ path: "home" });
		},
		goLogin() {
			__WEBPACK_IMPORTED_MODULE_1__router_router_js__["a" /* default */].push({ path: "login" });
		},
		gosearch() {
			var that = this;
			if (that.auto == false) {
				that.auto = true;
			} else {
				that.auto = false;
			}
		},
		checksearch() {
			var that = this;
			that.keyword = $("#search").val();
			that.$router.push({ path: "/search", query: { keyword: that.keyword } });
		}
	},
	mounted() {
		var that = this;
		var id = localStorage.getItem("id");
		var name = localStorage.getItem("name1");
		that.id = id;
		that.name = name;
	}
});

/***/ }),
/* 70 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "commonHeader"
  }, [_c('div', {
    staticClass: "back",
    on: {
      "click": function($event) {
        _vm.gohome()
      }
    }
  }, [_vm._v("首页")]), _vm._v(" "), _c('div', {
    staticClass: "title"
  }, [_vm._v("ENJOY"), _c('span', {
    staticClass: "citynames"
  }, [_vm._v(_vm._s(_vm.name))]), _vm._m(0)]), _vm._v(" "), _c('div', {
    staticClass: "moreInfo"
  }, [_c('i', {
    staticClass: "iconfont",
    on: {
      "click": _vm.goLogin
    }
  }, [_vm._v("登录")]), _vm._v(" "), _c('i', {
    staticClass: "iconfont",
    on: {
      "click": function($event) {
        _vm.gosearch()
      }
    }
  }, [_vm._v("")])]), _vm._v(" "), _c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.auto),
      expression: "auto"
    }],
    staticClass: "searchbox"
  }, [_c('input', {
    attrs: {
      "type": "text",
      "name": "search",
      "id": "search",
      "value": "",
      "placeholder": "搜索本地精选/快递到家"
    }
  }), _vm._v(" "), _c('span', {
    on: {
      "click": function($event) {
        _vm.checksearch()
      }
    }
  }, [_vm._v("搜索")])])])
}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('span', [_c('i', {
    staticClass: "iconfont"
  }, [_vm._v("")])])
}]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-e887207e", esExports)
  }
}

/***/ }),
/* 71 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_UserHeader_vue__ = __webpack_require__(74);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_e270f190_hasScoped_true_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_UserHeader_vue__ = __webpack_require__(75);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(72)
}
var normalizeComponent = __webpack_require__(2)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-e270f190"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_UserHeader_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_e270f190_hasScoped_true_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_UserHeader_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "com\\UserHeader.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] UserHeader.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-e270f190", Component.options)
  } else {
    hotAPI.reload("data-v-e270f190", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(73);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("ade429a0", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../node_modules/_css-loader@0.28.5@css-loader/index.js?sourceMap!../node_modules/_vue-loader@13.0.4@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-e270f190\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/_vue-loader@13.0.4@vue-loader/lib/selector.js?type=styles&index=0!./UserHeader.vue", function() {
     var newContent = require("!!../node_modules/_css-loader@0.28.5@css-loader/index.js?sourceMap!../node_modules/_vue-loader@13.0.4@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-e270f190\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/_vue-loader@13.0.4@vue-loader/lib/selector.js?type=styles&index=0!./UserHeader.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\ndiv[data-v-e270f190]{\n\ttext-align: center;\n\tline-height: 44px;\n}\n", "", {"version":3,"sources":["G:/enjoy/com/com/UserHeader.vue?6aa6511d"],"names":[],"mappings":";AAeA;CACA,mBAAA;CACA,kBAAA;CACA","file":"UserHeader.vue","sourcesContent":["<template>\r\n\t<div>ENJOY</div>\r\n</template>\r\n\r\n<script>\r\n\texport default {\r\n\t\tdata(){\r\n\t\t\treturn {\r\n\t\t\t\t\r\n\t\t\t}\r\n\t\t}\r\n\t}\r\n</script>\r\n\r\n<style scoped>\r\n\tdiv{\r\n\t\ttext-align: center;\r\n\t\tline-height: 44px;\r\n\t}\r\n</style>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 74 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
	data() {
		return {};
	}
});

/***/ }),
/* 75 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_vm._v("ENJOY")])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-e270f190", esExports)
  }
}

/***/ }),
/* 76 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_MoreHeader_vue__ = __webpack_require__(79);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_cb951b7c_hasScoped_true_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_MoreHeader_vue__ = __webpack_require__(80);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(77)
}
var normalizeComponent = __webpack_require__(2)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-cb951b7c"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_MoreHeader_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_cb951b7c_hasScoped_true_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_MoreHeader_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "com\\MoreHeader.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] MoreHeader.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-cb951b7c", Component.options)
  } else {
    hotAPI.reload("data-v-cb951b7c", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(78);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("0f78e5f6", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../node_modules/_css-loader@0.28.5@css-loader/index.js?sourceMap!../node_modules/_vue-loader@13.0.4@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-cb951b7c\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/_vue-loader@13.0.4@vue-loader/lib/selector.js?type=styles&index=0!./MoreHeader.vue", function() {
     var newContent = require("!!../node_modules/_css-loader@0.28.5@css-loader/index.js?sourceMap!../node_modules/_vue-loader@13.0.4@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-cb951b7c\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/_vue-loader@13.0.4@vue-loader/lib/selector.js?type=styles&index=0!./MoreHeader.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\ndiv[data-v-cb951b7c]{\n\ttext-align: center;\n\tline-height: 44px;\n}\n", "", {"version":3,"sources":["G:/enjoy/com/com/MoreHeader.vue?39f5025e"],"names":[],"mappings":";AAeA;CACA,mBAAA;CACA,kBAAA;CACA","file":"MoreHeader.vue","sourcesContent":["<template>\r\n\t<div>我的中心</div>\r\n</template>\r\n\r\n<script>\r\n\texport default {\r\n\t\tdata(){\r\n\t\t\treturn {\r\n\t\t\t\t\r\n\t\t\t}\r\n\t\t}\r\n\t}\r\n</script>\r\n\r\n<style scoped>\r\n\tdiv{\r\n\t\ttext-align: center;\r\n\t\tline-height: 44px;\r\n\t}\r\n</style>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 79 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
	data() {
		return {};
	}
});

/***/ }),
/* 80 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_vm._v("我的中心")])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-cb951b7c", esExports)
  }
}

/***/ }),
/* 81 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_MapChoose_vue__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_06c09c43_hasScoped_true_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_MapChoose_vue__ = __webpack_require__(85);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(82)
}
var normalizeComponent = __webpack_require__(2)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-06c09c43"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_MapChoose_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_06c09c43_hasScoped_true_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_MapChoose_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "com\\MapChoose.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] MapChoose.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-06c09c43", Component.options)
  } else {
    hotAPI.reload("data-v-06c09c43", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(83);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("4eb81ccd", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../node_modules/_css-loader@0.28.5@css-loader/index.js?sourceMap!../node_modules/_vue-loader@13.0.4@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-06c09c43\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/_vue-loader@13.0.4@vue-loader/lib/selector.js?type=styles&index=0!./MapChoose.vue", function() {
     var newContent = require("!!../node_modules/_css-loader@0.28.5@css-loader/index.js?sourceMap!../node_modules/_vue-loader@13.0.4@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-06c09c43\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/_vue-loader@13.0.4@vue-loader/lib/selector.js?type=styles&index=0!./MapChoose.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n.homecontent[data-v-06c09c43]{\n\twidth: 100%;\n\theight: 100%;\n\toverflow-y: auto;\n}\n.homecontent[data-v-06c09c43]::-webkit-scrollbar {display: none;\n}\n.chosul[data-v-06c09c43]{\n\twidth: 100%;\n}\n.chostitle[data-v-06c09c43]{\n\twidth: 95%;\n\tpadding-left: 5%;\n\theight: 30px;\n\tline-height: 30px;\n\tfont-size: 14px;\n\tbackground-color: #ccc;\n\tclear: both;\n}\n.chosul li[data-v-06c09c43] {\n\tfont-size: 12px;\n\tbox-sizing: border-box;\n\ttext-align: center;\n\theight: 40px;\n\tline-height: 40px;\n\tfloat: left;\n\twidth: 33.3%;\n\tborder-right:1px solid #ccc;\n\tborder-bottom: 1px solid #ccc;\n}\n\n", "", {"version":3,"sources":["G:/enjoy/com/com/MapChoose.vue?a7fc8adc"],"names":[],"mappings":";AA+FA;CACA,YAAA;CACA,aAAA;CACA,iBAAA;CACA;AACA,kDAAA,cAAA;CAAA;AACA;CACA,YAAA;CAEA;AACA;CACA,WAAA;CACA,iBAAA;CACA,aAAA;CACA,kBAAA;CACA,gBAAA;CACA,uBAAA;CACA,YAAA;CACA;AACA;CACA,gBAAA;CACA,uBAAA;CACA,mBAAA;CACA,aAAA;CACA,kBAAA;CACA,YAAA;CACA,aAAA;CACA,4BAAA;CACA,8BAAA;CACA","file":"MapChoose.vue","sourcesContent":["<template>\r\n\t<div class=\"homecontent\">\r\n\t\t<ul class=\"chosul\" >\r\n\t\t\t<div class=\"chostitle\">{{map1[0].name}}</div>\r\n\t\t\t<li v-for = \"item in list1\" @click=\"goMapDtail1(item.enjoy_url)\">{{item.name}}</li>\r\n\t\t</ul>\r\n\t\t<ul class=\"chosul\" >\r\n\t\t\t<div class=\"chostitle\">{{map1[1].name}}</div>\r\n\t\t\t<li v-for = \"item in list2\" @click=\"goMapDtail2(item.enjoy_url)\">{{item.name}}</li>\r\n\t\t</ul>\r\n\t\t<ul class=\"chosul\" >\r\n\t\t\t<div class=\"chostitle\">{{map1[2].name}}</div>\r\n\t\t\t<li v-for = \"item in list3\" @click=\"goMapDtail3(item.enjoy_url)\">{{item.name}}</li>\r\n\t\t</ul>\r\n\t\t<ul class=\"chosul\" >\r\n\t\t\t<div class=\"chostitle\">{{map1[3].name}}</div>\r\n\t\t\t<li v-for = \"item in list4\" @click=\"goMapDtail4(item.enjoy_url)\">{{item.name}}</li>\r\n\t\t</ul>\r\n\t</div>\r\n</template>\r\n\r\n<script>\r\n\timport \"./../scss/main.scss\";\r\n\timport router from \"./../router/router.js\";\r\n\timport MyAjax from \"./../md/MyAjax.js\";\t\r\n\texport default{\r\n\t\tdata(){\r\n\t\t\treturn{\r\n\t\t\t\tmap1:[],\r\n\t\t\t\tmapList:[],\r\n\t\t\t\tlist:[],\r\n\t\t\t\tlist1:[],\r\n\t\t\t\tlist2:[],\r\n\t\t\t\tlist3:[],\r\n\t\t\t\tlist4:[],\r\n\t\t\t\tcategory:'',\r\n\t\t\t\tdetail1:[]\r\n\t\t\t}\r\n\t\t},\r\n\t\t\r\n\t\tmounted(){\r\n\t\t\t\tvar that = this;\r\n\t\t\t\tvar url = \"https://s1.ricebook.com/cdn/home/djEvdmlydHVhbC9pbl9jYXRlZ29yeS5qc29uP2NpdHlfaWQ9MTA0JmlzX25ld19sb2NhbD1mYWxzZSZtZDU9NmNkMzg2ZWZmY2Y0NjVjYmRiNWY1ZGQzZDQxZTc1NjcmMjAxNzA4MTkyMTAw.json\";\r\n\t\t\t\tMyAjax.vueJson(url,function(data){\r\n\t\t\r\n\t\t\t\t\tthat.map1 = data;\r\n\t\t\t\t\tvar list=[];\r\n\t\t\t\t\tvar detail=[];\r\n\t\t\t\t\tvar detail1=[];\r\n\t\t\t\t\tvar detail2=[];\r\n\t\t\t\t\tvar detail3=[];\r\n\t\t\t\t\tvar detail4=[];\r\n\t\t\t\t\tvar arr1=[];\r\n\t\t\t\t\tvar arr2=[];\r\n\t\t\t\t\tvar arr3=[];\r\n\t\t\t\t\tvar arr4=[];\t\t\t\t\t\r\n\t\t\t\t\tfor(var i in data){\r\n\t\t\t\t\t\t list.push(data[i].sub_category_list);\t\t\t\t\t\t \r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t\tthat.list1 = list[0],\r\n\t\t\t\t\tthat.list2 = list[1],\r\n\t\t\t\t\tthat.list3 = list[2],\r\n\t\t\t\t\tthat.list4 = list[3]\t\t\t\r\n\t\t\t\t},function(err){\r\n\t\t\t\t\tconsole.log(err)\r\n\t\t\t\t})\t\t\t\t\t\t\t\t\r\n\t\t\t},\r\n\t\t\tmethods:{\r\n\t\t\tgoMapDtail1(data){\r\n\t\t\t\tvar that = this;\r\n\t\t\t\tthat.category = data.split(\"&\",1).toString().slice(40);\r\n\t\t\t\tthat.$router.push({path:\"/mapdetail\",query:{categoryID:that.category}})\r\n\t\t\t\tlocalStorage.setItem(\"categoryID\",that.category);\r\n\t\t\t},\r\n\t\t\tgoMapDtail2(data){\r\n\t\t\t\tvar that = this;\r\n\t\t\t\tthat.category = data.split(\"&\",1).toString().slice(40);\r\n\t\t\t\tlocalStorage.setItem(\"categoryID\",that.category);\r\n\t\t\t},\r\n\t\t\tgoMapDtail3(data){\r\n\t\t\t\tvar that = this;\r\n\t\t\t\tthat.category = data.split(\"&\",1).toString().slice(40);\r\n\t\t\t\tlocalStorage.setItem(\"categoryID\",that.category);\r\n\t\t\t},\r\n\t\t\tgoMapDtail4(data){\r\n\t\t\t\tvar that = this;\r\n\t\t\t\tthat.category = data.split(\"&\",1).toString().slice(40);\r\n\t\t\t\tlocalStorage.setItem(\"categoryID\",that.category);\r\n\t\t\t}\r\n\t\t}\r\n\t}\r\n</script>\r\n\r\n<style scoped>\r\n\t.homecontent{\r\n\t\twidth: 100%;\r\n\t\theight: 100%;\r\n\t\toverflow-y: auto;\r\n\t}\r\n\t.homecontent::-webkit-scrollbar {display: none;}\r\n\t.chosul{\r\n\t\twidth: 100%;\r\n\t\t\r\n\t}\r\n\t.chostitle{\r\n\t\twidth: 95%;\r\n\t\tpadding-left: 5%;\r\n\t\theight: 30px;\r\n\t\tline-height: 30px;\r\n\t\tfont-size: 14px;\r\n\t\tbackground-color: #ccc;\r\n\t\tclear: both;\r\n\t}\r\n\t.chosul li {\r\n\t\tfont-size: 12px;\r\n\t\tbox-sizing: border-box;\r\n\t\ttext-align: center;\r\n\t\theight: 40px;\r\n\t\tline-height: 40px;\r\n\t\tfloat: left;\r\n\t\twidth: 33.3%;\r\n\t\tborder-right:1px solid #ccc;\r\n\t\tborder-bottom: 1px solid #ccc;\r\n\t}\r\n\t\r\n</style>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 84 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scss_main_scss__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scss_main_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__scss_main_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__router_router_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__md_MyAjax_js__ = __webpack_require__(5);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
	data() {
		return {
			map1: [],
			mapList: [],
			list: [],
			list1: [],
			list2: [],
			list3: [],
			list4: [],
			category: '',
			detail1: []
		};
	},

	mounted() {
		var that = this;
		var url = "https://s1.ricebook.com/cdn/home/djEvdmlydHVhbC9pbl9jYXRlZ29yeS5qc29uP2NpdHlfaWQ9MTA0JmlzX25ld19sb2NhbD1mYWxzZSZtZDU9NmNkMzg2ZWZmY2Y0NjVjYmRiNWY1ZGQzZDQxZTc1NjcmMjAxNzA4MTkyMTAw.json";
		__WEBPACK_IMPORTED_MODULE_2__md_MyAjax_js__["a" /* default */].vueJson(url, function (data) {

			that.map1 = data;
			var list = [];
			var detail = [];
			var detail1 = [];
			var detail2 = [];
			var detail3 = [];
			var detail4 = [];
			var arr1 = [];
			var arr2 = [];
			var arr3 = [];
			var arr4 = [];
			for (var i in data) {
				list.push(data[i].sub_category_list);
			}

			that.list1 = list[0], that.list2 = list[1], that.list3 = list[2], that.list4 = list[3];
		}, function (err) {
			console.log(err);
		});
	},
	methods: {
		goMapDtail1(data) {
			var that = this;
			that.category = data.split("&", 1).toString().slice(40);
			that.$router.push({ path: "/mapdetail", query: { categoryID: that.category } });
			localStorage.setItem("categoryID", that.category);
		},
		goMapDtail2(data) {
			var that = this;
			that.category = data.split("&", 1).toString().slice(40);
			localStorage.setItem("categoryID", that.category);
		},
		goMapDtail3(data) {
			var that = this;
			that.category = data.split("&", 1).toString().slice(40);
			localStorage.setItem("categoryID", that.category);
		},
		goMapDtail4(data) {
			var that = this;
			that.category = data.split("&", 1).toString().slice(40);
			localStorage.setItem("categoryID", that.category);
		}
	}
});

/***/ }),
/* 85 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "homecontent"
  }, [_c('ul', {
    staticClass: "chosul"
  }, [_c('div', {
    staticClass: "chostitle"
  }, [_vm._v(_vm._s(_vm.map1[0].name))]), _vm._v(" "), _vm._l((_vm.list1), function(item) {
    return _c('li', {
      on: {
        "click": function($event) {
          _vm.goMapDtail1(item.enjoy_url)
        }
      }
    }, [_vm._v(_vm._s(item.name))])
  })], 2), _vm._v(" "), _c('ul', {
    staticClass: "chosul"
  }, [_c('div', {
    staticClass: "chostitle"
  }, [_vm._v(_vm._s(_vm.map1[1].name))]), _vm._v(" "), _vm._l((_vm.list2), function(item) {
    return _c('li', {
      on: {
        "click": function($event) {
          _vm.goMapDtail2(item.enjoy_url)
        }
      }
    }, [_vm._v(_vm._s(item.name))])
  })], 2), _vm._v(" "), _c('ul', {
    staticClass: "chosul"
  }, [_c('div', {
    staticClass: "chostitle"
  }, [_vm._v(_vm._s(_vm.map1[2].name))]), _vm._v(" "), _vm._l((_vm.list3), function(item) {
    return _c('li', {
      on: {
        "click": function($event) {
          _vm.goMapDtail3(item.enjoy_url)
        }
      }
    }, [_vm._v(_vm._s(item.name))])
  })], 2), _vm._v(" "), _c('ul', {
    staticClass: "chosul"
  }, [_c('div', {
    staticClass: "chostitle"
  }, [_vm._v(_vm._s(_vm.map1[3].name))]), _vm._v(" "), _vm._l((_vm.list4), function(item) {
    return _c('li', {
      on: {
        "click": function($event) {
          _vm.goMapDtail4(item.enjoy_url)
        }
      }
    }, [_vm._v(_vm._s(item.name))])
  })], 2)])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-06c09c43", esExports)
  }
}

/***/ }),
/* 86 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_BuyHeader_vue__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_cb6a6b3a_hasScoped_true_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_BuyHeader_vue__ = __webpack_require__(90);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(87)
}
var normalizeComponent = __webpack_require__(2)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-cb6a6b3a"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_BuyHeader_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_cb6a6b3a_hasScoped_true_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_BuyHeader_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "com\\BuyHeader.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] BuyHeader.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-cb6a6b3a", Component.options)
  } else {
    hotAPI.reload("data-v-cb6a6b3a", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(88);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("e77b6596", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../node_modules/_css-loader@0.28.5@css-loader/index.js?sourceMap!../node_modules/_vue-loader@13.0.4@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-cb6a6b3a\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/_vue-loader@13.0.4@vue-loader/lib/selector.js?type=styles&index=0!./BuyHeader.vue", function() {
     var newContent = require("!!../node_modules/_css-loader@0.28.5@css-loader/index.js?sourceMap!../node_modules/_vue-loader@13.0.4@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-cb6a6b3a\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/_vue-loader@13.0.4@vue-loader/lib/selector.js?type=styles&index=0!./BuyHeader.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\ndiv[data-v-cb6a6b3a]{\n\ttext-align: center;\n\tline-height: 44px;\n}\n", "", {"version":3,"sources":["G:/enjoy/com/com/BuyHeader.vue?1880f5e0"],"names":[],"mappings":";AAeA;CACA,mBAAA;CACA,kBAAA;CACA","file":"BuyHeader.vue","sourcesContent":["<template>\r\n\t<div>订单中心</div>\r\n</template>\r\n\r\n<script>\r\n\texport default {\r\n\t\tdata(){\r\n\t\t\treturn {\r\n\t\t\t\t\r\n\t\t\t}\r\n\t\t}\r\n\t}\r\n</script>\r\n\r\n<style scoped>\r\n\tdiv{\r\n\t\ttext-align: center;\r\n\t\tline-height: 44px;\r\n\t}\r\n</style>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 89 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
	data() {
		return {};
	}
});

/***/ }),
/* 90 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_vm._v("订单中心")])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-cb6a6b3a", esExports)
  }
}

/***/ }),
/* 91 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_Login_vue__ = __webpack_require__(94);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_7de2aa19_hasScoped_true_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_Login_vue__ = __webpack_require__(96);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(92)
}
var normalizeComponent = __webpack_require__(2)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-7de2aa19"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_Login_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_7de2aa19_hasScoped_true_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_Login_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "com\\Login.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] Login.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7de2aa19", Component.options)
  } else {
    hotAPI.reload("data-v-7de2aa19", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(93);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("6a4b2286", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../node_modules/_css-loader@0.28.5@css-loader/index.js?sourceMap!../node_modules/_vue-loader@13.0.4@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7de2aa19\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/_vue-loader@13.0.4@vue-loader/lib/selector.js?type=styles&index=0!./Login.vue", function() {
     var newContent = require("!!../node_modules/_css-loader@0.28.5@css-loader/index.js?sourceMap!../node_modules/_vue-loader@13.0.4@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7de2aa19\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/_vue-loader@13.0.4@vue-loader/lib/selector.js?type=styles&index=0!./Login.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n.tip[data-v-7de2aa19]{         \n         background:rgba(0,0,0,0.4);\n         display: none;\n         height:40px;\n         text-align: center;\n         line-height: 40px;\n         color: #fff;\n         position: absolute;\n         padding: 7px;\n         top:400px;\n}\n.logincontainer[data-v-7de2aa19]{\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t\tjustify-content: center;\n\t\talign-items: center;\n\t\tpadding:20px;\n}\nimg[data-v-7de2aa19]{\n\t\twidth:45%;\n\t\tmargin-top:30px;\n}\nform[data-v-7de2aa19]{\n\t\twidth:100%;\n\t\tmargin-top:50px;\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t\tjustify-content: center;\n}\ninput[data-v-7de2aa19]{\n\t\twidth:100%;\n\t\tmargin:10px 0;\n\t\theight:40px;\n\t\tpadding:10px;\n\t\tbox-sizing: border-box;\n\t\tborder-radius: 5px;\n\t\tborder: 1px solid #666;\n\t\toutline:none;\n\t\tborder-color:darkgray;\n}\n.yanzheng input[data-v-7de2aa19]{\n\t\twidth:50%\n}\n.yanzhengbtn[data-v-7de2aa19]{\n\t\tpadding:10px 20px;\n\t\tfloat:right;\n\t\twidth:122px;\n\t\theight:43px;\n\t\tmargin:10px 0;\n\t\tborder:1px solid darkgray;\n\t\tcolor:darkgray;\n\t\tbackground: #fff;\n\t\tbox-sizing: border-box;\n}\n.btn[data-v-7de2aa19]{\n\t\twidth:100%;\n\t\tdisplay: block;\n\t\theight:50px;\n\t\tbackground: #000;\n\t\tcolor:#fff;\n\t\tborder:0;\n\t\tmargin:10px 0;\n}\n.bottom[data-v-7de2aa19]{\n\t\tmargin-top:100px;\n\t\ttext-align: center;\n\t\tfont-size: 12px;\n\t\tcolor:darkgray\n}\n.bottom p[data-v-7de2aa19]{\n\t\tmargin:5px 0;\n}\n.bottom a[data-v-7de2aa19]{\n\t\ttext-decoration: underline;\n}\n", "", {"version":3,"sources":["G:/enjoy/com/com/Login.vue?1c50fde8"],"names":[],"mappings":";AA2EA;SACA,2BAAA;SACA,cAAA;SACA,YAAA;SACA,mBAAA;SACA,kBAAA;SACA,YAAA;SACA,mBAAA;SACA,aAAA;SACA,UAAA;CACA;AACA;EACA,cAAA;EACA,uBAAA;EACA,wBAAA;EACA,oBAAA;EACA,aAAA;CACA;AACA;EACA,UAAA;EACA,gBAAA;CACA;AACA;EACA,WAAA;EACA,gBAAA;EACA,cAAA;EACA,uBAAA;EACA,wBAAA;CACA;AACA;EACA,WAAA;EACA,cAAA;EACA,YAAA;EACA,aAAA;EACA,uBAAA;EACA,mBAAA;EACA,uBAAA;EACA,aAAA;EACA,sBAAA;CACA;AACA;EACA,SAAA;CACA;AACA;EACA,kBAAA;EACA,YAAA;EACA,YAAA;EACA,YAAA;EACA,cAAA;EACA,0BAAA;EACA,eAAA;EACA,iBAAA;EACA,uBAAA;CACA;AACA;EACA,WAAA;EACA,eAAA;EACA,YAAA;EACA,iBAAA;EACA,WAAA;EACA,SAAA;EACA,cAAA;CACA;AACA;EACA,iBAAA;EACA,mBAAA;EACA,gBAAA;EACA,cAAA;CACA;AACA;EACA,aAAA;CACA;AACA;EACA,2BAAA;CACA","file":"Login.vue","sourcesContent":["<template>\r\n\t<div class = 'logincontainer'>\r\n\t\t<img src = '../img/logo.png'  />\r\n\t\t<form>\r\n\t\t\t<input type = 'text' ref = 'phone' placeholder=\"手机号\" />\r\n\t\t\t<div class = 'yanzheng' >\r\n\t\t\t\t<input type = 'text' ref = 'ipt'  placeholder=\"短信验证码\"/>\t\r\n\t\t\t\t<button :flag = 'flag ? false : true' @click = \"inte()\" class = 'yanzhengbtn' ref  = 'yanzheng'>获取验证码</button>\r\n\t\t\t</div>\r\n\t\t\t<button @click=\"click()\" class = 'btn'>登录</button>\r\n\t\t</form>\r\n\t\t<div class = 'tip'>\r\n\t\t\t\r\n\t\t</div>\r\n\t\t<div class = 'bottom'>\r\n\t\t\t<p>未注册的用户登录后自动创建账户</p>\r\n\t\t\t<p>登录即表示您同意<a href = 'https://topic.ricebook.com/topicpage/agreement.html'>用户协议</a></p>\r\n\t\t</div>\r\n\t\t\r\n\t</div>\r\n</template>\r\n\r\n<script>\r\n\timport Toast from './../md/Toast.js';\r\n\texport default{\r\n\t\tdata(){\r\n\t\t\treturn{\r\n\t\t\t\tflag : true\r\n\t\t\t}\r\n\t\t},\r\n\t\tmethods:{\r\n\t\t\tinte(){\r\n\t\t\t\tvar that = this;\r\n\t\t\t\tvar num = 60;\r\n\t\t\t\tif($(that.$refs.phone).val() == ''){\r\n\t\t\t\t\talert(\"请输入手机号\");\r\n\t\t\t\t}\r\n\t\t\t\tif(that.flag == true && $(that.$refs.phone).val() !== ''){\r\n\t\t\t\t\tsetTimeout(function(){\r\n\t\t\t\t\t\t$(that.$refs.ipt).val(Math.floor(Math.random()*9000)+1000)\r\n\t\t\t\t\t},Math.random()*10000)\r\n\t\t\t\t\tvar timer = setInterval(function(){\r\n\t\t\t\t\t\tnum -- ;\r\n\t\t\t\t\t\t$(that.$refs.yanzheng).html(num);\r\n\t\t\t\t\t\tif(num == 0){\r\n\t\t\t\t\t\t\t$(that.$refs.yanzheng).html('超时');\r\n\t\t\t\t\t\t\tclearInterval(timer);\r\n\t\t\t\t\t\t};\r\n\t\t\t\t\t\tconsole.log()\r\n\t\t\t\t\t\tif($(that.$refs.ipt).val() !== ''){\r\n\t\t\t\t\t\t\t$(that.$refs.yanzheng).html('已获取');\r\n\t\t\t\t\t\t\tclearInterval(timer);\r\n\t\t\t\t\t\t}\r\n\t\t\t\t\t},1000)\r\n\t\t\t\t\tthat.flag = false;\r\n\t\t\t\t}\r\n\t\t\t},\r\n\t\t\tclick(){\r\n\t\t\t\tvar that = this;\r\n\t\t\t\tvar res = /^[0-9]*$/\r\n\t\t\t\tif(!res.test($(that.$refs.phone).val())){\r\n\t\t\t\t\talert(\"请输入正确格式\");\r\n\t\t\t\t}else if($(that.$refs.phone).val() == '' || $(that.$refs.ipt).val() == ''){\r\n\t\t\t\t\talert(\"请填写完整内容\");\r\n\t\t\t\t}else{\r\n\t\t\t\t\tlocalStorage.setItem('isLogin',1);\r\n\t\t\t\t\tlocalStorage.setItem('userID',$(that.$refs.phone).val());\r\n\t\t\t\t\tthat.$router.push('/more');\r\n\t\t\t\t}\r\n\t\t\t}\r\n\t\t}\r\n\t}\r\n</script>\r\n\r\n<style scoped>\r\n\t.tip{         \r\n         background:rgba(0,0,0,0.4);\r\n         display: none;\r\n         height:40px;\r\n         text-align: center;\r\n         line-height: 40px;\r\n         color: #fff;\r\n         position: absolute;\r\n         padding: 7px;\r\n         top:400px;\r\n     }\r\n\t.logincontainer{\r\n\t\tdisplay: flex;\r\n\t\tflex-direction: column;\r\n\t\tjustify-content: center;\r\n\t\talign-items: center;\r\n\t\tpadding:20px;\r\n\t}\r\n\timg{\r\n\t\twidth:45%;\r\n\t\tmargin-top:30px;\r\n\t}\r\n\tform{\r\n\t\twidth:100%;\r\n\t\tmargin-top:50px;\r\n\t\tdisplay: flex;\r\n\t\tflex-direction: column;\r\n\t\tjustify-content: center;\r\n\t}\r\n\tinput{\r\n\t\twidth:100%;\r\n\t\tmargin:10px 0;\r\n\t\theight:40px;\r\n\t\tpadding:10px;\r\n\t\tbox-sizing: border-box;\r\n\t\tborder-radius: 5px;\r\n\t\tborder: 1px solid #666;\r\n\t\toutline:none;\r\n\t\tborder-color:darkgray;\r\n\t}\r\n\t.yanzheng input{\r\n\t\twidth:50%\r\n\t}\r\n\t.yanzhengbtn{\r\n\t\tpadding:10px 20px;\r\n\t\tfloat:right;\r\n\t\twidth:122px;\r\n\t\theight:43px;\r\n\t\tmargin:10px 0;\r\n\t\tborder:1px solid darkgray;\r\n\t\tcolor:darkgray;\r\n\t\tbackground: #fff;\r\n\t\tbox-sizing: border-box;\r\n\t}\r\n\t.btn{\r\n\t\twidth:100%;\r\n\t\tdisplay: block;\r\n\t\theight:50px;\r\n\t\tbackground: #000;\r\n\t\tcolor:#fff;\r\n\t\tborder:0;\r\n\t\tmargin:10px 0;\r\n\t}\r\n\t.bottom{\r\n\t\tmargin-top:100px;\r\n\t\ttext-align: center;\r\n\t\tfont-size: 12px;\r\n\t\tcolor:darkgray\r\n\t}\r\n\t.bottom p{\r\n\t\tmargin:5px 0;\r\n\t}\r\n\t.bottom a{\r\n\t\ttext-decoration: underline;\r\n\t}\r\n</style>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 94 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__md_Toast_js__ = __webpack_require__(95);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["a"] = ({
	data() {
		return {
			flag: true
		};
	},
	methods: {
		inte() {
			var that = this;
			var num = 60;
			if ($(that.$refs.phone).val() == '') {
				alert("请输入手机号");
			}
			if (that.flag == true && $(that.$refs.phone).val() !== '') {
				setTimeout(function () {
					$(that.$refs.ipt).val(Math.floor(Math.random() * 9000) + 1000);
				}, Math.random() * 10000);
				var timer = setInterval(function () {
					num--;
					$(that.$refs.yanzheng).html(num);
					if (num == 0) {
						$(that.$refs.yanzheng).html('超时');
						clearInterval(timer);
					};
					console.log();
					if ($(that.$refs.ipt).val() !== '') {
						$(that.$refs.yanzheng).html('已获取');
						clearInterval(timer);
					}
				}, 1000);
				that.flag = false;
			}
		},
		click() {
			var that = this;
			var res = /^[0-9]*$/;
			if (!res.test($(that.$refs.phone).val())) {
				alert("请输入正确格式");
			} else if ($(that.$refs.phone).val() == '' || $(that.$refs.ipt).val() == '') {
				alert("请填写完整内容");
			} else {
				localStorage.setItem('isLogin', 1);
				localStorage.setItem('userID', $(that.$refs.phone).val());
				that.$router.push('/more');
			}
		}
	}
});

/***/ }),
/* 95 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/* unused harmony default export */ var _unused_webpack_default_export = ({
	makeText(str, time) {
		$("#toast").show();
		$("#toast").html(str);

		setTimeout(function () {
			$("#toast").hide();
		}, time);
	}
});

/***/ }),
/* 96 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "logincontainer"
  }, [_c('img', {
    attrs: {
      "src": __webpack_require__(97)
    }
  }), _vm._v(" "), _c('form', [_c('input', {
    ref: "phone",
    attrs: {
      "type": "text",
      "placeholder": "手机号"
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "yanzheng"
  }, [_c('input', {
    ref: "ipt",
    attrs: {
      "type": "text",
      "placeholder": "短信验证码"
    }
  }), _vm._v(" "), _c('button', {
    ref: "yanzheng",
    staticClass: "yanzhengbtn",
    attrs: {
      "flag": _vm.flag ? false : true
    },
    on: {
      "click": function($event) {
        _vm.inte()
      }
    }
  }, [_vm._v("获取验证码")])]), _vm._v(" "), _c('button', {
    staticClass: "btn",
    on: {
      "click": function($event) {
        _vm.click()
      }
    }
  }, [_vm._v("登录")])]), _vm._v(" "), _c('div', {
    staticClass: "tip"
  }), _vm._v(" "), _vm._m(0)])
}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "bottom"
  }, [_c('p', [_vm._v("未注册的用户登录后自动创建账户")]), _vm._v(" "), _c('p', [_vm._v("登录即表示您同意"), _c('a', {
    attrs: {
      "href": "https://topic.ricebook.com/topicpage/agreement.html"
    }
  }, [_vm._v("用户协议")])])])
}]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-7de2aa19", esExports)
  }
}

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "af09dff1bf0800d2a06fd3c91ed751a4.png";

/***/ }),
/* 98 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_Detail_vue__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_6b78e8d1_hasScoped_true_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_Detail_vue__ = __webpack_require__(102);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(99)
}
var normalizeComponent = __webpack_require__(2)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-6b78e8d1"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_Detail_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_6b78e8d1_hasScoped_true_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_Detail_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "com\\Detail.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] Detail.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6b78e8d1", Component.options)
  } else {
    hotAPI.reload("data-v-6b78e8d1", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(100);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("db16b51c", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../node_modules/_css-loader@0.28.5@css-loader/index.js?sourceMap!../node_modules/_vue-loader@13.0.4@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6b78e8d1\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/_vue-loader@13.0.4@vue-loader/lib/selector.js?type=styles&index=0!./Detail.vue", function() {
     var newContent = require("!!../node_modules/_css-loader@0.28.5@css-loader/index.js?sourceMap!../node_modules/_vue-loader@13.0.4@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6b78e8d1\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/_vue-loader@13.0.4@vue-loader/lib/selector.js?type=styles&index=0!./Detail.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n.homecontent[data-v-6b78e8d1]{\n\t\twidth: 100%;\n\t\theight: 100%;\n\t\toverflow-y: auto;\n}\n.homecontent[data-v-6b78e8d1]::-webkit-scrollbar {display: none;\n}\n.swiper-container[data-v-6b78e8d1] {\n        width: 100%;\n        height: 220px;\n}\n.swiper-slide img[data-v-6b78e8d1]{\n      width: 100%;\n      height: 220px;\n}\n.con[data-v-6b78e8d1]{\n    \twidth: 90%;\n    \theight: 90%;\n    \tpadding: 5%;\n    \tposition: relative;\n}\n.detitle[data-v-6b78e8d1]{\n    \twidth: 100%;\n}\n.detitle span[data-v-6b78e8d1]{\n    \twidth: 100%;\n    \tline-height: 30px;\n    \tfont-size: 16px;\n}\n#detho[data-v-6b78e8d1]{\n    \ttext-decoration: line-through;\n    \tfont-size: 8px;\n    \t-webkit-transform: scale(0.6);\n}\n.detitle2[data-v-6b78e8d1]{\n    \twidth: 100%;   \t\n    \tline-height: 40px;\n    \tfont-size: 20px;\n}\n.deprice[data-v-6b78e8d1]{\n    \twidth: 100%;\n    \theight: 40px;\n    \tline-height: 40px;\n    \tborder-bottom:1px solid #ccc;\n}\n#nulls[data-v-6b78e8d1]{\n    \twidth: 100%;\n    \theight: 4px;\n    \tbackground: #eee;\n}\n.swiper-slide .swiper-slide-active[data-v-6b78e8d1]{\n    \twidth: 100%;\n}\n.deprice span[data-v-6b78e8d1]:nth-of-type(1){\n    \tfont-size: 20px;\n    \tcolor: #FF6666;\n}\n.deprice span[data-v-6b78e8d1]:nth-of-type(2){\n    \tfont-size: 14px;\n    \tcolor: #FF6666;\n}\n.deprice span[data-v-6b78e8d1]:nth-of-type(3){\n    \tfont-size: 20px;\n    \tcolor: #ccc;\n    \tpadding: 0 5%;\n}\n.msg[data-v-6b78e8d1]{\n    \tborder-bottom: 1px solid #ccc;\n}\n.msgtitle[data-v-6b78e8d1]{\n    \ttext-align: center;\n    \twidth: 100%;\n    \theight: 50px;\n    \tline-height: 50px;\n    \tfont-size: 20px;\n    \tfont-weight: 800;\n    \tborder-bottom: 1px solid #ccc;\n}\n.didian[data-v-6b78e8d1],.num[data-v-6b78e8d1]{\n    \ttext-indent: 20px;\n    \twidth: 100%;\n    \theight: 40px;\n    \tline-height: 40px;\n    \tfont-size: 14px;\n}\n.menu[data-v-6b78e8d1]{\n    \tborder-bottom: 1px solid #ccc;\n    \tpadding: 4% 0;\n}\n.menutitle[data-v-6b78e8d1],.nn[data-v-6b78e8d1],.usetitle[data-v-6b78e8d1],.guesstitle[data-v-6b78e8d1]{\n    \tfont-size: 20px;\n    \twidth: 100%;\n    \theight: 50px;\n    \tline-height: 50px;\n    \ttext-align: center;\n    \tfont-weight: 800;\n}\n.mainfood div[data-v-6b78e8d1],.usetext[data-v-6b78e8d1]{\n    \ttext-align: center;\n    \twidth: 100%;\n    \tline-height: 30px;\n    \tfont-size: 18px;\n}\n.mainfood div[data-v-6b78e8d1]:nth-child(1){\n    \tfont-size: 18px;\n    \tfont-weight: 600;\n    \tmargin-top: 10px;\n}\n.text[data-v-6b78e8d1]{\n    \tfont-size: 16px;\n}\n.bright[data-v-6b78e8d1]{\n    \twidth: 100%;\n}\n.bright img[data-v-6b78e8d1]{\n    \twidth: 100%;\n    \theight: 180px;\n    \tmargin: 10px auto;\n}\n.brtitle[data-v-6b78e8d1]{\n    \twidth: 100%;\n    \tline-height: 30px;\n    \tfont-size: 22px;\n}\n.brinfo[data-v-6b78e8d1]{\n    \twidth: 100%;\n    \tline-height: 30px;\n    \tcolor: #555;\n    \tfont-size: 18px;\n}\n.guessrecommend[data-v-6b78e8d1]{\n    \twidth: 100%;\n    \theight: 100px;\n}\n.guessrecommend img[data-v-6b78e8d1]{\n    \tdisplay: block;\n    \tfloat: left;\n    \twidth: 30%;\n    \theight: 80px;\n    \tmargin-right: 5%;\n}\n.guess1[data-v-6b78e8d1]{\n    \t\n    \twidth: 65%;\n    \tfloat: left;\n    \tfont-size: 14px;\n    \tline-height: 40px;\n    \tmargin-bottom: 20px;\n    \twhite-space: nowrap;\n    \toverflow: hidden;\n    \ttext-overflow: ellipsis;\n}\n.guess2[data-v-6b78e8d1]{\n    \tcolor: red;\n    \tfont-size: 12px;\n}\n.cart[data-v-6b78e8d1]{\n    \tposition: fixed;\n    \tleft: 0;\n    \tbottom: 0;\n    \twidth: 100%;\n    \theight: 50px;\n    \tfont-size: 1rem;\n}\n.dian[data-v-6b78e8d1]{\n\tdisplay: block;\n\twidth: 5px;\n\theight: 5px;\n\tbackground: #f00;\n\tborder-radius:50% ;\n\tposition: absolute;\n\ttop: 25%;\n\tleft: 10%;\n\tdisplay: none;\n}\n.iconfont[data-v-6b78e8d1]{\n\t\twidth: 20%;\n\t\theight: 50px;\n\t\tline-height: 50px;\n\t\tfloat: left;\n\t\tfont-size: 20px;\n\t\ttext-align:center ;\n\t\tfont-style:inherit ;\n}\n.addcart[data-v-6b78e8d1]{\n\t\twidth: 40%;\n\t\theight: 100%;\n\t\tfloat: left;\n\t\ttext-align: center;\n\t\tline-height: 50px;\n\t\tbackground: #fa1;\n\t\tcolor: #fff;\n}\n.computed[data-v-6b78e8d1]{\n\t\twidth: 40%;\n\t\theight: 100%;\n\t\tfloat: left;\t\n\t\ttext-align: center;\n\t\tline-height: 50px;\n\t\tbackground: red;\n\t\tcolor: #fff;\n}\n    \n", "", {"version":3,"sources":["G:/enjoy/com/com/Detail.vue?cf46d0d8"],"names":[],"mappings":";AAkLA;EACA,YAAA;EACA,aAAA;EACA,iBAAA;CACA;AACA,kDAAA,cAAA;CAAA;AACA;QACA,YAAA;QACA,cAAA;CACA;AACA;MACA,YAAA;MACA,cAAA;CACA;AACA;KACA,WAAA;KACA,YAAA;KACA,YAAA;KACA,mBAAA;CACA;AACA;KACA,YAAA;CAEA;AACA;KACA,YAAA;KACA,kBAAA;KACA,gBAAA;CACA;AACA;KACA,8BAAA;KACA,eAAA;KACA,8BAAA;CACA;AACA;KACA,YAAA;KACA,kBAAA;KACA,gBAAA;CACA;AACA;KACA,YAAA;KACA,aAAA;KACA,kBAAA;KACA,6BAAA;CAEA;AAEA;KACA,YAAA;KACA,YAAA;KACA,iBAAA;CAEA;AACA;KACA,YAAA;CACA;AACA;KACA,gBAAA;KACA,eAAA;CACA;AACA;KACA,gBAAA;KACA,eAAA;CACA;AACA;KACA,gBAAA;KACA,YAAA;KACA,cAAA;CAEA;AACA;KACA,8BAAA;CACA;AACA;KACA,mBAAA;KACA,YAAA;KACA,aAAA;KACA,kBAAA;KACA,gBAAA;KACA,iBAAA;KACA,8BAAA;CACA;AACA;KACA,kBAAA;KACA,YAAA;KACA,aAAA;KACA,kBAAA;KACA,gBAAA;CACA;AACA;KACA,8BAAA;KACA,cAAA;CACA;AACA;KACA,gBAAA;KACA,YAAA;KACA,aAAA;KACA,kBAAA;KACA,mBAAA;KACA,iBAAA;CACA;AACA;KACA,mBAAA;KACA,YAAA;KACA,kBAAA;KACA,gBAAA;CAEA;AACA;KACA,gBAAA;KACA,iBAAA;KACA,iBAAA;CACA;AACA;KACA,gBAAA;CACA;AACA;KACA,YAAA;CACA;AACA;KACA,YAAA;KACA,cAAA;KACA,kBAAA;CACA;AACA;KACA,YAAA;KACA,kBAAA;KACA,gBAAA;CACA;AACA;KACA,YAAA;KACA,kBAAA;KACA,YAAA;KACA,gBAAA;CACA;AACA;KACA,YAAA;KACA,cAAA;CACA;AACA;KACA,eAAA;KACA,YAAA;KACA,WAAA;KACA,aAAA;KACA,iBAAA;CACA;AACA;;KAEA,WAAA;KACA,YAAA;KACA,gBAAA;KACA,kBAAA;KACA,oBAAA;KACA,oBAAA;KACA,iBAAA;KACA,wBAAA;CACA;AACA;KACA,WAAA;KACA,gBAAA;CACA;AACA;KACA,gBAAA;KACA,QAAA;KACA,UAAA;KACA,YAAA;KACA,aAAA;KACA,gBAAA;CAEA;AACA;CACA,eAAA;CACA,WAAA;CACA,YAAA;CACA,iBAAA;CACA,mBAAA;CACA,mBAAA;CACA,SAAA;CACA,UAAA;CACA,cAAA;CACA;AACA;EACA,WAAA;EACA,aAAA;EACA,kBAAA;EACA,YAAA;EACA,gBAAA;EACA,mBAAA;EACA,oBAAA;CAEA;AACA;EACA,WAAA;EACA,aAAA;EACA,YAAA;EACA,mBAAA;EACA,kBAAA;EACA,iBAAA;EACA,YAAA;CACA;AACA;EACA,WAAA;EACA,aAAA;EACA,YAAA;EACA,mBAAA;EACA,kBAAA;EACA,gBAAA;EACA,YAAA;CACA","file":"Detail.vue","sourcesContent":["<template>\r\n\t<div class=\"homecontent\">\r\n\t\t <div class=\"swiper-container\">\r\n\t        <div class=\"swiper-wrapper\">\r\n\t            <div class=\"swiper-slide\" v-for = \"item in imgs\">\r\n\t            \t<img :src=item.img_url>\r\n\t            </div>\r\n\t        </div>\r\n        \t<div class=\"swiper-pagination\"></div>\r\n    \t</div>\r\n    <div class=\"con\">\n    <div class=\"detitle\" ><span>{{name1}}</span><span>-{{spec1}}</span></div>\t\r\n    <div class=\"detitle2\">{{description1}}</div>\r\n    <div class=\"deprice\"><span>￥{{price1/100}}</span>/<span>{{show_entity_name}}</span><span id=\"detho\">￥{{origin_price1/100}}</span></div>\r\n    <div class=\"msg\">\r\n    \t<div class=\"msgtitle\">商户信息</div>\r\n    \t<div class=\"didian\">{{restaurant_address1}}</div>\t\r\n    \t<div class=\"num\">{{restaurant_phone_numbers}}</div>\r\n    </div>\r\n    <div class=\"menu\">\r\n    \t<div class=\"menutitle\">MENU</div>\r\n    \t<div v-for = \"per in contents\" class=\"mainfood\">\r\n\t    \t<div>{{per.sub_title}}</div>\r\n\t    \t<div class=\"text\" v-for=\"item in per.text\">{{item}}</div>\r\n    \t</div>\r\n    </div>   \r\n    <div class=\"nn\">亮点</div>\r\n    <div class=\"bright\" v-for=\"item in lights\">\r\n    \t<img :src=item.img_url>\r\n    \t<div class=\"brtitle\">{{item.title}}</div>\r\n    \t<div class=\"brinfo\">{{item.content}}</div>\r\n    </div>\r\n    \r\n    \r\n    <div class=\"useinfo\">\r\n    \t<div class=\"usetitle\">使用提示</div>\r\n    \t<div class=\"usetext\" v-for=\"item in contents1\">{{item.text}}</div>\r\n    </div>\r\n    \r\n    <div id=\"nulls\"></div>\r\n    <div class=\"guess\">\r\n    \t<div class=\"guesstitle\">猜你喜欢</div>\r\n    \t<div class=\"guessrecommend\" v-for = \"item in recommend\">\r\n    \t\t<img :src=item.product_image_url>\r\n    \t\t<div class=\"guess1\">{{item.product_name}}</div>\r\n    \t\t<div class=\"guess2\"><span >￥{{item.price/100}}</span>/<span >{{item.show_entity_name}}</span></div>\r\n    \t</div>\r\n    </div>\r\n    <div class=\"cart\">\r\n\t\t<div>\r\n\t\t\t<i class=\"iconfont\" @click = \"Cart()\">&#xe624;</i>\r\n\t\t\t<b class=\"dian\"></b>\r\n\t\t</div>\r\n\t\t<div class=\"addcart\" @click = \"addCart()\">加入购物车</div>\r\n\t\t<div class=\"computed\" @click = \"goCheck()\">立即购买</div>\r\n\t</div>\r\n   </div>\r\n   \r\n</div>\r\n</template>\r\n\r\n<script>\r\n\timport MyAjax from \"./../md/MyAjax.js\";\r\n\timport \"./../scss/main.scss\";\r\n\timport router from \"./../router/router.js\"; \r\n\texport default{\r\n\t\tdata(){\r\n\t\t\treturn{\r\n\t\t\t\tproductID:this.$route.query.allid,\r\n\t\t\t\ta:[],\r\n\t\t\t\timgs:[],\r\n\t\t\t\tname1:[],\r\n\t\t\t\tspec1:[],\r\n\t\t\t\tdescription1:[],\r\n\t\t\t\tprice1:[],\r\n\t\t\t\torigin_price1:[],\r\n\t\t\t\tshow_entity_name:[],\r\n\t\t\t\tshow_entity_name1:[],\r\n\t\t\t\tmodules1:[],\r\n\t\t\t\trestaurant_address1:[],\r\n\t\t\t\trestaurant_phone_numbers:[],\t\t\t\t\r\n\t\t\t\tcontents:[],\r\n\t\t\t\tsub_title:[],\r\n\t\t\t\ttext:[],\r\n\t\t\t\tlights:[],\r\n\t\t\t\tcontents1:[],\r\n\t\t\t\trecommend:[]\t\t\t\t\r\n\t\t\t}\r\n\t\t},\r\n\t\tmethods:{\r\n\t\t\tgoCheck(){\r\n\t\t\t\tif(localStorage.getItem(\"isLogin\")==\"1\"){\r\n\t\t\t\t\tthis.$router.push(\"/cart\")\r\n\t\t\t\t}else{\r\n\t\t\t\t\tthis.$router.push(\"/login\")\r\n\t\t\t\t}\r\n\t\t\t},\r\n\t\t\taddCart(){\r\n\t\t\t\tvar that = this;\r\n\t\t\t\tvar proid = that.productID;\r\n\t\t\t\tvar isgoods = localStorage.getItem('goods')\t;\t\r\n\t\t\t\tfunction isexit(currentobj,cartarr){\r\n\t\t\t\t\tfor(var i in cartarr){\r\n\t\t\t\t\t\tif(currentobj.proid== cartarr[i].proid){\r\n\t\t\t\t\t\t\treturn cartarr[i];\r\n\t\t\t\t\t\t}\r\n\t\t\t\t\t}\r\n\t\t\t\t\treturn false;\r\n\t\t\t\t}\r\n\t\t\t\tvar obj ={\r\n\t\t\t\t\t\tpic:that.imgs[0].img_url,\r\n\t\t\t\t\t\tname1:that.name1,\r\n\t\t\t\t\t\tspec1:that.spec1,\r\n\t\t\t\t\t\tdescription1:that.description1,\r\n\t\t\t\t\t\tprice1:that.price1,\r\n\t\t\t\t\t\tproid:that.productID\r\n\t\t\t\t\t}\r\n\t\t\t\tvar arr = [];\r\n\t\t\t\tif(isgoods == null){\r\n\t\t\t\t\tobj.num = 1;\r\n\t\t\t\t\tarr.push(obj);\r\n\t\t\t\t\tvar str =JSON.stringify(arr);\r\n\t\t\t\t\tlocalStorage.setItem(\"goods\",str);\r\n\t\t\t\r\n\t\t\t\t}else{\r\n\t\t\t\t\tvar nowproarr = JSON.parse(localStorage.getItem('goods'))\r\n\t\t\t\t\tvar exitflag = isexit(obj, nowproarr);\r\n\t\t\t\t\tif(exitflag){\r\n\t\t\t\t\t\texitflag.num++;\r\n\t\t\t\t\t\t\r\n\t\t\t\t\t}else{\r\n\t\t\t\t\t\tobj.num =1;\r\n\t\t\t\t\t\tnowproarr.push(obj);\r\n\t\t\t\t\t}\r\n\t\t\t\t\tvar nowproarrstr = JSON.stringify(nowproarr);\r\n                    localStorage.setItem('goods', nowproarrstr);             \r\n\t\t\t\t}\t\r\n\t\t\t\t\r\n\t\t\t\t\t$(\".dian\").css(\"display\",\"block\")\r\n\t\t\t\r\n\t\t\t\t\r\n\t\t\t},\r\n\t\t\tCart(){\r\n\t\t\t\tvar that = this;\r\n\t\t\t\tthat.$router.push({path:\"/cart\"});\r\n\t\t\t}\r\n\t\t},\r\n\t\tmounted(){\r\n\t\t\tvar that=this;\r\n\t\t\tvar productID = that.$route.query.allid;\r\n\t\t\t\tvar url = \"https://api.ricebook.com/product/info/product_detail.json?product_id=\"+productID;\r\n\t\t\t\tMyAjax.vueJson(url,function(data){\t\t\t\r\n\t\t\t\t\tthat.name1 = data.basic.name;\r\n\t\t\t\t\tthat.spec1 = data.basic.spec;\r\n\t\t\t\t\tthat.description1 = data.basic.description;\r\n\t\t\t\t\tthat.price1 = data.basic.price;\r\n\t\t\t\t\tthat.origin_price1 = data.basic.origin_price;\r\n\t\t\t\t\tthat.show_entity_name = data.basic.show_entity_name;\t\t\t\t\t\r\n\t\t\t\t\tthat.modules1 = data.modules;\r\n\t\t\t\t\tthat.restaurant_address1 = data.modules[0].data.restaurants[0].restaurant_address ;\r\n\t\t\t\t\tthat.restaurant_phone_numbers = data.modules[0].data.restaurants[0].restaurant_phone_numbers[0];\r\n\t\t\t\t\tthat.contents =data.modules[1].data.contents;\t\t\t\t\t\r\n\t\t\t\t\tthat.lights =data.modules[2].data.lights;\t\t\t\t\t\t\t\t\t\t\r\n\t\t\t\t\tthat.contents1 = data.modules[3].data.contents;\t\t\t\t\t\r\n\t\t\t\t\tthat.recommend = data.modules[4].data.recommend;\r\n\t\t\t\t\tthat.imgs=data.basic.product_images;\t\t\t\t\t\t\t\t\t\t\r\n\t\t\t\t},function(err){\r\n\t\t\t\t\tconsole.log(err)\r\n\t\t\t\t});\r\n\t\t\t\t  var swiper = new Swiper('.swiper-container', {\r\n\t\t\t        pagination: '.swiper-pagination',\r\n\t\t\t        observer:true\r\n    });\r\n\t\t}\r\n\t}\r\n</script>\r\n\r\n<style scoped>\r\n\t.homecontent{\r\n\t\twidth: 100%;\r\n\t\theight: 100%;\r\n\t\toverflow-y: auto;\r\n\t}\r\n\t.homecontent::-webkit-scrollbar {display: none;}\r\n\t .swiper-container {\r\n        width: 100%;\r\n        height: 220px;\r\n    }\r\n    .swiper-slide img{\r\n      width: 100%;\r\n      height: 220px;\r\n    }\r\n    .con{\r\n    \twidth: 90%;\r\n    \theight: 90%;\r\n    \tpadding: 5%;\r\n    \tposition: relative;    \t\r\n    }\r\n    .detitle{\r\n    \twidth: 100%;\r\n    \t\r\n    }\r\n    .detitle span{\r\n    \twidth: 100%;\r\n    \tline-height: 30px;\r\n    \tfont-size: 16px;\r\n    }\r\n    #detho{\r\n    \ttext-decoration: line-through;\r\n    \tfont-size: 8px;\r\n    \t-webkit-transform: scale(0.6);\r\n    }\r\n    .detitle2{\r\n    \twidth: 100%;   \t\r\n    \tline-height: 40px;\r\n    \tfont-size: 20px;\r\n    }\r\n    .deprice{\r\n    \twidth: 100%;\r\n    \theight: 40px;\r\n    \tline-height: 40px;\r\n    \tborder-bottom:1px solid #ccc;\r\n    \t\r\n    }\r\n\r\n    #nulls{\r\n    \twidth: 100%;\r\n    \theight: 4px;\r\n    \tbackground: #eee;\r\n    \t\r\n    }\r\n    .swiper-slide .swiper-slide-active{\r\n    \twidth: 100%;\r\n    }\r\n    .deprice span:nth-of-type(1){\r\n    \tfont-size: 20px;\r\n    \tcolor: #FF6666;\r\n    }\r\n    .deprice span:nth-of-type(2){\r\n    \tfont-size: 14px;\r\n    \tcolor: #FF6666;\r\n    }\r\n    .deprice span:nth-of-type(3){\r\n    \tfont-size: 20px;\r\n    \tcolor: #ccc;\r\n    \tpadding: 0 5%;\r\n    \t\r\n    }\r\n    .msg{\r\n    \tborder-bottom: 1px solid #ccc;\r\n    }\r\n    .msgtitle{\r\n    \ttext-align: center;\r\n    \twidth: 100%;\r\n    \theight: 50px;\r\n    \tline-height: 50px;\r\n    \tfont-size: 20px;\r\n    \tfont-weight: 800;\r\n    \tborder-bottom: 1px solid #ccc;\r\n    }\r\n    .didian,.num{\r\n    \ttext-indent: 20px;\r\n    \twidth: 100%;\r\n    \theight: 40px;\r\n    \tline-height: 40px;\r\n    \tfont-size: 14px;\r\n    }\r\n    .menu{\r\n    \tborder-bottom: 1px solid #ccc;\r\n    \tpadding: 4% 0;\r\n    }\r\n    .menutitle,.nn,.usetitle,.guesstitle{\r\n    \tfont-size: 20px;\r\n    \twidth: 100%;\r\n    \theight: 50px;\r\n    \tline-height: 50px;\r\n    \ttext-align: center;\r\n    \tfont-weight: 800;\r\n    }\r\n    .mainfood div,.usetext{\r\n    \ttext-align: center;\r\n    \twidth: 100%;\r\n    \tline-height: 30px;\r\n    \tfont-size: 18px;\r\n    \t\r\n    }\r\n    .mainfood div:nth-child(1){\r\n    \tfont-size: 18px;\r\n    \tfont-weight: 600;\r\n    \tmargin-top: 10px;\r\n    }\r\n    .text{\r\n    \tfont-size: 16px;\r\n    }\r\n    .bright{\r\n    \twidth: 100%;\r\n    }\r\n    .bright img{\r\n    \twidth: 100%;\r\n    \theight: 180px;\r\n    \tmargin: 10px auto;\r\n    }\r\n    .brtitle{\r\n    \twidth: 100%;\r\n    \tline-height: 30px;\r\n    \tfont-size: 22px;\r\n    }\r\n    .brinfo{\r\n    \twidth: 100%;\r\n    \tline-height: 30px;\r\n    \tcolor: #555;\r\n    \tfont-size: 18px;\r\n    }\r\n    .guessrecommend{\r\n    \twidth: 100%;\r\n    \theight: 100px;\r\n    }\r\n    .guessrecommend img{\r\n    \tdisplay: block;\r\n    \tfloat: left;\r\n    \twidth: 30%;\r\n    \theight: 80px;\r\n    \tmargin-right: 5%;\r\n    }\r\n    .guess1{\r\n    \t\r\n    \twidth: 65%;\r\n    \tfloat: left;\r\n    \tfont-size: 14px;\r\n    \tline-height: 40px;\r\n    \tmargin-bottom: 20px;\r\n    \twhite-space: nowrap;\r\n    \toverflow: hidden;\r\n    \ttext-overflow: ellipsis;\r\n    }\r\n    .guess2{\r\n    \tcolor: red;\r\n    \tfont-size: 12px;\r\n    }\r\n    .cart{\r\n    \tposition: fixed;\r\n    \tleft: 0;\r\n    \tbottom: 0;\r\n    \twidth: 100%;\r\n    \theight: 50px;\r\n    \tfont-size: 1rem;\r\n    \r\n    }\r\n    .dian{\r\n\tdisplay: block;\r\n\twidth: 5px;\r\n\theight: 5px;\r\n\tbackground: #f00;\r\n\tborder-radius:50% ;\r\n\tposition: absolute;\r\n\ttop: 25%;\r\n\tleft: 10%;\r\n\tdisplay: none;\r\n}\r\n\t.iconfont{\r\n\t\twidth: 20%;\r\n\t\theight: 50px;\r\n\t\tline-height: 50px;\r\n\t\tfloat: left;\r\n\t\tfont-size: 20px;\r\n\t\ttext-align:center ;\r\n\t\tfont-style:inherit ;\r\n\t\t\r\n\t}\r\n\t.addcart{\r\n\t\twidth: 40%;\r\n\t\theight: 100%;\r\n\t\tfloat: left;\r\n\t\ttext-align: center;\r\n\t\tline-height: 50px;\r\n\t\tbackground: #fa1;\r\n\t\tcolor: #fff;\r\n\t}\r\n\t.computed{\r\n\t\twidth: 40%;\r\n\t\theight: 100%;\r\n\t\tfloat: left;\t\r\n\t\ttext-align: center;\r\n\t\tline-height: 50px;\r\n\t\tbackground: red;\r\n\t\tcolor: #fff;\r\n\t}\r\n    \r\n</style>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 101 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__md_MyAjax_js__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scss_main_scss__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scss_main_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__scss_main_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__router_router_js__ = __webpack_require__(3);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
	data() {
		return {
			productID: this.$route.query.allid,
			a: [],
			imgs: [],
			name1: [],
			spec1: [],
			description1: [],
			price1: [],
			origin_price1: [],
			show_entity_name: [],
			show_entity_name1: [],
			modules1: [],
			restaurant_address1: [],
			restaurant_phone_numbers: [],
			contents: [],
			sub_title: [],
			text: [],
			lights: [],
			contents1: [],
			recommend: []
		};
	},
	methods: {
		goCheck() {
			if (localStorage.getItem("isLogin") == "1") {
				this.$router.push("/cart");
			} else {
				this.$router.push("/login");
			}
		},
		addCart() {
			var that = this;
			var proid = that.productID;
			var isgoods = localStorage.getItem('goods');
			function isexit(currentobj, cartarr) {
				for (var i in cartarr) {
					if (currentobj.proid == cartarr[i].proid) {
						return cartarr[i];
					}
				}
				return false;
			}
			var obj = {
				pic: that.imgs[0].img_url,
				name1: that.name1,
				spec1: that.spec1,
				description1: that.description1,
				price1: that.price1,
				proid: that.productID
			};
			var arr = [];
			if (isgoods == null) {
				obj.num = 1;
				arr.push(obj);
				var str = JSON.stringify(arr);
				localStorage.setItem("goods", str);
			} else {
				var nowproarr = JSON.parse(localStorage.getItem('goods'));
				var exitflag = isexit(obj, nowproarr);
				if (exitflag) {
					exitflag.num++;
				} else {
					obj.num = 1;
					nowproarr.push(obj);
				}
				var nowproarrstr = JSON.stringify(nowproarr);
				localStorage.setItem('goods', nowproarrstr);
			}

			$(".dian").css("display", "block");
		},
		Cart() {
			var that = this;
			that.$router.push({ path: "/cart" });
		}
	},
	mounted() {
		var that = this;
		var productID = that.$route.query.allid;
		var url = "https://api.ricebook.com/product/info/product_detail.json?product_id=" + productID;
		__WEBPACK_IMPORTED_MODULE_0__md_MyAjax_js__["a" /* default */].vueJson(url, function (data) {
			that.name1 = data.basic.name;
			that.spec1 = data.basic.spec;
			that.description1 = data.basic.description;
			that.price1 = data.basic.price;
			that.origin_price1 = data.basic.origin_price;
			that.show_entity_name = data.basic.show_entity_name;
			that.modules1 = data.modules;
			that.restaurant_address1 = data.modules[0].data.restaurants[0].restaurant_address;
			that.restaurant_phone_numbers = data.modules[0].data.restaurants[0].restaurant_phone_numbers[0];
			that.contents = data.modules[1].data.contents;
			that.lights = data.modules[2].data.lights;
			that.contents1 = data.modules[3].data.contents;
			that.recommend = data.modules[4].data.recommend;
			that.imgs = data.basic.product_images;
		}, function (err) {
			console.log(err);
		});
		var swiper = new Swiper('.swiper-container', {
			pagination: '.swiper-pagination',
			observer: true
		});
	}
});

/***/ }),
/* 102 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "homecontent"
  }, [_c('div', {
    staticClass: "swiper-container"
  }, [_c('div', {
    staticClass: "swiper-wrapper"
  }, _vm._l((_vm.imgs), function(item) {
    return _c('div', {
      staticClass: "swiper-slide"
    }, [_c('img', {
      attrs: {
        "src": item.img_url
      }
    })])
  })), _vm._v(" "), _c('div', {
    staticClass: "swiper-pagination"
  })]), _vm._v(" "), _c('div', {
    staticClass: "con"
  }, [_c('div', {
    staticClass: "detitle"
  }, [_c('span', [_vm._v(_vm._s(_vm.name1))]), _c('span', [_vm._v("-" + _vm._s(_vm.spec1))])]), _vm._v(" "), _c('div', {
    staticClass: "detitle2"
  }, [_vm._v(_vm._s(_vm.description1))]), _vm._v(" "), _c('div', {
    staticClass: "deprice"
  }, [_c('span', [_vm._v("￥" + _vm._s(_vm.price1 / 100))]), _vm._v("/"), _c('span', [_vm._v(_vm._s(_vm.show_entity_name))]), _c('span', {
    attrs: {
      "id": "detho"
    }
  }, [_vm._v("￥" + _vm._s(_vm.origin_price1 / 100))])]), _vm._v(" "), _c('div', {
    staticClass: "msg"
  }, [_c('div', {
    staticClass: "msgtitle"
  }, [_vm._v("商户信息")]), _vm._v(" "), _c('div', {
    staticClass: "didian"
  }, [_vm._v(_vm._s(_vm.restaurant_address1))]), _vm._v(" "), _c('div', {
    staticClass: "num"
  }, [_vm._v(_vm._s(_vm.restaurant_phone_numbers))])]), _vm._v(" "), _c('div', {
    staticClass: "menu"
  }, [_c('div', {
    staticClass: "menutitle"
  }, [_vm._v("MENU")]), _vm._v(" "), _vm._l((_vm.contents), function(per) {
    return _c('div', {
      staticClass: "mainfood"
    }, [_c('div', [_vm._v(_vm._s(per.sub_title))]), _vm._v(" "), _vm._l((per.text), function(item) {
      return _c('div', {
        staticClass: "text"
      }, [_vm._v(_vm._s(item))])
    })], 2)
  })], 2), _vm._v(" "), _c('div', {
    staticClass: "nn"
  }, [_vm._v("亮点")]), _vm._v(" "), _vm._l((_vm.lights), function(item) {
    return _c('div', {
      staticClass: "bright"
    }, [_c('img', {
      attrs: {
        "src": item.img_url
      }
    }), _vm._v(" "), _c('div', {
      staticClass: "brtitle"
    }, [_vm._v(_vm._s(item.title))]), _vm._v(" "), _c('div', {
      staticClass: "brinfo"
    }, [_vm._v(_vm._s(item.content))])])
  }), _vm._v(" "), _c('div', {
    staticClass: "useinfo"
  }, [_c('div', {
    staticClass: "usetitle"
  }, [_vm._v("使用提示")]), _vm._v(" "), _vm._l((_vm.contents1), function(item) {
    return _c('div', {
      staticClass: "usetext"
    }, [_vm._v(_vm._s(item.text))])
  })], 2), _vm._v(" "), _c('div', {
    attrs: {
      "id": "nulls"
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "guess"
  }, [_c('div', {
    staticClass: "guesstitle"
  }, [_vm._v("猜你喜欢")]), _vm._v(" "), _vm._l((_vm.recommend), function(item) {
    return _c('div', {
      staticClass: "guessrecommend"
    }, [_c('img', {
      attrs: {
        "src": item.product_image_url
      }
    }), _vm._v(" "), _c('div', {
      staticClass: "guess1"
    }, [_vm._v(_vm._s(item.product_name))]), _vm._v(" "), _c('div', {
      staticClass: "guess2"
    }, [_c('span', [_vm._v("￥" + _vm._s(item.price / 100))]), _vm._v("/"), _c('span', [_vm._v(_vm._s(item.show_entity_name))])])])
  })], 2), _vm._v(" "), _c('div', {
    staticClass: "cart"
  }, [_c('div', [_c('i', {
    staticClass: "iconfont",
    on: {
      "click": function($event) {
        _vm.Cart()
      }
    }
  }, [_vm._v("")]), _vm._v(" "), _c('b', {
    staticClass: "dian"
  })]), _vm._v(" "), _c('div', {
    staticClass: "addcart",
    on: {
      "click": function($event) {
        _vm.addCart()
      }
    }
  }, [_vm._v("加入购物车")]), _vm._v(" "), _c('div', {
    staticClass: "computed",
    on: {
      "click": function($event) {
        _vm.goCheck()
      }
    }
  }, [_vm._v("立即购买")])])], 2)])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-6b78e8d1", esExports)
  }
}

/***/ }),
/* 103 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_CartHeader_vue__ = __webpack_require__(106);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_75c7b04d_hasScoped_true_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_CartHeader_vue__ = __webpack_require__(107);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(104)
}
var normalizeComponent = __webpack_require__(2)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-75c7b04d"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_CartHeader_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_75c7b04d_hasScoped_true_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_CartHeader_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "com\\CartHeader.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] CartHeader.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-75c7b04d", Component.options)
  } else {
    hotAPI.reload("data-v-75c7b04d", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(105);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("9c91f45a", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../node_modules/_css-loader@0.28.5@css-loader/index.js?sourceMap!../node_modules/_vue-loader@13.0.4@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-75c7b04d\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/_vue-loader@13.0.4@vue-loader/lib/selector.js?type=styles&index=0!./CartHeader.vue", function() {
     var newContent = require("!!../node_modules/_css-loader@0.28.5@css-loader/index.js?sourceMap!../node_modules/_vue-loader@13.0.4@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-75c7b04d\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/_vue-loader@13.0.4@vue-loader/lib/selector.js?type=styles&index=0!./CartHeader.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\ndiv[data-v-75c7b04d]{\n\ttext-align: center;\n\tline-height: 2.5rem;\n}\n", "", {"version":3,"sources":["G:/enjoy/com/com/CartHeader.vue?46478ea4"],"names":[],"mappings":";AAeA;CACA,mBAAA;CACA,oBAAA;CACA","file":"CartHeader.vue","sourcesContent":["<template>\r\n\t<div>购物车中心</div>\r\n</template>\r\n\r\n<script>\r\n\texport default {\r\n\t\tdata(){\r\n\t\t\treturn {\r\n\t\t\t\t\r\n\t\t\t}\r\n\t\t}\r\n\t}\r\n</script>\r\n\r\n<style scoped>\r\n\tdiv{\r\n\t\ttext-align: center;\r\n\t\tline-height: 2.5rem;\r\n\t}\r\n</style>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 106 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
	data() {
		return {};
	}
});

/***/ }),
/* 107 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_vm._v("购物车中心")])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-75c7b04d", esExports)
  }
}

/***/ }),
/* 108 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_LoginHeader_vue__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_7159f586_hasScoped_true_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_LoginHeader_vue__ = __webpack_require__(112);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(109)
}
var normalizeComponent = __webpack_require__(2)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-7159f586"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_LoginHeader_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_7159f586_hasScoped_true_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_LoginHeader_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "com\\LoginHeader.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] LoginHeader.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7159f586", Component.options)
  } else {
    hotAPI.reload("data-v-7159f586", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(110);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("49babbf9", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../node_modules/_css-loader@0.28.5@css-loader/index.js?sourceMap!../node_modules/_vue-loader@13.0.4@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7159f586\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/_vue-loader@13.0.4@vue-loader/lib/selector.js?type=styles&index=0!./LoginHeader.vue", function() {
     var newContent = require("!!../node_modules/_css-loader@0.28.5@css-loader/index.js?sourceMap!../node_modules/_vue-loader@13.0.4@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7159f586\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/_vue-loader@13.0.4@vue-loader/lib/selector.js?type=styles&index=0!./LoginHeader.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\ndiv[data-v-7159f586]{\n\ttext-align: center;\n\tline-height: 2.5rem;\n}\n", "", {"version":3,"sources":["G:/enjoy/com/com/LoginHeader.vue?07edcf0a"],"names":[],"mappings":";AAeA;CACA,mBAAA;CACA,oBAAA;CACA","file":"LoginHeader.vue","sourcesContent":["<template>\r\n\t<div>登录</div>\r\n</template>\r\n\r\n<script>\r\n\texport default {\r\n\t\tdata(){\r\n\t\t\treturn {\r\n\t\t\t\t\r\n\t\t\t}\r\n\t\t}\r\n\t}\r\n</script>\r\n\r\n<style scoped>\r\n\tdiv{\r\n\t\ttext-align: center;\r\n\t\tline-height: 2.5rem;\r\n\t}\r\n</style>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 111 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
	data() {
		return {};
	}
});

/***/ }),
/* 112 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_vm._v("登录")])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-7159f586", esExports)
  }
}

/***/ }),
/* 113 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_MapNewDetail_vue__ = __webpack_require__(116);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_059eced6_hasScoped_true_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_MapNewDetail_vue__ = __webpack_require__(117);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(114)
}
var normalizeComponent = __webpack_require__(2)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-059eced6"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_MapNewDetail_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_059eced6_hasScoped_true_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_MapNewDetail_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "com\\MapNewDetail.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] MapNewDetail.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-059eced6", Component.options)
  } else {
    hotAPI.reload("data-v-059eced6", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(115);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("ceb3aa14", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../node_modules/_css-loader@0.28.5@css-loader/index.js?sourceMap!../node_modules/_vue-loader@13.0.4@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-059eced6\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/_vue-loader@13.0.4@vue-loader/lib/selector.js?type=styles&index=0!./MapNewDetail.vue", function() {
     var newContent = require("!!../node_modules/_css-loader@0.28.5@css-loader/index.js?sourceMap!../node_modules/_vue-loader@13.0.4@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-059eced6\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/_vue-loader@13.0.4@vue-loader/lib/selector.js?type=styles&index=0!./MapNewDetail.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n.homecontent[data-v-059eced6]{\n\t\twidth: 100%;\n\t\theight: 100%;\n\t\toverflow-y: auto;\n}\n.homecontent[data-v-059eced6]::-webkit-scrollbar {display: none;\n}\n.swiper-container[data-v-059eced6] {\n        width: 100%;\n        height: 220px;\n}\n.swiper-slide img[data-v-059eced6]{\n      width: 100%;\n      height: 220px;\n}\n.con[data-v-059eced6]{\n    \twidth: 90%;\n    \theight: 90%;\n    \tpadding: 5%;\n}\n.detitle[data-v-059eced6]{\n    \twidth: 100%;\n}\n.detitle span[data-v-059eced6]{\n    \twidth: 100%;\n    \tline-height: 30px;\n    \tfont-size: 18px;\n}\n.detitle2[data-v-059eced6]{\n    \twidth: 100%;    \t\n    \tline-height: 40px;\n    \tfont-size: 20px;\n}\n.deprice[data-v-059eced6]{\n    \twidth: 100%;\n    \theight: 40px;\n    \tline-height: 40px;\n    \tborder-bottom: 1px solid #ccc;\n}\n.deprice span[data-v-059eced6]:nth-of-type(1){\n    \tfont-size: 24px;\n    \tcolor: #FF6666;\n}\n.deprice span[data-v-059eced6]:nth-of-type(2){\n    \tfont-size: 14px;\n    \tcolor: #FF6666;\n}\n.deprice span[data-v-059eced6]:nth-of-type(3){\n    \tfont-size: 12px;\n    \tcolor: #ccc;\n    \tpadding: 0 5%;\n    \ttext-decoration: line-through;\n}\n.msg[data-v-059eced6]{\n    \tborder-bottom: 1px solid #ccc;\n}\n.msgtitle[data-v-059eced6]{\n    \ttext-align: center;\n    \twidth: 100%;\n    \theight: 50px;\n    \tline-height:40px;\n    \tfont-size: 20px;\n    \tfont-weight: 800;\n    \tborder-bottom: 1px solid #ccc;\n}\n.didian[data-v-059eced6],.num[data-v-059eced6]{\n    \ttext-indent: 20px;\n    \twidth: 100%;\n    \theight: 40px;\n    \tline-height: 40px;\n    \tfont-size: 14px;\n    \twhite-space: nowrap;\n    \ttext-overflow: ellipsis;\n    \toverflow: hidden;\n}\n.menu[data-v-059eced6]{\n    \tborder-bottom: 1px solid #ccc;\n}\n.menutitle[data-v-059eced6],.nn[data-v-059eced6],.usetitle[data-v-059eced6],.guesstitle[data-v-059eced6]{\n    \tfont-size: 20px;\n    \twidth: 100%;\n    \theight: 50px;\n    \tline-height: 40px;\n    \ttext-align: center;\n    \tfont-weight: 900;\n}\n.mainfood div[data-v-059eced6],.usetext[data-v-059eced6]{\n    \ttext-align: center;\n    \twidth: 100%;\n    \tline-height: 30px;\n    \tfont-size: 18px;\n}\n.mainfood div[data-v-059eced6]:nth-child(1){\n    \tfont-size: 20px;\n    \tfont-weight: 600;\n    \tmargin-top: 10px;\n}\n.bright[data-v-059eced6]{\n    \twidth: 100%;\n}\n.bright img[data-v-059eced6]{\n    \twidth: 100%;\n    \theight: 180px;\n    \tmargin: 10px auto;\n}\n.brtitle[data-v-059eced6]{\n    \twidth: 100%;\n    \tline-height: 30px;\n    \tfont-size: 22px;\n}\n.brinfo[data-v-059eced6]{\n    \twidth: 100%;\n    \tline-height: 30px;\n    \tfont-size: 18px;\n    \tcolor: #555;\n}\n.guessrecommend[data-v-059eced6]{\n    \twidth: 100%;\n    \theight: 100px;\n}\n.guessrecommend img[data-v-059eced6]{\n    \tdisplay: block;\n    \tfloat: left;\n    \twidth: 30%;\n    \theight: 80px;\n    \tmargin-right: 5%;\n}\n.guess1[data-v-059eced6]{\n    \t\n    \twidth: 65%;\n    \tfloat: left;\n    \tfont-size: 14px;\n    \tline-height: 24px;\n    \tmargin-bottom: 20px;\n    \twhite-space: nowrap;\n    \ttext-overflow: ellipsis;\n    \toverflow: hidden;\n}\n.guess2[data-v-059eced6]{\n    \tcolor: red;\n    \tfont-size: 12px;\n}\n.Mapcart[data-v-059eced6]{\n    \tposition: fixed;\n    \tleft: 0;\n    \tbottom: 0;\n    \twidth: 100%;\n    \theight: 50px;\n    \tfont-size: 1rem;\n}\n.dian[data-v-059eced6]{\n\tdisplay: block;\n\twidth: 5px;\n\theight: 5px;\n\tbackground: #f00;\n\tborder-radius:50% ;\n\tposition: absolute;\n\ttop: 25%;\n\tleft: 10%;\n\tdisplay: none;\n}\n.iconfont[data-v-059eced6]{\n\t\twidth: 20%;\n\t\theight: 50px;\n\t\tline-height: 50px;\n\t\tfloat: left;\n\t\tfont-size: 20px;\n\t\ttext-align:center ;\n\t\tfont-style:inherit ;\n}\n.addcart[data-v-059eced6]{\n\t\twidth: 40%;\n\t\theight: 100%;\n\t\tfloat: left;\n\t\ttext-align: center;\n\t\tline-height: 50px;\n\t\tbackground: #fa1;\n\t\tcolor: #fff;\n}\n.computed[data-v-059eced6]{\n\t\twidth: 40%;\n\t\theight: 100%;\n\t\tfloat: left;\t\n\t\ttext-align: center;\n\t\tline-height: 50px;\n\t\tbackground: red;\n\t\tcolor: #fff;\n}\n    \n", "", {"version":3,"sources":["G:/enjoy/com/com/MapNewDetail.vue?e281a026"],"names":[],"mappings":";AA+LA;EACA,YAAA;EACA,aAAA;EACA,iBAAA;CACA;AACA,kDAAA,cAAA;CAAA;AACA;QACA,YAAA;QACA,cAAA;CACA;AACA;MACA,YAAA;MACA,cAAA;CACA;AACA;KACA,WAAA;KACA,YAAA;KACA,YAAA;CAEA;AACA;KACA,YAAA;CAEA;AACA;KACA,YAAA;KACA,kBAAA;KACA,gBAAA;CACA;AACA;KACA,YAAA;KACA,kBAAA;KACA,gBAAA;CACA;AACA;KACA,YAAA;KACA,aAAA;KACA,kBAAA;KACA,8BAAA;CAEA;AACA;KACA,gBAAA;KACA,eAAA;CACA;AACA;KACA,gBAAA;KACA,eAAA;CACA;AACA;KACA,gBAAA;KACA,YAAA;KACA,cAAA;KACA,8BAAA;CAEA;AACA;KACA,8BAAA;CACA;AACA;KACA,mBAAA;KACA,YAAA;KACA,aAAA;KACA,iBAAA;KACA,gBAAA;KACA,iBAAA;KACA,8BAAA;CACA;AACA;KACA,kBAAA;KACA,YAAA;KACA,aAAA;KACA,kBAAA;KACA,gBAAA;KACA,oBAAA;KACA,wBAAA;KACA,iBAAA;CACA;AACA;KACA,8BAAA;CACA;AACA;KACA,gBAAA;KACA,YAAA;KACA,aAAA;KACA,kBAAA;KACA,mBAAA;KACA,iBAAA;CACA;AACA;KACA,mBAAA;KACA,YAAA;KACA,kBAAA;KACA,gBAAA;CAEA;AACA;KACA,gBAAA;KACA,iBAAA;KACA,iBAAA;CACA;AACA;KACA,YAAA;CACA;AACA;KACA,YAAA;KACA,cAAA;KACA,kBAAA;CACA;AACA;KACA,YAAA;KACA,kBAAA;KACA,gBAAA;CACA;AACA;KACA,YAAA;KACA,kBAAA;KACA,gBAAA;KACA,YAAA;CACA;AACA;KACA,YAAA;KACA,cAAA;CACA;AACA;KACA,eAAA;KACA,YAAA;KACA,WAAA;KACA,aAAA;KACA,iBAAA;CACA;AACA;;KAEA,WAAA;KACA,YAAA;KACA,gBAAA;KACA,kBAAA;KACA,oBAAA;KACA,oBAAA;KACA,wBAAA;KACA,iBAAA;CACA;AACA;KACA,WAAA;KACA,gBAAA;CACA;AACA;KACA,gBAAA;KACA,QAAA;KACA,UAAA;KACA,YAAA;KACA,aAAA;KACA,gBAAA;CAEA;AACA;CACA,eAAA;CACA,WAAA;CACA,YAAA;CACA,iBAAA;CACA,mBAAA;CACA,mBAAA;CACA,SAAA;CACA,UAAA;CACA,cAAA;CACA;AACA;EACA,WAAA;EACA,aAAA;EACA,kBAAA;EACA,YAAA;EACA,gBAAA;EACA,mBAAA;EACA,oBAAA;CAEA;AACA;EACA,WAAA;EACA,aAAA;EACA,YAAA;EACA,mBAAA;EACA,kBAAA;EACA,iBAAA;EACA,YAAA;CACA;AACA;EACA,WAAA;EACA,aAAA;EACA,YAAA;EACA,mBAAA;EACA,kBAAA;EACA,gBAAA;EACA,YAAA;CACA","file":"MapNewDetail.vue","sourcesContent":["<template>\r\n\t<div class=\"homecontent\">\r\n\t\t <div class=\"swiper-container\">\r\n\t        <div class=\"swiper-wrapper\">\r\n\t            <div class=\"swiper-slide\" v-for = \"item in imgs\">\r\n\t            \t<img :src=item.img_url>\r\n\t            </div>\r\n\t        </div>\r\n        \t<div class=\"swiper-pagination\"></div>\r\n    \t</div>\r\n    <div class=\"con\">\r\n    <div class=\"detitle\" ><span>{{name1}}</span><span>-{{spec1}}</span></div>\t\r\n    <div class=\"detitle2\">{{description1}}</div>\r\n    <div class=\"deprice\"><span>￥{{price1/100}}</span>/<span>{{show_entity_name}}</span><span>￥{{origin_price1/100}}</span></div>\r\n    <div class=\"msg\">\r\n    \t<div class=\"msgtitle\">商户信息</div>\r\n    \t<div class=\"didian\">{{restaurant_address1}}</div>\t\r\n    \t<div class=\"num\">{{restaurant_phone_numbers}}</div>\r\n    </div>\r\n    <div class=\"menu\">\r\n    \t<div class=\"menutitle\">MENU</div>\r\n    \t<div v-for = \"per in contents\" class=\"mainfood\">\r\n\t    \t<div>{{per.sub_title}}</div>\r\n\t    \t<div class=\"text\" v-for=\"item in per.text\">{{item}}</div>\r\n    \t</div>\r\n    </div>\r\n    \r\n    \r\n    \r\n    <div class=\"nn\">亮点</div>\r\n    <div class=\"bright\" v-for=\"item in lights\">\r\n    \t<img :src=item.img_url>\r\n    \t<div class=\"brtitle\">{{item.title}}</div>\r\n    \t<div class=\"brinfo\">{{item.content}}</div>\r\n    </div>\r\n    \r\n    \r\n    <div class=\"useinfo\">\r\n    \t<div class=\"usetitle\">使用提示</div>\r\n    \t<div class=\"usetext\" v-for=\"item in contents1\">{{item.text}}</div>\r\n    </div>\r\n    \r\n    \r\n    <div class=\"guess\">\r\n    \t<div class=\"guesstitle\">猜你喜欢</div>\r\n    \t<div class=\"guessrecommend\" v-for = \"item in recommend\">\r\n    \t\t<img :src=item.product_image_url>\r\n    \t\t<div class=\"guess1\">{{item.product_name}}</div>\r\n    \t\t<div class=\"guess2\"><span >￥{{item.price/100}}</span>/<span>{{item.show_entity_name}}</span></div>\r\n    \t</div>\r\n    </div>\r\n   </div>\r\n    <div class=\"Mapcart\">\r\n\t\t<div>\r\n\t\t\t<i class=\"iconfont\" @click = \"Cart()\" id=\"dd\">&#xe624;</i>\r\n\t\t\t<b class=\"dian\"></b>\r\n\t\t</div>\r\n\t\t<div class=\"addcart\" @click = \"addCart()\">加入购物车</div>\r\n\t\t<div class=\"computed\" @click = \"goCheck()\">立即购买</div>\r\n\t</div>\r\n</div>\r\n</template>\r\n\r\n\r\n<script>\r\n\timport MyAjax from \"./../md/MyAjax.js\";\r\n\timport \"./../scss/main.scss\";\r\n\timport router from \"./../router/router.js\";\r\n\texport default{\r\n\t\tdata(){\r\n\t\t\treturn{\r\n\t\t\t\timgs:[],\r\n\t\t\t\tname1:[],\r\n\t\t\t\tspec1:[],\r\n\t\t\t\tdescription1:[],\r\n\t\t\t\tprice1:[],\r\n\t\t\t\torigin_price1:[],\r\n\t\t\t\tshow_entity_name:[],\r\n\t\t\t\tshow_entity_name1:[],\r\n\t\t\t\tmodules1:[],\r\n\t\t\t\trestaurant_address1:[],\r\n\t\t\t\trestaurant_phone_numbers:[],\r\n\t\t\t\t\r\n\t\t\t\tcontents:[],\r\n\t\t\t\tsub_title:[],\r\n\t\t\t\ttext:[],\r\n\t\t\t\tlights:[],\r\n\t\t\t\tcontents1:[],\r\n\t\t\t\trecommend:[]\r\n\t\t\t}\r\n\t\t},\r\n\t\tmethods:{\r\n\t\t\tgoCheck(){\r\n\t\t\t\tif(localStorage.getItem(\"isLogin\")==\"1\"){\r\n\t\t\t\t\tthis.$router.push(\"/cart\")\r\n\t\t\t\t}else{\r\n\t\t\t\t\tthis.$router.push(\"/login\")\r\n\t\t\t\t}\r\n\t\t\t},\r\n\t\t\taddCart(){\r\n\t\t\t\tvar that = this;\r\n\t\t\t\tvar proid = that.productID;\r\n\t\t\t\tvar isgoods = localStorage.getItem('goods')\t;\t\r\n\t\t\t\tfunction isexit(currentobj,cartarr){\r\n\t\t\t\t\tfor(var i in cartarr){\r\n\t\t\t\t\t\tif(currentobj.proid== cartarr[i].proid){\r\n\t\t\t\t\t\t\treturn cartarr[i];\r\n\t\t\t\t\t\t}\r\n\t\t\t\t\t}\r\n\t\t\t\t\treturn false;\r\n\t\t\t\t}\r\n\t\t\t\tvar obj ={\r\n\t\t\t\t\t\tpic:that.imgs[0].img_url,\r\n\t\t\t\t\t\tname1:that.name1,\r\n\t\t\t\t\t\tspec1:that.spec1,\r\n\t\t\t\t\t\tdescription1:that.description1,\r\n\t\t\t\t\t\tprice1:that.price1,\r\n\t\t\t\t\t\tproid:that.productID\r\n\t\t\t\t\t}\r\n\t\t\t\tvar arr = [];\r\n\t\t\t\tif(isgoods == null){\r\n\t\t\t\t\tobj.num = 1;\r\n\t\t\t\t\tarr.push(obj);\r\n\t\t\t\t\tvar str =JSON.stringify(arr);\r\n\t\t\t\t\tlocalStorage.setItem(\"goods\",str);\r\n\t\t\t\r\n\t\t\t\t}else{\r\n\t\t\t\t\tvar nowproarr = JSON.parse(localStorage.getItem('goods'))\r\n\t\t\t\t\tvar exitflag = isexit(obj, nowproarr);\r\n\t\t\t\t\tif(exitflag){\r\n\t\t\t\t\t\texitflag.num++;\r\n\t\t\t\t\t\t\r\n\t\t\t\t\t}else{\r\n\t\t\t\t\t\tobj.num =1;\r\n\t\t\t\t\t\tnowproarr.push(obj);\r\n\t\t\t\t\t}\r\n\t\t\t\t\tvar nowproarrstr = JSON.stringify(nowproarr);\r\n                    localStorage.setItem('goods', nowproarrstr);             \r\n\t\t\t\t}\t\r\n\t\t\t\t\r\n\t\t\t\t\t$(\".dian\").css(\"display\",\"block\");\r\n\t\t\t\t\t$(\"#dd\").css(\"display\",\"block\");\r\n\t\t\t\t\r\n\t\t\t},\r\n\t\t\tCart(){\r\n\t\t\t\tvar that = this;\r\n\t\t\t\tthat.$router.push({path:\"/cart\"});\r\n\t\t\t}\r\n\t\t},\r\n\t\tmounted(){\r\n\t\t\tvar that = this;\r\n\t\t\tvar proID = that.$route.query.proID;\r\n\t\t\tconsole.log(proID);\r\n\t\t\tvar url=\"https://api.ricebook.com/product/info/product_detail.json?product_id=\"+proID;\r\n\t\t\tMyAjax.vueJson(url,function(data){\r\n\t\t\t\r\n\t\t\t\t\tconsole.log(data);\r\n\t\t\t\t\tthat.name1 = data.basic.name;\r\n\t\t\t\t\tthat.spec1 = data.basic.spec;\r\n\t\t\t\t\tthat.description1 = data.basic.description;\r\n\t\t\t\t\tthat.price1 = data.basic.price;\r\n\t\t\t\t\tthat.origin_price1 = data.basic.origin_price;\r\n\t\t\t\t\tthat.show_entity_name = data.basic.show_entity_name;\r\n\t\t\t\t\t\r\n\t\t\t\t\tthat.modules1 = data.modules;\r\n\t\t\t\t\tthat.restaurant_address1 = data.modules[0].data.restaurants[0].restaurant_address ;\r\n\t\t\t\t\tthat.restaurant_phone_numbers = data.modules[0].data.restaurants[0].restaurant_phone_numbers[0];\r\n\t\t\t\t\tthat.contents =data.modules[1].data.contents;\r\n\t\t\t\t\t\r\n\t\t\t\t\tthat.lights =data.modules[2].data.lights;\r\n\t\t\t\t\t\r\n\t\t\t\t\t\r\n\t\t\t\t\tthat.contents1 = data.modules[3].data.contents;\r\n\t\t\t\t\t\r\n\t\t\t\t\tthat.recommend = data.modules[4].data.recommend;\r\n\t\t\t\t\tthat.imgs=data.basic.product_images;\r\n\t\t\t\t\tconsole.log(data.basic.name);\r\n\t\t\t\t\tconsole.log(data.basic.product_images);\r\n\t\t\t\t},function(err){\r\n\t\t\t\t\tconsole.log(err)\r\n\t\t\t\t});\r\n\t\t\t\t  var swiper = new Swiper('.swiper-container', {\r\n\t\t\t        pagination: '.swiper-pagination',\r\n\t\t\t        observer:true\r\n    });\r\n\t\t\t\r\n\t\t}\r\n\t}\r\n</script>\r\n\r\n<style scoped>\r\n\t.homecontent{\r\n\t\twidth: 100%;\r\n\t\theight: 100%;\r\n\t\toverflow-y: auto;\r\n\t}\r\n\t.homecontent::-webkit-scrollbar {display: none;}\r\n\t .swiper-container {\r\n        width: 100%;\r\n        height: 220px;\r\n    }\r\n    .swiper-slide img{\r\n      width: 100%;\r\n      height: 220px;\r\n    }\r\n    .con{\r\n    \twidth: 90%;\r\n    \theight: 90%;\r\n    \tpadding: 5%;\r\n    \t\r\n    }\r\n    .detitle{\r\n    \twidth: 100%;\r\n    \t\r\n    }\r\n    .detitle span{\r\n    \twidth: 100%;\r\n    \tline-height: 30px;\r\n    \tfont-size: 18px;\r\n    }\r\n    .detitle2{\r\n    \twidth: 100%;    \t\r\n    \tline-height: 40px;\r\n    \tfont-size: 20px;\r\n    }\r\n    .deprice{\r\n    \twidth: 100%;\r\n    \theight: 40px;\r\n    \tline-height: 40px;\r\n    \tborder-bottom: 1px solid #ccc;\r\n    \t\r\n    }\r\n    .deprice span:nth-of-type(1){\r\n    \tfont-size: 24px;\r\n    \tcolor: #FF6666;\r\n    }\r\n    .deprice span:nth-of-type(2){\r\n    \tfont-size: 14px;\r\n    \tcolor: #FF6666;\r\n    }\r\n    .deprice span:nth-of-type(3){\r\n    \tfont-size: 12px;\r\n    \tcolor: #ccc;\r\n    \tpadding: 0 5%;\r\n    \ttext-decoration: line-through;\r\n    \t\r\n    }\r\n    .msg{\r\n    \tborder-bottom: 1px solid #ccc;\r\n    }\r\n    .msgtitle{\r\n    \ttext-align: center;\r\n    \twidth: 100%;\r\n    \theight: 50px;\r\n    \tline-height:40px;\r\n    \tfont-size: 20px;\r\n    \tfont-weight: 800;\r\n    \tborder-bottom: 1px solid #ccc;\r\n    }\r\n    .didian,.num{\r\n    \ttext-indent: 20px;\r\n    \twidth: 100%;\r\n    \theight: 40px;\r\n    \tline-height: 40px;\r\n    \tfont-size: 14px;\r\n    \twhite-space: nowrap;\r\n    \ttext-overflow: ellipsis;\r\n    \toverflow: hidden;\r\n    }\r\n    .menu{\r\n    \tborder-bottom: 1px solid #ccc;\r\n    }\r\n    .menutitle,.nn,.usetitle,.guesstitle{\r\n    \tfont-size: 20px;\r\n    \twidth: 100%;\r\n    \theight: 50px;\r\n    \tline-height: 40px;\r\n    \ttext-align: center;\r\n    \tfont-weight: 900;\r\n    }\r\n    .mainfood div,.usetext{\r\n    \ttext-align: center;\r\n    \twidth: 100%;\r\n    \tline-height: 30px;\r\n    \tfont-size: 18px;\r\n    \t\r\n    }\r\n    .mainfood div:nth-child(1){\r\n    \tfont-size: 20px;\r\n    \tfont-weight: 600;\r\n    \tmargin-top: 10px;\r\n    }\r\n    .bright{\r\n    \twidth: 100%;\r\n    }\r\n    .bright img{\r\n    \twidth: 100%;\r\n    \theight: 180px;\r\n    \tmargin: 10px auto;\r\n    }\r\n    .brtitle{\r\n    \twidth: 100%;\r\n    \tline-height: 30px;\r\n    \tfont-size: 22px;\r\n    }\r\n    .brinfo{\r\n    \twidth: 100%;\r\n    \tline-height: 30px;\r\n    \tfont-size: 18px;\r\n    \tcolor: #555;\r\n    }\r\n    .guessrecommend{\r\n    \twidth: 100%;\r\n    \theight: 100px;\r\n    }\r\n    .guessrecommend img{\r\n    \tdisplay: block;\r\n    \tfloat: left;\r\n    \twidth: 30%;\r\n    \theight: 80px;\r\n    \tmargin-right: 5%;\r\n    }\r\n    .guess1{\r\n    \t\r\n    \twidth: 65%;\r\n    \tfloat: left;\r\n    \tfont-size: 14px;\r\n    \tline-height: 24px;\r\n    \tmargin-bottom: 20px;\r\n    \twhite-space: nowrap;\r\n    \ttext-overflow: ellipsis;\r\n    \toverflow: hidden;\r\n    }\r\n    .guess2{\r\n    \tcolor: red;\r\n    \tfont-size: 12px;\r\n    }\r\n      .Mapcart{\r\n    \tposition: fixed;\r\n    \tleft: 0;\r\n    \tbottom: 0;\r\n    \twidth: 100%;\r\n    \theight: 50px;\r\n    \tfont-size: 1rem;\r\n    \r\n    }\r\n    .dian{\r\n\tdisplay: block;\r\n\twidth: 5px;\r\n\theight: 5px;\r\n\tbackground: #f00;\r\n\tborder-radius:50% ;\r\n\tposition: absolute;\r\n\ttop: 25%;\r\n\tleft: 10%;\r\n\tdisplay: none;\r\n}\r\n\t.iconfont{\r\n\t\twidth: 20%;\r\n\t\theight: 50px;\r\n\t\tline-height: 50px;\r\n\t\tfloat: left;\r\n\t\tfont-size: 20px;\r\n\t\ttext-align:center ;\r\n\t\tfont-style:inherit ;\r\n\t\t\r\n\t}\r\n\t.addcart{\r\n\t\twidth: 40%;\r\n\t\theight: 100%;\r\n\t\tfloat: left;\r\n\t\ttext-align: center;\r\n\t\tline-height: 50px;\r\n\t\tbackground: #fa1;\r\n\t\tcolor: #fff;\r\n\t}\r\n\t.computed{\r\n\t\twidth: 40%;\r\n\t\theight: 100%;\r\n\t\tfloat: left;\t\r\n\t\ttext-align: center;\r\n\t\tline-height: 50px;\r\n\t\tbackground: red;\r\n\t\tcolor: #fff;\r\n\t}\r\n    \r\n</style>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 116 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__md_MyAjax_js__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scss_main_scss__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scss_main_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__scss_main_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__router_router_js__ = __webpack_require__(3);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
	data() {
		return {
			imgs: [],
			name1: [],
			spec1: [],
			description1: [],
			price1: [],
			origin_price1: [],
			show_entity_name: [],
			show_entity_name1: [],
			modules1: [],
			restaurant_address1: [],
			restaurant_phone_numbers: [],

			contents: [],
			sub_title: [],
			text: [],
			lights: [],
			contents1: [],
			recommend: []
		};
	},
	methods: {
		goCheck() {
			if (localStorage.getItem("isLogin") == "1") {
				this.$router.push("/cart");
			} else {
				this.$router.push("/login");
			}
		},
		addCart() {
			var that = this;
			var proid = that.productID;
			var isgoods = localStorage.getItem('goods');
			function isexit(currentobj, cartarr) {
				for (var i in cartarr) {
					if (currentobj.proid == cartarr[i].proid) {
						return cartarr[i];
					}
				}
				return false;
			}
			var obj = {
				pic: that.imgs[0].img_url,
				name1: that.name1,
				spec1: that.spec1,
				description1: that.description1,
				price1: that.price1,
				proid: that.productID
			};
			var arr = [];
			if (isgoods == null) {
				obj.num = 1;
				arr.push(obj);
				var str = JSON.stringify(arr);
				localStorage.setItem("goods", str);
			} else {
				var nowproarr = JSON.parse(localStorage.getItem('goods'));
				var exitflag = isexit(obj, nowproarr);
				if (exitflag) {
					exitflag.num++;
				} else {
					obj.num = 1;
					nowproarr.push(obj);
				}
				var nowproarrstr = JSON.stringify(nowproarr);
				localStorage.setItem('goods', nowproarrstr);
			}

			$(".dian").css("display", "block");
			$("#dd").css("display", "block");
		},
		Cart() {
			var that = this;
			that.$router.push({ path: "/cart" });
		}
	},
	mounted() {
		var that = this;
		var proID = that.$route.query.proID;
		console.log(proID);
		var url = "https://api.ricebook.com/product/info/product_detail.json?product_id=" + proID;
		__WEBPACK_IMPORTED_MODULE_0__md_MyAjax_js__["a" /* default */].vueJson(url, function (data) {

			console.log(data);
			that.name1 = data.basic.name;
			that.spec1 = data.basic.spec;
			that.description1 = data.basic.description;
			that.price1 = data.basic.price;
			that.origin_price1 = data.basic.origin_price;
			that.show_entity_name = data.basic.show_entity_name;

			that.modules1 = data.modules;
			that.restaurant_address1 = data.modules[0].data.restaurants[0].restaurant_address;
			that.restaurant_phone_numbers = data.modules[0].data.restaurants[0].restaurant_phone_numbers[0];
			that.contents = data.modules[1].data.contents;

			that.lights = data.modules[2].data.lights;

			that.contents1 = data.modules[3].data.contents;

			that.recommend = data.modules[4].data.recommend;
			that.imgs = data.basic.product_images;
			console.log(data.basic.name);
			console.log(data.basic.product_images);
		}, function (err) {
			console.log(err);
		});
		var swiper = new Swiper('.swiper-container', {
			pagination: '.swiper-pagination',
			observer: true
		});
	}
});

/***/ }),
/* 117 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "homecontent"
  }, [_c('div', {
    staticClass: "swiper-container"
  }, [_c('div', {
    staticClass: "swiper-wrapper"
  }, _vm._l((_vm.imgs), function(item) {
    return _c('div', {
      staticClass: "swiper-slide"
    }, [_c('img', {
      attrs: {
        "src": item.img_url
      }
    })])
  })), _vm._v(" "), _c('div', {
    staticClass: "swiper-pagination"
  })]), _vm._v(" "), _c('div', {
    staticClass: "con"
  }, [_c('div', {
    staticClass: "detitle"
  }, [_c('span', [_vm._v(_vm._s(_vm.name1))]), _c('span', [_vm._v("-" + _vm._s(_vm.spec1))])]), _vm._v(" "), _c('div', {
    staticClass: "detitle2"
  }, [_vm._v(_vm._s(_vm.description1))]), _vm._v(" "), _c('div', {
    staticClass: "deprice"
  }, [_c('span', [_vm._v("￥" + _vm._s(_vm.price1 / 100))]), _vm._v("/"), _c('span', [_vm._v(_vm._s(_vm.show_entity_name))]), _c('span', [_vm._v("￥" + _vm._s(_vm.origin_price1 / 100))])]), _vm._v(" "), _c('div', {
    staticClass: "msg"
  }, [_c('div', {
    staticClass: "msgtitle"
  }, [_vm._v("商户信息")]), _vm._v(" "), _c('div', {
    staticClass: "didian"
  }, [_vm._v(_vm._s(_vm.restaurant_address1))]), _vm._v(" "), _c('div', {
    staticClass: "num"
  }, [_vm._v(_vm._s(_vm.restaurant_phone_numbers))])]), _vm._v(" "), _c('div', {
    staticClass: "menu"
  }, [_c('div', {
    staticClass: "menutitle"
  }, [_vm._v("MENU")]), _vm._v(" "), _vm._l((_vm.contents), function(per) {
    return _c('div', {
      staticClass: "mainfood"
    }, [_c('div', [_vm._v(_vm._s(per.sub_title))]), _vm._v(" "), _vm._l((per.text), function(item) {
      return _c('div', {
        staticClass: "text"
      }, [_vm._v(_vm._s(item))])
    })], 2)
  })], 2), _vm._v(" "), _c('div', {
    staticClass: "nn"
  }, [_vm._v("亮点")]), _vm._v(" "), _vm._l((_vm.lights), function(item) {
    return _c('div', {
      staticClass: "bright"
    }, [_c('img', {
      attrs: {
        "src": item.img_url
      }
    }), _vm._v(" "), _c('div', {
      staticClass: "brtitle"
    }, [_vm._v(_vm._s(item.title))]), _vm._v(" "), _c('div', {
      staticClass: "brinfo"
    }, [_vm._v(_vm._s(item.content))])])
  }), _vm._v(" "), _c('div', {
    staticClass: "useinfo"
  }, [_c('div', {
    staticClass: "usetitle"
  }, [_vm._v("使用提示")]), _vm._v(" "), _vm._l((_vm.contents1), function(item) {
    return _c('div', {
      staticClass: "usetext"
    }, [_vm._v(_vm._s(item.text))])
  })], 2), _vm._v(" "), _c('div', {
    staticClass: "guess"
  }, [_c('div', {
    staticClass: "guesstitle"
  }, [_vm._v("猜你喜欢")]), _vm._v(" "), _vm._l((_vm.recommend), function(item) {
    return _c('div', {
      staticClass: "guessrecommend"
    }, [_c('img', {
      attrs: {
        "src": item.product_image_url
      }
    }), _vm._v(" "), _c('div', {
      staticClass: "guess1"
    }, [_vm._v(_vm._s(item.product_name))]), _vm._v(" "), _c('div', {
      staticClass: "guess2"
    }, [_c('span', [_vm._v("￥" + _vm._s(item.price / 100))]), _vm._v("/"), _c('span', [_vm._v(_vm._s(item.show_entity_name))])])])
  })], 2)], 2), _vm._v(" "), _c('div', {
    staticClass: "Mapcart"
  }, [_c('div', [_c('i', {
    staticClass: "iconfont",
    attrs: {
      "id": "dd"
    },
    on: {
      "click": function($event) {
        _vm.Cart()
      }
    }
  }, [_vm._v("")]), _vm._v(" "), _c('b', {
    staticClass: "dian"
  })]), _vm._v(" "), _c('div', {
    staticClass: "addcart",
    on: {
      "click": function($event) {
        _vm.addCart()
      }
    }
  }, [_vm._v("加入购物车")]), _vm._v(" "), _c('div', {
    staticClass: "computed",
    on: {
      "click": function($event) {
        _vm.goCheck()
      }
    }
  }, [_vm._v("立即购买")])])])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-059eced6", esExports)
  }
}

/***/ }),
/* 118 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_Search_vue__ = __webpack_require__(121);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_7ee4b2a8_hasScoped_true_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_Search_vue__ = __webpack_require__(122);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(119)
}
var normalizeComponent = __webpack_require__(2)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-7ee4b2a8"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_Search_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_7ee4b2a8_hasScoped_true_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_Search_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "com\\Search.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] Search.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7ee4b2a8", Component.options)
  } else {
    hotAPI.reload("data-v-7ee4b2a8", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(120);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("58807ea4", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../node_modules/_css-loader@0.28.5@css-loader/index.js?sourceMap!../node_modules/_vue-loader@13.0.4@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7ee4b2a8\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/_vue-loader@13.0.4@vue-loader/lib/selector.js?type=styles&index=0!./Search.vue", function() {
     var newContent = require("!!../node_modules/_css-loader@0.28.5@css-loader/index.js?sourceMap!../node_modules/_vue-loader@13.0.4@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7ee4b2a8\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/_vue-loader@13.0.4@vue-loader/lib/selector.js?type=styles&index=0!./Search.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n.homecontent[data-v-7ee4b2a8]{\n\twidth: 100%;\n\theight: 100%;\n\toverflow-y: auto;\n}\n.homecontent[data-v-7ee4b2a8]::-webkit-scrollbar {display: none;\n}\n.sort[data-v-7ee4b2a8]{\n\twidth: 100%;\n\theight: 50px;\n}\n.sort span[data-v-7ee4b2a8]{\n\twidth: 50%;\n\tdisplay: inline-block;\n\tline-height: 50px;\n\ttext-align: center;\n\tfloat: left;\n\tfont-size: 16px;\n\tbox-sizing: border-box;\n\tborder-right: 1px solid #ccc;\n\tborder-bottom: 1px solid #ccc;\n}\n.iconfont[data-v-7ee4b2a8]{\n\tfont-style: inherit;\n}\n.sorttitile[data-v-7ee4b2a8]{\n\twidth: 100%;\n\theight: 20px;\n\tcolor: #ccc;\n\ttext-align: center;\n\tfont-size: 15px;\n\tcolor: #666;\n}\n.homecon[data-v-7ee4b2a8]{\n\twidth: 90%;\n\tpadding: 5%;\n\theight: 90%;\n}\n.mdpro[data-v-7ee4b2a8]{\n\twidth: 100%;\n\theight: 100px;\n\tpadding: 4% 0;\n\tborder-bottom: 1px solid #ccc;\n}\n.mdpro img[data-v-7ee4b2a8]{\n\tdisplay: block;\n\twidth: 40%;\n\theight: 100px;\n\tfloat: left;\n\tmargin-right: 10%;\n}\n.right[data-v-7ee4b2a8]{\n\twidth: 50%;\n\theight: 100px;\n\tfloat: left;\n\tfont-size: 12px;\n}\n.mdname[data-v-7ee4b2a8]{\n\twidth: 100%;\n\tline-height: 20px;\n\tmargin-bottom: 20px;\n}\n.mdpr[data-v-7ee4b2a8]{\n\twidth: 100%;\n\tline-height: 20px;\n\tcolor: #f66;\n}\n.originprice[data-v-7ee4b2a8]{\n\twidth: 20%;\n\tmargin-left: 20px;\n\tcolor: #ccc;\n}\n", "", {"version":3,"sources":["G:/enjoy/com/com/Search.vue?2bc010e8"],"names":[],"mappings":";AA4EA;CACA,YAAA;CACA,aAAA;CACA,iBAAA;CACA;AACA,kDAAA,cAAA;CAAA;AACA;CACA,YAAA;CACA,aAAA;CACA;AACA;CACA,WAAA;CACA,sBAAA;CACA,kBAAA;CACA,mBAAA;CACA,YAAA;CACA,gBAAA;CACA,uBAAA;CACA,6BAAA;CACA,8BAAA;CACA;AACA;CACA,oBAAA;CACA;AACA;CACA,YAAA;CACA,aAAA;CACA,YAAA;CACA,mBAAA;CACA,gBAAA;CACA,YAAA;CACA;AACA;CACA,WAAA;CACA,YAAA;CACA,YAAA;CACA;AACA;CACA,YAAA;CACA,cAAA;CACA,cAAA;CACA,8BAAA;CACA;AACA;CACA,eAAA;CACA,WAAA;CACA,cAAA;CACA,YAAA;CACA,kBAAA;CACA;AACA;CACA,WAAA;CACA,cAAA;CACA,YAAA;CACA,gBAAA;CACA;AACA;CACA,YAAA;CACA,kBAAA;CACA,oBAAA;CACA;AACA;CACA,YAAA;CACA,kBAAA;CACA,YAAA;CACA;AACA;CACA,WAAA;CACA,kBAAA;CACA,YAAA;CACA","file":"Search.vue","sourcesContent":["<template>\r\n\t<div class=\"homecontent\">\r\n\t<div class=\"sort\">\r\n\t\t<span @click = \"choosesort1()\">本地服务</span>\r\n\t\t<span @click = \"choosesort2()\">全国送</span>\r\n\t</div>\r\n\r\n\t<div class=\"sorttitile\">根据您的关键词<span></span>为您推荐以下商品</div>\r\n\t<div class=\"homecon\">\r\n\t\t<div class=\"mdpro\" v-for=\"item in products\" @click = \"godetail(item.product_id)\">\r\n\t\t\t<img :src = item.product_image>\r\n\t\t\t<div class=\"right\">\r\n\t\t\t\t<div class=\"mdname\">{{item.name}}</div>\r\n\t\t\t\t<div class=\"mdpr\"><span class=\"mdprice\">￥{{item.price/100}}元</span><span class=\"wei\">/{{item.show_entity_name}}</span></div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n</template>\r\n\r\n<script>\r\n\timport \"./../scss/main.scss\";\r\n\timport router from \"./../router/router.js\";\r\n\timport MyAjax from \"./../md/MyAjax.js\";\r\n\texport default{\r\n\t\tdata(){\r\n\t\t\treturn{\r\n\t\t\t\tproducts:[],\r\n\t\t\t\tarr:[]\r\n\t\t\t}\r\n\t\t},\r\n\t\tmethods:{\r\n\t\t\tchoosesort1(){\r\n\t\t\t\tvar that = this;\r\n\t\t\t\tvar keyword = that.$route.query.keyword;\r\n\t\t\t\tvar cityID = localStorage.getItem(\"id\");\r\n\t\t\t\tvar url1 = \"https://api.ricebook.com/3/enjoy_product/search.json?city_id=\"+cityID+\"&keyword=\"+keyword+\"&page=0\";\r\n\t\t\t\tMyAjax.vueJson(url1,function(data){\r\n\t\t\t\t\t that.products = data.products; \r\n\t\t\t\t},function(err){\r\n\t\t\t\t\tconsole.log(err)\r\n\t\t\t\t})\r\n\t\t\t},\r\n\t\t\tchoosesort2(){\r\n\t\t\t\tvar that = this;\r\n\t\t\t\tvar keyword = that.$route.query.keyword;\r\n\t\t\t\tvar url2 = \"https://api.ricebook.com/3/enjoy_product/search.json?city_id=1&keyword=\"+keyword+\"&page=0\";\r\n\t\t\t\tMyAjax.vueJson(url2,function(data){\r\n\t\t\t\t\t that.products = data.products; \r\n\t\t\t\t},function(err){\r\n\t\t\t\t\tconsole.log(err)\r\n\t\t\t\t})\r\n\t\t\t},\r\n\t\t\tgodetail(data){\r\n\t\t\r\n\t\t\t\tvar that = this;\r\n\t\t\t\tthat.$router.push({path:'/detail',query:{allid:data}});\r\n\t\t\t}\r\n\t\t},\r\n\t\tmounted(){\r\n\t\t\tvar that = this;\r\n\t\t\tvar keyword = that.$route.query.keyword;\r\n\t\t\tvar cityID = localStorage.getItem(\"id\");\r\n\t\t\t\tvar url1 = \"https://api.ricebook.com/3/enjoy_product/search.json?city_id=\"+cityID+\"&keyword=\"+keyword+\"&page=0\";\r\n\t\t\t\tMyAjax.vueJson(url1,function(data){\r\n\t\t\t\t\tconsole.log(data)\r\n\t\t\t\t\t that.products = data.products; \r\n\t\r\n\t\t\t\t},function(err){\r\n\t\t\t\t\tconsole.log(err)\r\n\t\t\t\t})\r\n\t\t}\r\n\t}\r\n</script>\r\n\r\n<style scoped>\r\n\t.homecontent{\r\n\t\twidth: 100%;\r\n\t\theight: 100%;\r\n\t\toverflow-y: auto;\r\n\t}\r\n\t.homecontent::-webkit-scrollbar {display: none;}\r\n\t.sort{\r\n\t\twidth: 100%;\r\n\t\theight: 50px;\r\n\t}\r\n\t.sort span{\r\n\t\twidth: 50%;\r\n\t\tdisplay: inline-block;\r\n\t\tline-height: 50px;\r\n\t\ttext-align: center;\r\n\t\tfloat: left;\r\n\t\tfont-size: 16px;\r\n\t\tbox-sizing: border-box;\r\n\t\tborder-right: 1px solid #ccc;\r\n\t\tborder-bottom: 1px solid #ccc;\r\n\t}\r\n\t .iconfont{\r\n\t\tfont-style: inherit;\r\n\t}\r\n\t.sorttitile{\r\n\t\twidth: 100%;\r\n\t\theight: 20px;\r\n\t\tcolor: #ccc;\r\n\t\ttext-align: center;\r\n\t\tfont-size: 15px;\r\n\t\tcolor: #666;\r\n\t}\r\n\t.homecon{\r\n\t\twidth: 90%;\r\n\t\tpadding: 5%;\r\n\t\theight: 90%;\r\n\t}\r\n\t.mdpro{\r\n\t\twidth: 100%;\r\n\t\theight: 100px;\r\n\t\tpadding: 4% 0;\r\n\t\tborder-bottom: 1px solid #ccc;\r\n\t}\r\n\t.mdpro img{\r\n\t\tdisplay: block;\r\n\t\twidth: 40%;\r\n\t\theight: 100px;\r\n\t\tfloat: left;\r\n\t\tmargin-right: 10%;\r\n\t}\r\n\t.right{\r\n\t\twidth: 50%;\r\n\t\theight: 100px;\r\n\t\tfloat: left;\r\n\t\tfont-size: 12px;\r\n\t}\r\n\t.mdname{\r\n\t\twidth: 100%;\r\n\t\tline-height: 20px;\r\n\t\tmargin-bottom: 20px;\r\n\t}\r\n\t.mdpr{\r\n\t\twidth: 100%;\r\n\t\tline-height: 20px;\r\n\t\tcolor: #f66;\r\n\t}\r\n\t.originprice{\r\n\t\twidth: 20%;\r\n\t\tmargin-left: 20px;\r\n\t\tcolor: #ccc;\r\n\t}\r\n</style>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 121 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scss_main_scss__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scss_main_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__scss_main_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__router_router_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__md_MyAjax_js__ = __webpack_require__(5);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
	data() {
		return {
			products: [],
			arr: []
		};
	},
	methods: {
		choosesort1() {
			var that = this;
			var keyword = that.$route.query.keyword;
			var cityID = localStorage.getItem("id");
			var url1 = "https://api.ricebook.com/3/enjoy_product/search.json?city_id=" + cityID + "&keyword=" + keyword + "&page=0";
			__WEBPACK_IMPORTED_MODULE_2__md_MyAjax_js__["a" /* default */].vueJson(url1, function (data) {
				that.products = data.products;
			}, function (err) {
				console.log(err);
			});
		},
		choosesort2() {
			var that = this;
			var keyword = that.$route.query.keyword;
			var url2 = "https://api.ricebook.com/3/enjoy_product/search.json?city_id=1&keyword=" + keyword + "&page=0";
			__WEBPACK_IMPORTED_MODULE_2__md_MyAjax_js__["a" /* default */].vueJson(url2, function (data) {
				that.products = data.products;
			}, function (err) {
				console.log(err);
			});
		},
		godetail(data) {

			var that = this;
			that.$router.push({ path: '/detail', query: { allid: data } });
		}
	},
	mounted() {
		var that = this;
		var keyword = that.$route.query.keyword;
		var cityID = localStorage.getItem("id");
		var url1 = "https://api.ricebook.com/3/enjoy_product/search.json?city_id=" + cityID + "&keyword=" + keyword + "&page=0";
		__WEBPACK_IMPORTED_MODULE_2__md_MyAjax_js__["a" /* default */].vueJson(url1, function (data) {
			console.log(data);
			that.products = data.products;
		}, function (err) {
			console.log(err);
		});
	}
});

/***/ }),
/* 122 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "homecontent"
  }, [_c('div', {
    staticClass: "sort"
  }, [_c('span', {
    on: {
      "click": function($event) {
        _vm.choosesort1()
      }
    }
  }, [_vm._v("本地服务")]), _vm._v(" "), _c('span', {
    on: {
      "click": function($event) {
        _vm.choosesort2()
      }
    }
  }, [_vm._v("全国送")])]), _vm._v(" "), _vm._m(0), _vm._v(" "), _c('div', {
    staticClass: "homecon"
  }, _vm._l((_vm.products), function(item) {
    return _c('div', {
      staticClass: "mdpro",
      on: {
        "click": function($event) {
          _vm.godetail(item.product_id)
        }
      }
    }, [_c('img', {
      attrs: {
        "src": item.product_image
      }
    }), _vm._v(" "), _c('div', {
      staticClass: "right"
    }, [_c('div', {
      staticClass: "mdname"
    }, [_vm._v(_vm._s(item.name))]), _vm._v(" "), _c('div', {
      staticClass: "mdpr"
    }, [_c('span', {
      staticClass: "mdprice"
    }, [_vm._v("￥" + _vm._s(item.price / 100) + "元")]), _c('span', {
      staticClass: "wei"
    }, [_vm._v("/" + _vm._s(item.show_entity_name))])])])])
  }))])
}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "sorttitile"
  }, [_vm._v("根据您的关键词"), _c('span'), _vm._v("为您推荐以下商品")])
}]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-7ee4b2a8", esExports)
  }
}

/***/ }),
/* 123 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_Buy_vue__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_e450ae94_hasScoped_true_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_Buy_vue__ = __webpack_require__(127);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(124)
}
var normalizeComponent = __webpack_require__(2)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-e450ae94"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_Buy_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_e450ae94_hasScoped_true_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_Buy_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "com\\Buy.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] Buy.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-e450ae94", Component.options)
  } else {
    hotAPI.reload("data-v-e450ae94", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(125);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("90aef9f2", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../node_modules/_css-loader@0.28.5@css-loader/index.js?sourceMap!../node_modules/_vue-loader@13.0.4@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-e450ae94\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/_vue-loader@13.0.4@vue-loader/lib/selector.js?type=styles&index=0!./Buy.vue", function() {
     var newContent = require("!!../node_modules/_css-loader@0.28.5@css-loader/index.js?sourceMap!../node_modules/_vue-loader@13.0.4@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-e450ae94\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/_vue-loader@13.0.4@vue-loader/lib/selector.js?type=styles&index=0!./Buy.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n.buyHeader p[data-v-e450ae94]{\n\twidth: 92%;\n\tpadding: 2%;\n\tline-height: 1.5rem;\t\t\n\tfont-size: 12px;\n\tborder-bottom: 1px solid #ccc;\n\tmargin-left: 2%;\n}\n.content[data-v-e450ae94]{\n\twidth: 100%;\n\tborder-bottom:1px solid #ccc ;\n}\n.shpi[data-v-e450ae94]{\n\tmargin-left:2%;\t\n\theight: 3rem;\n\tposition: relative;\n}\n.shpi b[data-v-e450ae94]{\n\twidth: 75%;\n\twhite-space: nowrap;\n\ttext-overflow: ellipsis;\n\toverflow: hidden;\n\tfont-weight: 100;\n\tfont-size: 14px;\n\tline-height: 26px;\n\tfloat: left\n}\n.shpi h4[data-v-e450ae94]{\n\t\n\tfont-size: 12px;\n\tposition: absolute;\n\ttop: 4px;\n\tright: 12px;\n}\n.shpi h4 i[data-v-e450ae94]{\n\t\tfont-style: inherit;\n}\n.detail[data-v-e450ae94]{\n\tfont-weight: 100;\n\tfont-size: 12px;\n\tdisplay: block;\n\tfloat: left;\n\tposition: absolute;\n\ttop: 25px;\n}\n.kong[data-v-e450ae94]{\n\twidth: 100%;\n\theight: 8px;\n\tbackground: #eee;\n}\n.quan[data-v-e450ae94]{\n\twidth: 100%;\n\theight: 6rem;\n\tborder: 1px solid #ccc;\t\n\tbox-sizing: border-box;\n}\n.top[data-v-e450ae94]{\n\twidth: 90%;\n\tfont-size: 12px;\n\tpadding: 3% 0;\t\n\theight: 1.3rem;\n}\n.top span[data-v-e450ae94]{\n\twidth: 1rem;\n\theight: 1rem;\n\tdisplay: block;\n\tborder-radius: 50%;\n\tmargin-left:3%;\n\tbackground: #f66;\n\tfloat: left;\n}\n.top i[data-v-e450ae94]{\n\tfont-style: inherit;\n\n\tcolor: #444;\n\tfloat: left;\n\tmargin-left: 1%;\n}\n.top h2[data-v-e450ae94]{\n\tfont-weight: 100;\n\tfloat: right;\n\tcolor: #ccc;\n\tmargin-right: 3%;\n}\n.downs[data-v-e450ae94]{\n\twidth: 96%;\n\tpadding: 2% 0;\n\theight: 2rem;\n}\n#txt[data-v-e450ae94]{\n\twidth: 70%;\n\theight: 30px;\n\toutline: none;\n\tmargin-left: 2%;\n\tbox-sizing: border-box;\n\ttext-indent: 3%;\n}\n#btn[data-v-e450ae94]{\n\toutline: none;\n\tbackground: #f00;\n\tcolor: #fff;\n\tborder: none;\n\twidth: 20%;\n\theight: 30px;\n\tbox-sizing: border-box;\n\tfont-size: 12px;\n}\n.sptotals[data-v-e450ae94]{\n\twidth: 100%;\n\tpadding: 4% 0;\n\theight: 1.0rem;\n\tborder-bottom: 1px solid #ccc;\n\tfont-size: 12px;\n}\n.sptotals h1[data-v-e450ae94]{\n\tfont-weight: 100;\n\tmargin-left: 2%;\n\tfloat: left;\n}\n.zongjia[data-v-e450ae94]{\nfloat: right;\nmargin-right: 4%;\n}\n.zongjia strong[data-v-e450ae94]{\n\tfont-weight: 100;\n}\n.buyfooter[data-v-e450ae94]{\n\twidth: 100%;\n\theight: 50px;\n\tposition: fixed;\n\tbottom: 0;\n\tleft: 0;\n}\n.heji[data-v-e450ae94]{\n\twidth: 70%;\n\tline-height: 50px;\n\tfont-size: 14px;\n\tcolor: #f00;\n\tfloat: left;\n}\n.money[data-v-e450ae94]{\n\tfloat: left;\n\tfont-weight: 100;\n\tfont-style: inherit;\n\tmargin-left: 3%;\n}\n.hj[data-v-e450ae94]{\n\tfloat: left;\n\tmargin-left:58%;\n\tfont-style: inherit;\n}\n.left[data-v-e450ae94]{\n\ttext-align: right;\n}\n.zhifu[data-v-e450ae94]{\n\twidth: 30%;\n\tcolor: #fff;\n\theight: 50px;\n\tline-height: 50px;\n\tbackground: #f00;\n\tfloat: left;\n\ttext-align: center;\n}\n", "", {"version":3,"sources":["G:/enjoy/com/com/Buy.vue?c16fc824"],"names":[],"mappings":";AA8EA;CACA,WAAA;CACA,YAAA;CACA,oBAAA;CACA,gBAAA;CACA,8BAAA;CACA,gBAAA;CACA;AACA;CACA,YAAA;CACA,8BAAA;CACA;AACA;CACA,eAAA;CACA,aAAA;CACA,mBAAA;CAEA;AACA;CACA,WAAA;CACA,oBAAA;CACA,wBAAA;CACA,iBAAA;CACA,iBAAA;CACA,gBAAA;CACA,kBAAA;CACA,WAAA;CAEA;AACA;;CAEA,gBAAA;CACA,mBAAA;CACA,SAAA;CACA,YAAA;CACA;AACA;EACA,oBAAA;CACA;AACA;CACA,iBAAA;CACA,gBAAA;CACA,eAAA;CACA,YAAA;CACA,mBAAA;CACA,UAAA;CAEA;AACA;CACA,YAAA;CACA,YAAA;CACA,iBAAA;CACA;AACA;CACA,YAAA;CACA,aAAA;CACA,uBAAA;CACA,uBAAA;CACA;AACA;CACA,WAAA;CACA,gBAAA;CACA,cAAA;CACA,eAAA;CAEA;AACA;CACA,YAAA;CACA,aAAA;CACA,eAAA;CACA,mBAAA;CACA,eAAA;CACA,iBAAA;CACA,YAAA;CAEA;AACA;CACA,oBAAA;;CAEA,YAAA;CACA,YAAA;CACA,gBAAA;CACA;AACA;CACA,iBAAA;CACA,aAAA;CACA,YAAA;CACA,iBAAA;CACA;AACA;CACA,WAAA;CACA,cAAA;CACA,aAAA;CAEA;AACA;CACA,WAAA;CACA,aAAA;CACA,cAAA;CACA,gBAAA;CACA,uBAAA;CACA,gBAAA;CACA;AACA;CACA,cAAA;CACA,iBAAA;CACA,YAAA;CACA,aAAA;CACA,WAAA;CACA,aAAA;CACA,uBAAA;CACA,gBAAA;CACA;AACA;CACA,YAAA;CACA,cAAA;CACA,eAAA;CACA,8BAAA;CACA,gBAAA;CACA;AACA;CACA,iBAAA;CACA,gBAAA;CACA,YAAA;CACA;AACA;AACA,aAAA;AACA,iBAAA;CACA;AACA;CACA,iBAAA;CACA;AACA;CACA,YAAA;CACA,aAAA;CACA,gBAAA;CACA,UAAA;CACA,QAAA;CAEA;AACA;CACA,WAAA;CACA,kBAAA;CACA,gBAAA;CACA,YAAA;CACA,YAAA;CACA;AACA;CACA,YAAA;CACA,iBAAA;CACA,oBAAA;CACA,gBAAA;CAEA;AACA;CACA,YAAA;CACA,gBAAA;CACA,oBAAA;CACA;AACA;CACA,kBAAA;CACA;AAEA;CACA,WAAA;CACA,YAAA;CACA,aAAA;CACA,kBAAA;CACA,iBAAA;CACA,YAAA;CACA,mBAAA;CACA","file":"Buy.vue","sourcesContent":["<template>\r\n\t<div class=\"buyHeader\">\r\n\t\t<p>本地精选</p>\r\n\t<div class=\"content\">\r\n\t\t<ul>\r\n\t\t\t<li v-for=\"item in list\" class=\"shpi\">\r\n\t\t\t\t<b>{{item.description1}}</b>\r\n\t\t\t\t<h4>\r\n\t\t\t\t\t<i>{{item.price1/100}}元</i>\t\r\n\t\t\t\t\tX<i>{{item.num}}</i>\r\n\t\t\t\t</h4>\t\t\t\r\n\t\t\t\t<div class=\"detail\">{{item.spec1}}</div>\t\t\t\r\n\t\t\t</li>\t\t\t\r\n\t\t</ul>\t\t\r\n\t</div>\t\r\n\t<div class=\"kong\"></div>\r\n\t\t<div class=\"quan\">\r\n\t\t\t<div class=\"top\">\r\n\t\t\t\t<span></span>\r\n\t\t\t\t<i>礼券</i>\r\n\t\t\t\t<h2>暂无礼券可用</h2>\r\n\t\t\t</div>\r\n\t\t<div class=\"downs\">\r\n\t\t\t<input type=\"text\" id=\"txt\">\r\n\t\t\t<input type=\"button\" value=\"兑换\" id=\"btn\">\t\r\n\t\t</div>\t\t\t\t\r\n\t</div>\r\n\t<div class=\"kong\"></div>\r\n\t<div class=\"sptotals\">\r\n\t\t<h1>商品金额</h1>\r\n\t\t<span class=\"zongjia\"> <strong class=\"yuan\">0</strong>元</span>\t\t\r\n\t</div>\t\r\n\t\t\r\n\t\t\r\n<div class=\"buyfooter\">\r\n\t<div class=\"heji\">\r\n\t\t<div class=\"left\">\r\n\t\t<i class=\"hj\">合计:</i>\r\n\t\t<h3 class=\"money\">0</h3>\r\n\t\t<span>元</span>\r\n\t</div>\r\n\t</div>\r\n\t<div class=\"zhifu\">\r\n\t\t去支付\r\n\t</div>\r\n</div>\t\t\r\n\t\t\r\n\t</div>\r\n</template>\r\n\r\n<script>\r\n\texport default {\r\n\t\tdata(){\r\n\t\t\treturn {\r\n\t\t\t\tlist:[]\r\n\t\t\t}\r\n\t\t},\r\n\t\tmounted(){\r\n\t\t\tvar that=this;\r\n\t\t\tvar goods=localStorage.getItem(\"goods\");\t\t\t\r\n\t\t\tthat.list=eval(goods);\r\n\t\t\tvar pri=\"\";\r\n\t\t\tvar Num=\"\";\r\n\t\t\tvar aa=0;\r\n\t\t\tfor(var i in that.list){\r\n\t\t\t\tpri=that.list[i].price1/100;\r\n\t\t\t\tNum=that.list[i].num;\r\n\t\t\t\taa+=pri*Num;\r\n\t\t\t};\r\n\t\t\t$(\".yuan\").html(aa);\r\n\t\t\t$(\".money\").html(aa);\r\n\t\t}\r\n\t}\r\n</script>\r\n</script>\r\n\r\n<style scoped>\r\n\t\r\n\t.buyHeader p{\r\n\t\twidth: 92%;\r\n\t\tpadding: 2%;\r\n\t\tline-height: 1.5rem;\t\t\r\n\t\tfont-size: 12px;\r\n\t\tborder-bottom: 1px solid #ccc;\r\n\t\tmargin-left: 2%;\r\n\t}\r\n\t.content{\r\n\t\twidth: 100%;\r\n\t\tborder-bottom:1px solid #ccc ;\r\n\t}\r\n\t.shpi{\r\n\t\tmargin-left:2%;\t\r\n\t\theight: 3rem;\r\n\t\tposition: relative;\t\r\n\t\t\r\n\t}\r\n\t.shpi b{\r\n\t\twidth: 75%;\r\n\t\twhite-space: nowrap;\r\n\t\ttext-overflow: ellipsis;\r\n\t\toverflow: hidden;\r\n\t\tfont-weight: 100;\r\n\t\tfont-size: 14px;\r\n\t\tline-height: 26px;\r\n\t\tfloat: left\r\n\t\t\r\n\t}\r\n\t.shpi h4{\r\n\t\t\r\n\t\tfont-size: 12px;\r\n\t\tposition: absolute;\r\n\t\ttop: 4px;\r\n\t\tright: 12px;\r\n\t}\r\n\t.shpi h4 i{\r\n\t\t\tfont-style: inherit;\r\n\t}\r\n\t.detail{\r\n\t\tfont-weight: 100;\r\n\t\tfont-size: 12px;\r\n\t\tdisplay: block;\r\n\t\tfloat: left;\r\n\t\tposition: absolute;\r\n\t\ttop: 25px;\r\n\t\t\r\n\t}\r\n\t.kong{\r\n\t\twidth: 100%;\r\n\t\theight: 8px;\r\n\t\tbackground: #eee;\t\t\r\n\t}\r\n\t.quan{\r\n\t\twidth: 100%;\r\n\t\theight: 6rem;\r\n\t\tborder: 1px solid #ccc;\t\r\n\t\tbox-sizing: border-box;\r\n\t}\r\n\t.top{\r\n\t\twidth: 90%;\r\n\t\tfont-size: 12px;\r\n\t\tpadding: 3% 0;\t\r\n\t\theight: 1.3rem;\r\n\t\r\n\t}\r\n\t.top span{\r\n\t\twidth: 1rem;\r\n\t\theight: 1rem;\r\n\t\tdisplay: block;\r\n\t\tborder-radius: 50%;\r\n\t\tmargin-left:3%;\r\n\t\tbackground: #f66;\r\n\t\tfloat: left;\r\n\t\r\n\t}\r\n\t.top i{\r\n\t\tfont-style: inherit;\r\n\t\r\n\t\tcolor: #444;\r\n\t\tfloat: left;\r\n\t\tmargin-left: 1%;\r\n\t}\r\n\t.top h2{\r\n\t\tfont-weight: 100;\r\n\t\tfloat: right;\r\n\t\tcolor: #ccc;\r\n\t\tmargin-right: 3%;\r\n\t}\r\n\t.downs{\r\n\t\twidth: 96%;\r\n\t\tpadding: 2% 0;\r\n\t\theight: 2rem;\r\n\t\t\r\n\t}\r\n\t#txt{\r\n\t\twidth: 70%;\r\n\t\theight: 30px;\r\n\t\toutline: none;\r\n\t\tmargin-left: 2%;\r\n\t\tbox-sizing: border-box;\r\n\t\ttext-indent: 3%;\r\n\t}\r\n\t#btn{\r\n\t\toutline: none;\r\n\t\tbackground: #f00;\r\n\t\tcolor: #fff;\r\n\t\tborder: none;\r\n\t\twidth: 20%;\r\n\t\theight: 30px;\r\n\t\tbox-sizing: border-box;\r\n\t\tfont-size: 12px;\r\n\t}\r\n\t.sptotals{\r\n\t\twidth: 100%;\r\n\t\tpadding: 4% 0;\r\n\t\theight: 1.0rem;\r\n\t\tborder-bottom: 1px solid #ccc;\r\n\t\tfont-size: 12px;\r\n\t}\r\n\t.sptotals h1{\r\n\t\tfont-weight: 100;\r\n\t\tmargin-left: 2%;\r\n\t\tfloat: left;\r\n\t}\r\n\t.zongjia{\r\n\tfloat: right;\r\n\tmargin-right: 4%;\t\t\r\n\t}\r\n\t.zongjia strong{\r\n\t\tfont-weight: 100;\r\n\t}\r\n\t.buyfooter{\r\n\t\twidth: 100%;\r\n\t\theight: 50px;\r\n\t\tposition: fixed;\r\n\t\tbottom: 0;\r\n\t\tleft: 0;\r\n\t\t\r\n\t}\r\n\t.heji{\r\n\t\twidth: 70%;\r\n\t\tline-height: 50px;\r\n\t\tfont-size: 14px;\r\n\t\tcolor: #f00;\r\n\t\tfloat: left;\r\n\t}\r\n\t.money{\r\n\t\tfloat: left;\r\n\t\tfont-weight: 100;\r\n\t\tfont-style: inherit;\r\n\t\tmargin-left: 3%;\r\n\t\t\r\n\t}\r\n\t.hj{\r\n\t\tfloat: left;\r\n\t\tmargin-left:58%;\r\n\t\tfont-style: inherit;\r\n\t}\r\n\t.left{\r\n\t\ttext-align: right;\r\n\t}\r\n\t\r\n\t.zhifu{\r\n\t\twidth: 30%;\r\n\t\tcolor: #fff;\r\n\t\theight: 50px;\r\n\t\tline-height: 50px;\r\n\t\tbackground: #f00;\r\n\t\tfloat: left;\r\n\t\ttext-align: center;\r\n\t}\r\n</style>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 126 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
	data() {
		return {
			list: []
		};
	},
	mounted() {
		var that = this;
		var goods = localStorage.getItem("goods");
		that.list = eval(goods);
		var pri = "";
		var Num = "";
		var aa = 0;
		for (var i in that.list) {
			pri = that.list[i].price1 / 100;
			Num = that.list[i].num;
			aa += pri * Num;
		};
		$(".yuan").html(aa);
		$(".money").html(aa);
	}
});

/***/ }),
/* 127 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "buyHeader"
  }, [_c('p', [_vm._v("本地精选")]), _vm._v(" "), _c('div', {
    staticClass: "content"
  }, [_c('ul', _vm._l((_vm.list), function(item) {
    return _c('li', {
      staticClass: "shpi"
    }, [_c('b', [_vm._v(_vm._s(item.description1))]), _vm._v(" "), _c('h4', [_c('i', [_vm._v(_vm._s(item.price1 / 100) + "元")]), _vm._v("\t\n\t\t\t\t\tX"), _c('i', [_vm._v(_vm._s(item.num))])]), _vm._v(" "), _c('div', {
      staticClass: "detail"
    }, [_vm._v(_vm._s(item.spec1))])])
  }))]), _vm._v(" "), _c('div', {
    staticClass: "kong"
  }), _vm._v(" "), _vm._m(0), _vm._v(" "), _c('div', {
    staticClass: "kong"
  }), _vm._v(" "), _vm._m(1), _vm._v(" "), _vm._m(2)])
}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "quan"
  }, [_c('div', {
    staticClass: "top"
  }, [_c('span'), _vm._v(" "), _c('i', [_vm._v("礼券")]), _vm._v(" "), _c('h2', [_vm._v("暂无礼券可用")])]), _vm._v(" "), _c('div', {
    staticClass: "downs"
  }, [_c('input', {
    attrs: {
      "type": "text",
      "id": "txt"
    }
  }), _vm._v(" "), _c('input', {
    attrs: {
      "type": "button",
      "value": "兑换",
      "id": "btn"
    }
  })])])
},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "sptotals"
  }, [_c('h1', [_vm._v("商品金额")]), _vm._v(" "), _c('span', {
    staticClass: "zongjia"
  }, [_c('strong', {
    staticClass: "yuan"
  }, [_vm._v("0")]), _vm._v("元")])])
},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "buyfooter"
  }, [_c('div', {
    staticClass: "heji"
  }, [_c('div', {
    staticClass: "left"
  }, [_c('i', {
    staticClass: "hj"
  }, [_vm._v("合计:")]), _vm._v(" "), _c('h3', {
    staticClass: "money"
  }, [_vm._v("0")]), _vm._v(" "), _c('span', [_vm._v("元")])])]), _vm._v(" "), _c('div', {
    staticClass: "zhifu"
  }, [_vm._v("\n\t\t去支付\n\t")])])
}]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-e450ae94", esExports)
  }
}

/***/ }),
/* 128 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_MapDetail_vue__ = __webpack_require__(131);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_505d917d_hasScoped_true_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_MapDetail_vue__ = __webpack_require__(132);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(129)
}
var normalizeComponent = __webpack_require__(2)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-505d917d"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_MapDetail_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_505d917d_hasScoped_true_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_MapDetail_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "com\\MapDetail.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] MapDetail.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-505d917d", Component.options)
  } else {
    hotAPI.reload("data-v-505d917d", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(130);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("93a797b4", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../node_modules/_css-loader@0.28.5@css-loader/index.js?sourceMap!../node_modules/_vue-loader@13.0.4@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-505d917d\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/_vue-loader@13.0.4@vue-loader/lib/selector.js?type=styles&index=0!./MapDetail.vue", function() {
     var newContent = require("!!../node_modules/_css-loader@0.28.5@css-loader/index.js?sourceMap!../node_modules/_vue-loader@13.0.4@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-505d917d\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/_vue-loader@13.0.4@vue-loader/lib/selector.js?type=styles&index=0!./MapDetail.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n.homecontent[data-v-505d917d]{\n\twidth: 100%;\n\theight: 100%;\n\toverflow-y: auto;\n}\n.homecontent[data-v-505d917d]::-webkit-scrollbar {display: none;\n}\n.sort[data-v-505d917d]{\n\twidth: 100%;\n\theight: 50px;\n}\n.sort span[data-v-505d917d]{\n\twidth: 50%;\n\tdisplay: inline-block;\n\tline-height: 50px;\n\ttext-align: center;\n\tfloat: left;\n\tfont-size: 16px;\n\tbox-sizing: border-box;\n\tborder-right: 1px solid #ccc;\n\tborder-bottom: 1px solid #ccc;\n}\n.iconfont[data-v-505d917d]{\n\tfont-style: inherit;\n}\n.intelligent[data-v-505d917d]{\n\tfont-size: 12px;\n}\n.intelligent p[data-v-505d917d]{\n\twidth: 100%;\n\theight: 30px;\n\tline-height: 30px;\n\tfont-size: 12px;\n\ttext-align: center;\n\tborder-bottom: 1px solid #ccc;\n\tdisplay: none;\n\tcolor: #f66;\n}\n.homecon[data-v-505d917d]{\n\twidth: 90%;\n\tpadding: 5%;\n\theight: 90%;\n}\n.mdpro[data-v-505d917d]{\n\twidth: 100%;\n\theight: 100px;\n\tpadding: 4% 0;\n\tborder-bottom: 1px solid #ccc;\n}\n.mdpro img[data-v-505d917d]{\n\tdisplay: block;\n\twidth: 40%;\n\theight: 100px;\n\tfloat: left;\n\tmargin-right: 10%;\n}\n.right[data-v-505d917d]{\n\twidth: 50%;\n\theight: 120px;\n\tfloat: left;\n\tfont-size:12px;\n}\n.mdname[data-v-505d917d]{\n\twidth: 100%;\n\tfont-size: 14px;\n\tline-height: 15px;\n\tmargin-bottom: 20px;\n}\n.mdpr[data-v-505d917d]{\n\twidth: 100%;\n\t\n\tcolor: #f66;\n}\n.mdarea[data-v-505d917d]{\nborder-bottom: 5px;\npadding:2% 0 ;\n}\n.originprice[data-v-505d917d]{\n\twidth: 20%;\n\tmargin-left: 20px;\n\tcolor: #ccc;\n\ttext-decoration: line-through;\n}\n#footer[data-v-505d917d]{\n\theight: 0;\n}\n", "", {"version":3,"sources":["G:/enjoy/com/com/MapDetail.vue?d1307df6"],"names":[],"mappings":";AA2FA;CACA,YAAA;CACA,aAAA;CACA,iBAAA;CACA;AACA,kDAAA,cAAA;CAAA;AACA;CACA,YAAA;CACA,aAAA;CACA;AACA;CACA,WAAA;CACA,sBAAA;CACA,kBAAA;CACA,mBAAA;CACA,YAAA;CACA,gBAAA;CACA,uBAAA;CACA,6BAAA;CACA,8BAAA;CACA;AACA;CACA,oBAAA;CACA;AACA;CACA,gBAAA;CACA;AACA;CACA,YAAA;CACA,aAAA;CACA,kBAAA;CACA,gBAAA;CACA,mBAAA;CACA,8BAAA;CACA,cAAA;CACA,YAAA;CACA;AACA;CACA,WAAA;CACA,YAAA;CACA,YAAA;CACA;AACA;CACA,YAAA;CACA,cAAA;CACA,cAAA;CACA,8BAAA;CACA;AACA;CACA,eAAA;CACA,WAAA;CACA,cAAA;CACA,YAAA;CACA,kBAAA;CACA;AACA;CACA,WAAA;CACA,cAAA;CACA,YAAA;CACA,eAAA;CAEA;AACA;CACA,YAAA;CACA,gBAAA;CACA,kBAAA;CACA,oBAAA;CACA;AACA;CACA,YAAA;;CAEA,YAAA;CACA;AACA;AACA,mBAAA;AACA,cAAA;CAGA;AACA;CACA,WAAA;CACA,kBAAA;CACA,YAAA;CACA,8BAAA;CACA;AACA;CACA,UAAA;CAEA","file":"MapDetail.vue","sourcesContent":["<template>\r\n<div class=\"homecontent\">\r\n\t<div class=\"sort\">\r\n\t\t<span>全部</span>\r\n\t\t<span @click = \"choosesort()\" >智能排序<i class=\"iconfont\">&#xe643;</i></span>\r\n\t</div>\r\n\t<div class=\"intelligent\">\r\n\t\t<p v-for = \"item in data1\" @click = gosort(item)>{{item.sort_name}}</p>\r\n\t</div>\r\n\t<div class=\"homecon\">\r\n\t\t<div class=\"mdpro\" v-for=\"item in data2\" @click = gomapnewdetail(att)>\r\n\t\t\t<img :src=item.product_image >\r\n\t\t\t<div class=\"right\">\r\n\t\t\t\t<div class=\"mdname\">{{item.name}}</div>\r\n\t\t\t\t<div class=\"mdpr\"><span class=\"mdprice\">￥{{item.price/100}}</span><span class=\"wei\">/{{item.show_entity_name}}</span><span class=\"originprice\">￥{{item.original_price/100}}</span></div>\r\n\t\t\t\t<div class=\"mdarea\">{{item.area}}</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n</template>\r\n\r\n<script>\r\n\timport MyAjax from \"./../md/MyAjax.js\";\r\n\timport \"./../scss/main.scss\";\r\n\timport router from \"./../router/router.js\"; \r\n\texport default{\r\n\t\tdata(){\r\n\t\t\treturn{\r\n\t\t\t\tdata1:[],\r\n\t\t\t\tdata2:[],\r\n\t\t\t\tproID:[],\r\n\t\t\t\tsortID:1,\r\n\t\t\t\tatt:'',\r\n\t\t\t\t\r\n\t\t\t\t\r\n\t\t\t}\r\n\t\t},\r\n\t\tmethods:{\r\n\t\t\tgomapnewdetail(data3){\r\n\t\t\t\tvar that = this;\r\n\t\t\t\tthat.$router.push({path:\"/mapnewdetail\",query:{proID:data3}})\r\n\t\t\t},\r\n\t\t\tchoosesort(){\r\n\t\t\t\t$(\".intelligent\").find(\"p\").css(\"display\",\"block\");\t\t\t\t\r\n\t\t\t},\r\n\t\t\tgosort(data4){\r\n\t\t\t\tvar that = this;\r\n\t\t\t\tvar sortID = data4.sort_id;\r\n\t\t\t\tvar categoryID = that.$route.query.categoryID;\r\n\t\t\t\tvar cityID = localStorage.getItem(\"id\");\r\n\t\t\t\t$(\".intelligent\").find(\"p\").css(\"display\",\"none\");\r\n\t\t\t\tvar url2 = \"https://api.ricebook.com/4/tab/category_product_list.json?category_id=\"+categoryID+\"&sort=\"+sortID+\"&from_id=0&city_id=\"+cityID+\"&page=0\";\r\n\t\t\t\tMyAjax.vueJson(url2,function(data){\r\n\t\t\t\tthat.data2 = data;\r\n\t\t\t\tfor(var i in that.data2){\r\n\t\t\t\t\tthat.att=that.data2[i].product_id;\r\n\t\t\t\t}\r\n\t\t\t\t \r\n\t\t\t},function(err){\r\n\t\t\t\tconsole.log(err)\r\n\t\t\t});\t\t\t\t\r\n\t\t\t}\r\n\t\t},\r\n\t\tmounted(){\r\n\t\t\tvar that = this;\r\n\t\t\tvar categoryID = that.$route.query.categoryID;\r\n\t\t\tvar cityID = localStorage.getItem(\"id\");\r\n\t\t\tvar sortID = that.sortID;\r\n\t\t\tvar url1 = \"https://api.ricebook.com/4/tab/sub_category.json?category_id=\"+categoryID+\"&city_id=\"+cityID+\"&from_id=0\";\r\n\t\t\tvar url2 = \"https://api.ricebook.com/4/tab/category_product_list.json?category_id=\"+categoryID+\"&sort=\"+sortID+\"&from_id=0&city_id=\"+cityID+\"&page=0\"\r\n\t\t\tMyAjax.vueJson(url1,function(data){\r\n\t\t\t\t\tthat.data1 = data.sort;\r\n\t\t\t\t},function(err){\r\n\t\t\t\t\tconsole.log(err)\r\n\t\t\t\t});\r\n\t\t\tMyAjax.vueJson(url2,function(data){\r\n\t\t\t\tthat.data2 = data;\r\n\t\t\t\tfor(var i in that.data2){\r\n\t\t\t\t\tthat.att=that.data2[i].product_id;\r\n\t\t\t\t}\r\n\t\t\t\t \r\n\t\t\t},function(err){\r\n\t\t\t\tconsole.log(err)\r\n\t\t\t});\r\n\t\t\t\r\n\t\t}\r\n\t}\r\n</script>\r\n\r\n<style scoped>\r\n\t.homecontent{\r\n\t\twidth: 100%;\r\n\t\theight: 100%;\r\n\t\toverflow-y: auto;\r\n\t}\r\n\t.homecontent::-webkit-scrollbar {display: none;}\r\n\t.sort{\r\n\t\twidth: 100%;\r\n\t\theight: 50px;\r\n\t}\r\n\t.sort span{\r\n\t\twidth: 50%;\r\n\t\tdisplay: inline-block;\r\n\t\tline-height: 50px;\r\n\t\ttext-align: center;\r\n\t\tfloat: left;\r\n\t\tfont-size: 16px;\r\n\t\tbox-sizing: border-box;\r\n\t\tborder-right: 1px solid #ccc;\r\n\t\tborder-bottom: 1px solid #ccc;\r\n\t}\r\n\t .iconfont{\r\n\t\tfont-style: inherit;\r\n\t}\r\n\t.intelligent{\r\n\t\tfont-size: 12px;\r\n\t}\r\n\t.intelligent p{\r\n\t\twidth: 100%;\r\n\t\theight: 30px;\r\n\t\tline-height: 30px;\r\n\t\tfont-size: 12px;\r\n\t\ttext-align: center;\r\n\t\tborder-bottom: 1px solid #ccc;\r\n\t\tdisplay: none;\r\n\t\tcolor: #f66;\r\n\t}\r\n\t.homecon{\r\n\t\twidth: 90%;\r\n\t\tpadding: 5%;\r\n\t\theight: 90%;\r\n\t}\r\n\t.mdpro{\r\n\t\twidth: 100%;\r\n\t\theight: 100px;\r\n\t\tpadding: 4% 0;\r\n\t\tborder-bottom: 1px solid #ccc;\r\n\t}\r\n\t.mdpro img{\r\n\t\tdisplay: block;\r\n\t\twidth: 40%;\r\n\t\theight: 100px;\r\n\t\tfloat: left;\r\n\t\tmargin-right: 10%;\r\n\t}\r\n\t.right{\r\n\t\twidth: 50%;\r\n\t\theight: 120px;\r\n\t\tfloat: left;\r\n\t\tfont-size:12px;\r\n\t\t\r\n\t}\r\n\t.mdname{\r\n\t\twidth: 100%;\r\n\t\tfont-size: 14px;\r\n\t\tline-height: 15px;\r\n\t\tmargin-bottom: 20px;\r\n\t}\r\n\t.mdpr{\r\n\t\twidth: 100%;\r\n\t\t\r\n\t\tcolor: #f66;\r\n\t}\r\n\t.mdarea{\r\n\tborder-bottom: 5px;\r\n\tpadding:2% 0 ;\r\n\t\r\n\t\t\r\n\t}\r\n\t.originprice{\r\n\t\twidth: 20%;\r\n\t\tmargin-left: 20px;\r\n\t\tcolor: #ccc;\r\n\t\ttext-decoration: line-through;\r\n\t}\r\n\t#footer{\r\n\t\theight: 0;\r\n\t\t\r\n\t}\r\n</style>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 131 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__md_MyAjax_js__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scss_main_scss__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scss_main_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__scss_main_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__router_router_js__ = __webpack_require__(3);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
	data() {
		return {
			data1: [],
			data2: [],
			proID: [],
			sortID: 1,
			att: ''

		};
	},
	methods: {
		gomapnewdetail(data3) {
			var that = this;
			that.$router.push({ path: "/mapnewdetail", query: { proID: data3 } });
		},
		choosesort() {
			$(".intelligent").find("p").css("display", "block");
		},
		gosort(data4) {
			var that = this;
			var sortID = data4.sort_id;
			var categoryID = that.$route.query.categoryID;
			var cityID = localStorage.getItem("id");
			$(".intelligent").find("p").css("display", "none");
			var url2 = "https://api.ricebook.com/4/tab/category_product_list.json?category_id=" + categoryID + "&sort=" + sortID + "&from_id=0&city_id=" + cityID + "&page=0";
			__WEBPACK_IMPORTED_MODULE_0__md_MyAjax_js__["a" /* default */].vueJson(url2, function (data) {
				that.data2 = data;
				for (var i in that.data2) {
					that.att = that.data2[i].product_id;
				}
			}, function (err) {
				console.log(err);
			});
		}
	},
	mounted() {
		var that = this;
		var categoryID = that.$route.query.categoryID;
		var cityID = localStorage.getItem("id");
		var sortID = that.sortID;
		var url1 = "https://api.ricebook.com/4/tab/sub_category.json?category_id=" + categoryID + "&city_id=" + cityID + "&from_id=0";
		var url2 = "https://api.ricebook.com/4/tab/category_product_list.json?category_id=" + categoryID + "&sort=" + sortID + "&from_id=0&city_id=" + cityID + "&page=0";
		__WEBPACK_IMPORTED_MODULE_0__md_MyAjax_js__["a" /* default */].vueJson(url1, function (data) {
			that.data1 = data.sort;
		}, function (err) {
			console.log(err);
		});
		__WEBPACK_IMPORTED_MODULE_0__md_MyAjax_js__["a" /* default */].vueJson(url2, function (data) {
			that.data2 = data;
			for (var i in that.data2) {
				that.att = that.data2[i].product_id;
			}
		}, function (err) {
			console.log(err);
		});
	}
});

/***/ }),
/* 132 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "homecontent"
  }, [_c('div', {
    staticClass: "sort"
  }, [_c('span', [_vm._v("全部")]), _vm._v(" "), _c('span', {
    on: {
      "click": function($event) {
        _vm.choosesort()
      }
    }
  }, [_vm._v("智能排序"), _c('i', {
    staticClass: "iconfont"
  }, [_vm._v("")])])]), _vm._v(" "), _c('div', {
    staticClass: "intelligent"
  }, _vm._l((_vm.data1), function(item) {
    return _c('p', {
      on: {
        "click": function($event) {
          _vm.gosort(item)
        }
      }
    }, [_vm._v(_vm._s(item.sort_name))])
  })), _vm._v(" "), _c('div', {
    staticClass: "homecon"
  }, _vm._l((_vm.data2), function(item) {
    return _c('div', {
      staticClass: "mdpro",
      on: {
        "click": function($event) {
          _vm.gomapnewdetail(_vm.att)
        }
      }
    }, [_c('img', {
      attrs: {
        "src": item.product_image
      }
    }), _vm._v(" "), _c('div', {
      staticClass: "right"
    }, [_c('div', {
      staticClass: "mdname"
    }, [_vm._v(_vm._s(item.name))]), _vm._v(" "), _c('div', {
      staticClass: "mdpr"
    }, [_c('span', {
      staticClass: "mdprice"
    }, [_vm._v("￥" + _vm._s(item.price / 100))]), _c('span', {
      staticClass: "wei"
    }, [_vm._v("/" + _vm._s(item.show_entity_name))]), _c('span', {
      staticClass: "originprice"
    }, [_vm._v("￥" + _vm._s(item.original_price / 100))])]), _vm._v(" "), _c('div', {
      staticClass: "mdarea"
    }, [_vm._v(_vm._s(item.area))])])])
  }))])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-505d917d", esExports)
  }
}

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map