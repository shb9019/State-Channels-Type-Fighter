const io = require("socket.io")();
const socketapi = {
    io: io
};
const users = {};

io.on("connection", (socket) => {
    socket.on("send", ({data, recipient}) => {
        console.log("Sending message:", users[recipient], data);
        socket.broadcast.to(users[recipient]).emit("message", data);
    });

    socket.on("register", (id) => {
        users[id] = socket.id;
        socket.emit("registered");
    });
});

module.exports = socketapi;
