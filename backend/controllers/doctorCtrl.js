const Doctors = require("../models/doctorModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("./sendMail");

const { CLIENT_URL } = process.env;

const doctorCtrl = {
  register: async (req, res) => {
    try {
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
      } = req.body;

      if (
        !firstName ||
        !lastName ||
        !email ||
        !nic ||
        !address ||
        !phone ||
        !qualification||
        !doctorid||
        !wardno||
        !password
      )
        return res.status(400).json({ msg: "One of more fields is empty: Please fill in all fields" })

        if (!validatePhone(phone) && !validatePhoneEx(phone))
      return res.status(400).json({ msg: "Phone number is invalid. Please use valid Sri lankan phone number (+94XXXXXXXXX or 07XXXXXXXX)" })

      if (!validateEmail(email))
        return res.status(400).json({ msg: "Invalid email address. Please use a working email address to verify your account successfully" })
      

      const doctor = await Doctors.findOne({ email })
      if (doctor)
        return res.status(400).json({ msg: "This email already exists. Please login!" });

      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "Password must be at least 6 characters" });
       
      const passwordHash = await bcrypt.hash(password, 12);
   
      const newDoctor = {
        firstName,
        lastName,
        email,
        nic,
        address,
        phone,
        qualification,
        doctorid,
        wardno,
        password: passwordHash,
      };     

      const activation_token = createActivationToken(newDoctor);

      const url = `${CLIENT_URL}/doctor/activate/${activation_token}`;
      sendMail(email, url, "Verify your email address");   

      res.json({
        msg: "Registration successfull! Please activate your email to login",
      });

      

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  activateEmail: async (req, res) => {
    try {
      const { activation_token } = req.body;
      const doctor = jwt.verify(
        activation_token,
        process.env.ACTIVATION_TOKEN_SECRET
      );
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
      } = doctor;

      const check = await Doctors.findOne({ email });

      if (check)
        return res.status(400).json({ msg: "This email already exists. Please login" });

      const newDoctor = new Doctors({
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

      await newDoctor.save();

      res.json({ msg: "Account has been activated! Now you can login" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { doctorid, password } = req.body;
      const doctor = await Doctors.findOne({ doctorid });
      if (!doctor)
        return res.status(400).json({ msg: "This Doctor ID does not exist" });

      const isMatch = await bcrypt.compare(password, doctor.password);
      if (!isMatch)
        return res.status(400).json({ msg: "The password is incorrect" });

      const refresh_token = createRefreshToken({ id: doctor._id });
      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/doctor/refreshtoken",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7days
      });

      res.json({ msg: "Login success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getAccessToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token) return res.status(400).json({ msg: "Please login now!" });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, doctor) => {
        if (err) return res.status(400).json({ msg: "Please login now!" });

        const access_token = createAccessToken({ id: doctor.id });
        res.json({ access_token });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const doctor = await Doctors.findOne({ email });
      if (!doctor)
        return res.status(400).json({ msg: "This email does not exist" });

      const access_token = createAccessToken({ id: doctor.id });
      const url = `${CLIENT_URL}/doctor/reset/${access_token}`;

      sendMail(email, url, "Reset your password");
      res.json({ msg: "Resent the password, please check your email" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { password } = req.body;
      const passwordHash = await bcrypt.hash(password, 12);

      await Doctors.findOneAndUpdate(
        { _id: req.doctor.id },
        {
          password: passwordHash,
        }
      );
      res.json({ msg: "Password successfully updated! Now you can login" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getStudentInfor: async (req, res) => {
    try {
      const doctor = await Doctors.findById(req.doctor.id).select(
        "-password"
      );
      res.json(doctor);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/doctor/refreshtoken" });
      return res.json({ msg: "Logged Out" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateStudent: async (req, res) => {
    try {
      const { firstName, lastName, nic, address, phone,qualification, wardno, thumbnail } =
        req.body;
      await Doctors.findOneAndUpdate(
        { _id: req.doctor.id },
        {
          firstName,
          lastName,
          nic,
          address,
          phone,
          qualification,
          wardno,
          thumbnail,
        }
      );

      res.json({ msg: "Doctor details update successful!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getAllDoctors: async (req, res) => {
    try {
      const doctors = await Doctors.find().select("-password");
      res.json(doctors);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  deleteStudent: async (req, res) => {
    try {
      await Doctors.findByIdAndDelete(req.doctor.id);
      res.json({ msg: "Delete success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
function validatePhone(phone) {
  const pv = /^\d{10}$/;
  return pv.test(String(phone).toLowerCase());
}
function validatePhoneEx(phone) {
  const pvs = /^\+?([0-9]{2})\)?[-. ]?([0-9]{9})$/;
  return pvs.test(String(phone).toLowerCase());
}

const createActivationToken = (payload) => {
  return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {
    expiresIn: "5m",
  });
};
const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};
const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = doctorCtrl;
