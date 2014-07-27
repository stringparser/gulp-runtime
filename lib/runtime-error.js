
/*
 * Module dependencies
 */
var PluginError = require('gulp-util').PluginError;

exports = module.exports = RuntimeError;

function RuntimeError(options){

  var message = options.message || options();

  if(message)
    return new PluginError({
      plugin : 'gulp-runtime',
      message : message
    });
  else
    throw new PluginError({
      plugin : 'gulp-runtime',
      message : 'RuntimeError wrongly called.'
    });
}

