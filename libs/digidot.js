/**
 * DigiDot 
 * 
 * Control LEDs on a digidot-booster
 * 
 * --------------------------------------------------------------------------------------------------------------------
 * 
 * @author Amely Kling <mail@dwi.sk>
 *
 */


/* Node Includes
 * ==================================================================================================================== */

var SPI = require('pi-spi');
var chunks = require('split-array-into-chunks');

 

/* Class Constructor
 * ==================================================================================================================== */

function DigiDot(options, callback) {
	this.options = Object.assign({
		device: "/dev/spidev0.1",
		ledcount: 128,
		deviceDelay:40 * 1000,
		packageDelay: 15,
		packageChunk: 32
	}, options);
	
	this.init(callback);
}

// module export
module.exports = DigiDot;


/* Variables
 * ==================================================================================================================== */

DigiDot.prototype.pixels = [];

/* Methods
 * ==================================================================================================================== */

DigiDot.prototype.init = function(callback) {
	var self = this;
	
	// fill pixel array
	for (var i = 0; i < this.options.ledcount; i++) {
		this.pixels.push([128,0,0]);
	}
	
	// create spi device
	this.spi = new SPI.initialize(this.options.device);
	this.spi.clockSpeed(1e6);

	// init device
	this.spi.write(new Buffer([0xB1, this.options.ledcount, 24]), function () {
		callback = callback.bind(self);
		callback();
	});
	
	// catch exit
	process.on('exit', function () {
    self.close();
  });
	
	//	catch ctrl+c event and exit normally
  process.on('SIGINT', function () {
    console.log('Ctrl-C...');
		process.exit(2);
  });
}

DigiDot.prototype.sendCommand = function (command, callback) {
		var cmd = [];
		cmd = cmd.concat(command);		
		cmd.push(0xB2);
		if (typeof callback !== 'function' ) { callback = function() {}}
		this.spi.write(new Buffer(cmd), callback);
}

DigiDot.prototype.setPixel = function(pixel, r, g, b){
	if (pixel < this.options.ledcount) {
		this.pixels[pixel] = [r,g,b];
	}
}

DigiDot.prototype.sendPixels = function() {
	var self = this;
	var pixelPackages = chunks(this.pixels, this.options.packageChunk);
	
	pixelPackages.forEach(function(pixelPackage, index) {
		setTimeout(function() {
			var cmd = [];
			for (var j = 0; j < pixelPackage.length; j++) {
				cmd.push(0xA1, pixelPackage[j][0], pixelPackage[j][1], pixelPackage[j][2], 0xA4, index * self.options.packageChunk + j)			
			}
			self.sendCommand(cmd, function() {});
		}, index * self.options.packageDelay);		
		
	});	
}

DigiDot.prototype.clear = function() {
	this.sendCommand([0xA1, 0, 0, 0, 0xA5]);
}
	
DigiDot.prototype.close = function() {
	this.clear();
	this.spi.close();
}
