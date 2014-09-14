'use strict';

/*
 * file flags
 */
var path = require('path');
var util = require('runtime/lib/utils');
var runtime = require('../gulp-runtime');
var flags = ['--require', '--gulpfile'];

runtime.set(flags, function (argv, args){

  var gutil = require('gulp-util');
  var chalk = gutil.colors;

  var file = args.require || args.gulpfile;
  var env = runtime('env');

  if( file ){

    file = path.resolve(file);

    var message = chalk.magenta(
      '~' + path.sep + path.relative(process.env.HOME || '.', file)
    );

    if(env.gulpfile !== file){

      runtime.require(
        path.resolve(process.cwd(), file)
      );

      message = (
        args.gulpfile ? 'Using gulpfile' : 'Requiring module '
      ) + message;

    } else {
      message = 'gulpfile '+message+' already in use';
    }

    runtime.emit('message', {
       prompt : true,
      message : message
    });

  } else {
    runtime.emit('message', {
      error : new util.Error(
        'Something went wrong requiring your file. \n' +
        'This should not happen. Report this issue on github \n'+
        ' https://github.com/stringparser/gulp-runtime/issues'
      )
    });
  }
});
