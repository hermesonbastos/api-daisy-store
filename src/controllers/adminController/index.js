const adminService = require("../../services/admin");

const getAdmins = async (req, res) => {
  const admins = await adminService.getAllAdmins();
  res.json(admins);
}

const createAdmin = async (req, res) => {
  const { name, email } = req.body;
  const admin  = await adminService.createAdmin({ name, email });
  res.json(admin);
}

const updateAdmin = async (req, res) => {
  const { id, name, email } = req.body;
  const admin = await adminService.updateAdmin({ id, name, email })
  res.json(admin);
}

const deleteAdmin = async (req, res) => {
  const { id } = req.body;
  const admin = await adminService.deleteAdmin({ id });
  res.json(admin ? true : false);
}

module.exports = {
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin
}