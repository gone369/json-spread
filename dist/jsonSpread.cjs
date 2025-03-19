"use strict";
function isBuffer(obj) {
  return obj && obj.constructor && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj);
}
function keyIdentity(key) {
  return key;
}
function flatten(target, opts) {
  opts = opts || {};
  const delimiter = opts.delimiter || ".";
  const maxDepth = opts.maxDepth;
  const transformKey = opts.transformKey || keyIdentity;
  const output = {};
  function step(object, prev, currentDepth) {
    currentDepth = currentDepth || 1;
    Object.keys(object).forEach(function(key) {
      const value = object[key];
      const isarray = opts.safe && Array.isArray(value);
      const type = Object.prototype.toString.call(value);
      const isbuffer = isBuffer(value);
      const isobject = type === "[object Object]" || type === "[object Array]";
      const newKey = prev ? prev + delimiter + transformKey(key) : transformKey(key);
      if (!isarray && !isbuffer && isobject && Object.keys(value).length && (!opts.maxDepth || currentDepth < maxDepth)) {
        return step(value, newKey, currentDepth + 1);
      }
      output[newKey] = value;
    });
  }
  step(target);
  return output;
}
/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */
function isObject(o) {
  return Object.prototype.toString.call(o) === "[object Object]";
}
function isPlainObject(o) {
  var ctor, prot;
  if (isObject(o) === false) return false;
  ctor = o.constructor;
  if (ctor === void 0) return true;
  prot = ctor.prototype;
  if (isObject(prot) === false) return false;
  if (prot.hasOwnProperty("isPrototypeOf") === false) {
    return false;
  }
  return true;
}
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var flatmap$1;
var hasRequiredFlatmap;
function requireFlatmap() {
  if (hasRequiredFlatmap) return flatmap$1;
  hasRequiredFlatmap = 1;
  flatmap$1 = function(arr, iter, context) {
    var results = [];
    if (!Array.isArray(arr)) return results;
    arr.forEach(function(value, index, list) {
      var res = iter.call(context, value, index, list);
      if (Array.isArray(res)) {
        results.push.apply(results, res);
      } else if (res != null) {
        results.push(res);
      }
    });
    return results;
  };
  return flatmap$1;
}
var flatmapExports = requireFlatmap();
const flatmap = /* @__PURE__ */ getDefaultExportFromCjs(flatmapExports);
function containsNestedArray(value) {
  if (Array.isArray(value)) {
    return value.some(
      (item) => Array.isArray(item) || containsNestedArray(item)
    );
  } else if (typeof value === "object" && value !== null) {
    return Object.values(value).some(
      (item) => Array.isArray(item) || containsNestedArray(item)
    );
  }
  return false;
}
/*!
 *The MIT License (MIT)
 *Copyright (c) 2016 Xun Chen
 *
 *Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 *The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 *THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function spread(rootInput, options) {
  function spread2(input) {
    if (isPlainObject(input)) {
      return spreadHelper(input);
    } else if (Array.isArray(input)) {
      return flatmap(input, function(item) {
        return spreadHelper(item);
      });
    } else {
      throw new TypeError(
        "json-spread input needs to be either a plain object or an array. You inputted a typeof" + typeof input
      );
    }
    function spreadHelper(spreadInput) {
      if (Object.keys(spreadInput).length === 0) {
        return [{}];
      }
      spreadInput = flatten(spreadInput, {
        safe: true,
        delimiter: options.delimiter
      });
      let output = [];
      let containsArray = false;
      const model = {};
      Object.entries(spreadInput).forEach(([key, value]) => {
        if (!Array.isArray(value)) {
          model[key] = value;
        }
      });
      Object.entries(spreadInput).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          if (value.length === 0) {
            if (options.removeEmptyArray) {
              delete spreadInput[key];
            } else {
              spreadInput[key] = options.emptyValue;
            }
            return;
          } else {
            containsArray = true;
            let propertyArray = [];
            if (containsNestedArray(value)) {
              value.forEach((propValue) => {
                const innerArray = spread2(propValue);
                innerArray.forEach((item) => {
                  propertyArray.push(item);
                });
              });
            } else {
              propertyArray = value;
            }
            const baseModel = { ...model };
            propertyArray.forEach((propValue) => {
              const resultObj = { ...baseModel };
              resultObj[key] = propValue;
              output.push(resultObj);
            });
          }
        }
      });
      if (containsArray) {
        output = spread2(output);
        return output;
      } else {
        return [spreadInput];
      }
    }
  }
  return spread2(rootInput);
}
const defaultOptions = {
  delimiter: ".",
  removeEmptyArray: false,
  emptyValue: null,
  safe: true,
  debug: false
};
const jsonSpread = function(input, options) {
  return jsonSpread.spread(input, options);
};
jsonSpread.spread = function(input, options) {
  const opts = { ...defaultOptions, ...options };
  return spread(input, opts);
};
module.exports = jsonSpread;
