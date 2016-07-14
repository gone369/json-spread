var flat = require('flat');
var forEach = require('foreach');

module.exports = (function(){
  function containsNestedArray(value){
    value = flat(value,{safe:true});
    var test = false;
    forEach(value,function(v,key){
      if(Array.isArray(v)){
        test = true;
      }
    })
    return test;
  }
  function getNode(rootNode,path){
    var _path = JSON.parse(JSON.stringify(path));
    var _rootNode = JSON.parse(JSON.stringify(rootNode));
    return recurse(_rootNode,_path);
    function recurse(rootNode,path){
      if (_path.length === 0){
        return rootNode;
      }
      else{
        rootNode = rootNode[path.shift()];
        return getNode(rootNode,path);
      }
    }
  }
  function convertToArray(val){
    return Array.isArray(val)? val : [val];
  }
  return {
    containsNestedArray: containsNestedArray,
    getNode : getNode,
    convertToArray: convertToArray
  }
})();
