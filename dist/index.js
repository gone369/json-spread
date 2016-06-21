'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; /*
                                                                                                                                                                                                                                                   *The MIT License (MIT)
                                                                                                                                                                                                                                                   *Copyright (c) 2016 Xun Chen
                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                   *Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                   *The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                   *THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
                                                                                                                                                                                                                                                   */


var _flat = require('flat');

var _flat2 = _interopRequireDefault(_flat);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jsonSpread = function jsonSpread(rootInput) {
  //helper functions
  var containsNestedArray = function containsNestedArray(value) {
    value = (0, _flat2.default)(value, { safe: true });
    var test = false;
    _lodash2.default.forEach(value, function (v, key) {
      if (v.constructor.name === 'Array') {
        test = true;
      }
    });
    return test;
  };
  var spread = function spread(input) {
    //recursive spread function
    var spreadhelper = function spreadhelper(data) {
      data = (0, _flat2.default)(data, { safe: true });
      var retdata = [];
      var containsArray = false;
      //create a default model objects with non array properties
      var model = {};
      _lodash2.default.forEach(data, function (value, key) {
        if (!_lodash2.default.isArray(value)) {
          model[key] = value;
        }
      });
      //iterate through each property again
      _lodash2.default.forEach(data, function (value, key) {
        if (_lodash2.default.isArray(value)) {
          (function () {
            //if it is array, we test if it contains nested array or not
            containsArray = true;
            var propertyArray = [];
            if (containsNestedArray(value)) {
              //if it contains nested array, we recurse down the tree
              _lodash2.default.forEach(value, function (propValue, propKey) {
                var innerArray = spread(propValue); //this returns us an array of flattened objects
                _lodash2.default.forEach(innerArray, function (item, i) {
                  propertyArray.push(item);
                });
              });
            } else {
              //if it does not contain nested array, we use the array as it is.
              propertyArray = value;
            }
            //concat the model object with the object inside the property array and produce a new dataset, this new data set will exist in retdata;
            _lodash2.default.map(propertyArray, function (propValue, index) {
              var propObj = {};
              propObj[key] = propValue;
              retdata.push(_lodash2.default.assign({}, model, propObj));
            });
          })();
        }
      });

      if (containsArray) {
        retdata = spread(retdata);
        return retdata;
      } else {
        return [data];
      }
    };
    //detect types of input
    if (_lodash2.default.isPlainObject(input)) {
      return spreadhelper(input);
    } else if (_lodash2.default.isArray(input)) {
      return _lodash2.default.flatMap(input, function (item) {
        return spreadhelper(item);
      });
    } else {
      throw new TypeError('json-spread input needs to be either a hash or an array. You inputted a typeof ' + (typeof input === 'undefined' ? 'undefined' : _typeof(input)));
      //throw `json-spread input needs to be either a hash or an array. You inputted a typeof ${typeof input}`;
    }
  };

  return spread(rootInput);
};

module.exports = jsonSpread;