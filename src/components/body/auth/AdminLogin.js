import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import {
  showErrorMsg,
  showSuccessMsg,
} from "../../utils/notification/notification";
import { dispatchAdminLogin } from "../../../redux/actions/adminAction";
import { useDispatch } from "react-redux";

const initialState = {
  email: "",
  password: "",
  err: "",
  success: "",
};

function AdminLogin() {
  const [admin, setAdmin] = useState(initialState);
  const dispatch = useDispatch();
  const history = useHistory();

  const { email, password, err, success } = admin;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setAdmin({ ...admin, [name]: value, err: "", success: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/admin/login", { email, password });
      setAdmin({ ...admin, err: "", success: res.data.msg });

      localStorage.setItem("adminLogin", true);
      dispatch(dispatchAdminLogin());
      history.push("/adminprofile");
    } catch (err) {
      err.response.data.msg &&
        setAdmin({
          ...admin,
          err: err.response.data.msg,
          success: "",
        });
    }
  };

  return (
    <section class="content" id="studentLogin">
      <div className="container">
        <div className="row d-flex align-items-center">
          <div className="col py-3">
            <h2 className="h3 text-center subtitle">Admin Login</h2>
            <p className="text-center desc-text">
              Login to admin admin panel here.
            </p>
            <div className="loginForm">
              {err && showErrorMsg(err)}
              {success && showSuccessMsg(success)}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    className="form-control"
                    name="email"
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={handleChangeInput}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Password</label>
                  <input
                    className="form-control"
                    name="password"
                    type="password"
                    id="password"
                    placeholder="Password"
                    value={password}
                    onChange={handleChangeInput}
                  />
                </div>
                <div className="form-group mt-1 d-flex align-items-center justify-content-between">
                  <button
                    type="submit"
                    className="btn d-inline-block btn-success"
                  >
                    Login
                  </button>
                  <Link to="/forgotpassword" className="inline-link">
                    Forgot password?
                  </Link>
                </div>
                {/* <div className="form-group mt-3">
                  <p>
                    New student?
                    <Link to="/studentregister" className="inline-link">
                      Register here
                    </Link>
                  </p>
                </div> */}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminLogin;
