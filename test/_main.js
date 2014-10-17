'use strict';

var monkey = require('stdout-monkey')();

describe('gulp-runtime', function(){

  var fs = require('fs');
  var runtime = require('../.');
      runtime.config('repl', false);

/*  var testFiles = fs.readdirSync('./test/suite');

  testFiles.forEach(function(testFile){
    describe(testFile.replace('.','/'), function(){
      require('./suite/'+testFile)(runtime, monkey);
    });
  });*/

});
