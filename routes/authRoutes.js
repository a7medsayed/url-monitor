const {
  Router
} = require("express");
const authController = require("../controllers/authController");
const router = Router();
const {
  check,
  validationResult
} = require("express-validator");
const userServices = require("../services/userService");
const {
  verifyEmail
} = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 * name: Authentication
 * description: this for authenticat user
 * /signup:
 *   post:
 *        tags: [Authentication]
 *        requestBody:
 *                 required: true
 *                 content:
 *                      application/json:
 *                           schema:
 *                              type: object
 *                              properties:
 *                                  email:
 *                                     type: string
 *                                  password:
 *                                     type: string
 *
 *
 */
router.post(
  "/signup",
  check("email")
  .notEmpty()
  .withMessage("email cannot be null")
  .bail()
  .isEmail()
  .withMessage("email is not valid")
  .bail()
  .custom(async (email) => {
    const user1 = await userServices.findByEmail(email);
    if (user1) {
      throw new Error("e-mail in use");
    }
  }),
  check("password")
  .notEmpty()
  .withMessage("password cannot be null")
  .bail()
  .isLength({
    min: 6,
  })
  .withMessage("password must be atleast 6 character"),

  authController.signup_post
);

router.post("/login", verifyEmail, authController.login_post);

router.get("/verify-email", authController.verifyEmail);

module.exports = router;