'use strict';


  var util = require('runtime/lib/utils');
  var debug = util.debug(__filename);

var runtime = require('runtime').get('gulp');

/*
 * tasks at runtime
 * ------
 * this is also the root handler
 * non handled commands will end up here
 */



runtime.set(function taskRunner(argv, args, next){
  var tasks = [ ];
  var gulp = require('gulp');
  debug('gulp', gulp);

  // consuming arguments
  argv = argv.filter(function(name){
    if( !gulp.tasks[name] ){ return true; }
    tasks.push(name);
  });

  // not found
  var arg = argv.join(' ').trim();
  if( arg && !runtime.get(argv)._depth ){
    runtime.emit('message', {
      message : ' command \''+ arg +'\' not found ',
      quotify : 'red',
       prompt : !Boolean(tasks.length)
    });
  }

  // return early
  if( !tasks.length ){ return ; }

  // dispatch tasks
  try {  gulp.start.apply(gulp, tasks);  }
    catch(err){ throw err; }

  debug('tasks', tasks, tasks.length);
  next(argv.slice(1));
});
