'use strict';

module.exports = function(runtime, stdout){

  var path = require('path');
  var env = runtime.config().env;
  var assert = require('assert');

  it('config props [env, argv, parse, timer, name]', function(){
    stdout.enable();
    runtime.config().should.have
      .properties('env', 'parse', 'timer', 'name');
  });

  it('env props [cwd, gulpfile, cliPackage, modulePackage]', function(){
    stdout.enable();
    runtime.config().env.should.have
      .properties('INIT_CWD', 'gulpfile', 'cliPackage', 'modulePackage');
  });

  /*
   * Note: make better tests for this
   */
  it('argv.gulpfile defined should match env.gulpfile', function(){

    if( !process.argv.gulpfile ){
      return ;
    }
    
    stdout.enable();
    var gulpfile = env.gulpfile;

    gulpfile.should.be
      .a.String.and.be.exactly(
        require.resolve(process.argv.gulpfile)
      );

  });

  it('argv.gulpfile not defined, env.gulpfile fetched', function(){

    var gulpfile = env.gulpfile;

    assert(process.argv.gulpfile === void 0);

    gulpfile.should.be
      .a.String.and.be.exactly(
        require.resolve(path.resolve('.', 'gulpfile'))
      );
  });

};
