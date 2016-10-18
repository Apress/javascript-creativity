window.addEventListener('load', init, false);
function init() {
  try {
  	if (! window.AudioContext) {
  		if (! window.webkitAudioContext) {
  			bad_browser();
  			return;
  		}
  		window.AudioContext = window.webkitAudioContext;
  	}

  	ctx = new AudioContext();
  }
  catch(e) {
    console.log('Web Audio API is not supported in this browser');
  }
  
}

document.querySelector("#play").addEventListener('click', function() {
  playSound(document.querySelector("#hertz").value);
});

document.querySelector("#stop").addEventListener('click', function() {
  stopSound();
});

document.querySelector("#octave-up").addEventListener('click', function() {
  var hertz = document.querySelector("#hertz").value;
  document.querySelector("#hertz").value = hertz * 2;
});


document.querySelector("#octave-down").addEventListener('click', function() {
  var hertz = document.querySelector("#hertz").value;
  document.querySelector("#hertz").value = hertz / 2;
});

var o, i;
var PI_2 = Math.PI*2;
var SAMPLE_RATE = 44100;

function playSound(freq) {
  if (typeof(o) != "undefined") o.noteOff(0);
  o = ctx.createOscillator();    
  o.type = 0;
  o.frequency.value = freq;
  o.connect(ctx.destination);
  o.noteOn(0);
}

function stopSound()  {
  o.noteOff(0);
}