'use strict';

var path = require('path');
var should = require('should');

module.exports = function(runtime, util){
  should.exists(util);

  it('--require should reload if file was in cache', function(done){
    var timer;
    var fileName = path.join(process.cwd(), '_util.js');
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
    runtime.emit('next', '--require _util.js');
  });
};
