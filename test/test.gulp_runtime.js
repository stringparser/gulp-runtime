'use strict';

var hook = require('./stdoutHook');

describe('gulp-runtime', function(){

  var fs = require('fs');
  process.argv.push('--silent');
  require('../.');

  var runtime = require('runtime').get('gulp');

  var testFiles = fs.readdirSync('./test/suite').sort(function(a,b){
    return a.length - b.length;
  });

  testFiles.forEach(function(testFile){

    var stdout = hook(function(str){ return str; });

    describe(testFile, function(){
      require('./suite/'+testFile)(runtime, stdout);
    });

  });
});
