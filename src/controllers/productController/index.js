const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { google } = require('googleapis');
const productService = require("../../services/product");
const apikeys = require('../../../apikey.json');
const SCOPE = ["https://www.googleapis.com/auth/drive"];

async function authorize() {
    const jwtClient = new google.auth.JWT(
        apikeys.client_email,
        null,
        apikeys.private_key,
        SCOPE
    );
    await jwtClient.authorize();
    return jwtClient;
}

async function uploadFile(authClient, filePath, fileName) {
    return new Promise((resolve, reject) => {
        const drive = google.drive({ version: "v3", auth: authClient });

        const fileMetaData = {
            name: fileName,
            parents: ["1iNuIxfGmHbqaUwiq8hXe3b8oEQxCUEGv"]
        };

        const media = {
            mimeType: 'image/png',
            body: fs.createReadStream(filePath),
        };

        drive.files.create({
            resource: fileMetaData,
            media: media,
            fields: 'id'
        }, (err, file) => {
            if (err) {
                return reject(err);
            }
            resolve(file);
        });
    });
}

const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, categories, image } = req.body;

        const uuid = uuidv4();

        const matches = image.match(/^data:(image\/\w+);base64,/);
        if (!matches) {
            throw new Error('Invalid image format');
        }
        const mimeType = matches[1];
        const extension = mimeType.split('/')[1];
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

        const buffer = Buffer.from(base64Data, 'base64');

        const tempFilePath = path.join(__dirname, `../../../uploads/${uuid}.${extension}`);

        fs.writeFileSync(tempFilePath, buffer);

        const authClient = await authorize();
        const file = await uploadFile(authClient, tempFilePath, `${uuid}.${extension}`);

        fs.unlinkSync(tempFilePath);

        const product = await productService.createProduct({
            name,
            description,
            price,
            stock,
            categories: categories || [],
            image: {
                uuid: uuid,
                link: `https://docs.google.com/uc?id=${file.data.id}`
            }
        });

        res.status(201).json(product);
    } catch (error) {
        console.error("Error creating product:", error.message);
        res.status(500).json({
            error: "An error occurred while creating the product.",
        });
    }
};
  

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
