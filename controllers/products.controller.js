const { Product } = require("../models");

const getProducts = async (req, res) => {
  const { limit = 5, from = 0 } = req.query;

  const query = { status: true };

  const productsPromise = Product.find(query)
    .populate("user", "name")
    .populate("category", "name")
    .skip(Number(from))
    .limit(Number(limit));

  const totalPromise = Product.countDocuments(query);

  const [products, total] = await Promise.all([productsPromise, totalPromise]);

  res.json({
    total,
    products,
  });
};

const getProductById = async (req, res) => {
  const { id } = req.params;

  const category = await Product.findById(id)
    .populate("user", "name")
    .populate("category", "name");

  res.json(category);
};

const createProduct = async (req, res) => {
  const { user, status, ...body } = req.body;

  body.name = body.name.toUpperCase();

  const productDB = await Product.findOne({ name: body.name });

  if (productDB) {
    return res.status(400).json({
      msg: `Product ${productDB.name} already exists`,
    });
  }

  // Generar la data a guardar

  const data = {
    ...body,
    user: req.user._id,
  };

  let newProduct = new Product(data);

  await newProduct.save();

  res.status(201).json(newProduct);
};

const updateProduct = async (req, res) => {
  const { status, user, ...body } = req.body;
  const { id } = req.params;

  body.name = body.name?.toUpperCase();

  const data = {
    ...body,
    user: req.user._id,
  };

  const productUpdated = await Product.findByIdAndUpdate(id, data, {
    new: true,
  })
    .populate("user", "name")
    .populate("category", "name");

  res.json(productUpdated);
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    );

    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Something get wrong",
    });
  }
};

module.exports = {
  getProductById,
  getProducts,
  updateProduct,
  createProduct,
  deleteProduct,
};
