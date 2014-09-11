
/**
 * dependencies
 */
var gulp = require('gulp');
var runtime = require('../gulp-runtime');

/*
 * Add tasks to completion
 */
process.nextTick(function(){

  var gulp = require('gulp');
  process.nextTick(function(){
    runtime.set({ completion : Object.keys(gulp.tasks) });
  });
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
    util.logTasksSimple(env, gulp);
  else
    util.logTasks(env, gulp);

  runtime.prompt();
});


/*
 * tasks at runtime
 */
runtime.set(function taskRunner(argv, args, next){

  var gulp = require('gulp');
  var gutil = require('gulp-util');
  var chalk = gutil.colors;

  var tasks = argv;

  tasks = tasks.filter(function(name){
    if(name !== 'default')
      return gulp.tasks[name];
    else {
      gutil.log(
        '[gulp-runtime] the `'+chalk.cyan('default')+'` task '+
        'is not avaliable at runtime.'
      );
      return false;
    }
  });

  if( tasks[0] ){

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
  } else {

    gutil.log(
      '[gulp-runtime] task(s) '+
      chalk.red('`'+argv+'`')+' are not in your gulpfile(s)'
    );

    gutil.log('[gulp-runtime] Please check the `gulp` documentation for proper gulpfile formatting');
    process.exit(1);
  }

});
