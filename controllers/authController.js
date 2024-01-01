const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const test = (req, res) => {
  res.json({ message: "Its working" });
};

const handleRegister = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    //basic checks
    if (!userName) {
      return res.json({ error: "Username is required" });
    }
    if (!email) {
      return res.json({ error: "Email is required" });
    }
    if (!password || password.length < 6) {
      return res.json({
        error: "Password is required and should be at least 6 characters long",
      });
    }

    //email exist
    const existEmail = await UserModel.findOne({ email: email }).exec();
    if (existEmail) {
      return res.json({ error: "Email already exists" });
    }

    //create user
    if (userName && email && !existEmail && password.length >= 6) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await UserModel.create({
        userName: userName,
        email: email,
        password: hashedPassword,
      });
      res.json(user);
    }
  } catch (error) {
    console.error(error);
    console.log("Error registering user");
  }
};

//login auth

const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    //basic checks
    if (!email) {
      res.json({ error: "Email required" });
    }
    if (!password) {
      res.json({ error: "Password required" });
    }

    //match user password
    const user = await UserModel.findOne({ email: email }).exec();
    if (!user) {
      res.json({ error: "User not found" });
    }
    //match the password
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      jwt.sign(
        {
          email: user.email,
          id: user._id,
          userName: user.userName,
        },
        process.env.SECRET_KEY,
        { expiresIn: "1d" },
        (err, token) => {
          if (err) {
            throw err;
          } else {
            res
              .cookie("token", token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
              })
              .json(user);
          }
        }
      );
    } else {
      res.json({ error: "incorrect password" });
    }
    //valid
  } catch (error) {
    console.error(error);
    console.log("login failed server side");
  }
};

//profile

const handleProfile = async (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, {}, async (err, user) => {
      if (err) {
        res.json(null);
        return;
      }
      const { userName } = user;
      try {
        const foundUser = await UserModel.findOne({ userName: userName });
        if (!foundUser) {
          res.json(null);
          return;
        }
        res.json(foundUser);
      } catch (error) {
        console.error(error);
        res.json(null);
      }
    });
  } else {
    res.json(null);
  }
};

//handle logout
const handleLogout = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "logout successful" });
};

module.exports = {
  test,
  handleRegister,
  handleLogin,
  handleProfile,
  handleLogout,
};
