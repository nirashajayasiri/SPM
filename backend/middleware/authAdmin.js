const { resetPassword } = require("../controllers/adminCtrl");

const jwt = require("jsonwebtoken");

const authAdmin = (req, res, next) => {
  try {
    const tokenAdmin = req.header("Authorization");
    if (!tokenAdmin) return res.status(400).json({ msg: "Invalid authentication" });

    jwt.verify(tokenAdmin, process.env.ACCESS_TOKEN_SECRET, (err, admin) => {
      if (err) return res.status(400).json({ msg: "Invalid authentication" });

      req.admin = admin;
      next();
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = authAdmin;
