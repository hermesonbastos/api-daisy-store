const prisma = require('../../prisma');

const getAllProducts = async () => {
  return await prisma.product.findMany();
}

const createProduct = async (data) => {
  return await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      categories: {
        create: data.categories.map((categoryId) => ({
          category: { connect: { id: categoryId } },
          assignedBy: "system",
        })),
      },
    },
    include: {
      categories: true,
    },
  });
};


const updateProduct = async (data) => {
  return await prisma.product.update({
    where: {
      id: Number(data.id),
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
      id: Number(data.id),
    }
  })
}

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct
}