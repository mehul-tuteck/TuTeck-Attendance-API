const xlsx = require("xlsx");

const db = require("../models");
const User = db.UserModel;

const migrate = async (req, res, next) => {
  const file = xlsx.readFile("./Employee_Info.xlsx");
  const worksheet = file.Sheets["Sheet1"];
  const jsonArray = xlsx.utils.sheet_to_json(worksheet);


  const promises = jsonArray.map(async (current) => {
    return {
      first_name: current["First Name"],
      last_name: current["Last Name"],
      phone: current["Mobile Phone"],
      other_email: current["Other Email"],
      email: current["Email ID"],
      created_by: 1,
    };
  });

  const resolved = await Promise.all(promises);
  await User.bulkCreate(resolved);
};

migrate();
