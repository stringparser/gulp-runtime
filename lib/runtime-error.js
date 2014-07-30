
/*
 * Module dependencies
 */
var color = require('gulp-util').colors;
var PluginError = require('gulp-util').PluginError;

exports = module.exports = function RuntimeError(options){

  var message = options.message || (
    typeof options === 'function' ?
      options() : options
  );

  if(message){
    return new PluginError({
      plugin : 'gulp-runtime',
      message : message.replace(
        /(\`|\"|\')(\S+)(\`|\"|\')/g,
        function($0, $1, $2,$3){
          var match = $2 === 'gulp' ? (
            color.red($2)
          ) : color.cyan($2);

          return $1 + match + $3;
        }
      ) + '\n'
    });
  }
  else
    throw new PluginError({
      plugin : 'gulp-runtime',
      message : 'RuntimeError wrongly called.'
    });
}

