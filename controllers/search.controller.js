const { response } = require("express")
const { allowedSearchCollections } = require("../constants/collection.constants")
const { ObjectId } = require("mongoose").Types

const { User, Category, Product } = require('../models')

const searchUsers =  async(query = '', res = response) => {

  const isMongoId = ObjectId.isValid( query )

  if( isMongoId ) {
    const user = await User.findById(query);
    return res.json({
      results: ( user ) ? [ user ] : []
    })
  }

  const regex = new RegExp( query, 'i' );

  const users = await User.find({
    $or: [{ name: regex },{email: regex}],
    $and: [{status: true}]
  })

  res.json({
    results: users
  })

}

const searchCategories = async(query = '',  res = response) => {
  const isMongoId = ObjectId.isValid( query )

  if( isMongoId ) {
    const product = await Product.findById(query);
    return res.json({
      results: ( product ) ? [ product ] : []
    })
  }

  const regex = new RegExp( query, 'i' );

  const products = await Product.find({name: query, status: true})

  res.json({
    results: products
  })
}


const search = (req, res = response) => {
 
  const { collection, query } = req.params

  if(!allowedSearchCollections.includes(collection)) {
    return res.status(400).json({
      msg: `Collection ${collection} not allowed`
    })
  }

  switch(collection){
    case 'users':
      searchUsers( query, res )
    break;
    case 'categories':
    
    break;
    case 'products':
    
    break;

    default: 
      res.status(500).json({
        msg: 'Search category not implemented'
      })


  }

}

module.exports = {
  search
}