const Role = require('../models/role')
const User = require('../models/user')

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

const userExistsById = async(id) => {
  const userExist = await User.findById(id);
  if( !userExist ) {
    throw new Error(`User with id ${id} not founded`)
  }
}

module.exports = {
  isValidRole,
  emailTaken,
  userExistsById,
}