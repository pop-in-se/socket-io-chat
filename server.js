const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

const port = 3000

app.use(express.static('public'))

const users = {}

io.on('connection', (socket) => {
    console.log("User connected")
    
    socket.on("new-user", userName => {
        users[socket.id] = userName
        socket.broadcast.emit('user-connected', userName)
    })
   
    socket.on("message", incoming => {
        io.emit('message', incoming)
    })
    

    socket.on("disconnect", () => {
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
        /* console.log("User disconnected") */
    })
})


http.listen(port, () => console.log("Listening on port " + port))