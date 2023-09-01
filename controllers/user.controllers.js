const { response, request } = require("express");
const bcryptjs = require('bcryptjs');

const User = require('../models/user');

const usersGet = async(req, res) => {

  const { limit = 5, from = 0 } = req.query;

  const query = {status: true}

  // const users = await User.find(query)
  //                         .skip(Number(from))
  //                         .limit(Number(limit));

  // const total = await User.countDocuments(query);

  const usersPromise = User.find(query)
                          .skip(Number(from))
                          .limit(Number(limit));

  const totalPromise = User.countDocuments(query);
  
  const [users, total] = await Promise.all([
    usersPromise,
    totalPromise
  ])

  res.json({
    total,
    users
  });

};

/**
 * @param {request} req
 * @param {response} res
 */

const usersPost = async(req, res) => {

  const { name, email, password, role } = req.body;
  const user = new User({name, email, password, role})

  // Encriptar la contraseña
  const salt = bcryptjs.genSaltSync(10);
  user.password = bcryptjs.hashSync( password, salt )

  // Guardar DB
  
  await user.save()

  res.json(user);
};

/**
 * @param {request} req
 * @param {response} res
 */

const usersPut = async(req, res) => {
  const { id } = req.params;
  const { password, google, _id, email, ...body } = req.body

  // TODO validar contra base de datos

  if ( password ) {
    const salt = bcryptjs.genSaltSync(10);
    body.password = bcryptjs.hashSync( password, salt )
  }

  const user = await User.findByIdAndUpdate( id, body, {new: true} )

  res.json(user);
};

const usersDelete = async(req, res) => {
  const { id } = req.params

  const user = await User.findByIdAndUpdate(id, {status: false});

  res.json(user);
};

module.exports = {
  usersGet,
  usersPost,
  usersPut,
  usersDelete,
};
