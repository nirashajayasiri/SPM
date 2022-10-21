import "./App.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  dispatchLogin,
  fetchDoctor,
  dispatchGetDoctor,
} from "./redux/actions/authAction";

import {dispatchAdminLogin, fetchAdmin, dispatchGetAdmin} from './redux/actions/adminAction';


import axios from "axios";

import DoctorLogin from "./components/body/auth/DoctorLogin";

import AdminLogin from "./components/body/auth/AdminLogin";
import DoctorRegister from "./components/body/auth/DoctorRegister";
import ActivationEmail from "./components/body/auth/ActivationEmail";
import NotFound from "./components/utils/notfound/NotFound";

import ForgotPassword from "./components/body/auth/ForgotPassword";
import ResetDoctorPassword from "./components/body/auth/resetDoctorPassword";
import DoctorProfile from "./components/body/doctorProfile/DoctorProfile";
import AdminProfile from "./components/body/adminProfile/AdminProfile";



import Header from './shared/Header';
import Footer from './shared/Footer';

import {BrowserRouter as Router, Route} from "react-router-dom"

function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const tokenAdmin = useSelector((state) => state.tokenAdmin);
  const auth = useSelector((state) => state.auth);
  const admin = useSelector((state) => state.admin);
  const { isLogged } = auth;
  const { isAdminLogged, isAdmin } = admin;

  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) {
      const getToken = async () => {
        const res = await axios.post("/doctor/refreshtoken", null);
        dispatch({ type: "GET_TOKEN", payload: res.data.access_token });
      };
      getToken();
    }
  }, [auth.isLogged, dispatch]);

  useEffect(() => {
    if (token) {
      const getDoctor = () => {
        dispatch(dispatchLogin());
        return fetchDoctor(token).then((res) => {
          dispatch(dispatchGetDoctor(res));
        });
      };
      getDoctor();
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (tokenAdmin) {
      const getAdmin = () => {
        dispatch(dispatchAdminLogin());
        return fetchAdmin(tokenAdmin).then((res) => {
          dispatch(dispatchGetAdmin(res));
        });
      };
      getAdmin();
    }
  }, [tokenAdmin, dispatch]);

    useEffect(() => {
    const adminLogin = localStorage.getItem("adminLogin");
    if (adminLogin) {
      const getToken = async () => {
        const res = await axios.post("/admin/refreshtoken", null);
        dispatch({ type: "GET_ADMIN_TOKEN", payload: res.data.access_token });
      };
      getToken();
    }
  }, [admin.isAdminLogged, isAdmin, dispatch]);

  return (
    <Router>
      <Header />
          {/* <Route path="/" exact component={CounterClass} /> */}

          <Route
            path="/doctorlogin"
            component={isLogged ? NotFound : DoctorLogin}
            exact
          ></Route>
          <Route
            path="/adminlogin"
            component={isLogged ? NotFound : AdminLogin}
            exact
          ></Route>

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
            component={isLogged && !isAdmin ? DoctorProfile : NotFound}
            exact
          ></Route>

          <Route
            path="/adminprofile"
            component={isAdminLogged && isAdmin ? AdminProfile : NotFound}
            exact
          ></Route>

          <Route
            path="/doctor/activate/:activation_token"
            component={ActivationEmail}
            exact
          ></Route>

    <Footer/>
    </Router>
  );
}

export default App;
