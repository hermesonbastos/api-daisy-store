const adminService = require("../../services/admin");
const bcrypt = require("bcrypt");
const { generateToken } = require("../../utils/jwt");
const prisma = require("../../prisma");

const validateAdminToken = async (req, res) => {
    const { token } = req.body;

    console.log(token)
  
    try {
      const admin = await adminService.validateToken(token);
      res.json({ message: "Token is valid", admin });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  };

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
        const { name, email, password } = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({ error: "Name, email, and password are required." });
        }

        const existingAdmin = await adminService.findAdminByEmail(email);
        if(existingAdmin) {
            return res.status(400).json({ error: "Email is already in use." });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const admin = await adminService.createAdmin({
            name,
            email,
            password: hashedPassword,
        });
        res.status(201).json(admin);

    } catch (error) {
        console.error("Error creating admin:", error.message);
        res.status(500).json({
            error: "An error occurred while creating the admin.",
        });
    }
};

const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await prisma.admin.findUnique({
            where: { email },
        });

        if(!admin || !bcrypt.compareSync(password, admin.password)) {
            return res.status(400).json({ message: "Invalid email or password" });
        };

        const token = generateToken({ id: admin.id, email: admin.email });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Server error." })
    }
}

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
    validateAdminToken,
    getAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    adminLogin,
};
