const http = require("http");
const express = require("express");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let connectedPlayers = 0;
const MAX_PLAYERS = 2;

io.on("connection", (socket) => {
  if (connectedPlayers < MAX_PLAYERS) {
    connectedPlayers++;

    socket.on("reset", () => {
      io.emit("resetGame");
    });
    socket.on("playerMove", (index) => {
      io.emit("updateGame", index);
    });

    socket.on("disconnect", () => {
      connectedPlayers--;
    });
  } else {
    socket.emit("maxPlayersReached");
    socket.disconnect(true);
  }
});

app.use(express.static("./"));
app.get("/", (req, res) => {
  return res.sendFile("index.html");
});
server.listen(3000, () => console.log("server stated"));
