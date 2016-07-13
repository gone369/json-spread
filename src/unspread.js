/*
 *The MIT License (MIT)
 *Copyright (c) 2016 Xun Chen
 *
 *Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 *The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 *THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
var flat = require('flat');
var unflat = require('flat').unflatten;
var assign = require('object-assign');
var forEach = require('foreach');
var isArray = require('isArray');
var isObject = require('is-plain-object');
var flatmap = require('flatmap');
var isDefined = function(val){return typeof val !== "undefined"};
var deepEql = require('deep-eql');

module.exports = function(rootInput,primaryKey,options){

  console.debug = function(val){if(options.debug) console.warn(val)};

  function unspread(input){
    //detect types of input
    if(isObject(input)){
      return [unflat(input)];
    }
    else if(isArray(input)){
      return unspreadHelper(input);
    }
    else{
      throw new TypeError('json-spread input needs to be either a plain object or an array. You inputted a typeof' + typeof input);
    }
    function unspreadHelper(spreadInput){ //spreadInput has to be an array
      var valueMap= {};
      var output = [];
      
      forEach(spreadInput,function(item,itemIndex){
        if(isDefined(primaryKey)){
          var itemKeyValue = item[primaryKey];
          if(!isDefined(itemKeyValue)){//if item does not contain primaryKey property, skip the item
            console.debug("skipping item " +itemIndex + "because it does not contain the primarykey " + primaryKey);
            return;
          }
          var outputItemIndex = valueMap[itemKeyValue];
          console.log('index: ',outputItemIndex)
          console.log('item key value: ',itemKeyValue);
          if(isDefined(outputItemIndex)){ //if map contains a value same as item's primaryKey's value, merge outputItem with current item
            mergeItems({dest:output[outputItemIndex],src:item});
          }
          else{
            output.push(item);
            valueMap[itemKeyValue] = output.length-1;
          }
        }
        else{
          if(output.length === 0){
            output.push(item);
          }
          else{
            mergeItems({dest:output[0],src:item});
          }
        }
      });
      console.log('output',output);

      forEach(output,function(item,i){
        output[i] = unflat(item);
      });
      return output;
    }
    function mergeItems(items){
      if(!options.safe){
        items = flat(items);
      }
      forEach(items.src,function(value,key){
        var srcValue = options.emptyValue;
        if(!isDefined(value) || value !== null || value !== []){

        }
        if(isDefined(items.dest[key])){
          if(!deepEql(items.dest[key],items.src[key])){
            if(!isArray(items.dest[key])){
              items.dest[key] = [items.dest[key]];
            }
            items.dest[key].push(items.src[key]);
          }
        }
        else{
          items.dest[key] = value;
        }
      })
    }
  }
  return unspread(rootInput);
}
