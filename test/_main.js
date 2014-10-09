'use strict';

var monkey = require('stdout-monkey');

describe('gulp-runtime', function(){

  var fs = require('fs');
  var stdout = hookStdout();
  var runtime = require('../.');

  var testFiles = fs.readdirSync('./test/suite');

  testFiles.forEach(function(testFile){
    describe(testFile.replace('.','/'), function(){
      require('./suite/'+testFile)(runtime, stdout);
    });

  });

});
