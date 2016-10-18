/* Tracks */

var timelineWidth = document.querySelector("#tracks").clientWidth;
var timelineHeight = document.querySelector("#tracks").clientHeight;
var tracks = SVG('timeline');

var play = false;

var numOfTracks = 5;
var track = [];
var trackPos = timelineHeight/numOfTracks;


var clippings = [];
drawTimeline();
function drawTimeline()  {
    tracks.clear();

    for (var i = 0; i <= numOfTracks; i++)  {
        track[i] = tracks.line(0, timelineHeight/numOfTracks, timelineWidth, trackPos);
        track[i].move(0, trackPos * i);
        track[i].attr({ stroke: '#DAC8B0', id: "track"+i });
    }

    if (!localStorage["clippings"]) var clippingNames = [];
    else var clippingNames = JSON.parse(localStorage["clippings"]);
    for (var i = 0; i < clippingNames.length; i++)  {
        var clipping = JSON.parse(localStorage["clippings-" + clippingNames[i]]);
        clippings[i] = tracks.rect(timelineWidth/120 * clipping.size/120, trackPos);
        clippings[i].attr( { fill: "#C6A49A" } );
        clippings[i].move(150, trackPos * 3);

        var text = tracks.text(clippingNames[i]).move(clippings[i].x() + 10, clippings[i].y() + 10).front();
        text.attr( { fill: "#fff", id: "text"+i });

        clippings[i].draggable();
        clippings[i].dragend = (function(text)  {
            return function() {
                if (this.y() < 0)
                    this.move(this.x(), 0);
                if (this.y() > timelineHeight - trackPos)
                    this.move(this.x(), height - trackPos);
                else
                    this.move(this.x(), Math.ceil(this.y() / trackPos) * trackPos);
                text.move(this.x() + 10, this.y() + 10);
            }
        })(text);

        clippings[i].dragmove = (function(text)  {
            return function() {
                text.move(this.x() + 10, this.y() + 10);
            }
        })(text);
    }
}


/* Buttons */

var toggleRecord = false;
var recordStart;
var recordEnd;
var recorder;
document.querySelector("#record").addEventListener('click', function() {
    if (!toggleRecord)  {
        recorder = new Recorder(gainNode, { workerPath: "../vendor/recorderWorker.js"});
        recorder.record();
        recordStart = Date.now();
        document.querySelector("#record").className = "recording";
        toggleRecord = !toggleRecord;
    }
    else  {
        recordEnd = Date.now();
        document.querySelector("#record").className = "";
        toggleRecord = !toggleRecord;
        recordSound(prompt("Name of sound clipping:"));
    }
});


document.querySelector("#play").addEventListener('click', function() {
    play = true;
});

document.querySelector("#stop").addEventListener('click', function() {
    play = false;
});

/* Timer */

var timer = 0;
var bpm = 120;

var currentTime = tracks.line(1, 0, 0, timelineHeight);
currentTime.attr({ stroke: '#DAC8B0', id: "currentTime" });

function time()  {
    if (play)  {
        currentTime.move(timer, 0);
        if (!localStorage["clippings"]) var clippingNames = [];
        else var clippingNames = JSON.parse(localStorage["clippings"]);
        for (var i = 0; i < clippingNames.length; i++)  {
            if (clippings[i].x() > currentTime.x() - timelineWidth/120 && clippings[i].x() <= currentTime.x())  {
                playAudio(clippingNames[i]);
            }
        }

        timer += timelineWidth / 120;
    }
}
window.setInterval(time, timelineWidth / (60 / bpm * 4));

/* Keyboard */

var width = document.querySelector("#keyboard").clientWidth;
var height = document.querySelector("#keyboard").clientHeight;
var keyboard = SVG('keyboard');

var keyboardKeys = [83,68,70,71,72,74,75];
var blackKeys = [69,82,89,85,73];

var keyboardPressKeys = [115,100,102,103,104,106,107];
var blackKeyPress = [101, 114, 121, 117, 105];

var octave = 1; // where octave 1 = middle C

var keys = [];
for (var i = 0; i < 21; i++)  {
    keys[i] = keyboard.rect(width/21, height);
    keys[i].move(width/21 * i, 0);
    keys[i].attr({ fill: '#fff', stroke: '#000', id: "key"+i });
    keys[i].mousedown ((function(n) {
        return function()  {
            var key = SVG.get("key"+n);
            key.fill({ color: '#f06' });
            playSound(n, false);
        }
    })(i));

    keys[i].mouseup((function(n)  {
        return function() {
            keys[n].fill({ color: '#fff' });
            stopSound(n, false);
        }
    })(i));
}

var bkeys = [];
var prev = 0;
for (var i = 0; i < 15; i++)  {
    bkeys[i] = keyboard.rect(width/42, height / 1.7);
    bkeys[i].attr({ fill: '#000', stroke: '#000', id: "bkey"+i });
    bkeys[i].move(prev + (width/(21*1.3)), 0);
    prev = prev + width/21;
    if (i == 1 || i == 4 || i == 6 || i == 9 || i == 11)  {
        prev += width/21;
    }

    bkeys[i].mousedown ((function(n) {
        return function()  {
            var key = SVG.get("bkey"+n);
            key.fill({ color: '#f06' });
            playSound(n, true);
        }
    })(i));

    bkeys[i].mouseup((function(n)  {
        return function() {
            bkeys[n].fill({ color: '#000' });
            stopSound(n, true);
        }
    })(i));
}


window.addEventListener('keypress', function(e) {
    for (var i = 0; i < keyboardPressKeys.length; i++)  {
        if (e.keyCode == keyboardPressKeys[i]) {
            var n = i + octave * 7;
            var key = SVG.get("key"+n);
            key.fill({ color: '#f06' });
            playSound(n, false);
        }
    }
    for (var i = 0; i < blackKeyPress.length; i++)  {
        if (e.keyCode == blackKeyPress[i]) {
            var n = i + octave * 5;
            var key = SVG.get("bkey"+n);
            key.fill({ color: '#f06' });
            playSound(n, true);
        }
    }
    if (e.keyCode == 97 && octave > 0) --octave;
    if (e.keyCode == 108 && octave < 2) ++octave;
});

window.addEventListener('keyup', function(e) {
    for (var i = 0; i < keyboardKeys.length; i++)  {
        if (e.keyCode == keyboardKeys[i]) {
            var key = SVG.get("key"+(i+octave*7));
            key.fill({ color: '#fff' });
            stopSound(i+octave*7, false);
        }
    }
    for (var i = 0; i < blackKeys.length; i++)  {
        if (e.keyCode == blackKeys[i]) {
            var n = i + octave * 5;
            var key = SVG.get("bkey"+n);
            key.fill({ color: '#000' });
            stopSound(n, true);
        }
    }
});

var o = new Array(21);
var ob = new Array(15);
function connectKeys()  {
    // White Keys
    for (var i = 0; i < 21; i++)  {
        o[i] = ctx.createOscillator();
        o[i].connect(gainNode);
    }

    // Black Keys
    for (var i = 0; i < 15; i++)  {
        ob[i] = ctx.createOscillator();
        ob[i].connect(gainNode);
    }
}

var PI_2 = Math.PI*2;
var SAMPLE_RATE = 44100;


function recordSound(name)  {
    recorder.exportWAV(function(blob) {
        var object =  {
            file: window.URL.createObjectURL(blob),
            size: recordEnd - recordStart
        }
        if (localStorage["clippings"]) {
            var clippings = JSON.parse(localStorage["clippings"]);
            clippings.push(name);
            localStorage["clippings"] = JSON.stringify(clippings);
        }
        else  {
            localStorage["clippings"] = JSON.stringify([name]);
        }
        localStorage["clippings-"+name] = JSON.stringify(object);
        drawTimeline();
    });
}

function playAudio(id)  {
    var audio = new Audio(JSON.parse(localStorage["clippings-" + id]).file);
    audio.play();
}

var whiteNotes = [130.82, 146.83, 164.81, 174.61, 196, 220, 246.94, 261.63
, 293.66, 329.63, 349.23, 392, 440, 493.88, 523.25, 587.33, 659.26, 698.46, 783.99, 880, 987.77];
var blackNotes = [138.59, 155.56, 185, 207.65, 233.08, 277.18, 311.13, 369.99, 415.3, 466.16, 554.37, 622.25, 739.99, 830.61, 932.33];


function playSound(i, black) {
    //var osc = ctx.createOscillator();
    if (black) var freq = blackNotes[i];
    else var freq = whiteNotes[i];
    osc = o[i];
    if (black) osc = ob[i];
    osc.type = 3;
    osc.frequency.value = freq;
    osc.connect(gainNode);
    console.log(osc);
    osc.noteOn(0);
    if (black) ob[i] = osc;
    else o[i] = osc;
}

function stopSound(i, black)  {
    if (black) osc = ob[i];
    else osc = o[i];
    if (typeof(osc) != "undefined") {
        osc.noteOff(0);
        osc.disconnect();
        osc = ctx.createOscillator();
    }
    if (black) ob[i] = osc;
    else o[i] = osc;
}
