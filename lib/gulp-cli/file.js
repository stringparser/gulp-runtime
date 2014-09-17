'use strict';

/*
 * file flags
 */
var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');
var debug = require('debug')('gr:file');

runtime.set(['--require', '--gulpfile'], function (argv, args){

  var message;
  var chalk = util.colors;
  var fileName = args.require || args.gulpfile;

  if( fileName ){

    message = chalk.magenta( util.tildify(fileName) );

    if( !require.cache[fileName] ){

      message = (args.gulpfile ? 'using gulpfile' : ' required module') +
              ' `' + message+ '`';

      debug('gulpfile', args.gulpfile);
      debug('require', args.require);
      debug('fileName', fileName);

      try {
        runtime.require(fileName);
      } catch(err){
        runtime.emit('message', {
           prompt : true,
          quotify : 'red',
            error : err
        });
        return ;
      }

    } else {
      message = (args.gulpfile ? 'gulpfile': 'module') +
        ' `' + message + '` is already loaded';
    }

    runtime.emit('message', {
        stamp : true,
       prompt : true,
      quotify : 'magenta',
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
