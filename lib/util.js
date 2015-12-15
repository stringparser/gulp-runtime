'use strict';

exports = module.exports = {};

// dependencies
//
exports.type = require('utils-type');
exports.color = require('chalk');
exports.archy = require('archy');
exports.createREPL = require('./createREPL');
exports.dateFormat = require('dateformat');
exports.prettyTime = require('pretty-hrtime');

// assorted
//

exports.log = function(/* arguments */){
  var date = exports.dateFormat(new Date(), 'HH:MM:ss');
  process.stdout.write('[' + exports.color.grey(date) + '] ');
  console.log.apply(console, arguments);
};

exports.color.time = function(time){
  var value = exports.prettyTime(process.hrtime(time || [0, 0]));
  var format = this.magenta(value);
  return exports.quote(format);
};

exports.color.file = function(filename){
  var value = exports.tildify(filename);
  var format = this.magenta(value);
  return exports.quote(format);
};

exports.color.task = function(taskName){
  var format = this.cyan(taskName);
  return exports.quote(format);
};

exports.color.stack = function(taskName){
  var format = this.green(taskName);
  return exports.quote(format);
};

exports.quote = function(format){
  return format;
};
