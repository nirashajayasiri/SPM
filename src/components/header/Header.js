import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

function Header() {
  const auth = useSelector((state) => state.auth);

  const { doctor, isLogged } = auth;

  const doctorLogout = async () => {
    try {
      await axios.get("/doctor/logout");
      localStorage.removeItem("firstLogin");
      window.location.href = "/";
    } catch (err) {
      window.location.href = "/";
    }
  };

  const doctorLink = () => {
    return (
      <div className="profilePic">
        <img src={doctor.thumbnail} alt="" className="img-fluid" />
        <p>
          <Link to="/profile" className="personName">
            {doctor.firstName}
          </Link>
          <Link to="/" onClick={doctorLogout} className="logout">
            Logout
          </Link>
        </p>
      </div>
    );
  };
  return (
    <header>
      {/* <div className="topHeader">
        <div className="container justify-content-between align-items-center d-flex">
          
        </div>
      </div> */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container d-flex justify-content-between">
          <Link className="navbar-brand" to="#">
            Wisdom Universe
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="#">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="#">
                  Features
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="#">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div className="signup-links">
            {isLogged ? (
              doctorLink()
            ) : (
              <ul className="signupBlock">
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle"
                    to="#"
                    id="navbarDropdownMenuLink"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Doctor
                  </Link>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdownMenuLink"
                  >
                    <li>
                      <Link className="dropdown-item" to="/doctorlogin">
                        Login
                      </Link>
                    </li>
                    <Link className="dropdown-item" to="/doctorregister">
                      Register
                    </Link>
                  </ul>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
