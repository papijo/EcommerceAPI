const jwt = require("jsonwebtoken");
const config = require("./config");
let id;

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  console.log(authHeader);
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, config.JWT_SECRET_KEY, (err, user) => {
      console.log("err", err);
      if (err) res.status(403).json("Token is InValid!!!!");
      else {
        console.log("user", user);
        req.user = user;
        id = user?.id;
        next();
      }
    });
  } else {
    return res.status(401).json("You are not Authenticated");
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req?.user.id === req?.headers?.id || req?.user?.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not authorised: Authentication Level");
    }
  });
};

const verifyTokenAndStaff = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user?.isStaff || req.user?.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not authorised: Staff Level");
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user?.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not authorised: Admin Level");
    }
  });
};

module.exports = {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyTokenAndStaff,
};
