'use strict';

var timer = { }, batch = { };

exports = module.exports = batchThese;

function batchThese(name, data, callback){

  if(timer[name]){
    clearTimeout(timer[name]);
    delete timer[name];
  }

  batch[name] = batch[name] || [];
  batch[name].push(data);

  if( batch[name][2] ){
    callback(batch[name]);
    delete batch[name];
    return ;
  }

  timer[name] = setTimeout(function(){
    if( batch[name] ){
      callback(batch[name]);
    }
    delete batch[name];
  });
}
