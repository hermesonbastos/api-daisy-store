// __tests__/adminController.test.js
const adminService = require('../src/services/admin/index.js');
const { getAdmins } = require('../src/controllers/adminController/index.js');

jest.mock('../src/services/admin/index.js');

describe('Admin Controller - getAdmins', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return all admins successfully', async () => {
    const mockAdmins = [
      { id: 1, name: 'Admin 1', email: 'admin1@example.com' },
      { id: 2, name: 'Admin 2', email: 'admin2@example.com' },
    ];
    adminService.getAllAdmins.mockResolvedValue(mockAdmins);

    await getAdmins(req, res);

    expect(adminService.getAllAdmins).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(mockAdmins);
  });

  test('should handle errors when retrieving admins', async () => {
    const mockError = new Error('Database error');
    adminService.getAllAdmins.mockRejectedValue(mockError);

    await getAdmins(req, res);

    expect(adminService.getAllAdmins).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'An error occurred while retrieving admins.',
    });
  });
});