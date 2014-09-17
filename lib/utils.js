'use strict';

//
// ## all utils in the same object to prevent
//    big header of requires in each file

var gutil = require('gulp-util');
var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

var chalk = gutil.colors;

// ## save the plugin badge
util.badge = chalk.yellow('gulp-runtime');

util.merge(util, gutil);
util.merge(util, runtime.require('./util'));

util.archy = require('archy');
util.tildify = require('tildify');
util.ansiJS = require('ansi-highlight');
util.prettyTime = require('pretty-hrtime');



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
