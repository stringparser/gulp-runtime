'use strict';

var should = require('should');

module.exports = function(runtime, util){
  should.exists(util);
  it('-l or --log should log task code', function(done){
    var timer;
    var output = '';
    runtime.output.on('data', function(buf){
      var self = this;  output += buf;
      if(timer){ clearTimeout(timer); }
      timer = setTimeout(function(){
        output.match(/gulp|default|function/g)
          .should.have.property('length', 3);
        self.removeAllListeners('data');
        done();
      });
    });
    runtime.emit('next', '--log default');
  });

};
