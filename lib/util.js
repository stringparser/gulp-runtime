/*
 * Extended `util` module
 *
 * Module dependencies
 */
var merge = require('utils-merge');
var util = require('util');
var path = require('path');

//
// ## No harm done :)
//
util = merge(exports, util);

//
// ## merge is just a function
//
util.merge = merge;

//
// ## Native's or Underscore's
//
util.isUndefined = util.isUndefined ?
  util.isUndefined : function(obj){
    return obj === void 0;
  };


util.testPrompt = function(dir){

  dir = path.relative('../..', dir);
  return '  ' + dir + ' ';
}
//
// ## JSON.stringify + colors
//    for the console.log
//
var ansiJS = require('ansi-highlight');
var prettyfy;

exports.prettyfy = prettyfy = {};

prettyfy.str = function(obj){

  return JSON.stringify( obj ,
    function (key, value){

      if(typeof value === 'function')
        return  value.toString();
      else if(typeof value === 'string')
        return '\''+value+'\'';
      else
        return value;

    }, '   ').replace(/\"/g, '')
             .replace(/\\\\n/g,'<n>')
             .replace(/\\n/g, '\n')
             .replace(/\<n\>/g, '\\n')
}

prettyfy.log = function(obj){
  var str = prettyfy.str(obj);
  console.log(str);
}

prettyfy.color = function(obj){
  var str = prettyfy.str(obj);
      str = ansiJS(str);

  console.log(str);
}