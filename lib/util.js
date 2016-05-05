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
util.xargs = process.argv.join(' ').trim();
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
  time: function(hrtime){
    return util.chalk.magenta(
      util.prettyTime(process.hrtime(hrtime || [0, 0]))
    );
  },
  link: function(link){
    return util.chalk.underline(
      util.chalk.green(link)
    );
  },
  path: function(filename){
    return util.chalk.magenta(
      util.tildify(filename)
    );
  },
  task: function(task, stack){
    if(!task || !task.mode || (stack && !stack.deep)){
      return util.chalk.cyan(task && task.label || task);
    }

    return (
      (task.name ? util.chalk.cyan(task.name) + ' => ' : '') +
       task.mode + '(' +
        task.label.split(/[,\s]+/).map(function(name){
          return util.chalk.cyan(name)
        }).join(', ') +
      ')'
    );
  },
  date: function(date){
    var value = util.dateFormat(date || new Date(), 'HH:MM:ss');
    return '[' + util.chalk.grey(value) + '] ';
  },
  error: function(value){
    return util.chalk.red(value);
  }
};
