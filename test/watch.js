'use strict';

var fs = require('fs');
var should = require('should');

exports = module.exports = function(Gulp, util){
  should.exists(util);

  before(function(done){
    util.mkdirp('test/dir', done);
  });

  after(function(done){
    util.rimraf('test/dir', done);
  });

  function setupTest(onSuccess, onError){
    fs.writeFile(util.testFile, util.content, function(writeError){
      if(writeError){ onError(writeError); return; }

      onSuccess();

      setTimeout(function(){
        util.rimraf(util.testFile, function (deleteError){
          if(deleteError){ onError(deleteError); }
        });
      }, 10);
    });
  }

  it('watch(glob, [Function]) should call function on change', function(done){
    var gulp = Gulp.create({log: false});

    setupTest(function(){
      var watcher = gulp.watch(util.testFile, function(){
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
      var watcher = gulp.watch(util.testFile, ['one', 'two'], function(){
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
      var watcher = gulp.watch(util.testFile, ['one', 'two'], function(){
        pile.should.containDeep(['one', 'two']);
        watcher.end();
        done();
      });
    }, done);
  });
};
