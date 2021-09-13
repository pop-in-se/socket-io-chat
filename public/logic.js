let socket = io()
const typeInput = document.getElementById('message')
const isTyping = document.getElementById('isTyping')
const jokeButton = document.querySelector(".getJoke");
const joke = document.querySelector(".joke");
jokeButton.addEventListener("click", handleClick);

const userName = prompt("What is your name?"); 
if (userName) { 
    socket.emit('new-user', userName)
} else {
	location.reload();
}

async function handleClick() {
    const { joke } = await getJoke();
    const input = document.getElementById("message")
      /* const jokeValue = joke */
      input.value = joke
      console.log(joke)
      socket.emit('joke', { userName })
  }

async function getJoke() {
    const response = await fetch("http://icanhazdadjoke.com", {
        headers: {
          Accept: "application/json",
        },
      });
      const joke = await response.json();
      return joke;
    }


/* function getJoke() {
    axios.get('/joke')
    .then(function (response) {
        socket.emit('joke', response.data);
    })
    .catch(function (error) {
        console.log(error);
    });
    clearInputField();
} */


// Skicka meddelande. incoming = data. messages = ul

socket.on('message', incoming => {
    isTyping.innerText = ""
    const list = document.getElementById("messages")
    let listItem = document.createElement("li")
    listItem.innerHTML = '<h6>' + incoming.userName + " says: </h6>" + '<br/>' + '<h5>' + incoming.message + '</h5>'
    list.appendChild(listItem)
/*     var scrollDown = document.getElementsByClassName("messageContainer");
    scrollDown.scrollTop = scrollDown.scrollHeight; */
   /*  window.scrollTo(0, document.body.scrollHeight); */
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



