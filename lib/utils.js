
var util = require('util');
var chalk = require('chalk');
var merge = require('utils-merge');

exports = module.exports = merge({}, util);

exports.isUndefined = util.isUndefined || function(obj){
  return obj === void 0;
};

exports.isObject = util.isObject || function(obj){
  return obj === Object(obj);
};

exports.isBoolean = function(obj){

  return (
      obj === true || obj === false ||
      toString.call(obj) == '[object Boolean]'
  );

};

exports.merge = merge;

exports.quotify = function(str){
  return str.replace(/('|"|`)(\S+)('|"|`)/g, function($0,$1,$2,$3){
    return $1 + chalk.yellow($2) + $3;
  })
}
