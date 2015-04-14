'use strict';

var should = require('should');
var tornado = require('tornado-repl');
var readline = require('readline');

module.exports = function(runtime, util){
	should.exists(util);
	var create = runtime.create;

	it('should be a Runtime instance', function(){
		var gulp = create('one');

		gulp.should.be.instanceof(tornado.Runtime);
	});

	it('should have no repl by default', function(){
		var gulp = create('two');

		gulp.should.not.have.property('repl');
	});

	it('should be readline.Interface for {repl: true}', function(){
		var gulp = create('three', {repl: true});

		gulp.repl.should.be.instanceof(readline.Interface);

		gulp.repl.close();
	});

	it('should be readline.Interface for {input: true}', function(){
		var gulp = create({input: true});

		gulp.repl.should.be.instanceof(readline.Interface);

		gulp.repl.close();
	});

	it('should give a previous instance if it exists', function(){
		var build = create('build');

		create('build').should.be.eql(build);
		create('build', {repl: true}).should.be.eql(build);
		create('build', {input: process.stdin}).should.be.eql(build);

		build.repl.close();
	});
};
