const prisma = require('../../prisma');

const getAllOrders = async () => {
  return await prisma.order.findMany({
    include: {
      products: {
        include: {
          product: true
        }
      }
    }
  });
}

const createOrder = async (data) => {
  return await prisma.order.create({
    data: {
      status: data.status || "pendente",
      description: data.description,
      customer_name: data.customer_name,
      customer_email: data.customer_email,
      customer_phone: data.customer_phone,
      products: {
        create: data.products.map((product) => ({
          product: {
            connect: { id: product.id }
          },
          assignedBy: product.assignedBy || "system",
          quantity: product.quantity,
        })),
      },
    },
    include: {
      products: {
        include: {
          product: true,
        },
      },
    },
  });
};


const updateOrder = async (data) => {
  return await prisma.order.update({
    where: {
      id: Number(data.id),
    },
    data: {
      status: data.status,
      description: data.description,
      customer_name: data.customer_name,
      customer_email: data.customer_email,
      customer_phone: data.customer_phone,
      products: {
        deleteMany: {},
        create: data.products.map((product) => ({
          product: { connect: { id: product.id } },
          assignedBy: "system",
          quantity: product.quantity,
        })),
      },
    },
    include: {
      products: true,
    },
  });
};

const deleteOrder = async (data) => {
  try {
    await prisma.product_order.deleteMany({
      where: {
        orderId: Number(data.id),
      },
    });

    return await prisma.order.delete({
      where: {
        id: Number(data.id),
      },
    });
  } catch (error) {
    console.error("Error deleting order:", error.message);
    throw error;
  }
};


const getOrderById = async (id) => {
  return await prisma.order.findUnique({
    where: { id: Number(id) },
    include: {
      products: {
        include: {
          product: {
            include: {
              images: {
                include: {
                  image: true
                }
              }
            }
          }
        }
      }
    }
  });
};



module.exports = {
  getAllOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderById
}