'use strict';

module.exports = function(runtime){

  var path = require('path');
  var config = runtime();

  it('config props [env, argv, parse, timer, name]', function(){

    config.should.have
      .properties('env', 'argv', 'parse', 'timer', 'name');
  });

  it('env props [cwd, gulpfile, cliPackage, modulePackage]', function(){

    config.env.should.have
      .properties('cwd', 'gulpfile', 'cliPackage', 'modulePackage');
  });

  /*
   * Note: make better tests for this
   */
  it('env.gulpfile matches the required file', function(){

    config.env.gulpfile.should.be
      .a.String.and.be.exactly(
        require.resolve(path.resolve('.', 'gulpfile'))
      );
  });

};