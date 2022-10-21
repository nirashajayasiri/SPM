const router = require("express").Router();
const adminCtrl = require("../controllers/adminCtrl");
const doctorCtrl = require("../controllers/doctorCtrl");
const authAdmin = require("../middleware/authAdmin");

router.post("/register", adminCtrl.register);

router.post("/activation", adminCtrl.activateEmail);

router.post("/login", adminCtrl.login);

router.post("/refreshtoken", adminCtrl.getAccessToken);

router.post("/forgot", adminCtrl.forgotPassword);

router.post("/reset", authAdmin, adminCtrl.resetPassword);

router.get("/profile", authAdmin, adminCtrl.getAdminInfor);

router.get("/alldoctors", adminCtrl.getAllDoctors);

router.get("/logout", adminCtrl.logout);

router.patch("/updatedoctor/:id", adminCtrl.updateDoctor);

router.delete("/delete/:id", authAdmin, adminCtrl.deleteAdmin);

module.exports = router;
