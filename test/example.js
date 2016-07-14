var jsonSpread = require('../src/index.js');
var unflat = require('flat').unflatten;
var flat = require('flat');
var util = require('util');

var input = [
  {
    "a.index": 1
  },
  {
    "a.index": 2
  },
  {
    "a.index": 3
  }
]
var primaryKey = "a";
console.log("primaryKey: ", primaryKey);
console.log('===input===');
console.log(input);
console.log('===end of input===');

var output = jsonSpread.unspread(input,primaryKey,{debug:true});

console.log('===output===');
console.log(util.inspect(output,{showHidden: false, depth: null}));
console.log('===end of output===');
//console.log(util.inspect(unflat({"a.b.index":[1,2,3]},{safe:true}),false,null));

//var out = unflat({
//"id": 1,
//"a.index" : [1,2]
//})
//console.log(out);
//
//

