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
  var format = exports.chalk.magenta(value);
  return exports.quote(format);
};

exports.color.mode = function(value){
  return exports.chalk.bold(value);
};

exports.color.file = function(filename){
  var value = exports.tildify(filename);
  var format = exports.chalk.magenta(value);
  return exports.quote(format);
};

exports.color.task = function(value){
  var format = exports.chalk.cyan(value);
  return exports.quote(format);
};

exports.color.error = function(value){
  var format = exports.chalk.red(value);
  return exports.quote(format);
};

exports.color.host = function(value){
  var format = exports.chalk.yellow(value);
  return exports.quote(format);
};

exports.color.stack = function(value){
  var format = exports.chalk.green(value);
  return exports.quote(format);
};

exports.quote = function(format){
  return format;
};
