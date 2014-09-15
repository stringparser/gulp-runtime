'use strict';

module.exports = function hook(cb){
  var oldWrite = process.stdout.write;
  var output = '';

  process.stdout.write = (function(write){
    return function(str, enc, fd){
      write.apply(process.stdout, arguments);
      cb({ str : str, enc : enc, fd : fd });
      output += str;
    };
  })(process.stdout.write);

  return {
    restore : function(){
      process.stdout.write = oldWrite;
      return this;
    },
    disable : function(){
      process.stdout.write = (function(){
        return function(str, enc, fd){
          cb({ str : str, enc : enc, fd : fd });
          output += str;
        };
      })();
      return this;
    },
    enable : function(){
      process.stdout.write = (function(write){
        return function(str, enc, fd){
          write.apply(process.stdout, arguments);
          cb({ str : str, enc : enc, fd : fd });
          output += str;
        };
      })(oldWrite);
    },
    output : function(){
      return output;
    },
    clean : function(){
      output = '';
      return this;
    },
    reset : function(){
      return this.disable().clean();
    }
  };
};
