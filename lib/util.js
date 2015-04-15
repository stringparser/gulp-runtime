'use strict';

var path = require('path');

exports = module.exports = {};

// dependencies
//
exports.date = require('dateformat');
exports.type = require('utils-type');
exports.tildify = require('tildify');
exports.prettyTime = require('pretty-hrtime');

// library dependencies
//
exports.log = require('./log');
exports.color = require('./color');

// figure out configFile from arguments
//
exports.configFile = function(){
  if(!process.argv[1]){
    return new Error('process.argv[1] is undefined');
  }

  var maybeBin = process.argv[1] || '';
  var binRE = new RegExp('\\'+path.sep+'bin');

  if(!binRE.test(maybeBin)){
    return process.argv[1];
  }

  return require('whech').sync({
    name: process.argv[1].split(path.sep).pop()
  }).configFile;
};


// reload file by path
//
exports.shouldReloadFile = function(opt, ev){
  return (
    opt.reload &&
    ev.type !== 'delete' &&
    require.extension[path.extname(ev.path)]
  );
};
