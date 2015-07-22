var app = require('http').createServer()
var io = require('socket.io')(app);
var imagePosition = "center"
app.listen(9000);

io.on('connection', function(socket){
    socket.emit('news',imagePosition);
    socket.on('update',function(data){
        imagePosition = data;
        io.emit('news',imagePosition);
        console.log(imagePosition);
    });
});
