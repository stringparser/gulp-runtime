'use strict';

var fs = require('fs');
var path = require('path');
var should = require('should');

module.exports = function(Gulp, util){
  should.exists(util);

  before(function(done){
    util.mkdirp('test/dir', function(e){
      if(e){ done(e); }
      fs.writeFile(util.testModule, util.testContent, function(er){
        if(er){ done(er); }
        fs.writeFile('test/dir/gulpfile.js', '', function(err){
          if(err){ done(err); }
          done();
        });
      });
    });
  });

  after(function(done){
    util.rimraf('test/dir', done);
  });

  var cliCommands = [
    ':cli(--silent)',
    ':cli(--version|-v)',
    ':cli(--cwd) :dirname(\\S+)',
    ':cli(--no-color|--color)',
    ':cli(--tasks-simple|--tasks|-T)',
    ':cli(--require) :file(\\S+)'
  ];

  var gulp = Gulp.create();

  it('should have all CLI commands', function(){
    cliCommands.forEach(function(name){
      (gulp.tasks.get(name) !== null).should.be.eql(true);
    });
  });

  it('--silent should turn off logging', function(done){
    gulp.start('--silent', {
      onHandleError: done,
      onHandleEnd: function(){
        this.log.should.be.eql(false);
        done();
        gulp.log = true;
      }
    });
  });

  it('--no-color should turn colors off', function(done){
    gulp.start('--no-color', {
      onHandleError: done,
      onHandleEnd: function(){
        util.lib.chalk.should.have.property('enabled', false);
        done();
      }
    });
  });

  it('--color should restore them', function(done){
    gulp.start('--color', {
      onHandleError: done,
      onHandleEnd: function(){
        util.lib.chalk.should.have.property('enabled', true);
        done();
      }
    });
  });

  it('--cwd :dirname should change cwd', function(done){
    var cwd = process.cwd();

    gulp.stack('--cwd ./dir/module', {
      onHandleError: done,
      onHandleStart: function(){
        console.log('helloo');
      },
      onHandleEnd: function(){
        console.log('hellooo');
        console.log(process.cwd());
        process.cwd().should.be.eql(
          path.resolve(__dirname, 'dir')
        );
      }
    })(function (){
      process.chdir(cwd); // restore previous working directory
      done();
    });
  });

  it('--require should require a module from the cwd', function(done){
    var cwd = process.cwd();
    var modulePath = path.join(cwd, 'test/dir/module.js');

    gulp.start('--require test/dir/module', {
      onHandleError: done,
      onHandleStart: function(){
        require.cache.should.not.have.property(modulePath);
      },
      onHandleEnd: function(){
        require.cache.should.have.property(modulePath);
        process.cwd().should.be.eql(cwd);
        done();
      }
    });
  });
};
