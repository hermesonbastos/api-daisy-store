const prisma = require('../../prisma');

const getAllProducts = async () => {
  return await prisma.product.findMany();
}

const createProduct = async (data) => {
  return await prisma.product.create({
    data,
  });
}

const updateProduct = async (data) => {
  return await prisma.product.update({
    where: {
      id: data.id,
    },
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
    }
  })
}

const deleteProduct = async (data) => {
  return await prisma.product.delete({
    where: {
      id: data.id,
    }
  })
}

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct
}