'use strict';

var fs = require('fs');
var path = require('path');
var should = require('should');

var test = {
  file: path.resolve(__dirname, 'dir', 'cliTestFile.js'),
  dirname: path.resolve(__dirname, 'dir'),
  content: 'exports = module.exports = { test: "cli" };'
};

exports = module.exports = function (Gulp, util) {

  before(function (done) {
    util.mkdirp(test.dirname, function (error) {
      if (error) { return done(error); }
      fs.writeFile(test.file, test.content, done);
    });
  });

  after(function (done) {
    util.rimraf(test.dirname, done);
  });

  it('--silent should turn off logging', function (done) {
    var gulp = Gulp.create();

    gulp.log.should.be.eql(true);

    gulp.start(['--silent'], function (error) {
      if (error) { return done(error); }
      should(gulp.log).be.eql(false);
      done();
    });
  });

  it('--no-color should turn colors off', function (done) {
    var gulp = Gulp.create();

    gulp.start(['--no-color'], function (error) {
      if (error) { return done(error); }
      should(util.lib.chalk).have.property('enabled', false);
      done();
    });
  });

  it('--color should restore them', function (done) {
    var gulp = Gulp.create();

    gulp.start(['--color'], function (error) {
      if (error) { return done(error); }
      should(util.lib.chalk).have.property('enabled', true);
      done();
    });
  });

  it('--cwd :dirname should change cwd', function (done) {
    var cwd = process.cwd();
    var gulp = Gulp.create();

    gulp.start(['--cwd ' + test.dirname], function (error) {
      if (error) { return done(error); }
      should(process.cwd()).be.eql(test.dirname);
      process.chdir(cwd); // restore previous working directory
      done();
    });
  });

  it('--require should require a module from the cwd', function (done) {
    var cwd = process.cwd();
    var gulp = Gulp.create();

    should(require.cache).not.have.property(test.file);

    gulp.start(['--require ' + test.file], function (error) {
      if (error) { return done(error); }
      should(require.cache).have.property(test.file);
      process.cwd().should.be.eql(cwd);
      done();
    });
  });
};
