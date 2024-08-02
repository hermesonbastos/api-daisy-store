const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

require('dotenv').config();

app.use(express.json());

app.get('/users', async (req, res) => {
  const admins = await prisma.admin.findMany();
  res.json(admins);
});

app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  const admin = await prisma.admin.create({
    data: { name, email }
  });
  res.json(admin);
});

app.get('/categories', async (req, res) => {
  const category = await prisma.category.findMany();
  res.json(category);
});

app.post('/categories', async (req, res) => {
  const { name, description } = req.body;
  const category = await prisma.category.create({
    data: { name, description }
  });
  res.json(category);
});

app.get('/products', async (req, res) => {
  const product = await prisma.product.findMany();
  res.json(product);
});

app.post('/products', async (req, res) => {
  const { name, description, price, stock } = req.body;
  const product = await prisma.product.create({
    data: { name, description, price, stock }
  });
  res.json(product);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
