const validateFields = require("./validate-fields");
const validateJWT = require("./validate-jwt");
const hasRole = require("./validate-roles");
const validateFile = require("./validate-file")
const validateCollectionAndEntity = require('./validate-collection-and-entity')

module.exports = {
  ...validateFields,
  ...validateJWT,
  ...hasRole,
  ...validateFile,
  ...validateCollectionAndEntity,
}