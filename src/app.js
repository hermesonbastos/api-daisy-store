const express = require('express');
const app = express();

app.use(express.json());

const adminRoutes = require('./routes/adminRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const upload = require('./routes/uploadRoutes');

app.use('/users', adminRoutes);
app.use('/categories', categoryRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/api', upload);

module.exports = app;
