const { register, login } = require("./controllers/UserController");

const WebsocketRouter = (socket, message) => {
  // validate the message structure
  const { type, data } = message;

  switch (type) {
    case "user-register":
      register(socket, data);
      break;

    case "user-login":
      login(socket, data);
      break;

    default:
      console.log("🚫 invalid message type");

      // send back a invalid response
      socket.emit(
        "message",
        JSON.stringify({
          type: "error",
          status: 404,
          message: "invalid message type",
        })
      );
      break;
  }
};

module.exports = WebsocketRouter;
