var express = require('express')
var http = require('http')
//instantiate the app 
var app = express()
var path = require('path')

// making the server with http module and plugin the express module
var server = http.createServer(app);
//instantialte the io
var io = require('socket.io').listen(server);


app.use(express.static(path.join(__dirname, '/public')))

io.on('connect', (socket) => {
    socket.on('draw_data', (data) => {
        socket.broadcast.emit('drawother', data)
    })
})

server.listen(8080, (err) => {
    if (err) {
        consol.log(err)
    }
    else {
        console.log("server is running")
    }
})