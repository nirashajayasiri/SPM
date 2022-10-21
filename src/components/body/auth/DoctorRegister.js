import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  showErrorMsg,
  showSuccessMsg,
} from "../../utils/notification/notification";
import {
  isEmpty,
  isEmail,
  isLength,
  isMatch,
} from "../../utils/validation/Validation";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  nic: "",
  address: "",
  phone: "",
  qualification:"",
  doctorid:"",
  wardno:"",
  password: "",
  password2: "",
  err: "",
  success: "",
};

function DoctorRegister() {
  const [doctor, setDoctor] = useState(initialState);

  //const [gender, setGender] = useState("Male");

  //console.log(gender);
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
  } = doctor;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setDoctor({ ...doctor, [name]: value, err: "", success: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      isEmpty(firstName) ||
      isEmpty(lastName) ||
      isEmpty(email) ||
      isEmpty(nic) ||
      isEmpty(address) ||
      isEmpty(phone) ||
      isEmpty(qualification) ||
      isEmpty(doctorid) ||
      isEmpty(wardno) ||
      isEmpty(password)
    )
      return setDoctor({
        ...doctor,
        err: "One of more fields are empty. Please fill in all fields",
        success: "",
      });

    if (!isEmail(email))
      return setDoctor({
        ...doctor,
        err: "Invalid email address. Please use a working email address to verify your account successfully",
        success: "",
      });

    if (isLength(password))
      return setDoctor({
        ...doctor,
        err: "Password must be at least 6 characters",
        success: "",
      });

    if (!isMatch(password, password2))
      return setDoctor({
        ...doctor,
        err: "Passwords do not match",
        success: "",
      });

    try {
      const res = await axios.post("/doctor/register", {
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
      });

      setDoctor({
        ...doctor,
        err: "",
        success: res.data.msg,
      });
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
    <section className="content" id="studentRegister">
      <div className="container">
        <div className="row d-flex align-items-center justify-content-center">
          <div className="col-8">
            
            <div className="loginForm">


            <h2 className="h4 text-center mb-4 mt-2 subtitle">Register as a new doctor</h2>

              {err && showErrorMsg(err)}
              {success && showSuccessMsg(success)}

              <form onSubmit={handleSubmit} noValidate>

                <div className="d-flex">
                  <div className="label-wrap">
                  <label>First Name</label>
                  </div>
                  <div className="input-wrap">
                  <input
                    className="form-control"
                    name="firstName"
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={handleChangeInput}
                  />
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="label-wrap">
                    <label>Last Name</label>
                    </div>
                    <div className="input-wrap">
                  <input
                    className="form-control"
                    name="lastName"
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={handleChangeInput}
                  />
                  </div>
                </div>

                <div className="d-flex align-items-center">
                  <div className="label-wrap">
                   <label>Email address</label>
                    </div>
                  <div className="input-wrap">
                  <input
                    className="form-control"
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={handleChangeInput}
                  />
                  </div>
                </div>

                <div className="d-flex align-items-center">
                  <div className="label-wrap">
                   <label>NIC</label>
                    </div>
                  <div className="input-wrap">
                  <input
                    className="form-control"
                    name="nic"
                    type="text"
                    placeholder="NIC"
                    value={nic}
                    onChange={handleChangeInput}
                  />
                  </div>
                </div>

                <div className="d-flex align-items-center">
                  <div className="label-wrap">
                   <label>Address</label>
                    </div>
                  <div className="input-wrap">
                  <input
                    className="form-control"
                    name="address"
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={handleChangeInput}
                  />
                  </div>
                </div>

                <div className="d-flex align-items-center">
                  <div className="label-wrap">
                   <label>Phone number</label>
                    </div>
                  <div className="input-wrap">
                  <input
                    className="form-control"
                    name="phone"
                    type="tel"
                    placeholder="Phone"
                    value={phone}
                    onChange={handleChangeInput}
                  />
                  </div>
                </div>

                <div className="d-flex align-items-center">
                  <div className="label-wrap">
                   <label>Qualifications</label>
                    </div>
                  <div className="input-wrap">
                  <select name="qualification" value={qualification} onChange={handleChangeInput} id="qualification" className="form-control">
                      <option value="">Please select Higher Qualification</option>
                      <option value="Diploma">Diploma</option>
                      <option value="Bachelors Degree">Bachelors Degree</option>
                      <option value="Masters Degree">Masters Degree</option>
                      <option value="PhD">PhD</option>
                  </select>
                  </div>
                </div>

                <div className="d-flex align-items-center">
                  <div className="label-wrap">
                   <label>Doctor ID</label>
                    </div>
                  <div className="input-wrap">
                  <input
                    className="form-control"
                    name="doctorid"
                    type="text"
                    placeholder="Doctor ID"
                    value={doctorid}
                    onChange={handleChangeInput}
                  />
                  </div>
                </div>

                <div className="d-flex align-items-center">
                  <div className="label-wrap">
                   <label>Ward Number</label>
                    </div>
                  <div className="input-wrap">
                  <input
                    className="form-control"
                    name="wardno"
                    type="text"
                    placeholder="Ward"
                    value={wardno}
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
                    placeholder="Password"
                    value={password}
                    onChange={handleChangeInput}
                  />
                  </div>
                </div>

                <div className="d-flex align-items-center">
                  <div className="label-wrap">
                   <label>Retype Password</label>
                    </div>
                  <div className="input-wrap">
                  <input
                    className="form-control"
                    name="password2"
                    type="password"
                    placeholder="Retype password"
                    value={password2}
                    onChange={handleChangeInput}
                  />
                  </div>
                </div>

                <div className="mb-3 mt-1 d-flex align-items-center input-wrap justify-content-end">
                  <button
                    type="submit"
                    className="btn d-inline-block btn-submit"
                  >
                    Register
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DoctorRegister;
