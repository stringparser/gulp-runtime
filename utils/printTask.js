
// module dependencies
var ansiJS = require('ansi-highlight')
  , cliText = require('../lib/runtime').cliText;

module.exports = function printTask(task, argv){

  var dep = task.dep
    , strFn = JSON.stringify(dep)
    , str;

  str = (
  'gulp.task(\'' + task.name + '\','
    + (dep.legnth !== 0 ?  strFn + ',' : '').toString()
    + (task.fn).toString()
   + ');\n'+cliText
  ).toString();

  process.stdout.write(
    ansiJS(str)
  );
}