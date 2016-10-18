// Pollyfill for AudioContext
(function() {
	window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

var audioEle = document.querySelector('audio');
var audioCtx = new AudioContext();
var canvasEle = document.querySelector('canvas');
var canvasCtx = canvasEle.getContext('2d');

var analyser = audioCtx.createAnalyser();
analyser.smoothingTimeConstant = 0;

var logger = audioCtx.createJavaScriptNode(analyser.frequencyBinCount, 1, 1);

var source = audioCtx.createMediaElementSource(audioEle);
var volumeControl = audioCtx.createGainNode();

source.connect(volumeControl);
volumeControl.connect(analyser);
analyser.connect(audioCtx.destination);
logger.connect(audioCtx.destination);

//audioEle.addEventListener('onvolumechange', volumeControl, false);

logger.onaudioprocess = function () {
	logic();
}

function volumeChange()  {
	volumeControl.gain.value = audioEle.volume;
}

var x = 0;

function logic()  {
	if(!audioEle.paused)  {
		x += 1;
		var freqData = new Uint8Array(analyser.frequencyBinCount);
		analyser.getByteFrequencyData(freqData);
		requestAnimationFrame(function() {
			draw(freqData);
		});
	}
}

function draw(freqData)  {
	if (x > canvasEle.width)  {
		canvasCtx.clearRect(0, 0, canvasEle.width, canvasEle.height);
		x = 0;
	}
	
	for (var i = 0; i < freqData.length; i++) {
		canvasCtx.fillStyle = "hsl(" + freqData[i] + ",100%, 50%)";		
		canvasCtx.fillRect(x, canvasEle.height - i, 1, 1);
	}
}
