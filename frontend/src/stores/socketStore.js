import create from "zustand";
import { server } from "../env";
import io from "socket.io-client";
const { toast } = require("react-toastify");

const useSocketStore = create((set, get) => ({
  isLoggedIn: false,
  socket: null,
  initSocket: () => {
    const socket = io(server, {
      transports: ["websocket"],
    });

    // show errors
    socket.on("error", (data) => {
      console.log(data);
      const { message } = data;
      toast(message, {
        type: "error",
        theme: "colored",
        position: toast.POSITION.TOP_RIGHT,
      });
    });

    // show messages
    socket.on("message", (data) => {
      console.log(data);
      const { message } = data;
      toast(message, {
        type: "success",
        theme: "colored",
        position: toast.POSITION.TOP_RIGHT,
      });
    });

    set({ socket });
  },
  sendMessage: (data) => {
    const { socket } = get();
    socket.emit("message", data);
  },
}));

export default useSocketStore;
