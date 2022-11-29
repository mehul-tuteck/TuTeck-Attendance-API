const xlsx = require("xlsx");
const { sequelize } = require("../models");

const generateExcel = async (req, res, next) => {
  let workbook = xlsx.utils.book_new();

  let dateArr = [];
  for (let i = 4; i >= 0; i--) {
    dateArr.push(
      new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    );
  }

  console.log(dateArr);

  //dateArr.sort();

  let promises = [];
  dateArr.map(async (currentDate) => {
    const [attendance, metadata] = await sequelize.query(
      `select t_attendance_details.login_time, t_attendance_details.logout_time, t_attendance_details.login_date, t_attendance_details.is_absent, t_attendance_details.no_of_hours, t_user.first_name, t_user.last_name from t_attendance_details inner join t_user on t_user.id = t_attendance_details.user_id where login_date = "${currentDate}"`
    );
    promises = [];
    if (attendance.length > 0) {
      promises = attendance.map((current) => {
        return {
          Date: current.login_date,
          Name: current.first_name + " " + current.last_name,
          "Number of hours": current.no_of_hours,
          "Login time": current.login_time,
          "Logout time": current.logout_time,
          Absent: current.is_absent === 1 ? "Yes" : "No",
        };
      });
    }

    const resolved = await Promise.all(promises);
    console.log(resolved);
    const worksheet = xlsx.utils.json_to_sheet(resolved);

    xlsx.utils.book_append_sheet(workbook, worksheet, `${currentDate}.xlsx`);
    xlsx.writeFile(workbook, `Weekly Attendance.xlsx`);
  });
};



module.exports = {
  generateExcel,
};
