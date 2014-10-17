
'use strict';

var runtime = require('runtime').set('gulp');

runtime.require('./utils');
runtime.require('./config');
runtime.require('./repl');

runtime.config('repl', true);
module.exports = runtime.repl();
