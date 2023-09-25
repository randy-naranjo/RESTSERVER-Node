const { Router } = require("express");
const { check } = require("express-validator");

const {
  usersGet,
  usersPut,
  usersPost,
  usersDelete,
} = require("../controllers/user.controllers");
const { isValidRole, emailTaken, checkIfEntityExistsById } = require("../helpers/db-validators");

const {
  validateFields,
  hasRole,
  validateJWT
} = require('../middlewares');
const { User } = require("../models");

const userExistById = checkIfEntityExistsById(User)

const router = Router();

router.get("/", usersGet);

router.put("/:id",[
  check('id', 'Id Not Valid').isMongoId(),
  check('id').custom( userExistById ),
  check('role').custom( isValidRole ),
  validateFields
], usersPut);

router.post("/", [
  check('name', 'Name is required').not().isEmpty(),
  check('password', 'Password is required and must have at least 6 characters').isLength({min: 6}),
  check('email', 'Email not valid').isEmail(),
  check('email').custom( emailTaken ),
  check('role').custom( isValidRole ),
  validateFields
],usersPost);

router.delete("/:id",[
  validateJWT,
  // isAdminRole,
  hasRole('ADMIN_ROLE','SELLER_ROLE'),
  check('id', 'Id Not Valid').isMongoId(),
  check('id').custom( userExistById ),
  validateFields
],usersDelete);

module.exports = router;
