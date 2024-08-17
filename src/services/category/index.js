const prisma = require('../../prisma');

const getAllCategories = async () => {
  return await prisma.category.findMany();
}

const createCategory = async (data) => {
  return await prisma.category.create({
    data,
  });
}

const updateCategory = async (data) => {
  return await prisma.category.update({
    where: {
      id: Number(data.id),
    },
    data: {
      name: data.name,
      description: data.description,
    }
  })
}

const deleteCategory = async (data) => {
  return await prisma.category.delete({
    where: {
      id: Number(data.id),
    }
  })
}

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
}