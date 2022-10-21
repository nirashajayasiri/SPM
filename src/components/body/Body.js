import React, { useState } from "react";
import { Switch, Route } from "react-router-dom";
import DoctorLogin from "./auth/DoctorLogin";
import AdminLogin from "./auth/AdminLogin";
import DoctorRegister from "./auth/DoctorRegister";
import ActivationEmail from "./auth/ActivationEmail";
import NotFound from "../utils/notfound/NotFound";

import ForgotPassword from "../body/auth/ForgotPassword";
import ResetDoctorPassword from "../body/auth/resetDoctorPassword";
import DoctorProfile from "./doctorProfile/DoctorProfile";
import AdminProfile from "./adminProfile/AdminProfile";

import { useSelector } from "react-redux";

function Body() {
  const auth = useSelector((state) => state.auth);
  const { isLogged } = auth;
  return (
    <section id="content">
      <div className="container">
        <Switch>
          <Route
            path="/doctorlogin"
            component={isLogged ? NotFound : DoctorLogin}
            exact
          ></Route>
          <Route path="/adminlogin" component={AdminLogin} exact></Route>

          <Route
            path="/doctorregister"
            component={isLogged ? NotFound : DoctorRegister}
            exact
          ></Route>

          <Route
            path="/forgotpassword"
            component={isLogged ? NotFound : ForgotPassword}
            exact
          ></Route>

          <Route
            path="/doctor/reset/:token"
            component={isLogged ? NotFound : ResetDoctorPassword}
            exact
          ></Route>

          <Route
            path="/profile"
            component={isLogged ? DoctorProfile : NotFound}
            exact
          ></Route>

          <Route
            path="/adminprofile"
            component={isLogged ? AdminProfile : NotFound}
            exact
          ></Route>

          <Route
            path="/doctor/activate/:activation_token"
            component={ActivationEmail}
            exact
          ></Route>
        </Switch>
      </div>
    </section>
  );
}

export default Body;
