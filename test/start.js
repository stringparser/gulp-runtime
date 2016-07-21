'use strict';

exports = module.exports = function(Gulp){

  it('start(tasks...) should run the tasks given in parallel', function(done){
    var result = [];

    var gulp = Gulp.create({
      onHandleError: done,
      onStackEnd: check
    });

    gulp.task(':taskName', function(next){
      var self = this;
      setTimeout(function(){
        result.push(self.params.taskName);
        next();
      }, Math.random() * 10);
    });

    function check(){
      result.should.containDeep(['one', 'two', 'three', 'four', 'five']);
      result.should.have.property('length', 5);
      done();
    }

    gulp.start('one', 'two', 'three', 'four', 'five');
  });

  it('start([tasks...], args...) passes args... to the stack', function (done){
    var gulp = Gulp.create({ onHandleError: done });
    var values = ['one', 'two', 'three', 'four'];

    gulp.task(':taskName', function(next, pile){
      var self = this;
      setTimeout(function(){
        pile.push(self.params.taskName);
        next(pile);
      }, Math.random() * 20);
    });

    function check(error, result){
      if(error){ return done(error); }
      result.should.containDeep(values);
      result.should.have.property('length', values.length);
      result.should.not.be.equal(values);
      done();
    }

    gulp.start(['one', 'two', 'three', 'four'], [], check);
  });
};
