const { response, json } = require("express");
const bcryptjs = require("bcryptjs");

const User = require("../models/user");
const { generateJWT } = require("../helpers/generateJWT");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    // Verificar si el email existe

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        msg: "email / password are wrong - email",
      });
    }

    // Verificar si el usuario está activo
    if (!user.status) {
      return res.status(400).json({
        msg: "email / password are wrong - status",
      });
    }

    // Verificar Contraseña
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "email / password are wrong - password",
      });
    }

    // Generar el JWT
    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Something get wrong",
    });
  }
};

googleSignIn = async (req, res = response) => {
  const { id_token } = req.body;

  try {

    const {name, picture, email} = await googleVerify(id_token)

    let user = await User.findOne({email});

    if(!user) {
      // create user

      const data = {
        name,
        email,
        password: ':p',
        img: picture,
        google: true,
        role: 'USER_ROLE'
      }
      
      user = new User( data )
      await user.save()
    }

    // Si el usuario en DB esta inactivo
    if (!user.status) {
      return res.status(401).json({
        msg: 'User Deactivated'
      })
    }

    const token = await generateJWT( user.id );


    res.json({
      user,
      token,
    });
  } catch (error) {
    res.status(400).json({
      msg: 'Token could not be verify'
    })
  }

  
};

module.exports = {
  login,
  googleSignIn,
};
