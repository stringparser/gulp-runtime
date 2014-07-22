
// module dependencies
var gulp = require('gulp')
  , ansiJS = require('ansi-highlight')
  , PluginError = require('gulp-util').PluginError;

module.exports = function printTask(task, cb){

  var task = gulp.tasks[task]
    , strDeps = task.dep.length !== 0 ? JSON.stringify(task.dep) + ',' : ''
    , strTaskFn = JSON.stringify(task.fn)
    , str = 'gulp.task(\'' + task.name + '\',';

  str += strDeps + strTaskFn + ');'

  if(typeof cb === 'function')
    cb(ansiJS(str));
  else if(typeof cb !== 'undefined')
    throw new PluginError({
      plugin : 'gulp-runtime',
      message : 'printTask needs a callback.\n This is an error, please report it.'
    });
}