const { response } = require("express");
const { Category } = require("../models");


const createCategory = async(req, res = response) => {

  let name = req.body.name.toUpperCase();

  const categoryDB = await Category.findOne({name})

  if(categoryDB) {
    return res.status(400).json({
      msg: `La categoria ${name} ya existe`
    })
  }

  // Generar la data a guardar

  const data = {
    name,
    user: req.user._id
  }

  const newCategory = new Category( data )

  await newCategory.save();

  res.status(201).json(newCategory);

}

const getCategories = async(req, res) => {
  
  const { limit = 5, from = 0 } = req.query;

  const query = {status: true}

  const categoriesPromise = Category.find(query)
                          .populate('user','name')
                          .skip(Number(from))
                          .limit(Number(limit));

  const totalPromise = Category.countDocuments(query);
  
  const [categories, total] = await Promise.all([
    categoriesPromise,
    totalPromise
  ])

  res.json({
    total,
    categories
  });

}

const getCategoryById = async(req, res) => {

  const { id } = req.params

  const category = await Category.findById(id).populate('user','name')

  res.json(category)

}

const updateCategory = async(req, res) => {

  const { status, user, ...body } = req.body
  const { id } = req.params

  body.name = body.name.toUpperCase()

  const data = {
    ...body,
    user: req.user._id,
  }

  const category = await Category.findByIdAndUpdate(id, data, {new: true}).populate('user','name')

  res.json(category)

}

const deleteCategory = async(req, res) => {

  const { id } = req.params

  try {
    
    const category = await Category.findByIdAndUpdate(id, {status: false}, {new: true}).populate('user','name')

    res.json(category)

  } catch (error) {
    console.log(error)
    res.status(400).json({
      msg: `Category with id ${ id } could not be deleted`
    })
  }
  
}

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
}