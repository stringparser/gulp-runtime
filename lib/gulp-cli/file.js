'use strict';

/*
 * file flags
 */
var runtime = require('runtime').get('gulp');

runtime.set(['--require', '--gulpfile'], function (argv, args){

  var path = require('path');
  var gutil = require('gulp-util');
  var chalk = gutil.colors;

  var fileName = args.require || args.gulpfile;
  var env = runtime('env');

  if( fileName ){

    fileName = path.resolve(fileName);

    var message = chalk.magenta(
      '~' + path.sep + path.relative(process.env.HOME || '.', fileName)
    );

    if(env.gulpfile !== fileName){

      runtime.require(fileName);

      message = (
        args.gulpfile ? 'Using gulpfile' : 'Requiring module '
      ) + message;

    } else {
      message = 'gulpfile '+message+' is already loaded';
    }

    runtime.emit('message', {
       prompt : true,
      message : message
    });

  } else {

    runtime.emit('message', {
      error : new Error(
        'Something went wrong requiring your file. \n' +
        'This should not happen. Report this issue on github \n'+
        ' https://github.com/stringparser/gulp-runtime/issues \n'+
        'Paste the stack trace'
      )
    });
  }
});
