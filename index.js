const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
