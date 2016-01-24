'use strict';

var should = require('should');

module.exports = function(runtime, util){
  should.exists(util);
  var create = runtime.create;

  it('task("name", [Function]) should register `name`', function(){
    var gulp = create();
    var handle = function(){};
    gulp.task('name', handle);
    gulp.tasks.get('name').fn.should.be.eql(handle);
  });

  it('task([Function: name]) should register `name`', function(){
    var gulp = create();
    function name(){}
    gulp.task(name);
    gulp.tasks.get('name').fn.should.be.eql(name);
  });

  it('task("taskName", [Function: name]) should register `name`', function(){
    var gulp = create();
    function name(){}
    gulp.task('taskName', name);
    gulp.tasks.get('taskName').fn.should.be.eql(name);
  });

  it('task("taskName") should return registered its function', function(){
    var gulp = create();
    function name(){}
    gulp.task('taskName', name);
    gulp.task('taskName').should.be.eql(name);
  });

  it('task("taskName", deps, [Function]) should register task deps', function(){
    var gulp = create();
    var deps = ['1', '2', '3'];
    function name(){}

    gulp.task('taskName', deps, name);
    gulp.task('taskName').should.be.eql(name);
  });
};
