const {
  validationResult
} = require("express-validator");

const userService = require("../services/userService");
const {
  sendEmailActivation
} = require("../services/emailService");

const authService = require("../services/authService");


module.exports.verifyEmail = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const validationErrors = {};
    errors.array().forEach((err) => {
      validationErrors[err.param] = err.msg;
    });
    return res.status(400).send({
      validationErrors: validationErrors,
    });
  }
  try {
    const token = req.query.token;
    const user = await userService.findByToken(token);
    if (user) {
      user.emailToken = null;
      user.isVerified = true;
      await userService.updateUser(user);

      res.status(200).send({
        message: "Email Confirmed",
      });
    } else {
      res.status(404).send({
        message: "User Not found Or Email already confirmed",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports.signup_post = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const validationErrors = {};
    errors.array().forEach((err) => {
      validationErrors[err.param] = err.msg;
    });
    return res.status(400).send({
      validationErrors: validationErrors,
    });
  }

  const user = await userService.saveUser(req.body);
  await sendEmailActivation(user.email, user.emailToken, req.headers.host)
    .then(() => {
      res.status(200).send({
        message: "Please Confirm Your Email",
      });
    })
    .catch(() => {
      res.status(500).send({
        message: "Error in sending Email",
      });
    });
};

module.exports.login_post = async (req, res) => {
  try {
    const user = await userService.login(req.body);
    const token = authService.createToken(user._id);
    res.status(200).json({
      ...user,
      token,
    });
  } catch (err) {
    if (err.message == "incorrect email") {
      return res.status(400).send({
        validationErrors: {
          email: err.message,
        },
      });
    } else if (err.message == "incorrect password") {
      return res.status(400).send({
        validationErrors: {
          password: err.message,
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