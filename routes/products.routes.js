const { Router } = require("express");
const { check } = require("express-validator");
const {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/products.controller");
const { checkIfEntityExistsById } = require("../helpers/db-validators");
const { validateFields, validateJWT, isAdminRole } = require("../middlewares");
const { Product, Category } = require("../models");

// Middlewares

const productValidators = {
  isMongoId: (param) => check(`${param}`, `Id not valid`).isMongoId(),
  productExists: check("id").custom(checkIfEntityExistsById(Product)),
  categoryExists: check("category").custom(checkIfEntityExistsById(Category)),
  paramRequired: (param) =>
    check(`${param}`, `${param} is required`).not().isEmpty(),
  isFloatPositive: (param) =>
    check(
      `${param}`,
      `${param} must be a numeric value and can not be negative`
    )
      .optional()
      .isFloat({ min: 0 }),
  isBoolean: (param) =>
    check(`${param}`, `${param} must be a boolean value`)
      .isBoolean(),
};

const router = Router();

router.get("/", getProducts);

router.get(
  "/:id",
  [
    productValidators.isMongoId("id"),
    productValidators.productExists,
    validateFields,
  ],
  getProductById
);

router.post(
  "/",
  [
    validateJWT,
    productValidators.isMongoId("category"),
    productValidators.categoryExists,
    productValidators.paramRequired("name"),
    productValidators.isFloatPositive("price"),
    productValidators.isBoolean("stock").optional(),
    validateFields,
  ],
  createProduct
);

router.put(
  "/:id",
  [
    validateJWT,
    productValidators.isMongoId("id"),
    productValidators.productExists,
    productValidators.isMongoId("category").optional(),
    productValidators.categoryExists.optional(),
    productValidators.isFloatPositive("price"),
    productValidators.isBoolean("stock").optional(),
    validateFields,
  ],
  updateProduct
);

router.delete(
  "/:id",
  [
    validateJWT,
    isAdminRole,
    productValidators.isMongoId("id"),
    productValidators.productExists,
    validateFields,
  ],
  deleteProduct
);

module.exports = router;
