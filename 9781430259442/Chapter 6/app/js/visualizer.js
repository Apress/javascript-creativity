// Pollyfill for RequestAnimationFrame
(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

function visualizer() {
    w = $('#visualizer').width();
    h = $('#visualizer').height();
    g = $('#visualizer')[0].getContext("2d");
    ratio = w / h;
    g.globalCompositeOperation = "lighter";
    g.scale(w / 2 / ratio, h / 2);
    g.translate(ratio, 1);
    lw = 45 / h;
    a = r = d = 0;
    Xt = Yt = Zt = Xi = Yi = Zi = x = y = z = X = Y = Z = frames = 0;
    lastPointVisible = false;
    time = u = -8;  
    requestAnimationFrame(draw);
}

function draw() {
    freqData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(freqData);
    if (!$("#player")[0].paused)  {
        var average = getAverage(freqData);
        console.log(average);
        //console.log(freqData);
        if (average > 0)  {
            for (frames = 0; frames < 70; frames++) {
              Xt = (average/100) * 18 - 9;
              Yt = (average/100) * 18 - 9;
              Zt = (average/100) * 18 - 9;
            }

            Xi = interpolate(Xi, Xt);
            Yi = interpolate(Yi, Yt);
            Zi = interpolate(Zi, Zt);

            X  = interpolate(X,  Xi);
            Y  = interpolate(Y,  Yi);
            Z  = interpolate(Z,  Zi);

            yaw   = Math.atan2(Z, -X * 2);
            pitch = Math.atan2(Y * 2, Math.sqrt(X * X + Z * Z));

            time += 0.05;
            g.clearRect(-ratio, -1, 2 * ratio, 2);
            for (i = 16; i; --i) {
                v = 0;
                for (pointIndex = 45; pointIndex;) {
                    pointIndex--;
                    offset = time - pointIndex * 0.03 - i * 3;
                    longitude = Math.cos(offset + Math.sin(offset * 0.31)) * 2
                              + Math.sin(offset * 0.83) * 3 + offset * 0.02;
                    latitude = Math.sin(offset * 0.7) - Math.cos(3 + offset * 0.23) * 3;
                    distance = Math.sqrt(pointIndex+.2);
                    z = Math.cos(longitude) * Math.cos(latitude) * distance;
                    y = Math.sin(longitude) * Math.cos(latitude) * distance;
                    z = Math.sin(latitude) * distance;

                    x -= X; y -= Y; z -= Z;

                    x2 = x * Math.cos(yaw) + z * Math.sin(yaw);
                    y2 = y;
                    z2 = z * Math.cos(yaw) - x * Math.sin(yaw);

                    x3 = x2;
                    y3 = y2 * Math.cos(pitch) + z2 * Math.sin(pitch);
                    z3 = z2 * Math.cos(pitch) - y2 * Math.sin(pitch);
                    h = !pointIndex;
                    g.lineWidth = lw * (2 + h) / z3;
                    x = x3 / z3;
                    y = y3 / z3;
                    g.lineTo(x,y);
                    distance = Math.round(45 - pointIndex) * (1 + h + Math.max(0, Math.sin(time * 6 - pointIndex / 8) - .95) * 70);
                    g.strokeStyle = "rgb(" + Math.round(distance * (Math.sin(h + i + time * .15) + 1)) + "," + Math.round(distance * (h + Math.sin(i - 1) + 1)) + "," + Math.round(distance * (h + Math.sin(i - 1.3) + 1)) + ")";
                    if (z3 > 0.1) {
                      if (lastPointVisible) {
                        g.stroke();
                      }
                      else {
                        lastPointVisible = true;
                      }
                    }
                    else {
                      lastPointVisible = false;
                    }
                    g.beginPath();
                    g.moveTo(x,y);
                }
            }
        } 
    }
    requestAnimationFrame(draw);
}

function getAverage(freqData)  {
    var average = 0;
    for (var i = 0; i < freqData.length; i++)  {
        average += freqData[i];
    }
    average = average / freqData.length;
    return average;
}


function interpolate(a,b) {
    return a + (b-a) * 0.04;
}