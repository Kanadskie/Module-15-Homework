// 1. Получаем элементы из DOM
const chatField = document.querySelector('.chat-field')
const sendField = document.querySelector('.send-field')
const statusMsg = document.querySelector('.status')
const btn = document.querySelector('.btn')
const btnClear = document.querySelector('.btn-clear')
const btnGeo = document.querySelector('.btn-geo')
const btnRes = document.getElementById('restart')
let input = document.querySelector('.form-control');

// 2. Создаем переменную, в которой будет храниться url echo сервера
const wsUrl = "wss://echo-ws-service.herokuapp.com";

let websocket;

// 3. Объявляем функцию, которая будет выводить сообщения в поле чата

function writeMsg(message, isRecieved) {
    if (message == '') return;
    let msgItem = document.createElement('div');
    if (!isRecieved? msgItem.className = 'msg-sent' : msgItem.className = 'msg-recieved')
    msgItem.innerHTML = message;
    chatField.appendChild(msgItem);
    scrollChat(msgItem);
    input.value = '';
}

// 4. Объявляем функцию для очистки чата и поля ввода

function clearChat() {
    input.value = '';
    chatField.innerHTML = '';
}

// 5. Объявляем функцию в которой создаем экземпляр класса WebSocket, используем его методы для открытия/закрытия соединения

function openConnection() {
    websocket = new WebSocket(wsUrl);
    websocket.onopen = function() {
        let sessionOpen = document.createElement('div');
        sessionOpen.className = 'chat-open';
        sessionOpen.innerHTML = 'OPENED';
        statusMsg.appendChild(sessionOpen);
    }

    websocket.onclose = function() {
        let sessionClose = document.createElement('div');
        sessionClose.className = 'chat-close';
        sessionClose.innerHTML = 'CLOSED';
        statusMsg.innerHTML = '';
        statusMsg.appendChild(sessionClose);
        websocket.close();
        websocket = null;
        btn.removeEventListener('click', echoMsg);
        btnGeo.removeEventListener('click', getGeo);
        $("#modal").modal("show");
    }
};

// 6. Объявляем функцию, которая обрабатывает полученное из input сообщение и отправляет его обратно

function echoMsg() {

    websocket.onmessage = function(event) {
        writeMsg(event.data);
    };

    let message = input.value;
    websocket.send(message);
    writeMsg(message, true);
    message = '';
}

// 7. Объявляем функцию для удачной и неудачной попытки отображения геолокации пользователя

function getGeo() {

    const error = () => {
        let error = document.createElement('div');
        error.className = 'msg-error';
        error.textContent = `No access to Geolocation`;
        chatField.appendChild(error);
        scrollChat(error);
    }
    
    const success = (position) => {
        const latitude  = position.coords.latitude;
        const longitude = position.coords.longitude;
        let geolocation = document.createElement('a');
        geolocation.className = 'msg-geo';
        geolocation.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
        geolocation.target = `_blank`;
        geolocation.textContent = `My Geolocation`;
        chatField.appendChild(geolocation);
        scrollChat(geolocation);
    }

    navigator.geolocation.getCurrentPosition(success, error);
}


// 8. Объявляем функцию для скролла в top последних сообщений чата, чтобы они всегда были видны

function scrollChat(item) {
    if (chatField.scrollHeight > 300) {
        item.scrollIntoView(top)
    }
}

// 9. Вызываем обработчики событий - при загрузке страницы и при нажатии на кнопки

btn.addEventListener('click', echoMsg);

btnGeo.addEventListener('click', getGeo);

btnRes.addEventListener('click', () => {
    statusMsg.innerHTML = '';
    openConnection();
    btn.addEventListener('click', echoMsg);
})

btnClear.addEventListener('click', clearChat);

document.addEventListener('DOMContentLoaded', openConnection);