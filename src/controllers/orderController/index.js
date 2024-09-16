const orderService = require("../../services/order");

const getOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json(orders);
  } catch (error) {
    console.error("Error getting orders:", error.message);
    res.status(500).json({
      error: "An error occurred while retrieving orders.",
    });
  }
};

const createOrder = async (req, res) => {
  try {
    const { status, customer_phone, customer_email, customer_name, products } =
      req.body;
    const order = await orderService.createOrder({
      status,
      customer_phone,
      customer_email,
      customer_name,
      products: products || [],
    });
    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error.message);
    res.status(500).json({
      error: "An error occurred while creating the order.",
    });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, customer_phone, customer_email, customer_name, products } =
      req.body;
    const order = await orderService.updateOrder({
      id,
      status,
      customer_phone,
      customer_email,
      customer_name,
      products: products || [],
    });
    res.json(order);
  } catch (error) {
    console.error("Error updating order:", error.message);
    if (error.message.includes("not found")) {
      res.status(404).json({ error: "Order not found." });
    } else {
      res.status(500).json({
        error: "An error occurred while updating the order.",
      });
    }
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderService.deleteOrder({ id });
    res.json(order ? true : false);
  } catch (error) {
    console.error("Error deleting order:", error.message);
    res.status(500).json({
      error: "An error occurred while deleting the order.",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderService.getOrderById(id);

    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    res.json(order);
  } catch (error) {
    console.error("Error getting order details:", error.message);
    res.status(500).json({
      error: "An error occurred while retrieving the order details.",
    });
  }
};

module.exports = {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderDetails,
};
