
'use strict';

/*
 * module dependencies
 */

var util = require('runtime/lib/utils');
var debug = require('debug')('gr:log');
var runtime = require('runtime').get('gulp');

runtime.set(['-l','--log'], function logTasks(argv, args){

  var gulp = require('gulp');

  var tasks = argv.slice(1);
  var colorIs = util.type(args.color);

  debug('argv', argv);
  debug('args', args);

  tasks.forEach(function(name){

    if( !gulp.tasks[name] ){

      var batched = util.quotify('`'+name+'`');

      util.batchThese('-l', batched, function(batch){
        console.warn( 'No task(s) with name '+batch.join(', ') );
      });

      return ;
    }

    var task = gulp.tasks[name];
    var str = ('\ngulp.task(\'' + task.name + '\',' +
        JSON.stringify(task.dep) +', ' +
        (''+task.fn) + ');\n').replace(/\n/g, '\n  ');

    if( colorIs.true || colorIs.undefined ){
      str = util.ansiJS(str);
    }

    console.log(str);
  });

  runtime.prompt();
});
