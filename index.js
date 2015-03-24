var tessel = require('tessel');
//var async = require('async');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

// Individual button bitmasks
var UP_MASK = 0x08;
var DOWN_MASK = 0x04;
var LEFT_MASK = 0x02;
var RIGHT_MASK = 0x01;
var A_MASK = 0x80;
var B_MASK = 0x40;
var SELECT_MASK = 0x20;
var START_MASK = 0x10;


function NESController (hardware, cb){
  var self = this;
  self.hardware = hardware;
  self.latchPin = hardware.pin['G1']; //Latch  (orange)
  //self.dataPin  = gpio.pin['G3']; //Data   (yellow)
  self.spi = new hardware.SPI({clockSpeed: 125000});
  self.buttonStates = 0x00;
  self.pollingObj = null;
  self.locked = false;

  self._getButtonStates = function(cb){
    var self = this;
    self.locked = true;
    self.latchPin.write(true);
    self.latchPin.write(false);
    self.spi.transfer(new Buffer([0x00]), function(err, rx){
        self.buttonStates = rx[0] ^ 0xff;
        cb(err, self.buttonStates);
        self.locked = false;
    });
  };

  self._printStates = function(){
    var pressed = [];
    if(this.buttonStates & UP_MASK) pressed.push("up");
    if(this.buttonStates & DOWN_MASK) pressed.push("down");
    if(this.buttonStates & LEFT_MASK) pressed.push("left");
    if(this.buttonStates & RIGHT_MASK) pressed.push("right");
    if(this.buttonStates & A_MASK) pressed.push("a");
    if(this.buttonStates & B_MASK) pressed.push("b");
    if(this.buttonStates & SELECT_MASK) pressed.push("select");
    if(this.buttonStates & START_MASK) pressed.push("start");
    if(pressed.length > 0)
        console.log(pressed.join(','));
  };

  if(cb)
    cb(null, self);

  setImmediate(function(){
    self.emit('ready');
  });
};

// Inherit event emission
util.inherits(NESController, EventEmitter);

// Define the API
// Query the state of the controller and call callback with the result
NESController.prototype.query = function(callback){
    var self = this;
    self._getButtonStates(callback);
};

NESController.prototype.startListening = function() {
  var self = this;
  if(this.pollingObj === null){

    this.pollingObj = setInterval(function(){
      // Poll the controller and emit necessary events
      if(!self.locked){
        self.query(function(err, newStates){
          if(newStates & UP_MASK) self.emit("up");
          if(newStates & DOWN_MASK) self.emit("down");
          if(newStates & LEFT_MASK) self.emit("left");
          if(newStates & RIGHT_MASK) self.emit("right");
          if(newStates & A_MASK) self.emit("a");
          if(newStates & B_MASK) self.emit("b");
          if(newStates & SELECT_MASK) self.emit("select");
          if(newStates & START_MASK) self.emit("start");
        });
      }
    }, 50);
  }
};

NESController.prototype.stopListening = function() {
  if(this.pollingObj !== null){
    clearInterval(this.pollingObj);
    this.pollingObj = null;
  }
};

// Every module needs a use function which calls the constructor
function use (hardware, callback) {
  return new NESController(hardware, callback);
}

// Export functions
exports.use = use;