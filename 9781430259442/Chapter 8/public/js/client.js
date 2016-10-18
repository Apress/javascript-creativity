// the socket handles sending messages between peer connections while they are in the
// process of connecting
var socket = io.connect('http://localhost');

//{"url": "stun:stun.l.google.com:19302"}
var servers = {"iceServers":[{"url": "stun:stun.l.google.com:19302"}, { "url": "stun:stun.services.mozilla.com" } ]};
//var servers = {"iceServers":[]};
var room_count = 0;


var connected = false;
var initConnection = false;
var mediaConstraints = {
  'mandatory': {
    'OfferToReceiveAudio':true,
    'OfferToReceiveVideo':true
  },
  'optional': [{'DtlsSrtpKeyAgreement': 'true'}]
};

var pc = new RTCPeerConnection(servers, mediaConstraints);

socket.on('assigned_id', function(data)  {
  console.log('assigned id' + data);
  socket.id = data;
});

socket.on('received_offer', function(data) {
  data = JSON.parse(data);
  console.log('received offer');
  if (data.type == "offer")  {
    pc.setRemoteDescription(new RTCSessionDescription(data));
    pc.createAnswer(function(data) {
      console.log('sending answer', data);
      pc.setLocalDescription(data);
      socket.emit('received_answer', data );
    }, null, mediaConstraints);
  }
});

socket.on('received_answer', function(data) {
  console.log('received answer', data);
  if(!connected && data.type == "answer") {
    var description = new RTCSessionDescription(data);
    console.log("Setting remote description", description);
    pc.setRemoteDescription(description);
    connected = true;
  }
});

socket.on('received_candidate', function(data) {
  console.log('received candidate', data);
  data = JSON.parse(data);

  var candidate = new RTCIceCandidate({
    sdpMLineIndex: data.label,
    candidate: data.candidate
  });
  pc.addIceCandidate(candidate);
});

socket.on('room_count', function(data)  {
  room_count = data;
  console.log('ROOM COUNT', data);
  if (room_count > 1)
    initConnection = true;
});

pc.onicecandidate = function(e) {
  console.log("oniceCandidate", e);
  if(e.candidate) {
    socket.emit('received_candidate', JSON.stringify({
        label: e.candidate.sdpMLineIndex,
        id: e.candidate.sdpMid,
        candidate: e.candidate.candidate
    }));
  }
};

pc.onaddstream = function(e) {
  console.log('start remote video stream');
  console.log(e);
  vid2.src = URL.createObjectURL(e.stream);
  vid2.play();
};

function broadcast() {
  getUserMedia({audio: true, video: true}, function(s) {
    pc.addStream(s);
    console.log("GOT MEDIA");
    vid1.src = URL.createObjectURL(s);
    vid1.play();
    if (initConnection) start();
  }, function(error) {throw error;});
};

function start() {
  console.log('STARTING');
  // this initializes the peer connection
  pc.createOffer(function(description) {
    console.log(description);
    pc.setLocalDescription(description);
    socket.emit('received_offer', JSON.stringify(description));
  }, null, mediaConstraints);
};

window.onload = function() {
  broadcast();
};

window.onbeforeunload = function() {
  socket.emit('close');
  pc.close();
  pc = null;
};

socket.on('close', function(room) {
  console.log(room + ' has closed the connection');
});

socket.on('message', function(evt) { 
  document.querySelector("#messages").innerHTML += '<p><span class="nickname">'+evt.nickname+': </span><span class="message">' + evt.message +'</span></p>';
});

var sendButton = document.querySelector("#send");
sendButton.addEventListener('click', function() {
  socket.emit('message', {
    "message": document.querySelector("#message").value,
    "nickname": document.querySelector("#nickname").value || 'Guest'
  });

  document.querySelector("#message").value = "";
});