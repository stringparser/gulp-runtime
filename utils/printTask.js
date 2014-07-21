
var promptText = require('./prompt').promptText;

module.exports = function printTask(task){

  var dep = task.dep
    , strFn = JSON.stringify(dep);

  process.stdout.write(
    'gulp.task(\'' + task.name + '\','
      + (dep.legnth !== 0 ?  strFn + ',' : '').toString()
      + (task.fn).toString()
     + ');\n'+promptText
  );
}