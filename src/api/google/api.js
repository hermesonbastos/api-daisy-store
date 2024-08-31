const fs = require('fs');
const { google } = require('googleapis');

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

async function uploadFile(authClient) {
  return new Promise((resolve, rejected) => {
    const drive = google.drive({ version: "v3", auth: authClient });

    var fileMetaData = {
      name: "images.txt",
      parents: ["1iNuIxfGmHbqaUwiq8hXe3b8oEQxCUEGv"]
    }

    drive.files.create({
      resource:fileMetaData,
      media: {
        body: fs.createReadStream("images.txt"),
        mimeType: 'text/plain',
      },
      fields: 'id'
    }, (err, file) => {
      if(err) {
        return rejected(err);
      }
      resolve(file);
    })
  })
}

authorize().then(uploadFile).catch("Error");