var jsonSpread = require('../src/index.js');
var unflat = require('flat').unflatten;
var output = jsonSpread.unspread(
  [
    {
      "a.index": 1
    },
    {
      "a.index": 2
    },
    {
      "a.index": 1
    }
  ]
  ,"a.index");

console.log(output);

//var out = unflat({
//"id": 1,
//"a.index" : [1,2]
//})
//console.log(out);
//
