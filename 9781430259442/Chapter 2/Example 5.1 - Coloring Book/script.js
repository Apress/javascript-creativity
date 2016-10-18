var colouringBook = (function() {
  var drop = document.querySelector("#drop");
  var save = document.querySelector("#save");
  var ctx = drop.getContext('2d');
  var drawing;

  /* These are to set the canvas to full width */
  drop.height = window.innerHeight; 
  drop.width = window.innerWidth;
  var lineWidth = 5;

  drop.addEventListener('dragover', preventDefault);
  drop.addEventListener('dragenter', preventDefault);
  drop.addEventListener('drop', handleDrop);


  drop.addEventListener('mousedown', startPath);
  drop.addEventListener('mouseup', function() {
    drawing = false;
  });
  drop.addEventListener('mousemove', handleDrawing);

  save.addEventListener('click', saveCanvas);

  function preventDefault(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    return false;
  }

  function handleDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";

    var file = e.dataTransfer.files[0];
    var image = new Image();

    var reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (function() {
      return function(e)  {
        image.src = e.target.result;
      };
    })();

    image.onload = function() {   
      ctx.drawImage(image, 0, 0);  
      var originalData = ctx.getImageData(0, 0, drop.width, drop.height);
      findEdges(originalData);
    };
  }

  function findEdges(originalData) {
    var output = ctx.createImageData(drop.width, drop.height);

    var w = originalData.width, h = originalData.height;
    var inputData = originalData.data;
    var outputData = output.data;
    var threshold = 100;

    // edge detection
    for (var y = 0; y < h; y += 1) {
      for (var x = 0; x < w; x += 1) {
        var i = (y * w + x) * 4;

        outputData[i] = inputData[i - w*4 - 4] +   inputData[i - w*4] + inputData[i - w*4 + 4] +
                inputData[i - 4]       -   8*inputData[i]     + inputData[i + 4] +
                inputData[i + w*4 - 4] +   inputData[i + w*4] + inputData[i + w*4 + 4];

        if (outputData[i] < threshold)
        {
          outputData[i] = 255;
          outputData[i+1] = 255;
          outputData[i+2] = 255;
        }
        else
        {
          outputData[i] = 0;
          outputData[i+1] = 0;
          outputData[i+2] = 0;
        }
        outputData[i + 3] = 255; // alpha
      }
    }

    // put the image data back after manipulation
    ctx.putImageData(output, 0, 0);
  }

  function startPath(e)  {
    ctx.strokeStyle = "#0000ff";
    ctx.lineWidth   = lineWidth;
    ctx.beginPath();
    ctx.moveTo(e.clientX + lineWidth, e.clientY + lineWidth);
    drawing = true;
  }

  function handleDrawing(e)  {
    if (drawing == true)
    {
      ctx.lineTo(e.clientX + lineWidth, e.clientY + lineWidth);
      ctx.stroke();
    }
  }

  function saveCanvas()  {
    var img = drop.toDataURL("image/png");
    save.href = img;
    save.download = "colouringBook.png";
  }

})();