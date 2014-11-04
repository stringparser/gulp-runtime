'use strict';

var should = require('should');

module.exports = function(runtime, util){
  should.exists(util);
  it('-l or --log should log task code with --no-color', function(done){
    runtime.output.once('data', function(data){
      data.should.match(/gulp|task|default/);
      done();
    });
    runtime.emit('next', '--log default --no-color');
  });

};
