const { response } = require("express")

const isAdminRole = (req, res = response, next) => {

  if( !req.user ) {
    return res.status(500).json({
      msg: 'User not validated'
    })
  }

  const { role, name } = req.user

  if(role !== 'ADMIN_ROLE') {
    return res.status(401).json({
      msg: `${ name } is not Admin`
    })
  }

  next()
}

const hasRole = (...roles) => (req, res, next) => {

  if( !req.user ) {
    return res.status(500).json({
      msg: 'User not validated'
    })
  }

  const {role} = req.user 
  
  if( !roles.includes(role) ) {
    return res.status(401).json({
      msg: 'Role Not Valid'
    })
  }

  next()
}

module.exports = {
  isAdminRole,
  hasRole
}