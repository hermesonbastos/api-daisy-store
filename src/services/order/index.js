const prisma = require('../../prisma');

const getAllOrders = async () => {
  return await prisma.order.findMany();
}

const createOrder = async (data) => {
  return await prisma.order.create({
    data: {
      status: "pendente",
      description: data.description,
      customer_name: data.customer_name,
      customer_email: data.customer_email,
      customer_phone: data.customer_phone,
      products: {
        create: data.products.map((productId) => ({
          product: {
            connect: { id: productId }
          },
          assignedBy: "system",
        })),
      },
    },
    include: {
      products: true,
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
        create: data.products.map((productId) => ({
          product: { connect: { id: productId } },
          assignedBy: "system",
        })),
      },
    },
    include: {
      products: true,
    },
  })
}

const deleteOrder = async (data) => {
  return await prisma.order.delete({
    where: {
      id: Number(data.id),
    }
  })
}

module.exports = {
  getAllOrders,
  createOrder,
  updateOrder,
  deleteOrder
}