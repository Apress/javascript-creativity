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
var oldData = null;


var minX = 0;
var maxX = 50;
var minY = 0;
var maxY = 50;

window.addEventListener('DOMContentLoaded', setup);


function setup()  {
    videoElement = document.querySelector("video");
    videoElement.width = w = window.innerWidth;
    videoElement.height = h = window.innerHeight;
    videoElement.autoplay = true;

    canvas = document.querySelector('canvas.main');
    canvas.width = w;
    canvas.height = h;
    ctx = canvas.getContext('2d');

    bcanvas = document.querySelector('canvas.buffer');
    bcanvas.width = w;
    bcanvas.height = h;
    bctx = bcanvas.getContext('2d');

    bctx.translate(w, 0);
    bctx.scale(-1, 1);
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
        bctx.drawImage(videoElement, 0, 0, w, h);
        manip = bctx.getImageData(0, 0, w, h);


        var data = manip.data;
        if (oldData != null) {
            data = motionDetection(data, oldData);
            motionInteraction(data);
            ctx.putImageData(manip, 0, 0);
            oldData = null;
        }
        else  {
            oldData = manip.data;
        }

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

function motionDetection(data, oldData)  {

    // Iterate through each pixel, changing to 255 if it has not changed
    for( var y = 0 ; y < h; y++ ) {
        for( var x = 0 ; x < w; x++ ) {
            var indexOld = (y * w + x) * 4,
                    oldr = oldData[indexOld],
                    oldg = oldData[indexOld+1],
                    oldb = oldData[indexOld+2],
                    olda = oldData[indexOld+3];
            var indexNew = (y * w + x) * 4,
                    r = data[indexNew],
                    g = data[indexNew+1],
                    b = data[indexNew+2],
                    a = data[indexNew+3];

            if (oldr > r - 15 || oldg > g - 15 || oldb > b - 15)
            {
                data[indexNew] = 255;
                data[indexNew+1] = 255;
                data[indexNew+2] = 255;
                data[indexNew+3] = 255;
                detected = true;
            }
            else
            {
                data[indexNew] = 0;
                data[indexNew+1] = 0;
                data[indexNew+2] = 0;
                data[indexNew+3] = 255;
            }
        }
    }

    return data;
}