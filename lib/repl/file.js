'use strict';

/*
 * file flags
 */
var path = require('path');
var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

var chalk = util.colors;
/*var debug = util.debug(__filename);*/

runtime.set(['--require', '--gulpfile'], function (argv, args, next){
  var cached = false;
  var cwd = process.cwd();
  var fileName = args.gulpfile || args.require;

  if( !util.type(fileName).string ){
    runtime.emit('message', {
      message : '\n Provide a ' +
      (args.gulpfile ? 'gulpfile' : 'module') + ' to load\n',
       prompt : true
    });
    return next();
  }

  argv.shift();

  fileName = path.resolve(cwd, fileName);
  cached = Boolean(require.cache[fileName]);

  runtime.emit('message', {
    message : (cached ? chalk.cyan('Reloading') : 'Loading') +
    ' ' + (args.gulpfile ? 'gulpfile' : 'module') +
    ' ' + chalk.magenta(util.tildify(fileName)),
    prompt : !args.gulpfile
  });

  try {
    runtime.require(fileName, { reload : cached });
    if( !args.gulpfile ){ return next(); }
  } catch(err){
    runtime.emit('message', {
        error : err,  quotify : 'red'
    });
    return next();
  }

  process.nextTick(function(){
    var gulp = require('gulp');
    runtime.set({ completion : Object.keys(gulp.tasks) });
    next();
  });
});
