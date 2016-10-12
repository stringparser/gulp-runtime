'use strict';

var path = require('path');

var util = exports = module.exports = {};

// dependencies
util.type = require('utils-type');
util.clone = require('lodash.clone');
util.archy = require('archy');
util.merge = require('lodash.merge');
util.gutil = require('gulp-util');
util.chalk = util.gutil.colors;
util.tildify = require('tildify');
util.dateFormat = require('dateformat');
util.prettyTime = require('pretty-hrtime');

// refs
var xargs = process.argv.slice(2).join(' ');
var isSilent = /(^|[\s])(--silent|--tasks-simple)/.test(xargs);
var execFile = path.extname(process.argv[1])
  ? process.argv[1]
  : process.argv[1] + '.js';

// assorted
util.docs = {
  task: 'http://git.io/vVYKS'
};

// logging helpers
util.silent = function () {};
util.logger = function (/* arguments */) {
  process.stdout.write(util.format.date());
  console.log.apply(console, arguments);
};

// assign the initial logger according to cli args
util.log = util.gutil.log = isSilent ? util.silent : util.logger;

util.format = {
  time: function (hrtime) {
    var time = util.prettyTime(process.hrtime(hrtime || []));
    return util.chalk.magenta(time);
  },
  path: function (pahtname) {
    return util.chalk.magenta(util.tildify(pahtname));
  },
  task: function (task) {
    if (task && task.label) {
      var name = '';
      var label = task.label.split(',').map(function (taskName) {
        return util.chalk.cyan(taskName);
      }).join(',');

      if (task.match && task.siteProps) {
        name = task.match + ':' + (task.siteProps.wait ? 'series' : 'parallel');
      } else if (task.props) {
        name = task.props.wait ? 'parallel' : 'series';
      }

      return name ? name + '(' + label + ')' : label;
    } else {
      return task;
    }
  },
  date: function (date) {
    var value = util.dateFormat(date || new Date(), 'HH:MM:ss');
    return '[' + util.chalk.grey(value) + '] ';
  },
  error: function (value) {
    return util.chalk.red(value);
  }
};

util.isFromCLI = function (gulp) {
  return gulp.gulpfile === execFile;
};

util.getGulpFile = function () {
  var match = new Error().stack.match(/\/([^:()]+)/g);
  return match && match[3] || '';
};
