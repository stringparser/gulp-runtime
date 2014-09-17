'use strict';

/*
 * file flags
 */
var path = require('path');
var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

runtime.set(['--require', '--gulpfile'], function (argv, args){

  var message;
  var chalk = util.colors;
  var fileName = path.resolve(args.require || args.gulpfile);

  if( fileName ){

    message = chalk.magenta( util.tildify(fileName) );

    if( !require.cache[fileName] ){

      runtime.require(fileName);

      message = (args.gulpfile ? 'Using gulpfile' : 'Requiring module') +
              ' ' + message;

    } else {
      message = 'gulpfile '+message+' is already loaded';
    }

    runtime.emit('message', {
       prompt : true,
      message : message
    });

  } else {

    runtime.emit('message', {
      stamp : true,
      error : new Error(
        'Something went wrong requiring your file. \n' +
        'This should not happen. Report this issue on github \n'+
        ' https://github.com/stringparser/gulp-runtime/issues \n'+
        'Paste the stack trace'
      )
    });
  }
});
