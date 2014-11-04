'use strict';

var should = require('should');

module.exports = function(runtime, util){
  should.exists(util);
  it('--tasks should output the task tree', function(done){
    runtime.once('test', function (output){
      output.match(/default|one|two|three/g)
        .should.have.property('length', 4 + 3);
      runtime.emit('test done', done);
    });
    runtime.emit('next', '--tasks');
  });

  it('should be able to run a defined task', function(done){
    runtime.once('test', function(output){
      output.match(/one/g).should
        .have.property('length', 2);
      runtime.emit('test done', done);
    });
    runtime.emit('next', 'one');
  });

  it('should be able to run various tasks', function(done){
    runtime.once('test', function(output){
      output.match(/one|two/g).should
        .have.property('length', 4);
      runtime.emit('test done', done);
    });
    runtime.emit('next', 'one two');
  });
};
