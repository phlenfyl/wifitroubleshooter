const chatbox = document.getElementById('chatbox');
const userInput = document.getElementById('userInput');
const submit = document.getElementById('submit')
const body = document.querySelector('.msg-body')
const typing = document.querySelector('.botMsg p')
let chat_id = getChatId()

function scrollToBottomOfResults() {
    body.scrollTop = body.scrollHeight;
}

function disableButton(){
    submit.setAttribute("disabled", "");
}   
function renableButton(){
    submit.removeAttribute("disabled");
}
function type(element, text, delay = 50) {
    return new Promise(resolve => {
        let i = 0;
        const interval = setInterval(() => {
            element.textContent += text[i];
            i++;
            const isNearBottom = (element.scrollHeight - element.scrollTop <= element.clientHeight);
            if(isNearBottom){
                element.scrollTop = element.scrollHeight
            }
            if (i === text.length) {
                clearInterval(interval);
                scrollToBottomOfResults();
                resolve();
            }
            
        }, delay);
    });
}

function sendMessage(e) {
    e.preventDefault()
    const userMsg = userInput.value;
    if (userMsg !== '') {
        const userDiv = document.createElement('div');
        userDiv.className = 'user-msg';
        let user;
        user = `
            <img class="userAvatar" src='troubleshoot/static/img/avatar.png' />
            <p class="userMsg">${userMsg} </p>
            <div class="clearfix"></div>
        `
        userDiv.innerHTML = user;
        body.appendChild(userDiv);
        scrollToBottomOfResults();
        userInput.value = '';

        urlsRoute(userMsg);
    }
}

async function getResponses(url, method, data) {
    let headers = {
      "X-CSRFToken": document.querySelector('input[name="csrfmiddlewaretoken"]').value,
      "Content-Type": "application/json",
    }

    try {
      const response = await fetch(url, {
        method: method,
        headers: headers,
        body: JSON.stringify(data),
      });
      if (response.ok) {
        let resp = await response.json()
        msg = resp.chats
        const tempElement = DOMPurify.sanitize(msg)
        const parsedText = tempElement
        console.log(parsedText)
        setTimeout(() => {
            // hideTyping();
            console.log(resp)
            getBotResponse(parsedText)
            scrollToBottomOfResults();
            renableButton();
        }, 1000);
      } else {
        console.log(response.status)
        setTimeout(() => {
            // hideTyping();
            getBotResponse("Can't get response. Send an error msg to the admin at supportwifi@gmail.com")
            scrollToBottomOfResults();
            renableButton();
        }, 600);
      }

    } catch (error) {
        setTimeout(() => {
            // hideTyping();
            loading_error()
            scrollToBottomOfResults();
            disableButton();
        }, 600);
      console.error("Error:", error);
    }
}

function urlsRoute(userMsg){
    let data = {
        "message": userMsg,
        "chatId": chat_id,
    };
    console.log(data)
    getResponses('initiate-chat/',"POST", data);
}

function getBotResponse(message) {
    const botDiv = document.createElement('div');
    botDiv.className = 'bot-msg';

    // Add bot's image
    const botImage = document.createElement('img');
    botImage.className = 'botAvatar';
    botImage.src = '/static/img/bot.png';
    botDiv.appendChild(botImage);

    // Add bot's message with typing effect
    const botMsg = document.createElement('div');
    botMsg.className = 'botMsg';
    botDiv.appendChild(botMsg);
    body.appendChild(botDiv);

    type(botMsg, message);
}

function loading_error() {
    botMsg = `
        <img class="botAvatar" src="troubleshoot/static/img/bot.png"/>
        <p class="botMsg">Not available right now. Please, do try again later or try reloading the page to start again. Reload the page to switch to offline mode</p>
        <div class="clearfix"></div>
    `;
    return botMsg
}

function getChatId() {
    const newId = Math.floor(Math.random() * 1000);
    return newId;
}

submit.addEventListener('click', sendMessage);





