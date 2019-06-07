/**
 * PixelNode_Driver_DigiDot
 * 
 * Pixel Driver for DigiDot Booster
 * 
 * --------------------------------------------------------------------------------------------------------------------
 * 
 * @author Amely Kling <mail@dwi.sk>
 *
 */


/* Includes
 * ==================================================================================================================== */

var util = require("util");
var colors = require('colors');
var DigiDot = require('./libs/digidot');


/* Class Constructor
 * ==================================================================================================================== */

// extending PixelNode_Driver
PixelNode_Driver = require('pixelnode-driver');

// define the Student class
function PixelNode_Driver_DigiDot(options,pixelData) {
  var self = this;
  PixelNode_Driver_DigiDot.super_.call(self, options, pixelData);
  this.className = "PixelNode_Driver_DigiDot";
}

// class inheritance 
util.inherits(PixelNode_Driver_DigiDot, PixelNode_Driver);

// module export
module.exports = PixelNode_Driver_DigiDot;


/* Variables
 * ==================================================================================================================== */

PixelNode_Driver_DigiDot.prototype.default_options = {
	pixelColorCorrection: false,
	offset: true,
	dimmer: 1,
	device: "/dev/spidev0.1",
	ledcount: 16,
	deviceDelay:40 * 1000,
	packageDelay: 10,
	packageChunk: 32

};
PixelNode_Driver_DigiDot.prototype.digidot = [];


/* Overriden Methods
 * ==================================================================================================================== */

 // init driver
PixelNode_Driver_DigiDot.prototype.init = function() {
	var self = this;
	console.log("Init PixelDriver DigiDot");


	digidot = new DigiDot(self.options, function() {
		self.digidot = this;
		// start painter on connect
		self.startPainter.call(self);
	});

};

// set's a pixel for digidot
PixelNode_Driver_DigiDot.prototype.setPixel = function(strip, id, r,g,b) {
	this.digidot.setPixel(id, r * this.options.dimmer, g * this.options.dimmer, b * this.options.dimmer);
}

// tells digidot to send pixels
PixelNode_Driver_DigiDot.prototype.sendPixels = function() {
	this.digidot.sendPixels();
}
