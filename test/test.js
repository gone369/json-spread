import multipleArrInput from './input/multipleArr.json' with { type: 'json' };
import nestedArrInput from './input/nestedArr.json' with { type: 'json' };
import nestedObjInput from './input/nestedObj.json' with { type: 'json' };
import nestedArrObjInput from './input/nestedArrObj.json' with { type: 'json' };
import nestedObjArrInput from './input/nestedObjArr.json' with { type: 'json' };
import complexObjInput from './input/complexObj.json' with { type: 'json' };
import complexArrInput from './input/complexArr.json' with { type: 'json' };
import reallifeInput from './input/reallife.json' with { type: 'json' };

import multipleArrOutput from './output/multipleArr.json' with { type: 'json' };
import nestedArrOutput from './output/nestedArr.json' with { type: 'json' };
import nestedObjOutput from './output/nestedObj.json' with { type: 'json' };
import nestedArrObjOutput from './output/nestedArrObj.json' with { type: 'json' };
import nestedObjArrOutput from './output/nestedObjArr.json' with { type: 'json' };
import complexObjOutput from './output/complexObj.json' with { type: 'json' };
import complexArrOutput from './output/complexArr.json' with { type: 'json' };
import reallifeOutput from './output/reallife.json' with { type: 'json' };

import jsonSpread from '../src/index.js';

import chai from 'chai';
const { assert, expect } = chai;

describe('Spread Source', function () {
  describe('Input', function () {
    it('should throw Error when input is not Object or Array', function () {
      expect(function () {
        jsonSpread('string');
      }).to.throw(TypeError);
      expect(function () {
        jsonSpread(1);
      }).to.throw(TypeError);
    });
    it('should not throw Error when input is Object or Array', function () {
      expect(function () {
        jsonSpread({});
      }).to.not.throw(TypeError);
      expect(function () {
        jsonSpread([]);
      }).to.not.throw(TypeError);
    });
  });

  describe('Output', function () {
    describe('Multiple Array', function () {
      it('input should be equal to output json', function () {
        assert.strictEqual(
          JSON.stringify(jsonSpread(multipleArrInput)),
          JSON.stringify(multipleArrOutput)
        );
      });
    });
    describe('Nested Array', function () {
      it('input should be equal to output json', function () {
        assert.strictEqual(
          JSON.stringify(jsonSpread(nestedArrInput)),
          JSON.stringify(nestedArrOutput)
        );
      });
    });
    describe('Nested Object', function () {
      it('input should be equal to output json', function () {
        assert.strictEqual(
          JSON.stringify(jsonSpread(nestedObjInput)),
          JSON.stringify(nestedObjOutput)
        );
      });
    });
    describe('Nested Array Objects', function () {
      it('input should be equal to output json', function () {
        assert.strictEqual(
          JSON.stringify(jsonSpread(nestedArrObjInput)),
          JSON.stringify(nestedArrObjOutput)
        );
      });
    });
    describe('Nested Object Arrays', function () {
      it('input should be equal to output json', function () {
        assert.strictEqual(
          JSON.stringify(jsonSpread(nestedObjArrInput)),
          JSON.stringify(nestedObjArrOutput)
        );
      });
    });
    describe('Complex Object', function () {
      it('input should be equal to output json', function () {
        assert.strictEqual(
          JSON.stringify(jsonSpread(complexObjInput)),
          JSON.stringify(complexObjOutput)
        );
      });
    });
    describe('Complex Array', function () {
      it('input should be equal to output json', function () {
        assert.strictEqual(
          JSON.stringify(jsonSpread(complexArrInput)),
          JSON.stringify(complexArrOutput)
        );
      });
    });
    describe('Real Life Example', function () {
      it('input should be equal to output json', function () {
        assert.strictEqual(
          JSON.stringify(jsonSpread(reallifeInput)),
          JSON.stringify(reallifeOutput)
        );
      });
    });
  });

  describe('Options', function () {
    describe('Remove Empty Arrays', function () {
      it('should remove empty array fields', function () {
        assert.strictEqual(
          JSON.stringify(
            jsonSpread({ a: 1, b: [] }, { removeEmptyArray: true })
          ),
          JSON.stringify([{ a: 1 }])
        );
      });
    });
    describe('Empty Arrays Value', function () {
      it("should replace empty array fields with 'EMPTY'", function () {
        assert.strictEqual(
          JSON.stringify(jsonSpread({ a: 1, b: [] }, { emptyValue: 'EMPTY' })),
          JSON.stringify([{ a: 1, b: 'EMPTY' }])
        );
      });
    });
    describe('Delimiter', function () {
      it("should use '*' as delimiters", function () {
        assert.strictEqual(
          JSON.stringify(jsonSpread({ a: { b: 1 } }, { delimiter: '*' })),
          JSON.stringify([{ 'a*b': 1 }])
        );
      });
    });
  });
});
