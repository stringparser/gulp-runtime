'use strict';

var path = require('path');
var should = require('should');

module.exports = function(runtime, util){
  should.exists(util);
  it('--gulpfile should reload if file was in cache', function(done){
    var timer;
    var fileName = path.join(process.cwd(), '_gulpfile.js');
    should.exists(require.cache[fileName]);
    var output = '';
    runtime.output.on('data', function(buf){
      var self = this;
      output += buf;
      if(timer){ clearTimeout(timer); }
      timer = setTimeout(function(){
        self.removeAllListeners('data');
        output.should.match(/Reload/);
        done();
      });
    });
    runtime.emit('next', '--gulpfile _gulpfile.js');
  });
  it('--gulpfile should load gulpfile', function(done){
    var timer;
    var fileName = path.resolve(process.cwd(), '../gulpfile.js');
    should.not.exists(require.cache[fileName]);
    var output = '';
    runtime.output.on('data', function(buf){
      var self = this;
      output += buf;
      if(timer){ clearTimeout(timer); }
      timer = setTimeout(function(){
        self.removeAllListeners('data');
        output.should.match(/Load/);
        done();
      });
    });
    runtime.emit('next', '--gulpfile ../gulpfile.js');
  });
};
