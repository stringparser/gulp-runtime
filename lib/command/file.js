'use strict';

/*
 * file flags
 */
var path = require('path');
var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');
var debug = require('debug')('gr:file');

runtime.set(['--require', '--gulpfile'], function (argv, args){

  var chalk = util.colors;
  var message = '\n Provide a';
  var fileName = util.type(args.gulpfile || args.require).string;

  if( fileName ){

    fileName = path.resolve('.', fileName);
    if( !require.cache[fileName] ){
      message = 'Loading';
    } else {
      message = chalk.cyan('Reloading');
      delete require.cache[fileName];
    }
  }

  debug('gulpfile', args.gulpfile);
  debug('require', args.require);
  debug('fileName', fileName);

  message = ' ' + message + ' ' +
    (args.gulpfile ? 'gulpfile': 'module') + ' ' +
    (fileName ? chalk.magenta(util.tildify(fileName)) : 'to load\n');

  runtime.emit('message', {
     prompt : args.gulpfile ? false : true,
    message : fileName ? message : chalk.red(message)
  });

  if( !fileName ){
    return ;
  }

  try {
    runtime.require(fileName);
  } catch(err){
    runtime.emit('message', {
       prompt : true,
      quotify : 'red',
        error : err
    });
  }
});
