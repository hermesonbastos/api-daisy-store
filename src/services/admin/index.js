const prisma = require('../../prisma');
const { verifyToken } = require('../../utils/jwt');

const validateToken = async (token) => {
  try {
    const decoded = verifyToken(token);
    
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
    });

    if (!admin) {
      throw new Error("Admin not found.");
    }

    return admin;
  } catch (error) {
    throw new Error("Invalid token.");
  }
};

const getAllAdmins = async () => {
  return await prisma.admin.findMany();
}

const createAdmin = async (data) => {
  return await prisma.admin.create({
    data,
  });
}

const updateAdmin = async (data) => {
  return await prisma.admin.update({
    where: { id: Number(data.id) },
    data: {
      name: data.name,
      email: data.email
    }
  });
}

const deleteAdmin = async (data) => {
  return await prisma.admin.delete({
    where: {
      id: Number(data.id)
    }
  })
}

const findAdminByEmail = async (email) => {
  return await prisma.admin.findUnique({
    where: { email },
  });
};

module.exports = {
  validateToken,
  getAllAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  findAdminByEmail,
}