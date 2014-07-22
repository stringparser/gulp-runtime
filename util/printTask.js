
// module dependencies
var ansiJS = require('ansi-highlight')
  , PluginError = require('gulp-util').PluginError;

module.exports = function printTask(gulp, task, cb){

  var task = gulp.tasks[task]
  , strDeps = task.dep.length !== 0 ? (' '+task.dep).toString() + ',' : ''
  , strTaskFn = (' '+task.fn).toString()
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