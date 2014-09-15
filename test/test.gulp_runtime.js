'use strict';

var hook = require('./stdoutHook');

describe('gulp-runtime', function(){

  var fs = require('fs');
  var runtime = require('../.');

  var testFiles = fs.readdirSync('./test/suite').sort(function(a,b){
    return a.length - b.length;
  });

  testFiles.forEach(function(testFile){

    var name = testFile.replace('.', '/').match(/\S+(?!\.js)/);

    describe('- '+name, function(){
      require('./suite/'+testFile)(runtime, hook);
    });

  });
});
