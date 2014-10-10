'use strict';

//
// ## all utils in the same object to prevent
//    big header of requires in each file

var gutil = require('gulp-util');
var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

util.merge(util, {
  colors : gutil.colors,
    date : gutil.date
});

util.archy = require('archy');
util.tildify = require('tildify');
util.ansiJS = require('ansi-highlight');
util.prettyTime = require('pretty-hrtime');

var chalk = gutil.colors;
var date = gutil.date;
// ## save the plugin badge
util.badge = chalk.yellow('gulp-runtime');
util.stamp = function(){
  return (
    '[' + chalk.grey(date(new Date(), 'HH:MM:ss')) + '] '
  );
};


// ## use pretty colors for quotes
util.quotify = function(input, color){

  var str = input, inputIs = util.type(input);
  if( inputIs.array ){
    str = input.join(' ');
  }

  if( !inputIs.string ){
    return str;
  }

  return str.replace(/(`|'|")(\S+)(`|'|")/g,
    function($0,$1,$2,$3){
      return $1 + (color ? chalk[color]($2) : chalk.cyan($2)) + $3;
    }
  );
};

util.merge(util, runtime.require('./util'));
