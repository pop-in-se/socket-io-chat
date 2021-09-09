let socket = io()

/* var typing=false;
var timeout=undefined;
var user; */

const userName = prompt("What is your name?"); 
if (userName) { 
    socket.emit('new-user', userName)
} else {
	location.reload();
}


        // feed
socket.on('message', incoming => {
    const list = document.getElementById("messages")
    let listItem = document.createElement("li")
    listItem.innerText = incoming.userName + ": " + incoming.message
    list.appendChild(listItem)
    window.scrollTo(0, document.body.scrollHeight);
})

socket.on('user typing', ({ userName, typers }) => {
    const feedback = document.getElementById("messages")
    let pItem = document.createElement("p")
    pItem.innerText = typers `<i>${userName}</i> is typing`;
    feedback.appendChild(pItem)
});

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