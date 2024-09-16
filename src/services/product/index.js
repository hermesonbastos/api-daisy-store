const prisma = require('../../prisma');

const getAllProducts = async () => {
  return await prisma.product.findMany({
    include: {
      images: {
        include: {
          image: true,
        }
      },
      categories: {
        include: {
          category: true,
        }
      }
    }
  });
}

const createProduct = async (data) => {
  console.log(data);
  
  const categories = Array.isArray(data.categories) ? data.categories : JSON.parse(data.categories || '[]');

  return await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      stock: parseInt(data.stock, 10),
      categories: categories.length > 0 ? {
        create: categories.map((categoryId) => ({
          category: { connect: { id: parseInt(categoryId, 10) } },
          assignedBy: "system",
        })),
      } : undefined,
      images: {
        create: {
          image: {
            create: {
              uuid: data.image?.uuid,
              link: data.image?.link,
            }
          }
        }
      }
    },
    include: {
      categories: true,
      images: true,
    },
  });
};

const updateProductStock = async (id, stock) => {
  return await prisma.product.update({
    where: { id: Number(id) },
    data: { stock: parseInt(stock, 10) },
    include: {
      categories: true,
      images: true,
    },
  });
};


const updateProduct = async (data) => {
  const categoriesData = Array.isArray(data.categories) && data.categories.length > 0
    ? data.categories.map((categoryId) => ({
        category: { connect: { id: Number(categoryId) } },
        assignedBy: "system",
      }))
    : [];

  const updateData = {
    name: data.name,
    description: data.description,
    price: parseFloat(data.price),
    stock: parseInt(data.stock, 10),
    categories: categoriesData.length > 0 ? {
      deleteMany: {},
      create: categoriesData,
    } : {
      deleteMany: {},
    },
  };

  if (data.image) {
    updateData.images = {
      deleteMany: {},
      create: {
        image: {
          create: {
            uuid: data.image.uuid,
            link: data.image.link,
          }
        }
      }
    };
  }

  return await prisma.product.update({
    where: {
      id: Number(data.id),
    },
    data: updateData,
    include: {
      categories: true,
      images: true,
    },
  });
};

const detailProduct = async (id) => {
  return await prisma.product.findUnique({
    where: { id: Number(id) },
    include: {
      categories: {
        include: {
          category: true,
        }
      },
      images: {
        include: {
          image: true,
        }
      }
    }
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
  detailProduct,
  deleteProduct,
  updateProductStock
}