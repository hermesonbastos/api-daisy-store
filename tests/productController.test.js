const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const { v4: uuidv4 } = require('uuid');
const productService = require('../src/services/product/index.js');
const {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../src/controllers/productController/index.js');

jest.mock('fs');
jest.mock('path');
jest.mock('googleapis');
jest.mock('uuid', () => ({ v4: jest.fn() }));
jest.mock('../src/services/product/index.js');

describe('Product Controller', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {}, params: {} };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createProduct', () => {
        test('should create a product successfully', async () => {
            const mockProduct = { id: 1, name: 'Product 1' };
            const mockFile = { data: { id: 'fileId' } };
            const mockUuid = 'uuid';
            const mockImage = 'data:image/png;base64,base64data';
            const mockBuffer = Buffer.from('base64data', 'base64');
            const mockFilePath = '/temp/uuid.png';

            req.body = {
                name: 'Product 1',
                description: 'Description 1',
                price: 100,
                stock: 10,
                categories: [],
                image: mockImage,
            };

            uuidv4.mockReturnValue(mockUuid);
            fs.writeFileSync.mockImplementation(() => {});
            fs.unlinkSync.mockImplementation(() => {});
            google.auth.JWT.mockImplementation(() => ({
                authorize: jest.fn().mockResolvedValue(),
            }));
            google.drive.mockImplementation(() => ({
                files: {
                    create: jest.fn((_, callback) => callback(null, mockFile)),
                },
            }));
            productService.createProduct.mockResolvedValue(mockProduct);

            await createProduct(req, res);

            expect(fs.writeFileSync).toHaveBeenCalledWith(mockFilePath, mockBuffer);
            expect(fs.unlinkSync).toHaveBeenCalledWith(mockFilePath);
            expect(productService.createProduct).toHaveBeenCalledWith({
                name: 'Product 1',
                description: 'Description 1',
                price: 100,
                stock: 10,
                categories: [],
                image: {
                    uuid: mockUuid,
                    link: `https://docs.google.com/uc?id=${mockFile.data.id}`,
                },
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockProduct);
        });

        test('should handle invalid image format', async () => {
            req.body = { image: 'invalidImage' };

            await createProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'An error occurred while creating the product.',
            });
        });

        test('should handle error during file write', async () => {
            const mockError = new Error('File write error');
            req.body = { image: 'data:image/png;base64,base64data' };

            fs.writeFileSync.mockImplementation(() => {
                throw mockError;
            });

            await createProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'An error occurred while creating the product.',
            });
        });

        test('should handle error during file upload', async () => {
            const mockError = new Error('File upload error');
            req.body = { image: 'data:image/png;base64,base64data' };

            google.auth.JWT.mockImplementation(() => ({
                authorize: jest.fn().mockResolvedValue(),
            }));
            google.drive.mockImplementation(() => ({
                files: {
                    create: jest.fn((_, callback) => callback(mockError)),
                },
            }));

            await createProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'An error occurred while creating the product.',
            });
        });

        test('should handle error during product creation', async () => {
            const mockError = new Error('Product creation error');
            req.body = { image: 'data:image/png;base64,base64data' };

            productService.createProduct.mockRejectedValue(mockError);

            await createProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'An error occurred while creating the product.',
            });
        });
    });

    describe('getProducts', () => {
        test('should return all products successfully', async () => {
            const mockProducts = [{ id: 1, name: 'Product 1' }];
            productService.getAllProducts.mockResolvedValue(mockProducts);

            await getProducts(req, res);

            expect(productService.getAllProducts).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(mockProducts);
        });

        test('should handle errors when retrieving products', async () => {
            const mockError = new Error('Database error');
            productService.getAllProducts.mockRejectedValue(mockError);

            await getProducts(req, res);

            expect(productService.getAllProducts).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'An error occurred while retrieving products.',
            });
        });
    });

    describe('updateProduct', () => {
        test('should update a product successfully', async () => {
            const mockProduct = { id: 1, name: 'Updated Product' };
            req.params.id = 1;
            req.body = { name: 'Updated Product', description: 'Updated Description' };
            productService.updateProduct.mockResolvedValue(mockProduct);

            await updateProduct(req, res);

            expect(productService.updateProduct).toHaveBeenCalledWith({
                id: req.params.id,
                name: req.body.name,
                description: req.body.description,
                price: undefined,
                stock: undefined,
                categories: [],
            });
            expect(res.json).toHaveBeenCalledWith(mockProduct);
        });

        test('should handle not found error when updating a product', async () => {
            const mockError = new Error('Product not found');
            req.params.id = 1;
            req.body = { name: 'Updated Product', description: 'Updated Description' };
            productService.updateProduct.mockRejectedValue(mockError);

            await updateProduct(req, res);

            expect(productService.updateProduct).toHaveBeenCalledWith({
                id: req.params.id,
                name: req.body.name,
                description: req.body.description,
                price: undefined,
                stock: undefined,
                categories: [],
            });
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Product not found.' });
        });

        test('should handle errors when updating a product', async () => {
            const mockError = new Error('Database error');
            req.params.id = 1;
            req.body = { name: 'Updated Product', description: 'Updated Description' };
            productService.updateProduct.mockRejectedValue(mockError);

            await updateProduct(req, res);

            expect(productService.updateProduct).toHaveBeenCalledWith({
                id: req.params.id,
                name: req.body.name,
                description: req.body.description,
                price: undefined,
                stock: undefined,
                categories: [],
            });
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'An error occurred while updating the product.',
            });
        });
    });

    describe('deleteProduct', () => {
        test('should delete a product successfully', async () => {
            req.params.id = 1;
            productService.deleteProduct.mockResolvedValue(true);

            await deleteProduct(req, res);

            expect(productService.deleteProduct).toHaveBeenCalledWith({ id: req.params.id });
            expect(res.json).toHaveBeenCalledWith(true);
        });

        test('should handle errors when deleting a product', async () => {
            const mockError = new Error('Database error');
            req.params.id = 1;
            productService.deleteProduct.mockRejectedValue(mockError);

            await deleteProduct(req, res);

            expect(productService.deleteProduct).toHaveBeenCalledWith({ id: req.params.id });
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'An error occurred while deleting the product.',
            });
        });
    });
});