'use strict';

/*
 * file flags
 */
var path = require('path');
var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

/*var debug = util.debug(__filename);*/

runtime.set(['--require', '--gulpfile'], function (argv, args, next){
  argv.shift();
  var cwd = process.cwd();
  var chalk = util.colors;
  var message = '\n Provide a';
  var fileName = util.type(args.gulpfile || args.require).string;
  var inCache = true;

  if( fileName ){
    fileName = path.resolve(cwd, fileName);
    inCache = !!require.cache[fileName];
    message = inCache ? chalk.cyan('Reloading') : 'Loading';
  }

  message = ' ' + message + ' ' +
    (args.gulpfile ? 'gulpfile' : 'module') + ' ' +
    (fileName ? chalk.magenta(util.tildify(fileName)) : 'to load\n');

  runtime.emit('message', {
    message : fileName ? message : chalk.red(message),
     prompt : args.gulpfile ? false : true
  });

  if( !fileName ){  return ;  }

  try {
    runtime.require(fileName, { reload : inCache });
  } catch(err){
    runtime.emit('message', {
        error : err,
      quotify : 'red'
    });
  }

  if( argv.gulpfile && message.match(/Reloading/) ){
    process.nextTick(function(){
      var gulp = require('gulp');
      runtime.set({ completion : Object.keys(gulp.tasks)} );
      next();
    });
  } else {  next();  }
});
