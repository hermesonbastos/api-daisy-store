const prisma = require('../../prisma');

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
    where: { id: data.id },
    data: {
      name: data.name,
      email: data.email
    }
  });
}

const deleteAdmin = async (data) => {
  return await prisma.admin.delete({
    where: {
      id: data.id
    }
  })
}

module.exports = {
  getAllAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin
}