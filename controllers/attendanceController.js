const jwt = require("jsonwebtoken");

const db = require("../models");

const User = db.UserModel;
const Attendance = db.AttendanceModel;

const login = async (req, res, next) => {
  const { phone } = req.body;
  try {
    const userExists = await User.findOne({ where: { phone } });

    if (!userExists) {
      return res.status(404).send({
        success: false,
        data: [],
        message: "This phone number does not exist",
      });
    }

    const id = userExists.id;

    const token = jwt.sign({ id, phone }, process.env.JWT_SECRET);

    return res.status(200).send({
      success: true,
      data: token,
      message: "Login successful, proceed to mark your attendance",
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      data: error.message,
      message: "Something went wrong, please try again in sometime",
    });
  }
};

const markLoginAttendance = async (req, res, next) => {
  const { id } = req;
  try {
    const user = await User.findOne({ where: { id } });

    if (!user) {
      return res.status(404).send({
        success: false,
        data: [],
        message: "Requested user does not exist",
      });
    }
    const todayDate = new Date(Date.now()).toISOString().split("T")[0];
    const todayAttendanceMarked = await Attendance.findOne({
      where: { user_id: id, login_date: todayDate },
    });

    if (todayAttendanceMarked) {
      return res.status(400).send({
        success: false,
        data: [],
        message: `You have already marked your IN attendance for ${todayDate}`,
      });
    }

    const newAttendance = await Attendance.create({
      user_id: id,
      login_date: todayDate,
      login_time: JSON.stringify(new Date()),
      created_by: id,
    });

    return res.status(201).send({
      success: true,
      data: newAttendance,
      message: `Your IN attendance has been recorded successfully for ${todayDate}`,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      data: error.message,
      message: "Something went wrong, please try again in sometime",
    });
  }
};

const markLogoutAttendance = async (req, res, next) => {
  const { id } = req;
  try {
    const user = await User.findOne({ where: { id } });

    if (!user) {
      return res.status(404).send({
        success: false,
        data: [],
        message: "Requested user does not exist",
      });
    }

    const todayDate = new Date(Date.now()).toISOString().split("T")[0];
    const todayAttendanceMarked = await Attendance.findOne({
      where: { user_id: id, login_date: todayDate },
    });

    if (!todayAttendanceMarked) {
      return res.status(400).send({
        success: false,
        data: [],
        message: `You have not marked your IN attendance for ${todayDate}`,
      });
    }

    const date1 = new Date();
    const date2 = new Date(JSON.parse(todayAttendanceMarked.login_time));

    const hours = (Math.abs(date1 - date2) / 36e5).toFixed(1);

    const updateLogoutTime = await Attendance.update(
      {
        logout_date: todayDate,
        logout_time: JSON.stringify(date1),
        updated_by: id,
        no_of_hours: hours,
      },
      {
        where: { id: todayAttendanceMarked.id },
      }
    );

    const updatedAttendance = await Attendance.findOne({
      where: { id: todayAttendanceMarked.id },
    });

    return res.status(200).send({
      success: true,
      data: updatedAttendance,
      message: `Your logout time for ${todayDate} was recorded successfully`,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      data: error.message,
      message: "Something went wrong, please try again in sometime",
    });
  }
};

module.exports = {
  markLoginAttendance,
  markLogoutAttendance,
  login,
};
