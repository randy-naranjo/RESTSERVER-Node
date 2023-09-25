const { Schema, model } = require('mongoose')

const product = Schema({
  name:  {
    type: String,
    required: [true, "Name Required"],
    unique: true
  },
  status: {
    type: Boolean,
    default: true,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  description: {
    type: String,
  },
  stock: {
    type: Boolean,
    default: true,
  },
  img: {
    type: String
  },
});

product.methods.toJSON = function() {
  const { __v, _id, ...product } = this.toObject();

  return product
}

module.exports = model( 'Product', product )