// Pollyfill for AudioContext
(function() {
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
})();

var ele = document.querySelector('audio');
var ctx = new AudioContext();


var analyser = ctx.createAnalyser();
var logger = ctx.createJavaScriptNode(analyser.frequencyBinCount, 1, 1);

var source = ctx.createMediaElementSource(ele);
var volumeControl = ctx.createGainNode();

source.connect(volumeControl);
volumeControl.connect(analyser);
analyser.connect(ctx.destination);

//ele.addEventListener('onvolumechange', volumeControl, false);

function volumeChange()  {
	volumeControl.gain.value = ele.volume;
}


function log()  {
	freqData = new Uint8Array(analyser.frequencyBinCount);
	analyser.getByteFrequencyData(freqData);
	for (var i = 0; i < freqData.length; i++) {
		console.log(freqData[i] * ctx.sampleRate / analyser.fftSize);        
	}
}