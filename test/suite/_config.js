'use strict';

module.exports = function(runtime, stdout){

  var path = require('path');
  var config = runtime.config();

  stdout.enable();
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
  it('env.gulpfile if is defined, matches the required file', function(){

    var gulpfile = config.argv;

    if( gulpfile ){
      gulpfile.should.be
        .a.String.and.be.exactly(
          require.resolve(path.resolve('.', 'gulpfile'))
        );
    } else {
      (gulpfile === void 0).should.be.true;
    }

  });

};
