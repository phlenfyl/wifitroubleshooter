const chatbox = document.getElementById('chatbox');
const userInput = document.getElementById('userInput');
const submit = document.getElementById('submit')
const body = document.querySelector('.msg-body')
const typing = document.querySelector('.botMsg')

function scrollToBottomOfResults() {
    body.scrollTop = body.scrollHeight;
}

function type(element, text, delay = 50) {
    return new Promise(resolve => {
        let i = 0;
        const interval = setInterval(() => {
            element.textContent += text[i];
            i++;
            const isNearBottom = (element.scrollHeight - element.scrollTop <= element.clientHeight);
            if (i === text.length) {
                clearInterval(interval);
                scrollToBottomOfResults();
                resolve();
            }
            if(isNearBottom){
                element.scrollTop = element.scrollHeight
            }
            
        }, delay);
    });
}

function sendOfflineMessage() {
    const userMsg = userInput.value;
    if (userMsg !== '') {
        const userDiv = document.createElement('div');
        userDiv.className = 'user-msg';
        let user;
        user = `
            <img class="userAvatar" src='/static/img/avatar.png' />
            <p class="userMsg">${userMsg} </p>
            <div class="clearfix"></div>
        `
        userDiv.innerHTML = user;
        body.appendChild(userDiv);
        scrollToBottomOfResults();
        userInput.value = '';

        bot.reply("local-user", userMsg).then(function(message){
            getBotResponse(message);
        })

        scrollToBottomOfResults();

    }
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
    const botMsg = document.createElement('p');
    botMsg.className = 'botMsg';
    botDiv.appendChild(botMsg);
    body.appendChild(botDiv);

    type(botMsg, message);
}    

function loading_error(error, _filename, _lineno) {
    console.log("Error when loading files: " + error);

    botMsg = `
        <img class="botAvatar" src="/static/img/bot.png"/>
        <p class="botMsg">Can't get response. Send an error msg to the admin at supportwifi@gmail.com</p>
        <div class="clearfix"></div>
    `;
    return botMsg
}
submit.addEventListener('click', sendOfflineMessage);

