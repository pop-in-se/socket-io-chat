let socket = io()
let userName = ""

window.onload = () => {
    userName = prompt("Vad heter du?")
}


socket.on('message', (incoming) => {
    const list = document.getElementById("messages")
    let listItem = document.createElement("li")
    listItem.innerText = incoming.userName + ": " + incoming.message
    list.appendChild(listItem)
})

function sendMessage() {
    const input = document.getElementById("message")
    const message = input.value
    input.value = ""
    socket.emit('message', { userName, message })
}