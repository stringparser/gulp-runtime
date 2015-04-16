'use strict';

var util = require('./.');

exports = module.exports = require('chalk');

exports.time = function(time){
  return this.magenta(
    util.prettyTime(
      process.hrtime(time || [0,0])
    )
  );
};

exports.file = function(filename){
  return this.magenta(
    util.tildify(filename)
  );
};

exports.callersPath = function(error, index){
  if(!this.enabled){ return ; }
  index = Number(index) || 1;

  var file = (error.stack.match(/([^( )]+:\d+:\d+)/g) || '')[0];
  if(!file){ return ; }

  error.stack = error.stack.replace(file,
    this.file(file)
  ) + '\n';
};
