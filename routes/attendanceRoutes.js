const authenticate = require("../middleware/authentication");

const router = require("express").Router();

const {
  markLoginAttendance,
  markLogoutAttendance,
  login,
} = require("../controllers/attendanceController");

router.route("/login").post(login);
router.route("/attendance/login").post(authenticate, markLoginAttendance);
router.route("/attendance/logout").post(authenticate, markLogoutAttendance);

module.exports = router;
