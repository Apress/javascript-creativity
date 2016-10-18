var express = require('express'),
    http = require('http'),
    uuid = require ("node-uuid"),
    app = express(),
    server = http.createServer(app),
    io = require('socket.io').listen(server);
io.set('log level', 1); // Removes debug logs
app.use(express.static('public'));
server.listen(8080);


app.get('/:id', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {

    var room = socket.handshake.headers.referer;
    console.log('JOINED', room);
    socket.join(room);
    socket.id = uuid.v1();
    socket.color = '#'+ ('000000' + Math.floor(Math.random()*16777215).toString(16)).slice(-6);

    io.sockets.in(room).emit('room_count', io.sockets.manager.rooms['/' + room].length);


    // WebRTC signalling
    socket.on('received_offer', function(data) {
        console.log("received_offer %j", data);
        io.sockets.in(room).emit('received_offer', data);
    });

    socket.on('received_candidate', function(data) {
        console.log("received_candidate %j", data);
        io.sockets.in(room).emit('received_candidate', data);
    });

    socket.on('received_answer', function(data) {
        console.log("received_answer %j", data);
        io.sockets.in(room).emit('received_answer', data);
    });

    // Chatroom messages
    socket.on('message', function (data) {
        io.sockets.in(room).emit('message', data);
    });

    // Music
    socket.on('play_sound', function (data) {
        data.color = socket.color;
        console.log("play sound %j", data);
        socket.broadcast.to(room).emit('play_sound', data);
    });

    socket.on('stop_sound', function (data) {
        console.log("stop sound %j", data);
        socket.broadcast.to(room).emit('stop_sound', data);
    });

    // Close socket and let others know
    socket.on('close', function () {
        console.log("closed %j", room);
        io.sockets.in(room).emit('closed', room);
        socket.leave(room);
    });

});