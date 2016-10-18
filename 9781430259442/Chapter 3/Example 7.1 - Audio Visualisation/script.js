// Pollyfill for AudioContext
(function() {
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

var audioEle = document.querySelector('audio');
var audioCtx = new AudioContext();
var canvasEle = document.querySelector('canvas');
var canvasCtx = canvasEle.getContext('2d');

var analyser = audioCtx.createAnalyser();

var source = audioCtx.createMediaElementSource(audioEle);
var volumeControl = audioCtx.createGainNode();

source.connect(volumeControl);
volumeControl.connect(analyser);
analyser.connect(audioCtx.destination);

//audioEle.addEventListener('onvolumechange', volumeControl, false);

function volumeChange()  {
	volumeControl.gain.value = audioEle.volume;
}

function logic()  {
	var freqData = new Uint8Array(analyser.frequencyBinCount);
	analyser.getByteFrequencyData(freqData);
	requestAnimationFrame(function() {
		draw(freqData);
	});
}

function draw(freqData)  {
	canvasCtx.clearRect(0, 0, canvasEle.width, canvasEle.height);
	canvasCtx.fillStyle = "#ff0000";
	for (var i = 0; i < freqData.length; i++) {
		canvasCtx.fillRect(i, canvasEle.height, 1, canvasEle.height - freqData[i]);
	}
}

setInterval(logic, 1000/60);