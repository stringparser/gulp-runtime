'use strict';

var batch = { };

function batchThese(name, data, handle){

  if( batch.timer ){
    clearTimeout(batch.timer);
    delete batch.timer;
  }

  batch.data = batch.data || [ ];
  batch.name = batch.name || name;
  batch.handle = batch.handle || handle;

  if( batch.name === name ){
    batch.handle = handle;
  } else {
    batch.handle(batch.data);
    batch = {
        name : name,
        data : [ ],
      handle : handle
    };
  }
  batch.data.push(data);
  // keep a timer anyway
  batch.timer = setTimeout(function(){
    if( batch.data ){
      batch.handle(batch.data);
    }
    batch = { };
  });
}

exports = module.exports = batchThese;
