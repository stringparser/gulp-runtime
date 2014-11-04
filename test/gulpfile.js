'use strict';

var should = require('should');

module.exports = function(runtime, util){
  should.exists(util);
  it('gulpfile should be in cache', function(){
    var gulpfile = runtime.config('env').gulpfile;
    should.exists(require.cache[gulpfile]);
  });

  it('--gulpfile should reload if file was in cache', function(done){
    runtime.output.once('data', function(data){
      data.should.match(/Reload/);
      done();
    });
    runtime.emit('next', '--gulpfile _gulpfile.js');
  });
};
