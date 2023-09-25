const { Model } = require("mongoose")
const { User, Role } = require("../models")
const { CustomValidator } = require('express-validator')

const isValidRole = async(role = '') => {
  const roleExists = await Role.findOne({ role })
  if(!roleExists) {
    throw new Error(`Role ${role} not valid`)
  }
}

const emailTaken = async(email) => {
  const emailExists = await User.findOne({ email });
  if( emailExists ) {
    throw new Error(`Email ${email} has been taken`)
  }
}

/**
 * 
 * @param {Model} Model 
 * @returns {CustomValidator}
 */

const checkIfEntityExistsById = (Model) => async(id) => {
  if(!Model) {
    throw new Error(`Model not valid`)
  }
  const entity = await Model.findById(id);
  if( !entity ) {
    throw new Error(`${Model.modelName} with id ${id} not founded`)
  }
}

module.exports = {
  isValidRole,
  emailTaken,
  checkIfEntityExistsById,
}