'use strict';

var timer = { }, batch = { };

exports = module.exports = batchThese;

function batchThese(name, flush, data, callback){

  if(timer[name]){
    clearTimeout(timer[name]);
    delete timer[name];
  }

  batch[name] = batch[name] || [];
  batch[name].push(data);

  if( batch[name].length > flush-1 ){
    callback(batch[name]);
    clearTimeout(timer[name]);
    delete timer[name];
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
