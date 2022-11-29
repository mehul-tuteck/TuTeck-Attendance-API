const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ctanmoy345@gmail.com",
    pass: "sbirfydifvyckvin",
  },
});

module.exports = transporter;
