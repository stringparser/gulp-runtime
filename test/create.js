'use strict';

var readline = require('readline');

module.exports = function(Gulp){

  it('create() should log by default', function(){
    var gulp = Gulp.create();
    gulp.log.should.be.eql(true);
  });

  it('create() should have no repl by default', function(){
    var gulp = Gulp.create();
    gulp.should.not.have.property('repl');
  });

  it('create({log: false}) should disable logging', function(){
    var gulp = Gulp.create({log: false});
    gulp.log.should.be.eql(false);
  });

  it('create({repl: true}) should make a repl at gulp.repl', function(){
    var gulp = Gulp.create({repl: true});
    gulp.should.have.property('repl');
    gulp.repl.should.be.instanceof(readline.Interface);
    gulp.repl.close();
  });
};
