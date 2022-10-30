const router = require("express").Router();
const User = require("../models/User");
const logger = require("../utils/logger");
const config = require("../utils/config");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../utils/verifyToken");
const { errorHandler } = require("../utils/middleware");

//Register
router.post("/register", async (req, res) => {
  const userEmailExist = await User.findOne({ email: req.body.email });
  const userUsernameExist = await User.findOne({
    username: req.body.username,
  });

  if (userEmailExist || userUsernameExist) {
    console.log("User Already Exists");
    res.status(400).json({ error: true, message: "User Already Exists" });
  }

  const newUser = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      config.PASS_SECRET_CRYPTOJS
    ).toString(),
    isAdmin: req.body.isAdmin || false,
    isStaff: req.body.isStaff || false,
    img: req.body.img,
  });

  try {
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);

    console.log(savedUser);
  } catch (error) {}
});

//Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(401).json("Wrong Credentials!!!");

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      config.PASS_SECRET_CRYPTOJS
    );
    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    originalPassword !== req.body.password &&
      res.status(401).json("Wrong Credentials");

    // console.log(`id: ${user.id}`);
    // console.log(`_id: ${user._id}`);

    //Access Token
    const accessToken = jwt.sign(
      {
        id: user?.id,
        isStaff: user?.isStaff,
        isAdmin: user?.isAdmin,
        isUser: user?.isUser,
      },
      config.JWT_SECRET_KEY,
      { expiresIn: "15s" }
    );

    //Refresh Token
    const refreshToken = jwt.sign(
      {
        id: user?.id,
        isStaff: user?.isStaff,
        isAdmin: user?.isAdmin,
        sUser: user?.isUser,
      },
      config.JWT_RFR_SECRET_KEY,
      { expiresIn: "15s" }
    );

    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, accessToken, refreshToken });
  } catch (err) {}
});

//Logout Route
router.post("/logout", (req, res) => {
  let user = req.body;
  // console.log(user);
  // console.log("You logged out successfully");
  res.status(200).json("You logged out successfully");
});

module.exports = router;
