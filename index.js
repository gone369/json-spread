import flat from 'flat';
import _ from 'lodash';

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

const isArray = (value)=>{
  return value.constructor.name === "Array";
}

const spread = function(data,level){
  if(level> 0){
    //console.log(data);
  }
  const retdata = [];

  //create a default model objects with non array properties
  const model = {}
  _.forEach(data,(value,key)=>{
    if(!isArray(value)){
      model[key] = value;
    }
  })

  //iterate through each property again
  _.forEach(data,(value,key)=>{
    if(isArray(value)){//if it is array, we test if it contains nested array or not
      let propertyArray = [];

      if(containsNestedArray(value)){
        //if it contains nested array, we recurse down the tree
        _.forEach(value,(propValue,propKey)=>{
          const innerArray = spread(propValue,level+1); //this returns us an array of flattened objects
          innerArray.forEach((item,i)=>{
            propertyArray.push(item);
          })
        })
      }
      else{ //if it does not contain nested array, we use the array as it is.
        propertyArray = value;
      }

      //concat the model object with the object inside the property array and produce a new dataset, this new data set will exist in retdata;
      _.map(propertyArray,(propValue,index)=>{
        const propObj = {};
        propObj[key] = propValue;
        retdata.push(flat(_.assign({},model,propObj),{safe:true}));
      })
    }
  })

  return retdata;//return the spread format of nested arrays
}

export default spread;

