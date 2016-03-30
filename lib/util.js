'use strict';

exports = module.exports = {};

// dependencies
//
exports.type = require('utils-type');
exports.archy = require('archy');
exports.merge = require('lodash.merge');
exports.chalk = require('chalk');
exports.tildify = require('tildify');
exports.dateFormat = require('dateformat');
exports.prettyTime = require('pretty-hrtime');

// assorted
//

exports.docs = {
  task: 'http://git.io/vVYKS'
};

exports.log = function(/* arguments */){
  process.stdout.write(exports.format.date());
  console.log.apply(console, arguments);
};

exports.format = {
  time: function(time){
    var value = exports.prettyTime(process.hrtime(time || [0, 0]));
    return exports.chalk.magenta(value);
  },
  link: function(link){
    return exports.chalk.underline(exports.chalk.cyan(link));
  },
  file: function(filename){
    var value = exports.tildify(filename);
    return exports.chalk.magenta(value);
  },
  task: function(value){
    return exports.chalk.cyan(value);
  },
  date: function(date){
    var value = exports.dateFormat(date || new Date(), 'HH:MM:ss');
    return '[' + exports.chalk.grey(value) + '] ';
  },
  mode: function(value){
    return exports.chalk.bold(value);
  },
  error: function(value){
    return exports.chalk.red(value);
  },
  enabled: function(value){
    return exports.chalk.green(value);
  }
};

exports.getGulpFile = function(){
  var callPaths = new Error().stack.match(/\/([^:]+)/g);
  return (callPaths || {3: ''})[3];
};
