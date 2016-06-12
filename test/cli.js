'use strict';

var fs = require('fs');
var path = require('path');
var should = require('should');

var test = {
  file: path.resolve(__dirname, 'dir', 'cliTestFile.js'),
  dirname: path.resolve(__dirname, 'dir'),
  content: 'exports = module.exports = { test: "cli" };'
};

exports = module.exports = function(Gulp, util){

  before(function(done){
    util.mkdirp(test.dirname, function(error){
      if(error){ return done(error); }
      fs.writeFile(test.file, test.content, done);
    });
  });

  after(function(done){
    util.rimraf(test.dirname, done);
  });

  var gulp = Gulp.create();

  it('--silent should turn off logging', function(done){
    gulp.start('--silent', {
      onHandleError: done,
      onHandleEnd: function(){
        should(this.log).be.eql(false);
        done();
        gulp.log = true;
      }
    });
  });

  it('--no-color should turn colors off', function(done){
    gulp.start('--no-color', {
      onHandleError: done,
      onHandleEnd: function(){
        should(util.lib.chalk).have.property('enabled', false);
        done();
      }
    });
  });

  it('--color should restore them', function(done){
    gulp.start('--color', {
      onHandleError: done,
      onHandleEnd: function(){
        should(util.lib.chalk).have.property('enabled', true);
        done();
      }
    });
  });

  it('--cwd :dirname should change cwd', function(done){
    var cwd = process.cwd();

    gulp.start('--cwd ' + test.dirname, {
      onHandleError: done,
      onHandleEnd: function(){
        should(process.cwd()).be.eql(test.dirname);
        process.chdir(cwd); // restore previous working directory
        done();
      }
    });
  });

  it('--require should require a module from the cwd', function(done){
    var cwd = process.cwd();

    gulp.start('--require ' + test.file, {
      onHandleError: done,
      onHandleStart: function(){
        should(require.cache).not.have.property(test.file);
      },
      onHandleEnd: function(){
        should(require.cache).have.property(test.file);
        process.cwd().should.be.eql(cwd);
        done();
      }
    });
  });
};
