'use strict';

var should = require('should');

module.exports = function(runtime, util){
	should.exists(util);
	var create = runtime.create;

	it('should throw if handle does not use the callback or return', function(){
		var gulp = create('throw');

		(function(){
			gulp.task('name', function(){});
		}).should.throw();
	});

	it('should register task deps as an array', function(){
		var gulp = create('array deps');
		var dep = ['1', '2'];

		gulp.task('name', dep);
		gulp.get('name').should.have.property('dep', dep);
	});

	it('should register task deps as a string', function(){
		var gulp = create('string deps');
		var dep = ' 1  2 3';

		gulp.task('name', dep);
		gulp.get('name').should.have.property('dep', dep.trim().split(/[ ]+/));
	});

	it('should register task handle', function(){
		var handle = function(next){ next(); };
		var gulp = create('new task');

		gulp.task('name', handle);
		gulp.get('name').should.have.property('handle', handle);
	});
};
