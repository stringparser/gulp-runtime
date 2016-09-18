'use strict';

exports = module.exports = function (Gulp) {
  var should = require('should');

  it('task(name, fn) registers task `name`', function () {
    var gulp = Gulp.create();
    var handle = function () {};
    gulp.task('name', handle);
    gulp.tasks.get('name').fn.should.be.eql(handle);
  });

  it('task([Function: name]) registers task `name`', function () {
    var gulp = Gulp.create();
    function name () {}
    gulp.task(name);
    gulp.tasks.get('name').fn.should.be.eql(name);
  });

  it('task(name, [Function]) registers task `name`', function () {
    var gulp = Gulp.create();
    function name () {}
    gulp.task('taskName', name);
    gulp.tasks.get('taskName').fn.should.be.eql(name);
  });

  it('task(name) returns task\'s function', function () {
    var gulp = Gulp.create();
    function name () {}
    gulp.task('taskName', name);
    gulp.task('taskName').should.be.eql(name);
  });

  it('task(name, deps, fn) deps can be defined after', function (done) {
    var gulp = Gulp.create();
    var deps = ['1', '2', '3'];

    gulp.task('taskName', deps, function () {});
    deps.forEach(function (dep) {
      (gulp.tasks.get(dep) === null).should.be.eql(true);
    });

    function one () {}
    gulp.task('1', one);
    gulp.task('1').should.be.eql(one);

    done();
  });

  it('task(name, deps, fn) non defined deps throw at runtime', function (done) {
    var gulp = Gulp.create({log: false});
    var deps = ['1', '2', '3'];

    gulp.task('taskName', deps, function () {});
    gulp.stack('taskName')(function (error) {
      should(error).be.instanceof(Error);
      done();
    });
  });

  it('task(name, deps, fn) deps will run before task', function (done) {
    var gulp = Gulp.create({log: false});

    gulp.task('task', ['one', 'two'], function (next, pile) {
      pile.push('task');
      next(null, pile);
    });

    gulp.task('one', function (next, pile) {
      pile.push('one');
      next(null, pile);
    });

    gulp.task('two', function (next, pile) {
      pile.push('two');
      next(null, pile);
    });

    var task = gulp.tasks.get('task');

    task.fn([], function (err, pile) {
      if (err) { return done(err); }
      pile.should.containDeep(['one', 'two', 'task']);
      pile.pop().should.be.eql('task');
      done();
    });
  });

  it('task(name, deps) bundles deps into task `name`', function (done) {
    var gulp = Gulp.create({ log: false });

    gulp.task('task', ['one', 'two']);

    gulp.task('one', function (next, pile) {
      pile.push('one');
      next(null, pile);
    });

    gulp.task('two', function (next, pile) {
      pile.push('two');
      next(null, pile);
    });

    var task = gulp.tasks.get('task');

    task.fn([], function (err, pile) {
      if (err) { return done(err); }
      pile.should.be.eql(['one', 'two']);
      done();
    });
  });
};
