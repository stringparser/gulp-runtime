'use strict';

var should = require('should');

module.exports = function(runtime, util){
  should.exists(util);
  it('should have repl commands on completion', function(){
    runtime.get().completion.should
      .containDeep(
        [
          '--gulpfile',
          '--require',
          '--log',
          '--tasks',
          '--tasks-simple',
          '-v',
          '--version'
        ]
      );
  });
};
