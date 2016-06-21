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
import flat from 'flat';
import _ from 'lodash';

const jsonSpread = (rootInput)=>{
  //helper functions
  const containsNestedArray = (value)=>{
    value = flat(value,{safe:true});
    let test = false;
    _.forEach(value,(v,key)=>{
      if(v.constructor.name === 'Array'){
        test = true;
      }
    })
    return test;
  }
  const spread = (input)=>{
    //recursive spread function
    const spreadhelper = (data)=>{
      data = flat(data,{safe:true});
      let retdata = [];
      let containsArray = false;
      //create a default model objects with non array properties
      const model = {};
      _.forEach(data,(value,key)=>{
        if(!_.isArray(value)){
          model[key] = value;
        }
      })
      //iterate through each property again
      _.forEach(data,(value,key)=>{
        if(_.isArray(value)){//if it is array, we test if it contains nested array or not
          containsArray = true;
          let propertyArray = [];
          if(containsNestedArray(value)){
            //if it contains nested array, we recurse down the tree
            _.forEach(value,(propValue,propKey)=>{
              const innerArray = spread(propValue); //this returns us an array of flattened objects
              _.forEach(innerArray,(item,i)=>{
                propertyArray.push(item);
              });
            })
          }
          else{ //if it does not contain nested array, we use the array as it is.
            propertyArray = value;
          }
          //concat the model object with the object inside the property array and produce a new dataset, this new data set will exist in retdata;
          _.map(propertyArray,(propValue,index)=>{
            const propObj = {};
            propObj[key] = propValue;
            retdata.push(_.assign({},model,propObj));
          })
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
      return _.flatMap(input,(item)=>{
        return spreadhelper(item);
      })
    }
    else{
      throw new TypeError(`json-spread input needs to be either a hash or an array. You inputted a typeof ${typeof input}`);
      //throw `json-spread input needs to be either a hash or an array. You inputted a typeof ${typeof input}`;
    }
  }

  return spread(rootInput);
}

module.exports = jsonSpread;

