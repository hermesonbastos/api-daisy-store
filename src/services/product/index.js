const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const { google } = require('googleapis');
const prisma = require('../../prisma');

const apikeys = require('../../../apikey.json');
const SCOPE = ["https://www.googleapis.com/auth/drive"];

async function authorize() {
  const jwtClient = new google.auth.JWT(
    apikeys.client_email,
    null,
    apikeys.private_key,
    SCOPE
  );
  await jwtClient.authorize();
  return jwtClient;
}

async function uploadFileToDrive(authClient, filePath, fileName) {
  return new Promise((resolve, reject) => {
    const drive = google.drive({ version: "v3", auth: authClient });

    const fileMetaData = {
      name: fileName,
      parents: ["<YOUR_GOOGLE_DRIVE_FOLDER_ID>"] // substitua pelo ID da pasta no Google Drive
    };

    const media = {
      mimeType: 'image/jpeg', // ajuste conforme o tipo de arquivo
      body: fs.createReadStream(filePath),
    };

    drive.files.create({
      resource: fileMetaData,
      media: media,
      fields: 'id, webViewLink'
    }, (err, file) => {
      if (err) {
        reject(err);
      } else {
        resolve(file.data.webViewLink);
      }
    });
  });
}

const getAllProducts = async () => {
  return await prisma.product.findMany();
}

const createProduct = async (data) => {
  const authClient = await authorize();
  const uuid = uuidv4();
  
  // Supondo que a imagem é enviada via upload e salva temporariamente em uma pasta
  const imagePath = data.imagePath; // Caminho temporário da imagem no servidor
  const imageName = `${uuid}.jpg`; // Ou ajuste conforme a extensão do arquivo

  const imageUrl = await uploadFileToDrive(authClient, imagePath, imageName);

  return await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      categories: {
        create: data.categories.map((categoryId) => ({
          category: { connect: { id: categoryId } },
          assignedBy: "system",
        })),
      },
      images: {
        create: {
          uuid: uuid,
          link: imageUrl,
        }
      }
    },
    include: {
      categories: true,
      images: true,
    },
  });
};

const updateProduct = async (data) => {
  return await prisma.product.update({
    where: {
      id: Number(data.id),
    },
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      categories: {
        deleteMany: {},
        create: data.categories.map((categoryId) => ({
          category: { connect: { id: categoryId } },
          assignedBy: "system",
        })),
      },
    },
    include: {
      categories: true,
    },
  });
};


const deleteProduct = async (data) => {
  return await prisma.product.delete({
    where: {
      id: Number(data.id),
    }
  })
}

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct
}