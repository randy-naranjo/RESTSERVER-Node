const { Router } = require("express");
const { check } = require("express-validator");
const { uploadFile, updateImageCloudinary, getImage } = require("../controllers/uploads.controller");
const { validateFields, validateFile, collectionAndEntityExists } = require("../middlewares");

const router = new Router()

router.post( '/' ,[
  validateFile
], uploadFile )

router.put('/:collection/:id', [
  check('id','Id not Valid').isMongoId(),
  collectionAndEntityExists, // This middleware check if entity exists and save it into req.params
  validateFile,
  validateFields
] , updateImageCloudinary)

router.get('/:collection/:id', [
  check('id','Id not Valid').isMongoId(),
  collectionAndEntityExists, // This middleware check if entity exists and save it into req.params
  validateFields
] , getImage)



module.exports = router
