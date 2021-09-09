const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

const port = 3000

app.use(express.static('public'))

const users = {}
const typers = {}

io.on('connection', (socket) => {
    console.log("User connected")
    
    // Användare ansluter

    socket.on("new-user", userName => {
        users[socket.id] = userName
        socket.broadcast.emit('user-connected', userName)
    })
   
    // skicka meddelande

    socket.on("message", incoming => {
        delete typers[socket.id];   
        io.emit('message', incoming)
    })
    
    //Användare skriver

    socket.on('user typing', () => {
        typers[socket.id] = 1;
    
        socket.broadcast.emit('user typing', {
            user: users[socket.id].userName,
            typers: Object.keys(typers).length
        })
    })

    socket.on('user stopped typing', () => {
        delete typers[socket.id];
    
        socket.broadcast.emit('user stopped typing', Object.keys(typers).length);
    })
    
    // Användare lämnar

    socket.on("disconnect", () => {
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
        /* console.log("User disconnected") */
    })
});


http.listen(port, () => console.log("Listening on port " + port))