const dbValidators = require('./db-validators')
const generateJWT = require('./generateJWT')
const uploadFiles = require('./upload-files')
const googleVerify = require('./google-verify')

module.exports = {
  ...dbValidators,
  ...generateJWT,
  ...googleVerify,
  ...uploadFiles
}