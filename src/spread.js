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
import { flatten } from 'flat';
import { isPlainObject } from 'is-plain-object';
import flatmap from 'flatmap';
import * as util from './util.js';

export default function (rootInput, options) {
  function spread(input) {
    //recursive spread function
    //detect types of input
    if (isPlainObject(input)) {
      return spreadHelper(input);
    } else if (Array.isArray(input)) {
      return flatmap(input, function (item) {
        return spreadHelper(item);
      });
    } else {
      throw new TypeError(
        'json-spread input needs to be either a plain object or an array. You inputted a typeof' +
          typeof input
      );
    }
    function spreadHelper(spreadInput) {
      if (Object.keys(spreadInput).length === 0) {
        return [{}]; // Return early for empty objects
      }
      spreadInput = flatten(spreadInput, {
        safe: true,
        delimiter: options.delimiter,
      });
      let output = [];
      let containsArray = false;
      //create a default model objects with non array properties
      const model = {};
      Object.entries(spreadInput).forEach(([key, value]) => {
        if (!Array.isArray(value)) {
          model[key] = value;
        }
      });
      //iterate through each property again
      Object.entries(spreadInput).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          //if it is array, we test if it contains nested array or not
          if (value.length === 0) {
            //if empty array
            if (options.removeEmptyArray) {
              delete spreadInput[key];
            } else {
              spreadInput[key] = options.emptyValue;
            }
            return;
          } else {
            containsArray = true;
            let propertyArray = [];
            if (util.containsNestedArray(value)) {
              //if it contains nested array, we recurse down the tree
              value.forEach((propValue) => {
                const innerArray = spread(propValue); //this returns us an array of flattened objects
                innerArray.forEach((item) => {
                  propertyArray.push(item);
                });
              });
            } else {
              //if it does not contain nested array, we use the array as it is.
              propertyArray = value;
            }
            //concat the model object with the object inside the property array and produce a new dataset, this new data set will exist in output;
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
        output = spread(output);
        return output;
      } else {
        return [spreadInput];
      }
    }
  }
  return spread(rootInput);
}
