'use strict';

// prevent default repl and add the test gulpfile
process.argv[1] = 'test/_gulpfile.js';
process.argv.push('one');
process.argv.push('--silent', '--no-color');

var path = require('path');
var packageName = require('../package').name;
var runtime = require('../');
var util = require('./_util');

var timer, output = '';
runtime.output.on('data', function(data){
  output  = (output || '') + data;
  if(timer){  clearTimeout(timer);  }
  timer = setTimeout(function(){
    runtime.emit('test', output);
  }, 2);
});

runtime.on('test done', function(done){
  output = '';  done();
});

describe(packageName, function(){
  util.testSuite().forEach(function(file){
    var suite = path.basename(file, path.extname(file));
    describe(suite, function(){
      // the actual suite code
      require('./'+file)(runtime, util);
    });
  });
});
