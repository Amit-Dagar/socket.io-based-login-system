import { Fragment } from "react";
import useSocketStore from "../stores/socketStore";

export default function Login() {
  const sendMessage = useSocketStore((state) => state.sendMessage);

  const login = (e) => {
    e.preventDefault();
    const payload = {
      type: "user-login",
      data: {
        username: e.target.username.value,
        password: e.target.password.value,
      },
    };
    sendMessage(payload);
  };

  return (
    <Fragment>
      <div className="d-flex justify-content-center align-items-center w-100 h-100">
        <div
          className="card shadow border-0 p-3"
          style={{
            width: "35%",
          }}
        >
          <div className="card-header text-center bg-transparent border-0">
            <h3>Login</h3>
          </div>
          <div className="card-body">
            <form onSubmit={login}>
              <div className="form-group mb-3">
                <label htmlFor="username">Username</label>
                <input
                  name="username"
                  type="text"
                  className="form-control"
                  id="username"
                  placeholder="Enter username"
                />
              </div>
              <div className="form-group mb-4">
                <label htmlFor="password">Password</label>
                <input
                  name="password"
                  type="text"
                  className="form-control"
                  id="password"
                  placeholder="Enter password"
                />
              </div>
              <div className="form-group">
                <button type="submit" className="btn btn-primary w-100">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
