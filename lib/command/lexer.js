

/*
 * Prepare the arguments for the consumer
 *   - Strip all flag arguments i.e. numbers and ="something".
 *   - Put the flags at the beginning.
 */

module.exports = function defaultLexer(line){

  var flags = [];
  var cmd = line.replace(/(\d+|=\S+)/g, '');


  function takeFlags($1){
    flags.push($1);

    return '';
  }

  cmd = cmd.replace(/-{1,}\S+/g, takeFlags).match(/\w+/g);

  if(cmd !== null)
    return flags.concat(cmd);
  else
    return flags;
}