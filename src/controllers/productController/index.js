const { v4: uuidv4 } = require('uuid');
const productService = require("../../services/product");
const fs = require('fs');
const admin = require('firebase-admin');
const { promisify } = require('util');
const path = require('path');
const os = require('os');

const serviceAccount = require("../../utils/daisy-store-12555-firebase-adminsdk-pa804-f011e7615e.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "daisy-store-12555.appspot.com",
});

const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, categories } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'Nenhuma imagem enviada.' });
    }

    const uuid = uuidv4();
    const bucket = admin.storage().bucket();
    const filePath = `${uuid}-${file.originalname}`;
    
    try {
      const tempFilePath = path.join(os.tmpdir(), filePath);

      await promisify(fs.writeFile)(tempFilePath, file.buffer);

      await bucket.upload(tempFilePath, {
        destination: filePath,
        metadata: {
          contentType: file.mimetype,
        },
      });

      const [metadata] = await bucket.file(filePath).getMetadata();
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${metadata.bucket}/o/${encodeURIComponent(filePath)}?alt=media`;

      await promisify(fs.unlink)(tempFilePath);

      const parsedCategories = Array.isArray(categories) ? categories : JSON.parse(categories || '[]');

      const product = await productService.createProduct({
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        categories: parsedCategories,
        image: {
          uuid: uuid,
          link: imageUrl,
        },
      });

      res.status(201).json(product);
    } catch (uploadError) {
      console.error("Error uploading image:", uploadError.message);
      return res.status(500).json({
        error: "Ocorreu um erro ao fazer o upload da imagem.",
      });
    }
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
    const file = req.file;

    const existingProduct = await productService.detailProduct(id);
    
    if (!existingProduct) {
      return res.status(404).json({ message: "Produto não encontrado." });
    }

    let updatedFields = {
      id,
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      categories: categories ? JSON.parse(categories) : [],
    };

    if (file) {
      const uuid = uuidv4();
      const bucket = admin.storage().bucket();
      const filePath = `${uuid}-${file.originalname}`;

      if (existingProduct.images && existingProduct.images.length > 0) {
        const oldImage = existingProduct.images[0].image; 
        if (oldImage && oldImage.link) {
          const oldFileName = decodeURIComponent(oldImage.link.split("/o/")[1].split("?")[0]);

          await bucket.file(oldFileName).delete();
          console.log("Imagem antiga excluída:", oldFileName);
        }
      }

      try {
        const tempFilePath = path.join(os.tmpdir(), filePath);

        await promisify(fs.writeFile)(tempFilePath, file.buffer);

        await bucket.upload(tempFilePath, {
          destination: filePath,
          metadata: {
            contentType: file.mimetype,
          },
        });

        const [metadata] = await bucket.file(filePath).getMetadata();
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${metadata.bucket}/o/${encodeURIComponent(filePath)}?alt=media`;

        await promisify(fs.unlink)(tempFilePath);

        updatedFields.image = {
          uuid: uuid,
          link: imageUrl,
        };

      } catch (uploadError) {
        console.error("Erro ao fazer o upload da nova imagem:", uploadError.message);
        return res.status(500).json({
          error: "Ocorreu um erro ao fazer o upload da imagem.",
        });
      }
    }

    const updatedProduct = await productService.updateProduct(updatedFields);

    res.json(updatedProduct);
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

const detailProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productService.detailProduct(id);

    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado." });
    }

    res.json(product);
  } catch (error) {
    console.error("Erro ao obter o produto:", error.message);
    res.status(500).json({ error: "Ocorreu um erro ao obter o produto." });
  }
};

const updateProductStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    if (stock === undefined) {
      return res.status(400).json({ message: 'O parâmetro "stock" é obrigatório.' });
    }

    const updatedProduct = await productService.updateProductStock(id, stock);

    res.json(updatedProduct);
  } catch (error) {
    console.error("Erro ao atualizar o estoque do produto:", error.message);
    res.status(500).json({
      error: "Ocorreu um erro ao atualizar o estoque do produto.",
    });
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
    detailProduct,
    deleteProduct,
    updateProductStock
};
