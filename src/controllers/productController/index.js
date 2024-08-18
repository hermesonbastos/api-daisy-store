const productService = require("../../services/product");

const getProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.json(products);
    } catch (error) {
        console.error("Error getting products:", error.message);
        res.status(500).json({
            error: "An error occurred while retrieving products.",
        });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, categories } = req.body;
        const product = await productService.createProduct({
            name,
            description,
            price,
            stock,
            categories: categories || [],
        });
        res.status(201).json(product);
    } catch (error) {
        console.error("Error creating product:", error.message);
        res.status(500).json({
            error: "An error occurred while creating the product.",
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock, categories } = req.body;
        const product = await productService.updateProduct({
            id,
            name,
            description,
            price,
            stock,
            categories: categories || [],
        });
        res.json(product);
    } catch (error) {
        console.error("Error updating product:", error.message);
        if (error.message.includes("not found")) {
            res.status(404).json({ error: "Product not found." });
        } else {
            res.status(500).json({
                error: "An error occurred while updating the product.",
            });
        }
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productService.deleteProduct({ id });
        res.json(product ? true : false);
    } catch (error) {
        console.error("Error deleting product:", error.message);
        res.status(500).json({
            error: "An error occurred while deleting the product.",
        });
    }
};

module.exports = {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
};
