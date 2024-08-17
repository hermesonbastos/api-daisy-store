const adminService = require("../../services/admin");

const getAdmins = async (req, res) => {
    try {
        const admins = await adminService.getAllAdmins();
        res.json(admins);
    } catch (error) {
        console.error("Error getting admins:", error.message);
        res.status(500).json({
            error: "An error occurred while retrieving admins.",
        });
    }
};

const createAdmin = async (req, res) => {
    try {
        const { name, email } = req.body;
        const admin = await adminService.createAdmin({ name, email });
        res.status(201).json(admin);
    } catch (error) {
        console.error("Error creating admin:", error.message);
        res.status(500).json({
            error: "An error occurred while creating the admin.",
        });
    }
};

const updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;
        const admin = await adminService.updateAdmin({ id, name, email });
        res.json(admin);
    } catch (error) {
        console.error("Error updating admin:", error.message);
        if (error.message.includes("not found")) {
            res.status(404).json({ error: "Admin not found." });
        } else {
            res.status(500).json({
                error: "An error occurred while updating the admin.",
            });
        }
    }
};

const deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const admin = await adminService.deleteAdmin({ id });
        res.json(admin ? true : false);
    } catch (error) {
        console.error("Error deleting admin:", error.message);
        res.status(500).json({
            error: "An error occurred while deleting the admin.",
        });
    }
};

module.exports = {
    getAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin,
};
