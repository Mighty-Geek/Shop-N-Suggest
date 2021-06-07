const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { formatMessage } = require('./utils/messages');
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
} = require('./utils/users');

var app = express();
const server = http.createServer(app);
const io = socketio(server);

var PORT = process.env.PORT || 3000;

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = `Shop'N'Suggest Bot`;

//run when a (current) user connects
io.on('connection', socket => {
    console.log('New websocket connection');

    socket.on('joinRoom', ({ username, room }) => {

        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        socket.emit('message', formatMessage(botName, `Welcome to 'Ask a Friend' functionality`));

        // Broadcast when a user connects
        socket.broadcast
            .to(user.room)
            .emit(
                'message',
                formatMessage(botName, `${user.username} has joined the chat`)
            );

        // Send info to room and users
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });


    // listen for chatMessage
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit('message', formatMessage(botName, ` ${user.username} has left the hub`));

            // Send info to room and users
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }

    });
});

app.get("/page-2.html", (req, res) => { res.sendFile(path.join(__dirname + "public", "page-2.html")); });
app.get("/page-3.html", (req, res) => { res.sendFile(path.join(__dirname + "public", "page-3.html")); });
app.get("/page-3-chat.html", (req, res) => { res.sendFile(path.join(__dirname + "public", "page-3-chat.html")); });

server.listen(PORT, () => console.log(`app is running on port ${PORT}`));


