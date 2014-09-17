'use strict';

var timer = { }, batch = { };

exports = module.exports = batchThese;

function batchThese(eventName, info, callback){

  if(timer[eventName]){
    clearTimeout(eventName);
  }

  batch[eventName] = batch[eventName] || [];

  batch[eventName].push(info);

  timer[eventName] = setTimeout(function(){
    callback(batch[eventName]);
    delete batch[eventName];
  });
}
