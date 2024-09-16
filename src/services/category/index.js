const prisma = require('../../prisma');

const getAllCategories = async () => {
  return await prisma.category.findMany({
    include: {
      products: {
        include: {
          product: true,
        },
      },
    },
  });
};

const getCategoryById = async (id) => {
  return await prisma.category.findUnique({
    where: { id: Number(id) },
    include: {
      products: {
        include: {
          product: {
            include: {
              images: {
                include: {
                  image: true,
                }
              }
            },
          },
        },
      },
    },
  });
};


const createCategory = async (data) => {
  const { name, description } = data;

  if (!name) {
    throw new Error("O campo 'name' é obrigatório.");
  }

  return await prisma.category.create({
    data: {
      name,
      description: description || "",
    },
  });
};


const updateCategory = async (data) => {
  const { id, name, description, productIds } = data;

  const updateData = {
    name: name,
    description: description,
  };

  if (productIds && Array.isArray(productIds)) {
    updateData.products = {
      deleteMany: {},
      create: productIds.map(productId => ({
        product: { connect: { id: Number(productId) } },
        assignedBy: "system",
      })),
    };
  }

  return await prisma.category.update({
    where: {
      id: Number(id),
    },
    data: updateData,
  });
};

const deleteCategory = async (data) => {
  return await prisma.category.delete({
    where: {
      id: Number(data.id),
    }
  })
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
}