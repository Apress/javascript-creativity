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

window.addEventListener('DOMContentLoaded', setup);


function setup()  {
    videoElement = document.querySelector("video");
    videoElement.width = w = window.innerWidth;
    videoElement.height = h = window.innerHeight;
    videoElement.autoplay = true;

    navigator.getUserMedia({video: true}, function (stream) {
        videoElement.src = window.URL.createObjectURL(stream);
        videoElement.addEventListener('canplay', draw);
    }, function() {});
}

$.fn.highlight = function(rect, color) {
    $('.cursor').css({
        "border":   "2px solid " + color,
        "position": "absolute",
        "left":     ($(this).offset().left + rect[0]) + "px",
        "top":      ($(this).offset().top  + rect[1]) + "px",
        "width":    rect[2] + "px",
        "height":   rect[3] + "px",
        "z-index": 2
    });
}

function draw()  {
    $("video").objectdetect("all", {classifier: objectdetect.frontalface}, function(faces) {
        for (var i = 0; i < faces.length; ++i) {
            $(this).highlight(faces[i], "red");
        }
    });

    requestAnimationFrame(draw);
}