const router = require("express").Router();
const doctorCtrl = require("../controllers/doctorCtrl");
const auth = require("../middleware/auth");

router.post("/register", doctorCtrl.register);

router.post("/activation", doctorCtrl.activateEmail);

router.post("/login", doctorCtrl.login);

router.post("/refreshtoken", doctorCtrl.getAccessToken);

router.post("/forgot", doctorCtrl.forgotPassword);

router.post("/reset", auth, doctorCtrl.resetPassword);

router.get("/profile", auth, doctorCtrl.getStudentInfor);

router.get("/logout", doctorCtrl.logout);

router.patch("/update", auth, doctorCtrl.updateStudent);

router.delete("/delete/:id", auth, doctorCtrl.deleteStudent);

module.exports = router;
