'use strict';

//
// ## exploit require.cache to aglomerate utilities
//    at require('runtime/lib/utils') avoiding madness
//

var gutil = require('gulp-util');
var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

var _join = [ ].join;
var chalk = gutil.colors;

util.merge(util, {
     log : gutil.log,
  colors : gutil.colors,
    date : gutil.date
});

// save the plugin badge
util.badge = chalk.cyan('gulp-runtime');
util.longBadge = 'From plugin `' + util.badge + '`';

// gutil.log stamp
util.stamp = function(){
  var date = util.date(new Date(), 'HH:MM:ss');
  return '[' + chalk.grey(date) + '] ';
};

// go through the runtime.output
util.log = function(/* arguments */){
  runtime.output.write(
    util.stamp() + _join.call(arguments, ' ').trim() + '\n'
  );
};

// pretty colors for quotes
util.quotify = function(input, color){
  input = util.type(input);
  if( !input.match(/string|array/) ){
    return input;
  }
  input = input.string || input.array.join(' ');
  color = chalk[util.type(color).string] || chalk.cyan;
  return input.replace(/(`|'|")(.*?)(`|'|")/g,
    function($0,$1,$2,$3){
      return $1 + color($2) + $3;
    }
  );
};

util.cmdRE = function(stems){
  var completion = runtime.get(stems || '').completion;
  return new RegExp(completion.join('|'), 'g');
};

util.tasksRE = function(gulpInst){
  var tasks = Object.keys(gulpInst.tasks);
  return new RegExp(tasks.join('|'), 'g');
};

util.merge(util, runtime.require(/^(?!\_)(.*?)\.js/));

//
// ## lazyyyyyy
//

util.archy = function archy(tree){
  return require('archy')(tree);
};

util.tildify = function tildify(pathname){
  return require('tildify')(pathname);
};

util.ansiJS = function(str){
  return require('ansi-highlight')(str);
};
