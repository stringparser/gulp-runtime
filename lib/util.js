'use strict';

var util = exports = module.exports = {};

// dependencies
//
util.type = require('utils-type');
util.archy = require('archy');
util.merge = require('lodash.merge');
util.gutil = require('gulp-util');
util.chalk = util.gutil.colors;
util.tildify = require('tildify');
util.dateFormat = require('dateformat');
util.prettyTime = require('pretty-hrtime');

// flags
//
util.xargs = process.argv.join(' ');
util.isGulp = /gulp$/.test(process.argv[1]);
util.isSilent = /(^|[\s])(--silent|--tasks-simple)/.test(util.xargs);
util.logGulpfile = !util.fromGulp && !/(^|[\s])(--tasks|-T)/.test(util.xargs);

// assorted
//
util.docs = {
  task: 'http://git.io/vVYKS'
};

util.silent = function(){};

util.logger = function(/* arguments */){
  process.stdout.write(util.format.date());
  console.log.apply(console, arguments);
};

if (util.isSilent) {
  util.log = util.gutil.log = util.silent;
} else {
  util.log = util.gutil.log = util.logger;
}

util.format = {
  time: function(time){
    var value = util.prettyTime(process.hrtime(time || [0, 0]));
    return util.chalk.magenta(value);
  },
  link: function(link){
    return util.chalk.underline(util.chalk.cyan(link));
  },
  path: function(filename){
    var value = util.tildify(filename);
    return util.chalk.magenta(value);
  },
  task: function(value){
    return (value || '').split(/[, ]+/).map(function(task){
      return util.chalk.cyan(task);
    }).join(', ');
  },
  date: function(date){
    var value = util.dateFormat(date || new Date(), 'HH:MM:ss');
    return '[' + util.chalk.grey(value) + '] ';
  },
  mode: function(value){
    return util.chalk.bold(value);
  },
  error: function(value){
    return util.chalk.red(value);
  },
  enabled: function(value){
    return util.chalk.green(value);
  }
};
