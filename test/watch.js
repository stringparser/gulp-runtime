'use strict';

var fs = require('fs');
var should = require('should');

exports = module.exports = function(runtime, util){
  should.exists(util);
  var create = runtime.create;
  var testFile = 'test/dir/watch.js';

  beforeEach(function(done){
    fs.writeFile(testFile, util.content, done);
  });

  after(function(done){
    util.rimraf('test/dir/*.js', done);
  });

  it('(no opts) on change, should invoke callback', function(done){
    var gulp = create('watch callback', {log: false});

    var watcher = gulp.watch(testFile, function(){
      watcher.end();
      done();
    });

    util.rimraf(testFile, function(err){
      if(err){ throw err; }
    });
  });

  it('(opt string) should run tasks given', function(done){
    var gulp = create('watch opt string', {log: false});

    var watcher = gulp.watch(testFile, 'string', function(){
      watcher.end();
    });

    gulp.task('string', function(next){
      next(); done();
    });

    util.rimraf(testFile, function(err){
      if(err){ throw err; }
    });
  });

  it('(opt array) should run tasks given', function(done){
    var gulp = create('opt array', {log: false});

    gulp.task('array', function(next){
      next(); done();
    });

    var watcher = gulp.watch(testFile, ['array'], function(){
      watcher.end();
    });

    util.rimraf(testFile, function(err){
      if(err){ throw err; }
    });
  });

  it('should reload files if so was said', function(done){
    var gulp = create('reload file', {log: false});

    // arrange state change
    gulp.task('reload file', function(next){
      // assert initial state
      var testModule = require('./dir/watch');
      testModule.should.be.eql({content: 'changed'});

      // change exports
      testModule.prop = 'here';

      testModule.should.have.properties({
        content: 'changed',
        prop: 'here'
      });
      next();
    });

    var watcher = gulp.watch(testFile, {
      reload: true,
      tasks: 'reload file'
    }, function(){
      var reloaded = require('./dir/watch');
      reloaded.should.be.eql({content: 'changed'});
      watcher.end();
      done();
    });

    setTimeout(function(){
      fs.writeFile(testFile, util.contentChanged, function(err){
        if(err){ done(err); }
      });
    }, 150);
  });
};
