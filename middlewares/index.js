const validateFields = require("./validate-fields");
const validateJWT = require("./validate-jwt");
const hasRole = require("./validate-roles");

module.exports = {
  ...validateFields,
  ...validateJWT,
  ...hasRole
}