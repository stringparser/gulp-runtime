'use strict';

var gutil = require('gulp-util');
var chalk = gutil.colors;

module.exports = function(runtime, stdout){


  it('a command doesn\'t exists', function(){

    stdout.reset();
      runtime.emit('wire', 'this command doesn\'t exists');
    stdout.enable();

    stdout.output().should
      .containEql(chalk.cyan('this'))
      .and
      .containEql('not found');
  });

  it('[notFound] a should be after and have prompted', function(){

    stdout.reset();
      runtime.emit('wire', 'not found command');
    stdout.enable();

    stdout.output().should
      .containEql(' > gulp ')
      .and
      .containEql(chalk.cyan('not'))
      .and
      .containEql('not found');
  });

  it('[Error]+!opts.throw message does not throw', function(){

    var errorMessage = 'I\'m only here to inform you sir';
    stdout.reset();
      runtime.emit('message', {
        error : new Error(errorMessage)
      });
    stdout.enable();

    stdout.output().should
      .containEql(errorMessage);
  });

  it('[Error]+!opts.throw message is formatted with gutil.log', function(){
    stdout.output().should.match(/\d{2}:\d{2}:\d{2}/g);
  });

  it('[Error]+opts.throw actually... throws!', function(){

    var errorMessage = 'Hey! I\'m talking';
    stdout.reset().enable();
    (function(){
      runtime.emit('message', {
        error : new Error(errorMessage),
        throw : true
      });
    }).should.throw(new RegExp(errorMessage+'$'));
  });

  stdout.restore();
};
