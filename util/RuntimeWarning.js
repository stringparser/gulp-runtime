
/*
 * Module dependencies
 */

var color = require('gulp-util').colors;

module.exports = function RuntimeWarning(cb){

  var warn = cb();

  if(warn){
    var message = 'Plugin ' + color.cyan('gulp-runtime') + '\n' +
                  '[' + color.yellow('warning') + '] -> '

    console.log(
      padStr(message + warn, 3)
    )
  }

  this.emit('done');
}

function padStr(str, num){

  var ret = '';
  var pad = new Array(
    num ? num : 0 + 1
  ).join(' ');

  var par = str.split('\n');
  var len = par.length;

  par.forEach(
    function(line, index){
      ret += pad + line;
      ret += (index !== len-1) ? '\n' : '';
    }
  );

  return ret;
}
