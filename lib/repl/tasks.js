'use strict';

var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

/*
 * tasks at runtime
 * ------
 * this is also the root handler
 * non handled commands will end up here
 */

runtime.set(function taskRunner(argv){
  var tasks = [ ];
  var gulp = require('gulp');

  // consuming arguments
  argv = argv.filter(function(name){
    if( !gulp.tasks[name] ){ return true; }
    tasks.push(name);
  });

  // not found
  var chalk = util.colors;
  if( argv.length ){
    if( argv.indexOf('default') < 0 ){
      runtime.emit('message', {
        message : ' command \''+argv.join(' ')+'\' not found ',
        quotify : 'red',
         prompt : tasks.length ? false : true
      });
    } else {
      runtime.emit('message', {
        message :
          chalk.red('Task \'default\' is not in your gulpfile') + '\n' +
          'Please check the documentation for proper gulpfile formatting',
        stamp : true
      });
      process.exit(1);
    }
  }

  // dispatch tasks
  if( tasks.length ){
    try { gulp.start.apply(gulp, tasks); }
    catch(err){
      return runtime.emit('message', {
        error : err, throw : true
      });
    }
  }
});
