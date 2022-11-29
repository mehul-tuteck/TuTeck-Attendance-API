const { sequelize, Sequelize } = require("sequelize");
const db = require("../services/dbSetup");

db.UserModel = require("./t_user")(db.sequelize, Sequelize);
db.AttendanceModel = require("./t_attendance_details")(db.sequelize, Sequelize);

module.exports = db;
