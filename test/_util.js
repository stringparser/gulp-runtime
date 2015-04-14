'use strict';

require('should');
var fs = require('fs');

module.exports = {
  suite : function(){
    var first = [
      'create.js'
    ];

    return first.concat(
      fs.readdirSync(__dirname).filter(function(file){
        return !/^_/.test(file) && first.indexOf(file) < 0;
      })
    );
  }
};
