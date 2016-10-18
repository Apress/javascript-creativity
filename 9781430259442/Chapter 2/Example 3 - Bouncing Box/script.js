// Pollyfill for RequestAnimationFrame
(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();


var ele = document.querySelector("#animation");
ele.height = window.innerHeight;
ele.width = window.innerWidth;
var ctx = ele.getContext('2d');
var x = 10;
var y = 10;
var duration = 0;
var width = height = 50;
var heading_x = heading_y = Math.random() * 360;
var distance_x = distance_y = 0;

function logic () {
	if (heading_x > 360 || heading_x < -360) heading_x = 0;
	if (heading_y > 360 || heading_y < -360) heading_y = 0;

	if (x <= 0 || x >= ele.width - width) {
		heading_x = heading_x + 180;
	}

	if (y <= 0 || y >= ele.height - height) {
		heading_y = -heading_y;
	}

	distance_x = dir_x(2, heading_x);
	distance_y = dir_y(2, heading_y);
	if (duration < 10) duration += 0.05;
	x = lerp(x, x + distance_x, duration);
	y = lerp(y, y + distance_y, duration);
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

function degreesToRadians(degrees){
	return degrees * (Math.PI / 180);
}

function dir_x(length, angle){
	return length * Math.cos(degreesToRadians(angle));
}

function dir_y(length, angle){
	return length * Math.sin(degreesToRadians(angle));
}