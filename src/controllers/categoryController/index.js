const categoryService = require("../../services/category");

const getCategories = async (req, res) => {
  const categories = await categoryService.getAllCategories();
  res.json(categories);
}

const createCategory = async (req, res) => {
  const { name, description } = req.body;
  const category = await categoryService.createCategory({ name, description });
  res.json(category);
}

const updateCategory = async (req, res) => {
  const { id, name, description } = req.body;
  const category = await categoryService.updateCategory({ id, name, description })
  res.json(category);
}

const deleteCategory = async (req, res) => {
  const { id } = req.body;
  const category = await categoryService.deleteCategory({ id });
  res.json(category ? true : false);
}

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
}