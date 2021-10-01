let socket = io()
const typeInput = document.getElementById('message')
const textInput = document.getElementById('messages')
const isTyping = document.getElementById('isTyping')
const jokeButton = document.querySelector(".getJokeBtn");
const nudgeContainer = document.querySelector('#window');
const nudgeButton = document.querySelector('#nudge-button');
const messageScroll = document.querySelector(".messageContainer")

const { userName } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
socket.emit('new-user', userName)

window.onbeforeunload = function(e) {
  e.preventDefault();
}

async function handleClick() {
    const { joke } = await getJoke();
    const input = document.getElementById("message")
      input.value = joke
      
      socket.emit('joke', { userName })
  }


async function getJoke() {
    const response = await fetch("https://icanhazdadjoke.com", {
        headers: {
          Accept: "application/json",
        },
      });
      const joke = await response.json();
      return joke;
    }

function scrollDown(){
      messageScroll.scrollTop = messageScroll.scrollHeight;
    }

// Skicka meddelande. incoming = data. messages = ul

socket.on('message', incoming => {
    isTyping.innerText = ""
    const list = document.getElementById("messages")
    let listItem = document.createElement("li")
    listItem.innerHTML = '<h6>' + incoming.userName + " says: </h6>" + '<br/>' + '<h5>' + incoming.message + '</h5>'
    list.appendChild(listItem)
    scrollDown()
})

//Skicka när användare trycker enter

var input = document.getElementById("message");
input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
   event.preventDefault();
   document.getElementById("sendBtn").click();
  }

});

//Användare skriver meddelande

socket.on('typing', incoming =>  {
    isTyping.innerText = incoming.userName + ' is typing a message ...';
})

//keypress-lyssnare

typeInput.addEventListener('keypress', function() {
        socket.emit('typing', { userName, message });
})

//Användare ansluter
var laudio = new Audio("assets/login.mp3");
socket.on('user-connected', userName => {
    const list = document.getElementById("messages")
    let pItem = document.createElement("p")
    pItem.innerText = userName + " joined the chat"
    list.appendChild(pItem)
    scrollDown()
})



//Användare lämnar

socket.on('user-disconnected', userName => {
    const list = document.getElementById("messages")
    let pItem = document.createElement("p")
    pItem.innerText = userName + " left the chat"
    list.appendChild(pItem)
    scrollDown()
})

//Skicka meddelande, message = chatten
const mraudio = new Audio("assets/mrec.mp3");
function sendMessage() {
    const input = document.getElementById("message")
    const message = input.value
    input.value = ""
    socket.emit('message', { userName, message })
    mraudio.play();
    scrollDown()
}


function sendSmile() {
  const input = document.getElementById("message")
  const message = "😊"
  socket.emit('message', { userName, message })
  mraudio.play();
}

function sendFlirt() {
  const input = document.getElementById("message")
  const message = "😉"
  socket.emit('message', { userName, message })
  mraudio.play();
}

function sendLol() {
  const input = document.getElementById("message")
  const message = "😃"
  socket.emit('message', { userName, message })
  mraudio.play();
}

function sendSad() {
  const input = document.getElementById("message")
  const message = "🙁"
  socket.emit('message', { userName, message })
  mraudio.play();
}

function sendAngry() {
  const input = document.getElementById("message")
  const message = "😡"
  socket.emit('message', { userName, message })  
  mraudio.play();
}

//Användare skickar nudge
var naudio = new Audio('assets/nudge.mp3');
nudgeButton.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('nudge', userName )
    
    socket.on('nudge', userName => {
      const list = document.getElementById("messages")
      let h6Item = document.createElement("h6")
      h6Item.innerText = userName + " have just sent a nudge."
      naudio.play();
      list.appendChild(h6Item)
      nudgeContainer.classList.add('is-nudged');
      scrollDown()
      setTimeout(() => nudgeContainer.classList.remove('is-nudged'), 200)
})
})

    
//Autocomplete 

function autocomplete(inp, arr) {
    
    var currentFocus;

    inp.addEventListener("input", function(e) {
        var autocompleteContainer, matchingElement, i, val = this.value;
        
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        
        autocompleteContainer = document.createElement("div");
        autocompleteContainer.setAttribute("id", this.id + "autocomplete-list");
        autocompleteContainer.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(autocompleteContainer);

        for (i = 0; i < arr.length; i++) {
          //Kolla om första input matchar /
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            matchingElement = document.createElement("div");
            /* matchingElement.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>"; */
            matchingElement.innerHTML += arr[i].substr(val.length);
            matchingElement.innerHTML += "<input type='hidden' value='" + "1" + arr[i] + "'>";
            //Funktion för när du klickar på resultatet
            matchingElement.addEventListener("click", function(e) {
                handleClick();
                closeAllLists();
            });
            autocompleteContainer.appendChild(matchingElement);
          }
        }
    });
    //Funktion för tangenttryck
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
      
    });
    
    function closeAllLists(elmnt) {
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }
  }
  
  var jokeArray = ["/ 🤡"]
  
  autocomplete(document.getElementById("message"), jokeArray);