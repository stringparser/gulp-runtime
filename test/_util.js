'use strict';

var fs = require('fs');
var path = require('path');

module.exports = {
  lib: require('../lib/util'),
  suite : function(){
    var first = [
      'create.js'
    ];

    return first.concat(
      fs.readdirSync(__dirname).filter(function(file){
        if(/^_/.test(file)){ return false; }
        return path.extname(file) && first.indexOf(file) < 0;
      })
    );
  },
  through: require('through2')
};
