const express = require('express');
const app = express();

app.use(express.json());

const adminRoutes = require('./routes/adminRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');

app.use('/users', adminRoutes);
app.use('/categories', categoryRoutes);
app.use('/products', productRoutes);

module.exports = app;
