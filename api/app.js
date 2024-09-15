const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json());

const adminRoutes = require('../src/routes/adminRoutes');
const categoryRoutes = require('../src/routes/categoryRoutes');
const productRoutes = require('../src/routes/productRoutes');
const orderRoutes = require('../src/routes/orderRoutes');
const uploadRoutes = require('../src/routes/uploadRoutes');

app.use('/users', adminRoutes);
app.use('/categories', categoryRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/api', uploadRoutes);

module.exports = app;
