Example for using digidot.js alone

```js
var DigiDot = require('./digidot'); 

var test = new DigiDot({
	packageDelay: 10
	
}, function() {
	var self = this;
	
	this.clear();

	var i = 0;
	setInterval(function() {
		i += 1;
		i = i % 40;
		for (var j=0; j < 128; j++) {
			self.setPixel(j, j%2 ? i : 0, j%2 ? 0 : i, 0);
		}
	
		self.sendPixels();

	}, 100);

	});
```

