require("dotenv").config();
const { Server } = require("socket.io");

express = module.exports = require("express");
app = module.exports = express();
env = module.exports = process.env;
jwt = module.exports = require("jsonwebtoken");
mongoose = module.exports = require("mongoose");

// connect to mongoDB
mongoose.connect(env.MONGO_URI).then(() => {
  console.info("🟢 Mongo connected successfully.");
  console.info("--------------------------------------------");
});

// socket implementation
const server = require("http").Server(app);
const io = require("socket.io")(server);

// socket connection
io.on("connection", (socket) => {
  console.log("🌐 incoming connection - " + socket.id);

  // socket message
  socket.on("message", (message) => {
    console.log("📨 incoming message - ", message);
    require("./routes")(socket, message);
  });

  // socket disconnection
  socket.on("disconnect", () => {
    console.log("🌐 disconnected - " + socket.id);
  });
});

// start the server
server.listen(env.PORT, () => {
  console.info("--------------------------------------------");

  if (env.DEBUG === "off") console.log = function () {};
  console.info("👉 Debug mode => " + env.DEBUG);
  console.info(`🚀 Server started on => http://0.0.0.0:` + env.PORT);
});
