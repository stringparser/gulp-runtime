'use strict';

//
// ## exploit require.cache to aglomerate utilities
//    at require('runtime/lib/utils') avoiding madness
//

var gutil = require('gulp-util');
var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

util.merge(util, {
     log : gutil.log,
  colors : gutil.colors,
    date : gutil.date
});

//
// ## make everything go through the output
//
var _join = [].join;
util.log = function(){
  var env = runtime.config('env');
  var output = util.stamp() + _join.call(arguments, ' ').trim() + '\n';
  if( !env.failed ){
    runtime.output.write(output);
  } else {
    process.stdout.write(output);
  }
};

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

// save the plugin badge
util.badge = util.colors.yellow('gulp-runtime');
// gulp-log stamp
util.stamp = function(){
  var chalk = util.colors;
  var date = util.date(new Date(), 'HH:MM:ss');
  return '[' + chalk.grey(date) + '] ';
};


// pretty colors for quotes
util.quotify = function(input, color){
  input = util.type(input);
  if( !input.match(/string|array/) ){
    return input;
  }
  input = input.string || input.array.join(' ');
  color = util.type(color).string;
  var chalk = util.colors;
  color = chalk[color] || chalk.cyan;
  return input.replace(/(`|'|")(.*)(`|'|")/g,
    function($0,$1,$2,$3){
      return $1 + color($2) + $3;
    }
  );
};

util.merge(util, runtime.require('./util/'));
