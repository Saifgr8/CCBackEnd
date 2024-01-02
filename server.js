const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/dbConnection");
const cookieParser = require("cookie-parser");
//declare
const app = express();
connectDB();
//middlewares
app.use(
  cors({
    credentials: true,
    origin: "https://mern-custcards.azurewebsites.net",
  })
);
//https://mern-custcards.azurewebsites.net
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

//routes
app.use("/", require("./routes/auth"));
//port
const port = process.env.PORT || 3500;
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
