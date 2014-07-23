
// module dependencies
var ansiJS = require('ansi-highlight')
  , PluginError = require('gulp-util').PluginError;

module.exports = function printTask(task, cb){

  var strDeps = task.dep.length !== 0 ? (
      ' '+JSON.stringify(task.dep) + ','
    ) : ''
  , strTaskFn = (' '+task.fn).toString()
  , str = '\ngulp.task(\'' + task.name + '\',';

  str += strDeps + strTaskFn + ');\n'

  if(typeof cb === 'function')
    cb(ansiJS(str));
  else if(typeof cb !== 'undefined')
    throw new PluginError({
      plugin : 'gulp-runtime',
      message : 'printTask needs a callback.\n This is an error, please report it.'
    });
}