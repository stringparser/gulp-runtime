'use strict';

var should = require('should');

module.exports = function(Gulp, util){
  should.exists(util);

  it('task("name", fn) should register `name`', function(){
    var gulp = Gulp.create();
    var handle = function(){};
    gulp.task('name', handle);
    gulp.tasks.get('name').fn.should.be.eql(handle);
  });

  it('task([Function: name]) should register `name`', function(){
    var gulp = Gulp.create();
    function name(){}
    gulp.task(name);
    gulp.tasks.get('name').fn.should.be.eql(name);
  });

  it('task("name", [Function]) should register `name`', function(){
    var gulp = Gulp.create();
    function name(){}
    gulp.task('taskName', name);
    gulp.tasks.get('taskName').fn.should.be.eql(name);
  });

  it('task("taskName") should return the function registered', function(){
    var gulp = Gulp.create();
    function name(){}
    gulp.task('taskName', name);
    gulp.task('taskName').should.be.eql(name);
  });

  it('task deps can be defined after task("taskName", deps, fn)', function(){
    var gulp = Gulp.create();
    var deps = ['1', '2', '3'];

    gulp.task('taskName', deps, function(){});

    deps.forEach(function(dep){
      (gulp.task(dep) === null).should.be.eql(true);
    });

    function one(){}
    gulp.task('1', one);

    gulp.task('1').should.be.eql(one);
  });

  it('task deps not defined throw at runtime', function(done){
    var gulp = Gulp.create({log: false});
    var deps = ['1', '2', '3'];

    gulp.task('taskName', deps, function(){});
    gulp.stack('taskName')(function(error){
      error.should.be.instanceof(Error);
      done();
    });
  });

  it('task deps are run in series before the task', function(done){
    var gulp = Gulp.create({log: false});
    var deps = ['1', '2', '3'];

    var pile = [];
    gulp.task('taskName', deps, function(next){
      pile.push('taskName');
      next();
    });

    deps.forEach(function(dep){
      gulp.task(dep, function(next){
        pile.push(dep);
        next();
      });
    });

    gulp.stack('taskName', {
      onHandleError: done,
      onStackEnd: function(err){
        if(err){ return done(err); }
        pile.should.be.eql(deps.concat('taskName'));
        done();
      }
    })();
  });
};
