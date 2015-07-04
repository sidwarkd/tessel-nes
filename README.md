# Tessel NES Controller Library
A simple Tessel library for interacting with the original Nintendo controller

### Connection Information
The original NES controller has a 7 pin connector but only 5 are actually used. You'll need to cut off the connector end so you can attach the controller's wires to a breadboard or prototype board. If you don't want to permanently modify your NES controller, you can also purchase an "NES extension cable" that has a female connector on one end that you can cut off instead.

The following image shows what the connections are when looking at the connector.

<pre>
          +----> Power  (white)
          |
5 +---------+  7    
  | x  x  o   \     
  | o  o  o  o |    
4 +------------+ 1  
    |  |  |  |
    |  |  |  +-> Ground (brown)
    |  |  +----> Pulse  (red)
    |  +-------> Latch  (orange)
    +----------> Data   (yellow)
</pre>

The colors listed above are the most common but they aren't universal due to the huge number of knockoff controllers made. If you are using the female connector from an extension cable, the colors likely will not match between the two cables. The best way to be sure is to use the continuity feature on your multimeter to see which wire goes to which hole on the connector after you cut it off. The connector image above shows which hole corresponds to which connection. Once you've identified the wires you can connect them to any port, including GPIO, on the Tessel as follows:

| Controller Connection | Tessel Port Connection |
|-----------------------|------------------------|
| Ground                | Ground                 |
| Power                 | 3.3V                   |
| Latch                 | G1                     |
| Data                  | MISO                   |
| Pulse                 | SCK                    |



### Installation
```sh
npm install tessel-nes
```

### Example
```js
var tessel = require('tessel');
var nesController = require('tessel-nes').use(tessel.port['GPIO']);

nesController.on('ready', function(){
  // Query the button states every half second.
  setInterval(function(){
    nesController.query(function(err, buttons){
      console.log(buttons);
    });
  }, 500);
});
```

### Events
NESController.on('**ready**', callback(err, controller)) - Emitted when the controller object is first initialized

NESController.on('**up**', callback()) - Emitted when up button is pressed*

NESController.on('**down**', callback()) - Emitted when down button is pressed*

NESController.on('**left**', callback()) - Emitted when left button is pressed*

NESController.on('**right**', callback()) - Emitted when right button is pressed*

NESController.on('**a**', callback()) - Emitted when A button is pressed*

NESController.on('**b**', callback()) - Emitted when B button is pressed*

NESController.on('**select**', callback()) - Emitted when select button is pressed*

NESController.on('**start**', callback()) - Emitted when start button is pressed*

\*Button events will only fire after **startListening()** has been called

### Methods
NESController.**query**(callback(err, buttonStates)) - Query the controller button states

NESController.**startListening**() - Controller will start polling for button presses and fire events when detected

NESController.**stopListening**() - Stop polling for button events.

### Further Examples  
* [Button Events](examples/events.js). Demonstrates how to listen for button events.

### Licensing  
Public Domain. No restrictions.
