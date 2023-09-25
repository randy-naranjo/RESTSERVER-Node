const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadFileValidator = (files, validExtensions = ["png", "jpg", "jpeg", "gif", "ico"], folder = '') => {
  return new Promise((resolve, reject) => {
    const { file } = files;

    const fileNameCut = file.name.split(".");
    const extension = fileNameCut[fileNameCut.length - 1];

    if (!validExtensions.includes(extension)) {
      return reject(`Extension not valid`)
    }

    const newFileName = uuidv4() + "." + extension;

    const uploadPath = path.join(__dirname, "../uploads/", folder, newFileName);

    file.mv(uploadPath, (err) => {
      if (err) {
        return reject(err);
      }

      return resolve(newFileName)
    });
  });
};

module.exports = {
  uploadFileValidator,
};
