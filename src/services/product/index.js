const prisma = require('../../prisma');

const getAllProducts = async () => {
  return await prisma.product.findMany({
    include: {
      images: {
        include: {
          image: true,
        }
      }
    }
  });
}

const createProduct = async (data) => {
  console.log(data)
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
      images: {
        create: {
          image: {
            create: {
              uuid: data.image?.uuid,
              link: data.image?.link,
            }
          }
        },
      },
    },
    include: {
      categories: true,
      images: true,
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
      categories: {
        deleteMany: {},
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