import React from "react";
import {useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import axios from 'axios'



function NotFound() {

  const auth = useSelector((state) => state.auth);
  const adminAccount = useSelector((state) => state.admin);

  const { doctor, isLogged } = auth;
  const { admin, isAdmin, isAdminLogged} = adminAccount;
    
  const adminLogout = async () => {
    try {
      await axios.get("/admin/logout");
      localStorage.removeItem("firstLogin");
      localStorage.removeItem("adminLogin");
      window.location.href = "/adminlogin";
    } catch (err) {
      window.location.href = "/";
    }
  };

  const doctorLogout = async () => {
    try {
      await axios.get("/doctor/logout");
      localStorage.removeItem("adminLogin");
      localStorage.removeItem("firstLogin");
      window.location.href = "/doctorlogin";
    } catch (err) {
      window.location.href = "/";
    }
  };

  return (
    <section className="content">
      <div className="container">
        <div className="row justify-content-center ">
          <div className="col-8 text-center">          
            <h1>404 Not Found</h1>            
            <h4>The Page you requested is unavailable or you don't have the correct permissions to view the page.</h4>

            { isLogged == true ? (<p> You need an ADMIN account to access this page. Please login <Link onClick={adminLogout}>here</Link> </p>) : ( <p> You need to log in to access this page. Please login <Link onClick={doctorLogout}>here</Link></p>)}
            
            <p>or visit our <Link to="/">Home page</Link></p>
            <img src="https://res.cloudinary.com/dhdg4uhps/image/upload/v1633376735/3747371_xyjfo5.jpg" alt="" className="img-fluid mt-3" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default NotFound;
