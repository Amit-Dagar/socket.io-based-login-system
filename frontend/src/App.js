import { Fragment, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import useSocketStore from "./stores/socketStore";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

function App() {
  const initSocket = useSocketStore((state) => state.initSocket);
  useEffect(() => {
    initSocket();
  }, []);

  return (
    <Fragment>
      <RouterProvider router={router} />
      <ToastContainer />
    </Fragment>
  );
}

export default App;
