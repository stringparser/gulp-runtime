'use strict';

describe('gulp-runtime', function(){

  var fs = require('fs');
  var runtime = require('../.');

  var testFiles = fs.readdirSync('./test/suite').sort(function(a,b){
    return a.length - b.length;
  });

  function hookStdout(cb){
    var oldWrite = process.stdout.write;
    process.stdout.write = (function(write){
      return function(str, enc, fd){
        write.apply(process.stdout, arguments);
        cb(str, enc, fd);
      };
    })(process.stdout.write);

    return function(){
      process.stdout.write = oldWrite;
    };
  }

  var stdout, unhook = hookStdout(function(str){
    stdout = str;
  });

  testFiles.forEach(function(testFile){

    var name = testFile.replace('.', '/').match(/\S+(?!\.js)/);

    describe('- '+name, function(){
      require('./suite/'+testFile)(runtime, stdout);
    });

  });

  unhook();
});
