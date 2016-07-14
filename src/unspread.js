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
var isObject = require('is-plain-object');
var flatmap = require('flatmap');
var isDefined = function(val){return typeof val !== "undefined"};
var deepEql = require('deep-eql');
var deepmerge = require('deepmerge');
var util = require('./util.js');

module.exports = function(rootInput,primaryKey,options){

  console.debug = function(val){if(options.debug) console.warn(val)};
  if(isDefined(primaryKey)){
    var primaryKeyPath = primaryKey.split(options.delimiter);
    var primaryKeyLevel = primaryKeyPath.length;
    console.log('primaryKeyPath',primaryKeyPath);
  }

  function unspread(input){
    //detect types of input
    if(isObject(input)){
      return [unflat(input)];
    }
    else if(Array.isArray(input)){
      return unspreadHelper(input);
    }
    else{
      throw new TypeError('json-spread input needs to be either a plain object or an array. You inputted a typeof' + typeof input);
    }
    function unspreadHelper(spreadInput){ //spreadInput has to be an array
      var valueMap= {};
      var output = [];
      
      forEach(spreadInput,function(item,itemIndex){
        item = unflat(item);

        if(isDefined(primaryKey)){ //if primaryKey is defined in input
          var itemKeyValue = JSON.stringify(util.getNode(item,primaryKeyPath));
          console.log('item key value: ',itemKeyValue);
          if(!isDefined(itemKeyValue)){//if item does not contain primaryKey property, skip item
            console.debug("skipping item " +itemIndex + "because it does not contain the primarykey " + primaryKey);
            return;
          }

          var outputItemIndex = valueMap[itemKeyValue];
          if(isDefined(outputItemIndex)){ //if map contains a value same as item's primaryKey's value, merge outputItem with current item
            output[outputItemIndex] = mergeItems(output[outputItemIndex],item,primaryKeyPath);
            console.log(output[outputItemIndex]);
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
            output[0] = deepmerge(output[0],item);
          }
        }
        //[
        //{
        //"user_id" : 1,
        //"email": "1@domain.com",
        //"hobbies": [
        //{
        //"type": "sport",
        //"name": "soccer",
        //"dates": [
        //"May 3rd",
        //"May 4th",
        //"May 5th"
        //]
        //},
        //{
        //"type": "sport",
        //"name": "basketball",
        //"dates": [
        //"June 3rd",
        //"July 4th"
        //]
        //}
        //]
        //},
        //{
        //"user_id" : 2,
        //"email": "2@domain.com"
        //},
        //{
        //"user_id" : 3,
        //"email": "3@domain.com",
        //"hobbies": []
        //}
        //]
      });
      return output;

    }
    //console.log('item key value: ',itemKeyValue);
    //if(!isDefined(itemKeyValue)){//if item does not contain primaryKey property, skip the item
    //console.debug("skipping item " +itemIndex + "because it does not contain the primarykey " + primaryKey);
    //return;
    //}




    //var outputItemIndex = valueMap[itemKeyValue];
    //console.log('index: ',outputItemIndex)
    //if(isDefined(outputItemIndex)){ //if map contains a value same as item's primaryKey's value, merge outputItem with current item
    //mergeItems({dest:output[outputItemIndex],src:item});
    //}
    //else{
    //output.push(item);
    //valueMap[itemKeyValue] = output.length-1;
    //}
    //}
    //else{
    //if(output.length === 0){
    //output.push(item);
    //}
    //else{
    //mergeItems({dest:output[0],src:item});
    //}
    //}
    //});
    //console.log('output',output);

    //forEach(output,function(item,i){
    //output[i] = unflat(item);
    //});
    //return output;
    //}


    //[
      //{
        //a: {
          //index: 1
        //}
      //},
      //{
        //a: {
          //index: 2
        //}
      //},
      //{
        //a: {
          //index: 3
        //}
      //}
    //]

    //{
      //a: [
        //{index: 1},
        //{index: 2},
        //{index: 3}
      //]
    //}
    //{
      //a: {
        //index: [1,2,3]
      //}
    //}


    //function mergeItems(a,b,path){
    //var targetKey = path[path.length-1];
    //var targetLevel = path.length-1;
    //var _output = {};
    //var _level = 0;
    //var _a = JSON.parse(JSON.stringify(a));
    //var _b = JSON.parse(JSON.stringify(b));
    //return recurse(_a,_b,_level,_output);

    //function recurse(a,b,level,output){
    ////traverse a
    //forEach(a,function(value,key){
    //if(!isDefined(a[key]) || a[key] === null || a[key] === []){//returns options.emptyValue if a[key] is either undefined,null or [] 
    //output[key] = options.emptyValue;
    //return;
    //}
    //if(isDefined(b[key])){
    //if(isDefined(b[targetKey]) && targetLevel === level){//this is the primary key
    //if(isDefined(b[key])){ //if both a and b has primary key values
    ////conver to Array if not already an Array
    //var a_primaryKeyValue = util.convertToArray(a[key]);
    //var b_primaryKeyValue = util.convertToArray(b[key]);
    //output[key] = a_primaryKeyValue.concat(b_primaryKeyValue);
    //}
    //else{ // if only a has primary key value
    ////this will never happen hopefully
    //output[key] = a[key]; //overwrite output's primary key value with a's primaryKey value
    //}
    //}
    //else{ // if not primary key
    //var aVal = util.convertToArray(a[key]);
    //var bVal = util.convertToArray(b[key]);
    //output[key] = aVal.concat(bVal);
    //}
    //}
    //else{
    //output[key] = a[key];
    //}
    //output[key] = recurse(a[key],b[key],++level,output[key]);
    //})

    //return output;
    //}



    //if(!options.safe){
    //items = flat(items);
    //}
    //forEach(items.src,function(value,key){
    //var srcValue = options.emptyValue;
    //if(!isDefined(value) || value !== null || value !== []){

    //}
    //if(isDefined(items.dest[key])){
    //if(!deepEql(items.dest[key],items.src[key])){
    //if(!Array.isArray(items.dest[key])){
    //items.dest[key] = [items.dest[key]];
    //}
    //items.dest[key].push(items.src[key]);
    //}
    //}
    //else{
    //items.dest[key] = value;
    //}
    //})
    //}
  }
  return unspread(rootInput);
}
