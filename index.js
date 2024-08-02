const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

require('dotenv').config();

app.use(express.json());

//Implementação da rota de users(admins)
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
app.put('/users', async (req, res) => {
  const { id, name, email } = req.body;
  try {
    const admin = await prisma.admin.update({
      where: { id: id },
      data: { name, email }
    });
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: 'Admin não encontrado ou outro erro ocorreu.' });
  }
});
app.delete('/users', async (req, res) => {
  const { id } = req.body;
  try {
    const admin = await prisma.admin.delete({
      where: { id: id }
    });
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: 'Admin não encontrado ou outro erro ocorreu.' });
  }
});

//Implementação da rota de categorias
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
app.put('/categories', async (req, res) => {
  const { id, name, description } = req.body;
  try {
    const category = await prisma.category.update({
      where: { id: id },
      data: { name, description}
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Categoria não encontrado ou outro erro ocorreu.' });
  }
});
app.delete('/categories', async (req, res) => {
  const { id } = req.body;
  try {
    const category = await prisma.category.delete({
      where: { id: id }
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Categoria não encontrado ou outro erro ocorreu.' });
  }
});

//Implementação da rota de produtos
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
app.put('/products', async (req, res) => {
  const { id, name, description, price } = req.body;
  try {
    const product = await prisma.product.update({
      where: { id: id },
      data: { name, description, price }
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Produto não encontrado ou outro erro ocorreu.' });
  }
});
app.delete('/products', async (req, res) => {
  const { id } = req.body;
  try {
    const product = await prisma.product.delete({
      where: { id: id }
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Produto não encontrado ou outro erro ocorreu.' });
  }
});

//Conecção com o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
