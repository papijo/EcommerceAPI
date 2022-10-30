const User = require("../models/User");
const config = require("../utils/config");
const jwt = require("jsonwebtoken");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndStaff,
  verifyTokenAndAdmin,
} = require("../utils/verifyToken");

const router = require("express").Router();

//Edit User
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      config.PASS_SECRET_CRYPTOJS
    ).toString();
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json(err);
  }
});

//Delete User
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been Deleted!!!");
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get User
router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get All Users
router.get("/", verifyTokenAndStaff, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5) //Query to show latest users. limit() method controls how many would be shown.
      : await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get User Stats
router.get("/stats", verifyTokenAndStaff, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Refresh token
router.post("/refresh", async (req, res) => {
  try {
    //Take refresh token from User
    // console.log(req.headers);
    const refreshAccessToken = req.headers.refreshtoken;
    const user = await User.findById(req.headers.id);

    //Send Error if no Token or Invalid Token
    if (!refreshAccessToken) {
      return res.status(401).json({ message: "You are not authenticated!!!!" });
    }

    // jwt.verify(refreshAccessToken, config.JWT_RFR_SECRET_KEY, (error, user) => {
    //   error && console.log(error);

    //Access Token
    const newAccessToken = jwt.sign(
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
    const newRefreshAccessToken = jwt.sign(
      {
        id: user?.id,
        isStaff: user?.isStaff,
        isAdmin: user?.isAdmin,
        isUser: user?.isUser,
      },
      config.JWT_RFR_SECRET_KEY,
      { expiresIn: "15s" }
    );

    //   // refreshTokens.push(newRefreshAccessToken);

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshAccessToken,
    });
  } catch (error) {
    const errorMessage = {
      error: error,
      location: "Refresh Token Route",
      time: new Date(),
    };
    console.error(errorMessage);
    res.status(500).json(error);
  }
});

module.exports = router;
