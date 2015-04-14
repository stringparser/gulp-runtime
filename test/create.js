'use strict';

var should = require('should');
var tornado = require('tornado-repl');
var readline = require('readline');

module.exports = function(runtime, util){
	should.exists(util);
	var create = runtime.create;

	it('should be a tornado.Runtime instance by default', function(){
		var gulp = create();
		gulp.constructor.should.be.eql(tornado.Runtime);
	});

	it('should be a readline.Interface create({repl: true})', function(){
		var gulp = create({repl: true});

		gulp.repl.should.be.instanceof(readline.Interface);
		gulp.repl.close();
	});

	it('should retrieve a previous instance if exists', function(){
		var build = create('build');

		create('build').should.be.eql(build);
		create('build', {repl: true}).should.be.eql(build);
		create('build', {input: process.stdin}).should.be.eql(build);

		build.repl.close();
	});
};
