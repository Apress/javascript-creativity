// Pollyfill for RequestAnimationFrame
(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();


var ele = document.querySelector("#animation");
var ctx = ele.getContext('2d');
var width = height = 50;
var startX = 10;
var startY = 10;
var endX;
var x = startX;
var y = startY;
var duration = 0;

function logic (evt) {
	var max = ele.width - width;
	duration += 0.02;
	var l = lerp(startX, endX, duration);
	if (l < max && l > 0 && endX != x)
	{ 
		x = l;
		requestAnimationFrame(draw);
	}
	else {
		duration = 0;
	}
}

function draw()  {	
    ctx.clearRect(0, 0, ele.width, ele.height);
	
	// This sets the fill colour to red
	ctx.fillStyle = "#ff0000";

	// fillRectangle(x, y, width, height);
	ctx.fillRect(x, y, 50, 50);
}

function lerp(start, end, speed) {
	return start + (end - start) * speed;
}

ele.addEventListener('mousemove', function(evt) {
	startX = x;
	endX = evt.clientX;
});

requestAnimationFrame(draw);
setInterval(logic, 1000/60);