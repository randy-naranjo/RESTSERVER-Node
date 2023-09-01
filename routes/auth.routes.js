const { Router } = require("express");
const { check } = require("express-validator");
const { login } = require("../controllers/auth.controller");

const { validateFields } = require("../middlewares/validate-fields");

const router = Router();

router.post('/login',[
  check('email', 'Email Required').isEmail(),
  check('password', 'Password required').not().isEmpty(),
  validateFields
],login);

module.exports = router