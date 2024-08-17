const categoryService = require("../../services/category");

const getCategories = async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.json(categories);
    } catch (error) {
        console.error("Error getting categories:", error.message);
        res.status(500).json({
            error: "An error occurred while retrieving categories.",
        });
    }
};

const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = await categoryService.createCategory({
            name,
            description,
        });
        res.status(201).json(category);
    } catch (error) {
        console.error("Error creating category:", error.message);
        res.status(500).json({
            error: "An error occurred while creating the category.",
        });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const category = await categoryService.updateCategory({
            id,
            name,
            description,
        });
        res.json(category);
    } catch (error) {
        console.error("Error updating category:", error.message);
        if (error.message.includes("not found")) {
            res.status(404).json({ error: "Category not found." });
        } else {
            res.status(500).json({
                error: "An error occurred while updating the category.",
            });
        }
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await categoryService.deleteCategory({ id });
        res.json(category ? true : false);
    } catch (error) {
        console.error("Error deleting category:", error.message);
        res.status(500).json({
            error: "An error occurred while deleting the category.",
        });
    }
};

module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
};
