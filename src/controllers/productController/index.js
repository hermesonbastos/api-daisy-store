const { v4: uuidv4 } = require('uuid');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const { storage } = require('../../utils/firebase');
const productService = require("../../services/product");

const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, categories } = req.body;
        const file = req.file;  // Usar para o upload da imagem

        if (!file) {
            return res.status(400).json({ message: 'Nenhuma imagem enviada.' });
        }

        const uuid = uuidv4();  // Gerar um UUID único para a imagem

        // Criar uma referência ao Firebase Storage para o upload
        const storageRef = ref(storage, `images/${uuid}-${file.originalname}`);

        // Fazer o upload da imagem para o Firebase Storage
        await uploadBytes(storageRef, file.buffer, {
            contentType: file.mimetype,
        });

        // Obter a URL de download público da imagem
        const imageUrl = await getDownloadURL(storageRef);

        // Criar o produto no banco de dados, associando a imagem
        const product = await productService.createProduct({
            name,
            description,
            price,
            stock,
            categories: categories || [],
            image: {
                uuid: uuid,
                link: imageUrl,
            }
        });

        res.status(201).json(product);
    } catch (error) {
        console.error("Erro ao criar o produto:", error.message);
        res.status(500).json({
            error: "Ocorreu um erro ao criar o produto.",
        });
    }
};

const getProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.json(products);
    } catch (error) {
        console.error("Erro ao obter produtos:", error.message);
        res.status(500).json({
            error: "Ocorreu um erro ao obter os produtos.",
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
        console.error("Erro ao atualizar o produto:", error.message);
        if (error.message.includes("not found")) {
            res.status(404).json({ error: "Produto não encontrado." });
        } else {
            res.status(500).json({
                error: "Ocorreu um erro ao atualizar o produto.",
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
        console.error("Erro ao excluir o produto:", error.message);
        res.status(500).json({
            error: "Ocorreu um erro ao excluir o produto.",
        });
    }
};

module.exports = {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
};
