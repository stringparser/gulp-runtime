
var util = require('util');


exports = module.exports = {};

exports.defineGetter = function (obj, name, getter) {
  Object.defineProperty(obj, name, {
    configurable: true,
    enumerable: true,
    get: getter
  });
};

exports.defineSetter = function (obj, name, setter) {
  Object.defineProperty(obj, name, {
    configurable: true,
    enumerable: true,
    set: setter
  });
};

exports.isUndefined = util.isUndefined || function(obj){
  return obj === void 0;
}

exports.isObject = util.isObject || function(obj){
  return obj === Object(obj);
}

exports.isBoolean = function(obj){
  return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
}

exports.merge = require('utils-merge');