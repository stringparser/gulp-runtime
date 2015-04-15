'use strict';

var fs = require('fs');
var should = require('should');

exports = module.exports = function(runtime, util){
  should.exists(util);
  var create = runtime.create;

  before(function(done){
    fs.writeFile('test/dir/watch.js', done);
  });

  function writeTest(file, cb){
    setTimeout(function(){
      var content = Math.random().toString(36)+'\n';
      fs.writeFile(file, content, cb || function(err){
        if(err){ throw cb(err); }
      });
    }, 200);
  }

  function handle(done){
    done = done || function(){};
    return function(next){
      done(); next();
    };
  }

  it('should accept a string', function(done){
    var gulp = create('opt string', {log: false});
    gulp.set({onHandleError: done});

    gulp.task('opt', handle(done));
    var watcher = gulp.watch('test/dir/watch.js', 'opt', function(){
      watcher.end();
    });

    writeTest('test/dir/watch.js');
  });

  it('should accept an array', function(done){
    var gulp = create('opt array', {log: false});
    gulp.set({onHandleError: done});

    gulp.task('opt', handle(done));
    var watcher = gulp.watch('test/dir/*.js',
      ['opt'], function(){ watcher.end(); }
    );

    writeTest('test/dir/watch.js');
  });

  it('should accept an object {tasks: string|array}', function(done){
    var gulp = create('opt object', {log: false});
    gulp.set({onHandleError: done});

    var firstWatch = gulp.watch('test/dir/watch.js',
      {tasks: ['opt']}, function(){ firstWatch.end(); }
    );

    gulp.task('opt', function(next){
      var secondWatch = gulp.watch('test/dir/watch.js',
        {tasks: 'two'}, function(){ secondWatch.end(); }
      );
      writeTest('test/dir/watch.js', next);
    });
    gulp.task('two', handle(done));

    writeTest('test/dir/watch.js');
  });
};
