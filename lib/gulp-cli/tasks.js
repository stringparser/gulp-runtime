
/**
 * dependencies
 */
var runtime = require('../gulp-runtime');
var gulp = require('gulp');
var gutil = require('gulp-util');

/*
 * Add tasks to completion
 */
process.nextTick(function(){
  runtime.set({ completion : Object.keys(gulp.tasks) });
});

/*
 * task flags
 */
var flags = ["--tasks", "-T", "--tasks-simple"];

runtime.set(flags, function taskLog(argv, args, next){

  var taskSimpleFlag = args['tasks-simple'];

  if( !args.T && !args.tasks && !taskSimpleFlag )
    return ;

  var env = runtime.config('env');
  var util = require('../utils');

  if(taskSimpleFlag)
    util.logTasksSimple(gulp, env);
  else
    util.logTasks(gulp, env);

  runtime.prompt();
});


/*
 * tasks at runtime
 */
runtime.set(function taskRunner(argv, args, next){

  var tasks = argv;

  if( tasks.indexOf('default') !== -1){
    console.log(
      '[gulp-runtime] the `'+chalk.cyan('default')+'` task '+
      'is not avaliable at runtime.'
    );
  }

  tasks = tasks.filter(function(name){
    if(name !== 'default')
      return gulp.tasks[name];
    else
      return false;
  });

  if(tasks.length !== 0){

    tasks.push(function(){
      runtime.prompt();
      gulp.doneCallback = undefined;
    });

    try {
      gulp.start.apply(gulp, tasks);
    } catch(err){
      throw new gutil.PluginError({
         plugin : 'gulp-runtime',
        message : 'Error while `starting` a task. '+
                  ' This is an issue, please report.',
        showStack : true
      });
    }
  }

});
