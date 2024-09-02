const categoryService = require('../src/services/category/index.js');
const {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} = require('../src/controllers/categoryController/index.js');

jest.mock('../src/services/category/index.js');

describe('Category Controller', () => {
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

    describe('getCategories', () => {
        test('should return all categories successfully', async () => {
            const mockCategories = [
                { id: 1, name: 'Category 1', description: 'Description 1' },
                { id: 2, name: 'Category 2', description: 'Description 2' },
            ];
            categoryService.getAllCategories.mockResolvedValue(mockCategories);

            await getCategories(req, res);

            expect(categoryService.getAllCategories).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(mockCategories);
        });

        test('should handle errors when retrieving categories', async () => {
            const mockError = new Error('Database error');
            categoryService.getAllCategories.mockRejectedValue(mockError);

            await getCategories(req, res);

            expect(categoryService.getAllCategories).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'An error occurred while retrieving categories.',
            });
        });
    });

    describe('createCategory', () => {
        test('should create a category successfully', async () => {
            const mockCategory = { id: 1, name: 'Category 1', description: 'Description 1' };
            req.body = { name: 'Category 1', description: 'Description 1' };
            categoryService.createCategory.mockResolvedValue(mockCategory);

            await createCategory(req, res);

            expect(categoryService.createCategory).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockCategory);
        });

        test('should handle errors when creating a category', async () => {
            const mockError = new Error('Database error');
            req.body = { name: 'Category 1', description: 'Description 1' };
            categoryService.createCategory.mockRejectedValue(mockError);

            await createCategory(req, res);

            expect(categoryService.createCategory).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'An error occurred while creating the category.',
            });
        });
    });

    describe('updateCategory', () => {
        test('should update a category successfully', async () => {
            const mockCategory = { id: 1, name: 'Updated Category', description: 'Updated Description' };
            req.params.id = 1;
            req.body = { name: 'Updated Category', description: 'Updated Description' };
            categoryService.updateCategory.mockResolvedValue(mockCategory);

            await updateCategory(req, res);

            expect(categoryService.updateCategory).toHaveBeenCalledWith({
                id: req.params.id,
                name: req.body.name,
                description: req.body.description,
            });
            expect(res.json).toHaveBeenCalledWith(mockCategory);
        });

        test('should handle not found error when updating a category', async () => {
            const mockError = new Error('Category not found');
            req.params.id = 1;
            req.body = { name: 'Updated Category', description: 'Updated Description' };
            categoryService.updateCategory.mockRejectedValue(mockError);

            await updateCategory(req, res);

            expect(categoryService.updateCategory).toHaveBeenCalledWith({
                id: req.params.id,
                name: req.body.name,
                description: req.body.description,
            });
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Category not found.' });
        });

        test('should handle errors when updating a category', async () => {
            const mockError = new Error('Database error');
            req.params.id = 1;
            req.body = { name: 'Updated Category', description: 'Updated Description' };
            categoryService.updateCategory.mockRejectedValue(mockError);

            await updateCategory(req, res);

            expect(categoryService.updateCategory).toHaveBeenCalledWith({
                id: req.params.id,
                name: req.body.name,
                description: req.body.description,
            });
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'An error occurred while updating the category.',
            });
        });
    });

    describe('deleteCategory', () => {
        test('should delete a category successfully', async () => {
            req.params.id = 1;
            categoryService.deleteCategory.mockResolvedValue(true);

            await deleteCategory(req, res);

            expect(categoryService.deleteCategory).toHaveBeenCalledWith({ id: req.params.id });
            expect(res.json).toHaveBeenCalledWith(true);
        });

        test('should handle errors when deleting a category', async () => {
            const mockError = new Error('Database error');
            req.params.id = 1;
            categoryService.deleteCategory.mockRejectedValue(mockError);

            await deleteCategory(req, res);

            expect(categoryService.deleteCategory).toHaveBeenCalledWith({ id: req.params.id });
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'An error occurred while deleting the category.',
            });
        });
    });
});