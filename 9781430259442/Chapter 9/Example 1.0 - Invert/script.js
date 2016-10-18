window.URL = window.URL || window.webkitURL;
navigator.getUserMedia  =  navigator.getUserMedia ||
	                       navigator.webkitGetUserMedia ||
	                       navigator.mozGetUserMedia ||
	                       navigator.msGetUserMedia;
if (navigator.getUserMedia === undefined) {
	if (console !== undefined) {
		console.log("Browser doesn't support getUserMedia");
	}
}

var videoElement, canvas, ctx, manip, w, h;


window.addEventListener('DOMContentLoaded', setup);


function setup()  {
	videoElement = document.querySelector("video");
    videoElement.width = w = window.innerWidth;
    videoElement.height = h = window.innerHeight;
    videoElement.autoplay = true;

    canvas = document.querySelector('canvas');
    canvas.width = w;
    canvas.height = h;
    ctx = canvas.getContext('2d');

    navigator.getUserMedia({video: true}, function (stream) {
		videoElement.src = window.URL.createObjectURL(stream);
        videoElement.addEventListener('canplay', draw);
	}, function() {});
}


function draw() {
	if (videoElement.paused || videoElement.ended) {
		return;
	}
	try  {
		ctx.drawImage(videoElement, 0, 0, w, h);
		manip = ctx.getImageData(0, 0, w, h);
		var data = manip.data;

		data = invertFrame(data);

		ctx.putImageData(manip, 0, 0);
		requestAnimationFrame(draw);
	}
	catch (e)  {
		if (e.name == "NS_ERROR_NOT_AVAILABLE") {
			setTimeout(draw, 0);
		}
		else  {
			throw e;
		}
	}
}

function invertFrame(data)  {

	// Iterate through each pixel, inverting it
	for (var i = 0; i < data.length; i += 4) {
		var r = data[i],
			g = data[i+1],
			b = data[i+2];
		data[i] = 255 - r;
		data[i+1] = 255 - g;
		data[i+2] = 255 - b;
	}

	return data;
}