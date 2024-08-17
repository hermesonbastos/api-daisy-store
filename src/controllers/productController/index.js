const productService = require("../../services/product");

const getProducts = async (req, res) => {
  const categories = await productService.getAllProducts();
  res.json(categories);
}

const createProduct = async (req, res) => {
  const { name, description } = req.body;
  const category = await productService.createProduct({ name, description, price, stock });
  res.json(category);
}

const updateProduct = async (req, res) => {
  const { name, description, price, stock } = req.body;
  const category = await productService.updateProduct({ name, description, price, stock })
  res.json(category);
}

const deleteProduct = async (req, res) => {
  const { id } = req.body;
  const category = await productService.deleteProduct({ id });
  res.json(category ? true : false);
}

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
}