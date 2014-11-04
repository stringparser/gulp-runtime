'use strict';

var path = require('path');
var should = require('should');

module.exports = function(runtime, util){
  should.exists(util);
  console.log(' startup config\n\n', runtime.config());
  it('cwd should be ./test', function(){
    should(path.basename(process.cwd()))
      .be.eql('test');
  });
  it('gulpfile should be the one specified', function(done){
    should(path.resolve(runtime.config('env').gulpfile))
      .be.eql(path.join(process.cwd(), '_gulpfile.js'));
    done();
  });
  it('completion should be filled with the tasks', function(){
    runtime.get().completion.should
      .containDeep(Object.keys(require('gulp').tasks));
  });
};
