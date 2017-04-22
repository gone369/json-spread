var multipleArrInput = require('./input/multipleArr');
var nestedArrInput = require('./input/nestedArr');
var nestedObjInput = require('./input/nestedObj');
var nestedArrObjInput = require('./input/nestedArrObj');
var nestedObjArrInput = require('./input/nestedObjArr');
var complexObjInput = require('./input/complexObj');
var complexArrInput = require('./input/complexArr');
var reallifeInput = require('./input/reallife');

var multipleArrOutput = require('./output/multipleArr');
var nestedArrOutput = require('./output/nestedArr');
var nestedObjOutput = require('./output/nestedObj');
var nestedArrObjOutput = require('./output/nestedArrObj');
var nestedObjArrOutput = require('./output/nestedObjArr');
var complexObjOutput = require('./output/complexObj');
var complexArrOutput = require('./output/complexArr');
var reallifeOutput = require('./output/reallife');

var jsonSpread = require('../dist/jsonSpread.min.js');

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

describe('Spread Distribution', function(){
  describe('Input', function(){
    it('should throw Error when input is not Object or Array' ,function () {
      expect(function(){jsonSpread("string")}).to.throw(TypeError);
      expect(function(){jsonSpread(1)}).to.throw(TypeError);
    });
    it('should not throw Error when input is Object or Array' ,function () {
      expect(function(){jsonSpread({})}).to.not.throw(TypeError);
      expect(function(){jsonSpread([])}).to.not.throw(TypeError);
    });
  });

  describe('Output', function(){
    describe("Multiple Array", function(){
      it('input should be equal to output json' , function(){ 
        assert.strictEqual(JSON.stringify(jsonSpread(multipleArrInput)),JSON.stringify(multipleArrOutput));
      })
    })
    describe("Nested Array", function(){
      it('input should be equal to output json' , function(){ 
        assert.strictEqual(JSON.stringify(jsonSpread(nestedArrInput)),JSON.stringify(nestedArrOutput));
      })
    })
    describe("Nested Object", function(){
      it('input should be equal to output json' , function(){ 
        assert.strictEqual(JSON.stringify(jsonSpread(nestedObjInput)),JSON.stringify(nestedObjOutput));
      })
    })
    describe("Nested Array Objects", function(){
      it('input should be equal to output json' , function(){ 
        assert.strictEqual(JSON.stringify(jsonSpread(nestedArrObjInput)),JSON.stringify(nestedArrObjOutput));
      })
    })
    describe("Nested Object Arrays", function(){
      it('input should be equal to output json' , function(){ 
        assert.strictEqual(JSON.stringify(jsonSpread(nestedObjArrInput)),JSON.stringify(nestedObjArrOutput));
      })
    })
    describe("Complex Object", function(){
      it('input should be equal to output json' , function(){
        assert.strictEqual(JSON.stringify(jsonSpread(complexObjInput)),JSON.stringify(complexObjOutput));
      })
    })
    describe("Complex Array", function(){
      it('input should be equal to output json' , function(){
        assert.strictEqual(JSON.stringify(jsonSpread(complexArrInput)),JSON.stringify(complexArrOutput));
      })
    })
    describe("Real Life Example", function(){
      it('input should be equal to output json' , function(){
        assert.strictEqual(JSON.stringify(jsonSpread(reallifeInput)),JSON.stringify(reallifeOutput));
      })
    })
  })

  describe('Options', function(){
    describe("Remove Empty Arrays" , function(){
      it("should remove empty array fields", function(){
        assert.strictEqual(JSON.stringify(jsonSpread({a: 1, b:[]},{removeEmptyArray: true})),JSON.stringify([{a: 1}]));
      })
    })
    describe("Empty Arrays Value" , function(){
      it("should replace empty array fields with 'EMPTY'", function(){
        assert.strictEqual(JSON.stringify(jsonSpread({a: 1, b:[]},{emptyValue: "EMPTY"})),JSON.stringify([{a: 1, b: "EMPTY"}]));
      })
    })
    describe("Delimiter" , function(){
      it("should use '*' as delimiters", function(){
        assert.strictEqual(JSON.stringify(jsonSpread({a: { b: 1 }},{delimiter: "*"})),JSON.stringify([{"a*b": 1}]));
      })
    })
  })
})


