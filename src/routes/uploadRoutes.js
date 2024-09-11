const express = require('express');
const multer = require('multer');
const router = express.Router();
const { storage, ref } = require('../utils/firebase'); // Agora referenciamos corretamente o storage e o ref
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { v4: uuidv4 } = require('uuid');
const { uploadBytes, getDownloadURL } = require('firebase/storage');

// Configuração do multer para lidar com o upload
const upload = multer({
  storage: multer.memoryStorage(),
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('Nenhuma imagem enviada.');
    }

    // Gerar um UUID para a imagem
    const uuid = uuidv4();
    const fileName = `${uuid}-${req.file.originalname}`;

    // Criar uma referência no Firebase Storage
    const imageRef = ref(storage, fileName);

    // Fazer upload do arquivo para o Firebase Storage
    await uploadBytes(imageRef, req.file.buffer, {
      contentType: req.file.mimetype,
    });

    // Obter a URL pública da imagem
    const publicUrl = await getDownloadURL(imageRef);

    // Salvar a URL da imagem no banco de dados
    const savedImage = await prisma.image.create({
      data: {
        uuid: uuid,
        link: publicUrl,
      },
    });

    res.status(200).send({ message: 'Upload bem-sucedido', image: savedImage });

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Erro ao fazer upload da imagem' });
  }
});

module.exports = router;
