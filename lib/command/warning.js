

module.exports = function CommandWarning(options){

  var warn = options.length ? options : (
    options.message || options()
  );

  if(warn){
    var message = '[warning] -> ';

    console.log(
      padStr(message + warn + '', 0)
    )
  }
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
