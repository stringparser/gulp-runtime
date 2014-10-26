'use strict';

var fs = require('fs');

module.exports = {
  testSuite : function(){
    var testSuite = fs.readdirSync(__dirname);
    // in case there is priority
    var testFirst = [ ];

    // omit things starting with underscore
    testSuite = testSuite.filter(function(thing){
      return !thing.match(/^_/);
    });
    testSuite.unshift.apply(testSuite, testFirst);
    return testSuite;
  }
};
