const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

const port = 3000

app.use(express.static('public'))

const users = {}


io.on('connection', (socket) => {
    console.log("User connected")
    
    // Användare ansluter
    
    socket.on("new-user", userName => {
        users[socket.id] = userName
        socket.broadcast.emit('user-connected', userName)
    })
   
    // skicka meddelande

    socket.on("message", incoming => {
        io.emit('message', incoming )
    })
    
    //Användare skriver meddelande

    socket.on('typing', incoming => {
        socket.broadcast.emit('typing', incoming);
     })



    // Användare lämnar

    socket.on("disconnect", () => {
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
        /* console.log("User disconnected") */
    })
})


http.listen(port, () => console.log("Listening on port " + port))