'use strict';

// prevent default repl and add the test gulpfile
process.argv.splice(process.argv.indexOf('--repl'), 1);
process.argv.push('--repl', 'false');
process.argv.push('--gulpfile', './test/_gulpfile.js');

var path = require('path');
var packageName = require('../package').name;
var runtime = require('../');

var util = require('./_util');
// turn off logging
runtime.emit('next', '--silent');

describe(packageName, function(){
  before(function(done){
    setTimeout(function(){ done(); }, 1000);
  });
  util.testSuite().forEach(function(file){
    var suite = path.basename(file, path.extname(file));
    describe(suite, function(){
      // the actual suite code
      require('./'+file)(runtime, util);
    });
  });
});
