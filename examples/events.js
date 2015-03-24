/**********************************************************
            TESSEL NES CONTROLLER LIBRARY

This example shows how to subscribe to specific button
events. The package doesn't listen for events at startup.
You have to start the polling with a call to the api
function startListening(). You can stop the polling by
calling stopListening().
**********************************************************/

var tessel = require('tessel');
var nesController = require('../').use(tessel.port['GPIO']);

// Setup the events for various buttons
nesController.on('up', function(){
  console.log('up');
});
nesController.on('down', function(){
  console.log('down');
});
nesController.on('left', function(){
  console.log('left');
});
nesController.on('right', function(){
  console.log('right');
});
nesController.on('a', function(){
  console.log('a');
});
nesController.on('b', function(){
  console.log('b');
});
nesController.on('select', function(){
  console.log('select');
});
nesController.on('start', function(){
  console.log('start');
});


nesController.on('ready', function(){
  // Once the module is ready start listening for events
  nesController.startListening();

  // Listen for 10 seconds
  setTimeout(function(){
    nesController.stopListening();
  }, 10000);

});