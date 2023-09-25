
const { response, request } = require('express')
const jwt = require('jsonwebtoken');
const { User } = require('../models');

validateJWT = async(req = request, res = response, next) => {

  const bearerToken = req.headers.authorization

  if (!(bearerToken && bearerToken.startsWith('Bearer '))) {
    return res.status(401).json({
      msg: 'Unauthorize'
    });
  }

  const token = bearerToken.split(' ')[1];

  try {

    const { uid } = jwt.verify(token, process.env.SECRETORPUBLICKEY);

    // leer el usuario que corresponde al uid

    user = await User.findById(uid)

    if(!user) {
      return res.status(401).json({
        msg: 'Token no válido - usuario no existe DB'
      })
    }

    // Verificar si el usuario esta inactivo

    if(!user.status) {
      return res.status(401).json({
        msg: 'Token no válido - usuario con estado: false'
      })
    }

    req.user = user
    
    next()
  } catch (error) {
    console.log(error)
    res.status(401).json({
      msg: 'Invalid JWT'
    });
  }

  

}

module.exports = {
  validateJWT
}
