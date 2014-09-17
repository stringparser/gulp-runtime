'use strict';

//
// ## all utils in the same object to prevent
//    big header of requires in each file

var gutil = require('gulp-util');
var util = require('runtime/lib/utils');
var runtime = require('runtime').create();

var chalk = gutil.colors;

util.merge(util, gutil);
util.merge(util, runtime.require('./util'));

util.prettyTime = require('pretty-hrtime');
util.archy = require('archy');
util.ansiJS = require('ansi-highlight');

// ## use pretty colors for quotes
util.quotify = function(str){

  if( exports.type(str).string ){
    return str.replace(/`(\S+)`|"(\S+)"/g,
      function($0,$1,$2,$3){
        return $1 + chalk.cyan($2) + $3;
      }
    );
  } else {
    return str;
  }
};

// ## save the plugin badge
util.badge = chalk.yellow('gulp-runtime');
