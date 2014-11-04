'use strict';

var should = require('should');

module.exports = function(runtime, util){
  should.exists(util);
  it('--tasks should output the task tree', function(done){
    var timer, output = '';
    runtime.output.on('data', function(data){
      output += data;
      clearTimeout(timer);
      timer = setTimeout(function(){
        output.match(/default|one|two|three/g)
          .should.have.property('length', 4 + 3);
        runtime.output.removeAllListeners('data');
        done();
      });
    });
    runtime.emit('next', '--tasks');
  });
  it('should be able to run a defined task', function(done){
    runtime.output.once('data', function(data){
      data.match(/Starting|one/g).should
        .have.property('length', 2);
      done();
    });
    runtime.emit('next', 'one');
  });
  it('should be able to run various tasks', function(done){
    runtime.output.once('data', function(data){
      data.match(/Starting|one|two/g);
      done();
    });
    runtime.emit('next', 'one two');
  });
};
