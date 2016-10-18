var drop = document.getElementById('drop');
var ctx = drop.getContext('2d');

// Tells the browser that we *can* drop on this target
drop.addEventListener('dragover', preventDefault, false);
drop.addEventListener('dragenter', preventDefault, false);

drop.addEventListener('drop', handleDrop, false);

function preventDefault(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  return false;
}

function handleDrop(e) {
  e.stopPropagation(); // Stops some browsers from redirecting.
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  var file =  e.dataTransfer.files[0];
  var image = new Image();
  
  reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (function(theFile) {
    return function(e) {
      image.src = e.target.result;
    };
  })(file);

  image.onload = function() {
      ctx.drawImage(image, 0, 0);
  };
}

