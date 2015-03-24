/**********************************************************
            TESSEL NES CONTROLLER LIBRARY

This example shows the query function of the api which
allows you to query the state of the buttons. The return
value in the callback will be an integer that represents
the sum of all the buttons pressed using the following key

UP     8
DOWN   4
LEFT   2
RIGHT  1
START  16
SELECT 32
B      64
A      128

So if you press the A button you will see 128. If you hold
down both A and B you will see 192 (128 + 64).

The program below runs the query every 500 ms. 
**********************************************************/

var tessel = require('tessel');
var nesController = require('../').use(tessel.port['GPIO']);

nesController.on('ready', function(){
  // Query the button states on an interval.
  setInterval(function(){
    nesController.query(function(err, buttons){
      console.log(buttons);
    });
  }, 500);
});