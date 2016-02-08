'use strict';

exports = module.exports = {};

// dependencies
//
exports.type = require('utils-type');
exports.archy = require('archy');
exports.merge = require('lodash.merge');
exports.chalk = require('chalk');
exports.dateFormat = require('dateformat');
exports.prettyTime = require('pretty-hrtime');

exports.createREPL = require('./createREPL');

// assorted
//

exports.log = function(/* arguments */){
  var date = exports.dateFormat(new Date(), 'HH:MM:ss');
  process.stdout.write('[' + exports.chalk.grey(date) + '] ');
  console.log.apply(console, arguments);
};

exports.color = {};

exports.color.time = function(time){
  var value = exports.prettyTime(process.hrtime(time || [0, 0]));
  return exports.chalk.magenta(value);
};

exports.color.mode = function(value){
  return exports.chalk.bold(value);
};

exports.color.file = function(filename){
  var value = exports.tildify(filename);
  return exports.chalk.magenta(value);
};

exports.color.task = function(value){
  return exports.chalk.cyan(value);
};

exports.color.error = function(value){
  return exports.chalk.red(value);
};

exports.color.host = function(value){
  return exports.chalk.yellow(value);
};

exports.color.stack = function(value){
  return exports.chalk.green(value);
};
