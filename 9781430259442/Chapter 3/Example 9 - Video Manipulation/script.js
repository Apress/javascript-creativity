// Pollyfill for RequestAnimationFrame
(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

(function() {
	var canvasEle = document.querySelector('canvas');
	var canvasCtx = canvasEle.getContext('2d');

	var videoEle = document.querySelector('video');
	var w = videoEle.clientWidth;
	var h = videoEle.clientHeight;

	canvasEle.width = w;
	canvasEle.height = h;

	drawInvertedFrame();

	function drawInvertedFrame()  {
		canvasCtx.drawImage(videoEle, 0, 0, w, h);
		var manip = canvasCtx.getImageData(0, 0, w, h);
		var data = manip.data;

		// Iterate through each pixel, inverting it
		for (var i = 0; i < data.length; i += 4) {
			var r = data[i],
				g = data[i+1],
				b = data[i+2];
			data[i] = 255 - r;
			data[i+1] = 255 - g;
			data[i+2] = 255 - b;
		}

		canvasCtx.putImageData(manip, 0, 0);

		requestAnimationFrame(drawInvertedFrame);
	}
})();