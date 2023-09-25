const { User, Product } = require("../models");

const allowedSearchCollections = ["users", "categories", "products", "roles"];

allowedFilesCollections = [
  {
    collection: "users",
    model: User,
  },
  {
    collection: "products",
    model: Product,
  },
];

module.exports = {
  allowedSearchCollections,
  allowedFilesCollections,
};
