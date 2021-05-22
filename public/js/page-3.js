const chatForm = document.querySelector('#chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.querySelector('#room-name');
const userList = document.querySelectorAll('#users');

// Get username and hub from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

console.log(`${username} is in ${room} room`);

const socket = io();
// join hub
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

// message from server
socket.on('message', (message) => {
    console.log(message);
    ouputMessage(message);

    // scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get message text
    let msg = e.target.elements.msg.value;

    msg = msg.trim();

    if (!msg) {
        return false;
    }

    // Emit a message to server
    socket.emit('chatMessage', msg);

    // clear input box
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

});

//output message to DOM
function outputMessage(msg) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${msg.username} <span>${msg.time}</span></p>
    <p class="text">${msg.text}</p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// Add users list to DOM
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}

// leave - prompt 
document.querySelector('.chat-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure to leave the room?');
    if (leaveRoom) {
        window.location = `/index.html`;
    }
    else { }
});