var app = require('express')(), 
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);
server.listen(8080);

app.get('/:id', function (req, res) {
    res.locals.id = req.params.id;
    res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {

    var room = socket.handshake.headers.referer;

    socket.join(room);

    socket.on('message', function (data) {
        io.sockets.in(room).emit('message', data);
    });

    socket.on('leave', function (room) {
        socket.leave(room);
    });

});