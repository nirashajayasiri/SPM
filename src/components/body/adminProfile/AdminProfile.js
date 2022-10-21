import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import jsPDF from 'jspdf'

import {
fetchAllDoctors,
dispatchGetAllDoctors,
} from "../../../redux/actions/doctorsAction";

function AdminProfile() {
const adminState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  password2: "",
  err: "",
  success: "",
};

const admin = useSelector((state) => state.admin);
const tokenAdmin = useSelector((state) => state.tokenAdmin);
const [searchTerm, setSearchTerm]= useState("");
const doctors = useSelector((state) => state.doctors);

const {isAdminLogged, isAdmin} = admin;

const history = useHistory();
const [data, setData] = useState(adminState);
const [thumbnail, setThumbnail] = useState(false);
const {
  firstName,
  lastName,
  email,
  password,
  password2,
  err,
  success,
} = data;
const [loading, setLoading] = useState(false);
const [callback, setCallback] = useState(false);

const dispatch = useDispatch();

useEffect(() => {
  return fetchAllDoctors().then((res) => {
    dispatch(dispatchGetAllDoctors(res));
  });
}, [dispatch, callback]);

const handleDelete = async (id) => {
  try {
    if (window.confirm("Are you sure you want to delete this account?")) {
      setLoading(true);
      await axios.delete(`/admin/delete/${id}`, {
        headers: { Authorization: tokenAdmin },
      });
      setLoading(false);
      setCallback(!callback);
    }
  } catch (err) {
    setData({ ...data, err: err.response.data.msg, success: "" });
  }
};

console.log(admin);

const generatePDF = () => {
  var doc = new jsPDF("p", "pt", "a4");
  doc.html(document.querySelector('#print'), {
    callback: function(pdf){
      pdf.save("download.pdf");
    }
  })
}

const tempDate = new Date();
const date = tempDate.getFullYear() + "-" + (tempDate.getMonth() + 1) + "-" + tempDate.getDate() + " " + tempDate.getHours() + ":" + tempDate.getMinutes() + ":" + tempDate.getSeconds();


return (
  <section className="content" id="adminProfile">
    <div className="container">
      <div className="row">
        <div className="col text-center">
          <h1>Welcome {admin.admin.firstName}</h1>
          <h2 className="subtitle h3">All Registered Doctors</h2>
        </div>
      </div>
      <div className="row justify-content-center mt-5">
          <div className="col-12 mb-3 d-flex justify-content-center">
            <div className="search col-4 mx-2">
              <div class="input-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Type to search"
                  aria-label="Search students"
                  aria-describedby="button-addon2" onChange={(event) => {setSearchTerm(event.target.value)}}
                />
              </div>
            </div>
            <div className="addStudent mx-2">
              {/* <button className="btn btn-success mx-1">Add Student</button> */}
              <button className="btn btn-success mx-1" onClick={generatePDF}>
                Generate Report
              </button>
              <button className="btn btn-success mx-1">
                View Statistics
              </button>
            </div>
          </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="col mt-3 table-wrap">
            <div className="table-responsive">
              <table
                id="adminProfile"
                className="table table-hover table-bordered table-sm align-middle"
              >
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>NIC</th>
                    <th>Address</th>
                    <th>Phone</th>
                    <th>Education</th>               
                    <th>Ward</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.accounts.filter((doctor) =>{
                    if(searchTerm == "") {
                      return doctor
                    } else if(doctor.firstName.toLowerCase().includes(searchTerm.toLowerCase()
                      )){
                        return doctor
                      }
                      else if(doctor.lastName.toLowerCase().includes(searchTerm.toLowerCase()
                      )){
                        return doctor
                      }
                      else if (doctor.email.toLowerCase().includes(searchTerm.toLowerCase()
                      )){
                        return doctor
                      }else if (doctor.nic.toLowerCase().includes(searchTerm.toLowerCase()
                      )){
                        return doctor
                      }else if (doctor.wardno.toLowerCase().includes(searchTerm.toLowerCase()
                      )){
                        return doctor
                      }
                      else if (doctor.doctorid.toLowerCase().includes(searchTerm.toLowerCase()
                      )){
                        return doctor
                      }
                  }).map((doctor) => (
                    <tr key={doctor._id}>
                      <td>{doctor.doctorid}</td>
                      <td>{doctor.firstName}</td>
                      <td>{doctor.lastName}</td>
                      <td>{doctor.email}</td>
                      <td>{doctor.nic}</td>
                      <td>{doctor.address}</td>
                      <td>{doctor.phone}</td>
                      <td>{doctor.qualification}</td>                      
                      <td>{doctor.wardno}</td>
                      <td>
                        <button
                          className="deleteBtn"
                          onClick={() => handleDelete(doctor._id)}
                        >
                          <i class="fas fa-trash"></i>&nbsp;&nbsp;Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="d-none">      
    <div id="print">
    <div className="letterhead">
        <img class="img-fluid" src="https://res.cloudinary.com/dhdg4uhps/image/upload/v1662641241/logo_brfjtu.jpg"/>
        <div className="logo-text">
          <h3>Medicare Hospitals</h3>
        </div>
      </div>
      <div className="filename">
        <h4>Registered Doctors Report</h4>
        <p>Total Registered Doctors: {doctors.accounts.length}</p>
      </div>
      <table className="table-bordered">
        <thead>
          <tr>
            <th>Doctor ID</th>
            <th>First name</th>
            <th>Last name</th>
            <th>Email</th>
            <th>NIC</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Education</th>               
            <th>Ward</th>
          </tr>
        </thead>
        <tbody>            
            {doctors.accounts.map((doctor) => (
              <tr>
              <td>
                {doctor.doctorid}
              </td>
              <td>
                {doctor.firstName}
              </td>
              <td>
                {doctor.lastName}
              </td>
              <td>
                {doctor.email}
              </td>
              <td>
                {doctor.nic}
              </td>
              <td>
                {doctor.address}
              </td>
              <td>
                {doctor.phone}
              </td>
              <td>
                {doctor.qualification}
              </td>
              <td>
                {doctor.wardno}
              </td>
              </tr>

            ))}
        </tbody>
      </table>
      <small>Report generated on: {date}</small>
    </div>
    </div>
    
  </section>
);
}

export default AdminProfile;
