
'use strict';
var util = require('runtime/lib/utils');
var runtime = require('runtime').create('gulp');

runtime.require('./utils');
runtime.require('./config');
runtime.require('./repl');

var debug = util.debug(__filename);
runtime.once('done', function(){

  var makeRepl = util.type(runtime.config('repl')).boolean;
  debug('makeRepl?', makeRepl);
  runtime.repl(
    makeRepl
      ? runtime.config('repl')
      : JSON.parse(runtime.parser(process.argv).repl || 'true' )
  );
});


module.exports = runtime;
