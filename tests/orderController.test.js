const orderService = require('../src/services/order/index.js');
const {
    getOrders,
    createOrder,
    updateOrder,
    deleteOrder,
} = require('../src/controllers/orderController/index.js');

jest.mock('../src/services/order/index.js');

describe('Order Controller', () => {
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

    describe('getOrders', () => {
        test('should return all orders successfully', async () => {
            const mockOrders = [
                { id: 1, status: 'Pending', customer_name: 'John Doe' },
                { id: 2, status: 'Shipped', customer_name: 'Jane Doe' },
            ];
            orderService.getAllOrders.mockResolvedValue(mockOrders);

            await getOrders(req, res);

            expect(orderService.getAllOrders).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(mockOrders);
        });

        test('should handle errors when retrieving orders', async () => {
            const mockError = new Error('Database error');
            orderService.getAllOrders.mockRejectedValue(mockError);

            await getOrders(req, res);

            expect(orderService.getAllOrders).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'An error occurred while retrieving orders.',
            });
        });
    });

    describe('createOrder', () => {
        test('should create an order successfully', async () => {
            const mockOrder = { id: 1, status: 'Pending', customer_name: 'John Doe' };
            req.body = {
                status: 'Pending',
                customer_phone: '1234567890',
                customer_email: 'john@example.com',
                customer_name: 'John Doe',
                products: [],
            };
            orderService.createOrder.mockResolvedValue(mockOrder);

            await createOrder(req, res);

            expect(orderService.createOrder).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockOrder);
        });

        test('should handle errors when creating an order', async () => {
            const mockError = new Error('Database error');
            req.body = {
                status: 'Pending',
                customer_phone: '1234567890',
                customer_email: 'john@example.com',
                customer_name: 'John Doe',
                products: [],
            };
            orderService.createOrder.mockRejectedValue(mockError);

            await createOrder(req, res);

            expect(orderService.createOrder).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'An error occurred while creating the order.',
            });
        });
    });

    describe('updateOrder', () => {
        test('should update an order successfully', async () => {
            const mockOrder = { id: 1, status: 'Shipped', customer_name: 'John Doe' };
            req.params.id = 1;
            req.body = {
                status: 'Shipped',
                customer_phone: '1234567890',
                customer_email: 'john@example.com',
                customer_name: 'John Doe',
                products: [],
            };
            orderService.updateOrder.mockResolvedValue(mockOrder);

            await updateOrder(req, res);

            expect(orderService.updateOrder).toHaveBeenCalledWith({
                id: req.params.id,
                ...req.body,
            });
            expect(res.json).toHaveBeenCalledWith(mockOrder);
        });

        test('should handle not found error when updating an order', async () => {
            const mockError = new Error('Order not found');
            req.params.id = 1;
            req.body = {
                status: 'Shipped',
                customer_phone: '1234567890',
                customer_email: 'john@example.com',
                customer_name: 'John Doe',
                products: [],
            };
            orderService.updateOrder.mockRejectedValue(mockError);

            await updateOrder(req, res);

            expect(orderService.updateOrder).toHaveBeenCalledWith({
                id: req.params.id,
                ...req.body,
            });
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Order not found.' });
        });

        test('should handle errors when updating an order', async () => {
            const mockError = new Error('Database error');
            req.params.id = 1;
            req.body = {
                status: 'Shipped',
                customer_phone: '1234567890',
                customer_email: 'john@example.com',
                customer_name: 'John Doe',
                products: [],
            };
            orderService.updateOrder.mockRejectedValue(mockError);

            await updateOrder(req, res);

            expect(orderService.updateOrder).toHaveBeenCalledWith({
                id: req.params.id,
                ...req.body,
            });
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'An error occurred while updating the order.',
            });
        });
    });

    describe('deleteOrder', () => {
        test('should delete an order successfully', async () => {
            req.params.id = 1;
            orderService.deleteOrder.mockResolvedValue(true);

            await deleteOrder(req, res);

            expect(orderService.deleteOrder).toHaveBeenCalledWith({ id: req.params.id });
            expect(res.json).toHaveBeenCalledWith(true);
        });

        test('should handle errors when deleting an order', async () => {
            const mockError = new Error('Database error');
            req.params.id = 1;
            orderService.deleteOrder.mockRejectedValue(mockError);

            await deleteOrder(req, res);

            expect(orderService.deleteOrder).toHaveBeenCalledWith({ id: req.params.id });
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'An error occurred while deleting the order.',
            });
        });
    });
});