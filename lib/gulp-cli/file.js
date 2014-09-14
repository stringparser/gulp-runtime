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

  if( file ){

    runtime.require(file);

    var message = args.gulpfile ? 'Using gulpfile' : 'Requiring module';
        message += chalk.magenta(
          path.relative(process.env.INIT_CWD || '.', file) 
        );

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
