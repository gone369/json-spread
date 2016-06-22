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
var _ = require('lodash');

module.exports = function(rootInput,options){
  var _options = {
    delimiter : ".",
    removeEmptyArray : false,
    emptyValue       : null
  }
  _.assign(_options,options);

  //helper functions
  var containsNestedArray = function(value){
    value = flat(value,{safe:true});
    var test = false;
    _.forEach(value,function(v,key){
      if(v.constructor.name === 'Array'){
        test = true;
      }
    })
    return test;
  }
  var spread = function(input){
    //recursive spread function
    var spreadhelper = function(data){
      data = flat(data,{safe:true,delimiter:_options.delimiter});
      var retdata = [];
      var containsArray = false;
      //create a default model objects with non array properties
      var model = {};
      _.forEach(data,function(value,key){
        if(!_.isArray(value)){
          model[key] = value;
        }
      })
      //iterate through each property again
      _.forEach(data,function(value,key){
        if(_.isArray(value)){//if it is array, we test if it contains nested array or not
          if(value.length === 0){ //if empty array
            if(_options.removeEmptyArray){
              delete data[key];
            }
            else{
              data[key] = _options.emptyValue;
            }
            return;
          }
          else{
            containsArray = true;
            var propertyArray = [];
            if(containsNestedArray(value)){
              //if it contains nested array, we recurse down the tree
              _.forEach(value,function(propValue,propKey){
                var innerArray = spread(propValue); //this returns us an array of flattened objects
                _.forEach(innerArray,function(item,i){
                  propertyArray.push(item);
                });
              })
            }
            else{ //if it does not contain nested array, we use the array as it is.
              propertyArray = value;
            }
            //concat the model object with the object inside the property array and produce a new dataset, this new data set will exist in retdata;
            _.map(propertyArray,function(propValue,index){
              var propObj = {};
              propObj[key] = propValue;
              retdata.push(_.assign({},model,propObj));
            })
          }
        }
      })

      if(containsArray){
        retdata = spread(retdata);
        return retdata;
      }
      else{
        return [data];
      }
    }
    //detect types of input
    if(_.isPlainObject(input)){
      return spreadhelper(input);
    }
    else if(_.isArray(input)){
      return _.flatMap(input,function(item){
        return spreadhelper(item);
      })
    }
    else{
      throw new TypeError(`json-spread input needs to be either a hash or an array. You inputted a typeof ${typeof input}`);
    }
  }

  return spread(rootInput);
}

