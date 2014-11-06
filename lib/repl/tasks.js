'use strict';


var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

var debug = util.debug(__filename);

/*
 * tasks at runtime
 * ------
 * this is also the root handler
 * non handled commands will end up here
 */

runtime.set(function taskRunner(argv, args, next){
  debug('argv', argv);
  // handle empty lines first
  if( !argv[0] ){  return runtime.prompt();  }

  var gulp = require('gulp');

  // filter the tasks
  var cmds = argv.join(' ');
  var tasks = cmds.match(util.tasksRE(gulp)) || [ ];

  // not found
  var notFound = [ ];
  var notCommand = tasks.indexOf(argv[0]) < 0 && !runtime.get(argv)._depth;
  while( notCommand ){
    notFound.push(argv[0]);
    cmds = cmds.replace(argv.shift(), '').trim();
    notCommand = argv[0] && tasks.indexOf(argv[0]) < 0 &&
      !runtime.get(argv)._depth;
  }

  debug('onNext', cmds.split(/[ ]+/), 'notFound', notFound);
  if( notFound.length ){
    runtime.emit('message', {
      message : ' command \''+ notFound.join(' ') +'\' not found ',
      quotify : 'red',
       prompt : !tasks.length
    });
    // dispatch next
    return next(cmds);
  }

  // run tasks
  if( !tasks.length ){ return next(cmds); }
  try {  gulp.start.apply(gulp, tasks);  }
    catch(err){ throw err; }
});
