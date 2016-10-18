// Pollyfill for RequestAnimationFrame
(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();


var ele = document.querySelector("#animation");
var ctx = ele.getContext('2d');
var startX = 10;
var startY = 10;
var endX = ele.width - 50;
var endY = ele.height - 50;
var x = startX;
var y = startY;
var duration = 0;
var width = height = 50;

function logic () {
	duration += 0.02;
	x = lerp(startX, endX, duration);
	if (x < ele.width - width)
		requestAnimationFrame(draw);

	y = lerp(startY, endY, duration);
	if (y < ele.height - height)
		requestAnimationFrame(draw);
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

requestAnimationFrame(draw);
setInterval(logic, 1000/60);