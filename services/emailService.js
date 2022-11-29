require("dotenv").config();
const cron = require("node-cron");
const fs = require("fs");
const transporter = require("../config/mailConfig");
const { generateExcel } = require("../services/generateExcel");

const sendEmail = async () => {
  try {
    cron.schedule("50 17 * * *", async () => {
      await generateExcel();
      var mailOptions = {
        from: "ctanmoy345@gmail.com",
        to: [
        //   "jagriti.banerjee@tuteck.com",
        //   "pratik.banerjee@tuteck.com",
        //   "samantak.panda@tuteck.com",
        "pratikliferay@gmail.com",
          "mehulchattopadhyay2015@gmail.com",
        ],
        subject: "Attendance Details for this week",
        text: "PFA the attendance details of all employees for the previous week",
        attachments: [
          {
            filename: `Weekly Attendance.xlsx`,
            path: `./Weekly Attendance.xlsx`,
          },
        ],
      };
      transporter.sendMail(mailOptions, (error, data) => {
        if (error) {
          console.log(error.message);

          process.exit(1);
        } else {
          console.log("Mail sent");
        }

        fs.unlinkSync(`./Weekly Attendance.xlsx`);
      });
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = { sendEmail };
