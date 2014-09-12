
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
var flags = ["ls", "--tasks", "-T", "--tasks-simple"];

runtime.set(flags, function taskLog(argv, args, next){

  var taskSimpleFlag = args['tasks-simple'];
  var testFlags = !args.T && !args.tasks && !taskSimpleFlag;

  if( args._.indexOf('ls') < 0 && testFlags )
    return ;

  var env = runtime.config('env');
  var util = runtime.require('../utils');

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
    gutil.log('[gulp-runtime] Task `'+argv+'` not found');
    runtime.prompt();
  }

});
