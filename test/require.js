'use strict';

var path = require('path');
var should = require('should');

module.exports = function(runtime, util){
  should.exists(util);

  it('--require should reload if file was in cache', function(done){
    var fileName = path.join(process.cwd(), '_util.js');
    should.exists(require.cache[fileName]);
    runtime.output.once('data', function(data){
      data.should.match(/Reload/);
      done();
    });
    runtime.emit('next', '--require _util.js');
  });
};
