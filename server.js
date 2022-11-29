require("dotenv").config();
const cors = require("cors");
const express = require("express");

const { sendEmail } = require("./services/emailService");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const AttendanceRouter = require("./routes/attendanceRoutes");
app.use("/api", AttendanceRouter);

const PORT = process.env.PORT || 8080;
const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Database connected`);
      console.log(`Server started on port ${PORT}`);
      sendEmail();
    });
  } catch (error) {
    console.log(error);
  }
};

start();

