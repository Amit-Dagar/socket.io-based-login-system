const { checkDuplicate, getRecord, getToken } = require("../helpers");
const User = require("../models/UserModel");

module.exports = {
  register: async (socket, data) => {
    try {
      const { username, password } = data;

      // check if the username is already taken
      await checkDuplicate(User, { username }, "username");

      // create a new user
      const user = new User({
        username,
        password,
      });

      // save the user
      await user.save();
      socket.emit("message", {
        type: "user-register",
        status: 200,
        message: "User registered successfully",
        payload: {
          username: user.username,
        },
      });
    } catch (e) {
      socket.emit("error", {
        type: "error",
        status: e.status || 500,
        message: e.message || "SERVER_ERROR",
      });
    }

    return;
  },

  login: async (socket, data) => {
    try {
      const { username, password } = data;

      // find the user
      const user = await getRecord(User, { username, password }, "User");

      // generate a token
      const token = await getToken({ id: user.id });

      socket.emit("message", {
        type: "user-login",
        status: 200,
        message: "User logged in successfully",
        payload: {
          token,
        },
      });
    } catch (e) {
      socket.emit("error", {
        type: "error",
        status: e.status || 500,
        message: e.message || "SERVER_ERROR",
      });
    }

    return;
  },
};
