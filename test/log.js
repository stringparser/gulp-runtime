'use strict';

var should = require('should');

module.exports = function(runtime, util){
  should.exists(util);
  it('-l or --log should log task code with --no-color', function(done){
    runtime.once('test', function(output){
      output.should.match(/gulp|task|default/);
      this.emit('test done', done);
    });
    runtime.emit('next', '--log default --no-color');
  });

};
