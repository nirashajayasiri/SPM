import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import {
  showErrorMsg,
  showSuccessMsg,
} from "../../utils/notification/notification";
import { dispatchLogin } from "../../../redux/actions/authAction";
import { useDispatch } from "react-redux";

const initialState = {
  doctorid: "",
  password: "",
  err: "",
  success: "",
};

function DoctorLogin() {
  const [doctor, setDoctor] = useState(initialState);
  const dispatch = useDispatch();
  const history = useHistory();

  const { doctorid, password, err, success } = doctor;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setDoctor({ ...doctor, [name]: value, err: "", success: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/doctor/login", { doctorid, password });
      setDoctor({ ...doctor, err: "", success: res.data.msg });

      localStorage.setItem("firstLogin", true);
      dispatch(dispatchLogin());
      history.push("/profile");
    } catch (err) {
      err.response.data.msg &&
        setDoctor({
          ...doctor,
          err: err.response.data.msg,
          success: "",
        });
    }
  };

  return (
    <section class="content" id="studentLogin">
      <div className="container">
        <div className="row d-flex align-items-center">
          <div className="col">            
            
            <div className="loginForm">

            <h2 className="h3 text-center subtitle mb-4">Doctor Login</h2>

              {err && showErrorMsg(err)}
              {success && showSuccessMsg(success)}
              <form onSubmit={handleSubmit}>


              <div className="d-flex align-items-center">
                  <div className="label-wrap">
                   <label>Doctor ID</label>
                    </div>
                  <div className="input-wrap">
                  <input
                    className="form-control"
                    name="doctorid"
                    id="doctorid"
                    type="text"
                    placeholder="Doctor Id"
                    value={doctorid}
                    onChange={handleChangeInput}
                  />
                  </div>
                </div>
                
                <div className="d-flex align-items-center">
                  <div className="label-wrap">
                   <label>Password</label>
                    </div>
                  <div className="input-wrap">
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
                </div>

                <div className="form-group input-wrap mt-1 d-flex align-items-center justify-content-end">
                  <button
                    type="submit"
                    className="btn d-inline-block btn-submit"
                  >
                    Login
                  </button>
                </div>
                <div className="form-group mt-3">
                  <p>
                    New Doctor?
                    <Link to="/doctorregister" className="inline-link">
                      Register here
                    </Link>
                  </p>
                  <p className="mt-2">Forgot your password? 
                  <Link to="/forgotpassword" className="inline-link">
                    Forgot password?
                  </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DoctorLogin;
