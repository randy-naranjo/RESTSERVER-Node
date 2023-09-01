const { response, json } = require("express");
const bcryptjs = require('bcryptjs')

const User = require("../models/user");
const { generateJWT } = require("../helpers/generateJWT");

const login = async(req, res = response) => {

  const { email, password } = req.body;

  try {

    // Verificar si el email existe

    const user = await User.findOne({email})
    if( !user ) {
      return res.status(400).json({
        msg: 'email / password are wrong - email'
      })
    }

    // Verificar si el usuario está activo
    if(!user.status) {
      return res.status(400).json({
        msg: 'email / password are wrong - status'
      })
    }

    // Verificar Contraseña
    const validPassword = bcryptjs.compareSync(password, user.password)
    if ( !validPassword ) {
      return res.status(400).json({
        msg: 'email / password are wrong - password'
      })
    }

    // Generar el JWT
    const token = await generateJWT( user.id )

    res.json({
      user,
      token
    })
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      msg: 'Something get wrong'
    })
  }

}

module.exports = {
  login
}