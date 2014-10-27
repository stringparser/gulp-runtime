'use strict';

var path = require('path');
var should = require('should');

module.exports = function(runtime, util){
  should.exists(util);
  it('cwd should be ./test', function(){
    should(path.basename(process.cwd()))
      .be.eql('test');
  });
  it('gulpfile should be the one specified', function(done){
    should(runtime.config('env').gulpfile)
      .be.eql(path.join(process.cwd(), '_gulpfile.js'));
    done();
  });
  it('completion should be filled with the tasks', function(){
    runtime.get().completion.should
      .containDeep(Object.keys(require('gulp').tasks));
  });
  it('history should be prewarmed with the tasks', function(){
    runtime.history.should
      .containDeep(Object.keys(require('gulp').tasks));
  });
};