'use strict';

var should = require('should');

module.exports = function(runtime, util){
	should.exists(util);
	var create = runtime.create;

	it('should throw if handle does not use a callback or return', function(){
		var gulp = create('throw');

		(function(){
			gulp.task('name', function(){});
		}).should.throw();
	});

	it('should throw if handle has circular dependencies', function(){
		var gulp = create('throw');

		(function(){
			gulp.task('name', 'name', function(next){ next(); });
		}).should.throw();
	});

	it('should register task deps as an array', function(){
		var gulp = create('array deps');
		var dep = ['1', '2'];

		gulp.task('name', dep);
		gulp.get('name')
			.should.have.property('dep', dep);
	});

	it('should register task deps as a string', function(){
		var gulp = create('string deps');
		var dep = ' 1  2 3';

		gulp.task('name', dep);
		gulp.get('name')
			.should.have.property('dep', dep.trim().split(/[ ]+/));
	});

	it('should register task handle', function(){
		var handle = function(next){ next(); };
		var gulp = create('new task');

		gulp.task('name', handle);
		gulp.get('name').should.have.property('handle', handle);
	});

	it('deps should run in series and before task', function(done){
		var gulp = create('run deps');
		var dep = 'one two';

		gulp.task(':handle(three)', dep, function(next){
			setTimeout(next, Math.random()*10);
		});

		gulp.task(':handle(one|two)', function(next){
			setTimeout(next, Math.random()*10);
		});

		var stack = [];

		gulp.set({
			log: false,
			onHandleError: done,
			onHandleEnd: function(next){
				if(this.queue){
					stack.push(next.match);
					return ;
				} else if(this.host){
					stack.push(this.host.path);
					stack.should.be.eql(['one', 'two', 'three']);
					done();
				}
			}
		});

		gulp.stack('three')();
	});
};
