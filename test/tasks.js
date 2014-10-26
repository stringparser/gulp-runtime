'use strict';

var should = require('should');

module.exports = function(runtime, util){
  should.exists(util);
  it('should be able to run a defined task', function(done){
    var timer;
    var output = '';
    runtime.output.on('data', function(buf){
      var self = this;
      output += buf;
      if(timer){ clearTimeout(timer); }
      timer = setTimeout(function(){
        self.removeAllListeners('data');
        output.match(/Starting|one/g)
          .should.have.property('length', 2);
        done();
      });
    });
    runtime.emit('next', 'one');
  });
  it('should be able to run various tasks', function(done){
    var timer;
    var output = '';
    runtime.output.on('data', function(buf){
      var self = this;
      output += buf;
      if(timer){ clearTimeout(timer); }
      timer = setTimeout(function(){
        self.removeAllListeners('data');
        output.should.match(/Starting|one|two/g);
        done();
      });
    });
    runtime.emit('next', 'one two');
  });

  it('--tasks should output the task tree', function(done){
    var timer;
    var output = '';
    runtime.output.on('data', function(buf){
      var self = this;
      output += buf;
      if(timer){ clearTimeout(timer); }
      timer = setTimeout(function(){
        self.removeAllListeners('data');
        output.match(/default|one|two|three/g)
          .should.have.property('length', 4 + 3);
        done();
      });
    });
    runtime.emit('next', '--tasks');
  });
};
