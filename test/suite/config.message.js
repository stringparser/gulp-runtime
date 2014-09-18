'use strict';

var util = require('runtime/lib/utils');
var chalk = util.colors;

module.exports = function(runtime, stdout){

  describe('[notFound]', function(){

    it('a command doesn\'t exists', function(){

      stdout.reset();
        runtime.emit('wire', 'this command doesn\'t exists');
      stdout.enable();

      stdout.output().should
        .containEql(chalk.yellow('this'))
        .and
        .containEql('not found');
    });

    it('should be after and have prompted', function(){

      var noCommand = 'notRegisteredCommand';

      stdout.reset();
      runtime.emit('wire', noCommand);
      stdout.enable();

      stdout.output().should
        .containEql(chalk.yellow(noCommand))
        .and
        .containEql('not found')
        .and
        .containEql(' > gulp ');
    });
  });

  describe('[Error] with/without opts.throw', function(){

    it('for !opts.throw does not throw', function(){

      var errorMessage = 'I\'m only here to inform you sir';

      stdout.reset();
      (function(){
        runtime.emit('message', {
          error : new Error(errorMessage)
        });
      }).should.not.throw();
      stdout.enable();

      stdout.output().should
        .containEql(errorMessage);

    });

    it('opts.throw actually... throws!', function(){

      var errorMessage = 'Hey! I\'m talking';

      (function(){
        runtime.emit('message', {
          error : new Error(errorMessage),
          throw : true
        });
      }).should.throw();
      stdout.enable();

    });

  });

  stdout.restore();
};
