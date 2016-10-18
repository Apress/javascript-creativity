// Pollyfill for RequestAnimationFrame
(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();


var Flocking = (function()  {
	var canvas = document.querySelector("#flocking");
	var ctx = canvas.getContext('2d');
    
	canvas.height = window.innerHeight; 
	canvas.width = window.innerWidth;
	var flock = [];

	var flockRadius = 250;
	
	var Boid = function(x, y, heading, size) {

		this.x = x;
		this.y = y;
		this.heading = heading
		this.size = size;

	};

	function setup()  {
		for (var i = 0; i < 10; i++)
		{
			flock.push(new Boid(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 360, 15));
		}
		setInterval(logic, 1000/60);
	}
	
	function logic () {

    for (var i = 0; i < flock.length; i++)  {		
    	var centerx = 0;
    	var centery = 0;
    	var count = 0;

    	var b = flock[i];
    	
    	for (var j = 0; j < flock.length; j++)
    	{
    		var distance = distanceBetween(b, flock[j]);
    		if (distance < flockRadius)
    		{
    			centerx += flock[j].x;
    			centery += flock[j].y;
    			count++;
    		}
    	}
    	
      if (count > 1) {
      	centerx = centerx / count;
      	centery = centery / count;
      }
      else  {
      	centerx = Math.random() * canvas.width;
      	centery = Math.random() * canvas.height;
      }

      var angleToCenter = angleBetween(b.x,b.y,centerx,centery);
      var lerpangle = angleDifference(b.heading, angleToCenter);

      b.heading += lerpangle * 0.01;

      headingx = dir_x(2,b.heading);
      headingy = dir_y(2,b.heading);

      b.x += headingx;
      b.y += headingy;

      if (b.x < 0) b.x = canvas.width;
      if (b.y < 0) b.y = canvas.height;

      if (b.x > canvas.width) b.x = 0;
      if (b.y > canvas.height) b.y = 0;
		}

		requestAnimationFrame(draw);
	}

	function draw()  {	
		ctx.clearRect(0,0,canvas.width, canvas.height);
		for (var i = 0; i < flock.length; i++)
		{
			var b = flock[i];
			ctx.fillStyle = "blue";
			ctx.fillRect(b.x,b.y, b.size, b.size);
			ctx.beginPath();
			ctx.moveTo(b.x + (b.size / 2),b.y + (b.size / 2));
			ctx.lineTo((b.x + (b.size / 2)) + dir_x(20,flock[i].heading),(b.y + (b.size / 2)) + dir_y(20,flock[i].heading));
			ctx.strokeStyle = "red"
			ctx.stroke();
		}
	}

  function distanceBetween(a, b)  {
  	var dx = a.x - b.x;
  	var dy = a.y - b.y;
  	return Math.sqrt(dx * dx + dy * dy);
  }

  function angleBetween(x1, y1, x2, y2)
  {
  	return Math.atan2(y1 - y2, x1 - x2) * (180.0 / Math.PI);
  }

  function angleDifference(a1, a2)
  {
    return ((((a1 - a2) % 360) + 540) % 360) - 180;
  }
  	
  function degreesToRadians(degrees){
  	return degrees * (Math.PI / 180);
  }

  function dir_x(length, angle){
  	return length * Math.cos(degreesToRadians(angle));
  }

  function dir_y(length, angle){
  	return length * Math.sin(degreesToRadians(angle));
  }

	setup();

})();