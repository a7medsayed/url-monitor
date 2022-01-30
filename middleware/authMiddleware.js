const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { findByEmail } = require("../services/userService");

const requireAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    const token = req.headers.authorization.split(" ")[1];
    if (token) {
      jwt.verify(token, "dont try", (err, decodedtoken) => {
        if (err) {
          res.status(403).send("authrization needed");
        } else {
          next();
        }
      });
    } else {
      res.status(403).send("authrization needed");
    }
  } else {
    res.status(403).send("authrization needed");
  }
};

const checkUser = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    const token = req.headers.authorization.split(" ")[1];

    if (token) {
      jwt.verify(token, "dont try", async (err, decodedtoken) => {
        if (err) {
          req["user"] = null;
          next();
        } else {
          const user = await User.findById(decodedtoken.id);
          req["user"] = user;

          next();
        }
      });
    } else {
      req["user"] = null;
      next();
    }
  } else {
    req["user"] = null;
    next();
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const user = await findByEmail(req.body.email);
    if (user.isVerified) {
      next();
    } else {
      res.status(400).send({
        message: "Please Check Your Email To Verify Your Email",
      });
    }
  } catch (err) {
    if (err.message == "incorrect email") {
      return res.status(400).send({
        validationErrors: {
          email: err.message,
        },
      });
    } else {
      return res.status(400).send({
        validationErrors: {
          errors: err.message,
        },
      });
    }
  }
};
module.exports = {
  requireAuth,
  checkUser,
  verifyEmail,
};
