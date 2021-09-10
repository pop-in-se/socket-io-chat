let socket = io()
const typeInput = document.getElementById('message')
const isTyping = document.getElementById('isTyping')

/* var typing=false;
var timeout=undefined;
var user; */

const userName = prompt("What is your name?"); 
if (userName) { 
    socket.emit('new-user', userName)
} else {
	location.reload();
}



// Skicka meddelande. incoming = data. messages = ul


socket.on('message', incoming => {
    isTyping.innerText = ""
    const list = document.getElementById("messages")
    let listItem = document.createElement("li")
    listItem.innerText = incoming.userName + ": " + incoming.message
    list.appendChild(listItem)
    window.scrollTo(0, document.body.scrollHeight);
})



//Användare skriver meddelande

socket.on('typing', incoming =>  {
    isTyping.innerText = incoming.userName + ' is typing ...';
})

//keypress-lyssnare

typeInput.addEventListener('keypress', function() {
        socket.emit('typing', { userName, message });
})



//Användare ansluter

socket.on('user-connected', userName => {
    const list = document.getElementById("messages")
    let pItem = document.createElement("p")
    pItem.innerText = userName + " joined the chat"
    list.appendChild(pItem)
    window.scrollTo(0, document.body.scrollHeight);
})

//Användare lämnar

socket.on('user-disconnected', userName => {
    const list = document.getElementById("messages")
    let pItem = document.createElement("p")
    pItem.innerText = userName + " left the chat"
    list.appendChild(pItem)
    window.scrollTo(0, document.body.scrollHeight);
})

//Skicka meddelande


function sendMessage() {
    const input = document.getElementById("message")
    const message = input.value
    input.value = ""
    socket.emit('message', { userName, message })
}
// message = chat



