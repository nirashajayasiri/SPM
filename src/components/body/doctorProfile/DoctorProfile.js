import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { isLength, isMatch } from "../../utils/validation/Validation";
import { dispatchDelete } from "../../../redux/actions/authAction";
import {
  showSuccessMsg,
  showErrorMsg,
} from "../../utils/notification/notification";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  nic: "",
  address: "",
  phone: "",
  password: "",
  password2: "",
  gender: "",
  err: "",
  success: "",
};

function DoctorProfile() {
  const auth = useSelector((state) => state.auth);
  const token = useSelector((state) => state.token);
  const { doctor, isLogged } = auth;
  const history = useHistory();
  const [data, setData] = useState(initialState);
  const [thumbnail, setThumbnail] = useState(false);
  const {
    firstName,
    lastName,
    email,
    nic,
    address,
    phone,
    qualification,
    doctorid,
    wardno,
    password,
    password2,
    err,
    success,
  } = data;
  const [loading, setLoading] = useState(false);
  const [callback, setCallback] = useState(false);

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value, err: "", success: "" });
  };

  const changeThumbnail = async (e) => {
    e.preventDefault();
    try {
      const file = e.target.files[0];
      if (!file)
        return setData({ ...data, err: "No files were uploaded", success: "" });

      if (file.size > 1024 * 1024) {
        return setData({ ...data, err: "Size too large", success: "" });
      } // 1mb

      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        return setData({
          ...data,
          err: "File format not supported",
          success: "",
        });
      } // 1mb

      let formData = new FormData();
      formData.append("file", file);

      setLoading(true);

      const res = await axios.post("/api/uploadthumbnail", formData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: token,
        },
      });

      setLoading(false);
      setThumbnail(res.data.url);
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: "" });
    }
  };

  const updateProfile = () => {
    try {
      axios.patch(
        "/doctor/update",
        {
          firstName: firstName ? firstName : doctor.firstName,
          lastName: lastName ? lastName : doctor.lastName,
          nic: nic ? nic : doctor.nic,
          address: address ? address : doctor.address,
          phone: phone ? phone : doctor.phone,
          qualification: qualification ? qualification : doctor.qualification,
          wardno: wardno ? wardno : doctor.wardno,
          thumbnail: thumbnail ? thumbnail : doctor.thumbnail,
        },
        {
          headers: { Authorization: token },
        }
      );
      setData({ ...data, err: "", success: "Updated Successfully" });
      history.push("/profile");
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: "" });
    }
  };

  const updatePassword = () => {
    if (isLength(password))
      return setData({
        ...data,
        err: "Password must be at least 6 characters",
        success: "",
      });

    if (!isMatch(password, password2))
      return setData({
        ...data,
        err: "Passwords do not match",
        success: "",
      });
    try {
      axios.post(
        "/doctor/reset",
        { password },
        {
          headers: { Authorization: token },
        }
      );
      setData({ ...data, err: "", success: "Updated Successfully" });
      history.push("/profile");
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: "" });
    }
  };

  const handleUpdate = () => {
    if (firstName || lastName || nic || address || phone ||qualification || wardno || thumbnail)
      updateProfile();
    if (password) updatePassword();
  };

  const handleDelete = () => {
    try {
      if (
        window.confirm(
          "Are you sure you want to delete your account? This action is irreversible."
        )
      ) {
        axios.delete(`doctor/delete/${doctor._id}`, {
          headers: { Authorization: token },
        });
        dispatch(dispatchDelete(doctor.id));
        localStorage.removeItem("firstLogin");
        history.push("/doctorregister");
      }
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: "" });
    }
  };

  return (
    <section className="content" id="studentProfile">
      <div className="container">
        <div className="row">
          <div className="notification-bar">
            {err && showErrorMsg(err)}
            {success && showSuccessMsg(success)}
            {loading && <span>Loading...</span>}
          </div>
        </div>

        <div className="row ">
          <div className="col" id="studentWidget">
            <h2 className="h4 text-center subtitle">Doctor Profile</h2>
            <div className="studentThumbnail">
              <img
                src={thumbnail ? thumbnail : doctor.thumbnail}
                alt=""
                className="img-fluid"
              />
              <span>
                <i class="fas fa-camera"></i>
                <p>Change</p>
                <input
                  type="file"
                  name="file"
                  id="file_up"
                  onChange={changeThumbnail}
                />
              </span>
            </div>  
            <h4 className="text-center">Welcome <strong>{doctor.firstName } {doctor.lastName}</strong></h4>   

            <ul className="list-unstyled profile-details">
              <li><i class="fas fa-envelope"></i>&nbsp;&nbsp;Email: {doctor.email}</li>
              <li><i class="fas fa-phone-square-alt"></i>&nbsp;&nbsp;Phone: {doctor.phone}</li>
              <li><i class="fas fa-id-card"></i>&nbsp;&nbsp;NIC: {doctor.nic}</li>
              <li><i class="fas fa-id-card"></i>&nbsp;&nbsp;Doctor ID: {doctor.doctorid}</li>
            </ul>
                         
          </div>
          <div className="col" id="dashboardContent">
            
          <div className="profile-form">
              <div className="row">
                <div className="form-group col">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    className="form-control"
                    placeholder="First Name"
                    defaultValue={doctor.firstName}
                    id="firstName"
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group col">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    className="form-control"
                    placeholder="Last Name"
                    defaultValue={doctor.lastName}
                    id="lastName"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Email"
                    defaultValue={doctor.email}
                    id="email"
                    disabled
                  />
                </div>
                <div className="col form-group">
                  <label htmlFor="nic">NIC</label>
                  <input
                    type="text"
                    name="nic"
                    className="form-control"
                    placeholder="NIC"
                    defaultValue={doctor.nic}
                    id="nic"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row">                
                <div className="col form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    name="address"
                    className="form-control"
                    placeholder="Address"
                    defaultValue={doctor.address}
                    id="address"
                    onChange={handleChange}
                  />
                </div>
                <div className="col form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    placeholder="Phone"
                    defaultValue={doctor.phone}
                    id="phone"
                    onChange={handleChange}
                  />
                </div>
                </div>
                <div className="row">
                <div className="col form-group">
                  <label htmlFor="phone">Qualification</label>
                  <select name="qualification" value={doctor.qualification} onChange={handleChange} id="qualification" className="form-control">
                      <option value="">Please select Higher Qualification</option>
                      <option value="Diploma">Diploma</option>
                      <option value="Bachelors Degree">Bachelors Degree</option>
                      <option value="Masters Degree">Masters Degree</option>
                      <option value="PhD">PhD</option>
                  </select>
                </div>
                </div>
                <div className="row">
                <div className="col form-group">
                  <label htmlFor="gender">Doctor ID</label>
                  <input
                    type="text"
                    name="doctorid"
                    className="form-control"
                    placeholder="doctorid"
                    defaultValue={doctor.doctorid}
                    id="doctorid"
                    disabled
                  />
                </div>
                <div className="col form-group">
                  <label htmlFor="phone">wardno</label>
                  <input
                    type="text"
                    name="wardno"
                    className="form-control"
                    placeholder="wardno"
                    defaultValue={doctor.wardno}
                    id="wardno"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Password"
                    id="password"
                    value={password}
                    onChange={handleChange}
                  />
                </div>
                <div className="col form-group">
                  <label htmlFor="password2">Retype password</label>
                  <input
                    type="password"
                    name="password2"
                    className="form-control"
                    placeholder="Retype password"
                    id="password2"
                    value={password2}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col form-group d-grid">
                  <button
                    onClick={handleUpdate}
                    className="btn btn-submit mt-2"
                    disabled={loading}
                  >
                    Update info
                  </button>                  
                </div>
                <div className="col form-group d-grid">
                <button
                    onClick={handleDelete}
                    className="btn btn-delete mt-2"
                  >
                    Delete account
                  </button>
                </div>
              </div>
            </div>
            {/* profile form */}
          </div>
        </div>
      </div>
    </section>
  );
}

export default DoctorProfile;
