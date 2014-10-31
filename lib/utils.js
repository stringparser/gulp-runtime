'use strict';

//
// ## all utils in the same object to prevent
//    big header of requires in each file

var gutil = require('gulp-util');
var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

util.merge(util, {
     log : gutil.log,
  colors : gutil.colors,
    date : gutil.date
});

util.archy = require('archy');
util.tildify = require('tildify');
util.ansiJS = require('ansi-highlight');

// ## save the plugin badge
util.badge = util.colors.yellow('gulp-runtime');
util.stamp = function(){
  var chalk = util.colors;
  var date = util.date(new Date(), 'HH:MM:ss');
  return '[' + chalk.grey(date) + '] ';
};


// ## use pretty colors for quotes
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

var _join = [].join;
util.log = function(){
  runtime.output.write(
    util.stamp() + _join.call(arguments, ' ').trim() + '\n'
  );
};

util.merge(util, runtime.require('./util/'));
