'use strict';

var hook = require('./stdoutHook');

describe('gulp-runtime', function(){

  var fs = require('fs');
  var stdout = hook(function(str){ return str; });
  var runtime = require('../lib/gulp-runtime');

  var testFiles = fs.readdirSync('./test/suite').sort(function(a,b){
    return a.length - b.length;
  });

  testFiles.forEach(function(testFile){
    describe(testFile, function(){
      require('./suite/'+testFile)(runtime, stdout);
    });

  });

});
