'use strict';

var fs = require('fs');
var path = require('path');
var should = require('should');

module.exports = function(runtime, util){
  var create = runtime.create;
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
    ':flag(--silent)',
    ':flag(--cwd) :dirname',
    ':flag(--no-color|--color)',
    ':flag(--tasks-simple|--tasks|-T)',
    ':flag(--require|--gulpfile) :file'
  ];

  var cli = create();
  it('should have all CLI commands', function(){
    cli.regex
      .should.have.property('length', cliCommands.length);

    cli.store.children
      .should.have.properties(cliCommands);
  });

  var gulp = create('gulp');
  it('--silent should turn off logging', function(done){
    gulp.stack('--silent', {
      onHandle: function(){
        if(this.queue){ return ; }
        this.log.should.be.eql(false);
        done();
      }
    })();
  });

  it('--silent again should restore it', function(done){
    gulp.stack('--silent', {
      onHandle: function(){
        if(this.queue){ return ; }
        this.log.should.be.eql(true);
        done();
      }
    })();
  });

  it('--no-color should turn colors off', function(done){
    gulp.stack('--no-color', {
      log: false,
      onHandleError: done,
      onHandle: function(){
        if(this.queue){ return ; }
        util.lib.color.should.have.property('enabled', false);
        done();
      }
    })();
  });

  it('--color should restore them', function(done){
    gulp.stack('--color', {
      log: false,
      onHandleError: done,
      onHandle: function(){
        if(this.queue){ return ; }
        util.lib.color.should.have.property('enabled', true);
        done();
      }
    })();
  });

  it('--cwd :dirname([^ ]) should change cwd', function(done){
    var cwd = process.cwd();
    gulp.stack('--cwd ../', {
      log: false,
      onHandleError: done,
      onHandle: function(){
        if(this.queue){ return ; }
        process.cwd().should.be.eql(path.resolve(__dirname, '../..'));
        process.chdir(cwd); // restore previous working directory
        done();
      }
    })();
  });

  it('--tasks-simple should log tasks with no format', function(done){
    var wrote = '', timer = null;
    var write = process.stdout.write;
    process.stdout.write = function(value){
      wrote += value;
      clearTimeout(timer);
      timer = setTimeout(function(){
        process.stdout.write = write;
        wrote.trim().split('\n').should.be.eql(cliCommands);
        done();
      });
    };

    gulp.stack('--tasks-simple', {onHandleError: done})();
  });

  it('--tasks should log tasks archy format', function(done){
    util.lib.color.enabled = false;
    var wrote = '', timer = null;
    var write = process.stdout.write;

    process.stdout.write = function(value){
      wrote += value;
      clearTimeout(timer);
      timer = setTimeout(function(){
        process.stdout.write = write;
        wrote.should.match(/-/);
        wrote.should.match(/\|/);
        wrote.should.match(/Tasks for/);
        wrote.should.match(/\[\d{2}:\d{2}:\d{2}\]/);
        wrote.trim().split('\n')
          .should.have.property('length', cliCommands.length+1);
        util.lib.color.enabled = true; // restore color
        done();
      });
    };

    gulp.stack('--tasks', {onHandleError: done})();

  });

  it('-T should log tasks archy-like format', function(done){
    util.lib.color.enabled = false;
    var wrote = '', timer = null;
    var write = process.stdout.write;

    process.stdout.write = function(value){
      wrote += value;
      clearTimeout(timer);
      timer = setTimeout(function(){
        process.stdout.write = write;
        wrote.should.match(/-/);
        wrote.should.match(/\|/);
        wrote.should.match(/Tasks for/);
        wrote.should.match(/\[\d{2}:\d{2}:\d{2}\]/);
        wrote.trim().split('\n')
          .should.have.property('length', cliCommands.length+1);
        util.lib.color.enabled = true; // restore color
        done();
      });
    };

    gulp.stack('-T', {onHandleError: done})();
  });

  it('--require should require a module from the cwd', function(done){
    var cwd = process.cwd();
    var modulePath = path.join(cwd, 'test/dir/module.js');

    gulp.stack('--require test/dir/module', {
      log: false,
      onHandleError: done,
      onHandleCall: function(){
        require.cache.should.not.have.property(modulePath);
      },
      onHandleEnd: function(){
        require.cache.should.have.property(modulePath);
        process.cwd().should.be.eql(cwd);
        done();
      }
    })();
  });

  it('--gulpfile should require file and change cwd', function(done){
    var cwd = process.cwd();
    var modulePath = path.join(cwd, 'test/dir/gulpfile.js');

    gulp.stack('--gulpfile test/dir/gulpfile', {
      log: false,
      onHandleError: done,
      onHandleCall: function(){
        require.cache.should.not.have.property(modulePath);
      },
      onHandleEnd: function(){
        require.cache.should.have.property(modulePath);
        process.cwd().should.be.eql(path.dirname(modulePath));
        process.chdir(cwd);
        done();
      }
    })();
  });
};
