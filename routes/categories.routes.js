const { Router } = require("express");
const { check } = require("express-validator");
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories.controller");
const { checkIfEntityExistsById } = require("../helpers/db-validators");

const { validateFields, validateJWT, hasRole } = require("../middlewares");
const { Category } = require("../models");

const categoryExistsById = checkIfEntityExistsById(Category);

const router = Router();

// Obtener todas las categorias
router.get("/", getCategories);

// Obtener una categoría por id - publico
router.get(
  "/:id",
  [
    check("id", "Id not valid").isMongoId(),
    check("id").custom(categoryExistsById),
    validateFields],
  getCategoryById
);

// Crear categoria - privado - cualquier persona con un token váldo
router.post(
  "/",
  [validateJWT, check("name", "Name Required").not().isEmpty(), validateFields],
  createCategory
);

// Actualizar - privado - cualquiera con un token válido
router.put(
  "/:id",
  [
    validateJWT,
    hasRole("ADMIN_ROLE"),
    check("id").custom(categoryExistsById),
    check("name", "New name required").not().isEmpty(),
    validateFields,
  ],
  updateCategory
);

// Borrar una categoría - privado
router.delete(
  "/:id",
  [
    validateJWT,
    hasRole("ADMIN_ROLE"),
    check("id", "Id not valid").isMongoId(),
    check("id").custom(categoryExistsById),
    validateFields,
  ],
  deleteCategory
);

module.exports = router;
