
import React from 'react'
import {Link} from 'react-router-dom';
import { useSelector } from "react-redux";
import axios from "axios";

function Header() {
  const auth = useSelector((state) => state.auth);
  const adminAccount = useSelector((state) => state.admin);

  const { doctor, isLogged } = auth;
  const { admin, isAdmin, isAdminLogged} = adminAccount;

  const doctorLogout = async () => {
    try {
      await axios.get("/doctor/logout");
      localStorage.removeItem("firstLogin");
      window.location.href = "/doctorlogin";
    } catch (err) {
      window.location.href = "/";
    }
  };
  
  const adminLogout = async () => {
    try {
      await axios.get("/admin/logout");
      localStorage.removeItem("adminLogin");
      window.location.href = "/adminlogin";
    } catch (err) {
      window.location.href = "/";
    }
  };

  const doctorLink = () => {
    if( isLogged == true ) {
    return (      
        <div className="profilePic">
        <img src={doctor.thumbnail} alt="" className="img-fluid" />
        <p>
          <Link to="/profile" className="personName">
            {doctor.firstName}
          </Link>
          <p onClick={doctorLogout} className="logout">
            Logout
          </p>
        </p>
      </div>
    );
    } if ( isAdmin == true ){
      return (                      
        <div className="profilePic">
        <img src={admin.thumbnail} alt="" className="img-fluid" />
        <p>
          <Link to="/adminprofile" className="personName">
            {admin.firstName}
          </Link>
          <p onClick={adminLogout} className="logout">
            Log out
          </p>
        </p>
      </div>
 
    )
    }
  };

  return (
    <div>
            <header>
              <div class="container d-flex align-items-center">
                <div class="logo">
                  <img class="img-fluid" src="https://res.cloudinary.com/dhdg4uhps/image/upload/v1662641241/logo_brfjtu.jpg"/>
                </div>
                <h3 class="logo-name">Medicare Hospitals</h3>
              </div>
            </header>          
            <nav class="navbar p-0 navbar-expand-lg navbar-light bg-light">
                <div class="container">
                    <ul class="nav nav-pills nav-justified">
                        <li class="nav-item">
                          <Link class="nav-link" to="/">Home</Link>
                        </li>
                        <li class="nav-item">
                          <Link class="nav-link" to="/">Patients</Link>
                        </li>
                        <li class="nav-item dropdown">
                            <Link class="nav-link dropdown-toggle active" to="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Doctors
                            </Link>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><Link class="dropdown-item" to="/doctorregister">Register</Link></li>
                                <li><Link class="dropdown-item" to="/doctorlogin">Login</Link></li>
                                
                            </ul>
                        </li>
                        <li class="nav-item">
                          <Link class="nav-link" to="/">Inventory</Link>
                        </li>
                        <li class="nav-item">
                          <Link class="nav-link" to="/">About</Link>
                        </li>
                    </ul>
                    {isLogged || isAdminLogged ? (
              doctorLink()
            ) : (
              <Link to="/adminlogin" className='nav-link admin-login'>Admin Login</Link>
            )}
            </div>
        </nav>
    </div>
  );
}

export default Header;
