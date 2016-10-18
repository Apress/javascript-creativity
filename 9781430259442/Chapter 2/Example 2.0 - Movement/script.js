// Pollyfill for RequestAnimationFrame
(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();
 

// This is a way of selecting
var ele = document.querySelector("#animation");
var ctx = ele.getContext('2d');
var x = y = 10;
var width = height = 50;

function logic () {
	++x;
	if (x < ele.width - width)
		requestAnimationFrame(draw);
}

function draw()  {	
	ctx.clearRect(0, 0, ele.width, ele.height);
	
	// This sets the fill colour to red
	ctx.fillStyle = "#ff0000";

	// fillRectangle(x, y, width, height);
	ctx.fillRect(x, y, 50, 50);
}

requestAnimationFrame(draw);
setInterval(logic, 1000/60);
