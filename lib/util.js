'use strict';

var path = require('path');

var util = exports = module.exports = {};

var xargs = process.argv.slice(2).join(' ');
var isSilent = /(^|[\s])(--silent|--tasks-simple)/.test(xargs);
var execFile = path.extname(process.argv[1])
  ? process.argv[1]
  : process.argv[1] + '.js';

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

if (isSilent) {
  util.log = util.gutil.log = util.silent;
} else {
  util.log = util.gutil.log = util.logger;
}

util.format = {
  time: function(hrtime){
    return util.chalk.magenta(hrtime
      ? util.prettyTime(process.hrtime(hrtime))
      : util.prettyTime(process.hrtime())
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
  task: function(task){
    if(!task.mode){
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

util.isFromCLI = function(gulp){
  return gulp.gulpfile === execFile;
};

util.getGulpFile = function(){
  var match = new Error().stack.match(/\/([^:()]+)/g);
  return match && match[3] || '';
};
