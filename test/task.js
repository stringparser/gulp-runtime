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
		var stack = [];
		var dep = 'one two';
		var gulp = create('run deps');
		var randomHandle = function(next){
			setTimeout(next, Math.random()*10);
		};

		gulp.task('three', dep, randomHandle);
		gulp.task('one', randomHandle);
		gulp.task('two', randomHandle);

		gulp.set({
			log: false,
			onHandleEnd: function(next){
				if(next.match){ stack.push(next.match); }
				if(this.queue){ return ; }
				if(this.host){
					this.wait.should.be.eql(true);
					stack.should.be.eql(['one', 'two', 'three']);
					done();
				}
			}
		});

		gulp.stack('three')();
	});
};
