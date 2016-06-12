'use strict';

var fs = require('fs');
var path = require('path');

var test = {
  file: path.resolve(__dirname, 'dir', 'watchTestFile.js'),
  content: 'exports = module.exports = { test: "watchTest" };',
  dirname: path.resolve(__dirname, 'dir')
};

exports = module.exports = function(Gulp, util){

  before(function(done){
    util.mkdirp(test.dirname, done);
  });

  after(function(done){
    util.rimraf(test.dirname, done);
  });

  function setupTest(onSuccess, onError){
    fs.writeFile(test.file, test.content, function(writeError){
      if(writeError){
        return onError(writeError);
      }

      onSuccess();

      setTimeout(function(){
        fs.writeFile(test.file, '// changed', onError);
      }, 10);
    });
  }

  it('watch(glob, [Function]) should call function on change', function(done){
    var gulp = Gulp.create({log: false});

    setupTest(function(){
      var watcher = gulp.watch(test.file, function(){
        watcher.end();
        done();
      });
    }, done);
  });

  it('watch(glob, tasks) runs tasks in parallel after change', function(done){
    var pile = [];
    var gulp = Gulp.create({
      log: false,
      onHandleError: done
    });

    gulp.task('one', function(next){
      setTimeout(function(){
        pile.push('one');
        if(pile.length > 1){
          pile.should.containDeep(['one', 'two']);
          done();
        }
        next();
      }, Math.random() * 10);
    });

    gulp.task('two', function(next){
      setTimeout(function(){
        pile.push('two');
        if(pile.length > 1){
          pile.should.containDeep(['one', 'two']);
          done();
        }
        next();
      }, Math.random() * 10);
    });

    setupTest(function(){
      var watcher = gulp.watch(test.file, ['one', 'two'], function(){
        watcher.end();
      });
    }, done);
  });

  it('watch(glob, tasks, fn) onChange fn runs after tasks', function(done){
    var pile = [];
    var gulp = Gulp.create({
      log: false,
      onHandleError: done
    });

    gulp.task('one', function(next){
      setTimeout(function(){
        pile.push('one');
        next();
      }, Math.random() * 10);
    });

    gulp.task('two', function(next){
      setTimeout(function(){
        pile.push('two');
        next();
      }, Math.random() * 10);
    });

    setupTest(function(){
      var watcher = gulp.watch(test.file, ['one', 'two'], function(){
        pile.should.containDeep(['one', 'two']);
        watcher.end();
        done();
      });
    }, done);
  });
};
