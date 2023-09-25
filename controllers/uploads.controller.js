const { uploadFileValidator } = require("../helpers/upload-files");
const fs = require("fs");
const path = require("path");
const cloudinary = require('cloudinary').v2

cloudinary.config( process.env.CLOUDINARY_URL )

const deleteFile = (fileName = "", folder = "") => {
  const pathName = path.join(__dirname, "../uploads/", folder, fileName)

  if(fs.existsSync( pathName )) {
    fs.unlinkSync(pathName);
  }
};

const uploadFile = async (req, res) => {
  try {
    const name = await uploadFileValidator(req.files, ["txt", "md", "jpg"]);

    res.json({ name });
  } catch (error) {
    res.status(400).json({
      msg: error,
    });
  }
};

// const updateImage = async (req, res = response) => {
//   const { entity, collection } = req.params;
//   // Entity comes from collectionAndEntityExists

//   let img;

//   try {
//     img = await uploadFileValidator(req.files, undefined, collection);

//     if (entity.img) {
//       deleteFile(entity.img, collection)
//     }

//     entity.img = img;

//     await entity.save();

//     res.json(entity);
//   } catch (error) {
//     if (img) {
//       deleteFile(img, collection)
//     }

//     res.status(500).json({
//       msg: "Something get wrong",
//       error,
//     });
//   }
// };

const updateImageCloudinary = async (req, res = response) => {
  const { entity, collection } = req.params;
  // Entity comes from collectionAndEntityExists

  try {
    const { tempFilePath } = req.files.file
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath )

    if (entity.img) {
      const nameArr = entity.img.split('/')
      const [ public_id ] = nameArr[nameArr.length - 1].split('.')

      cloudinary.uploader.destroy( public_id );

    }

    entity.img = secure_url;

    await entity.save();

    res.json(entity);
  } catch (error) {

    res.status(500).json({
      msg: "Something get wrong",
      error,
    });
  }
};



getImage = async(req, res) => {
  const noImagePath = path.join(__dirname, "../assets/no-image.jpg")

  const {entity, collection} = req.params
  // Entity comes from collectionAndEntityExists


  if( !entity.img ) {
    return res.sendFile( noImagePath )
  }

  const pathName = path.join(__dirname, "../uploads/", collection, entity.img)

  if( !fs.existsSync( pathName ) ) {
    return res.sendFile( noImagePath )
  }

  res.sendFile(pathName)

}

module.exports = {
  uploadFile,
  updateImageCloudinary,
  getImage
};
