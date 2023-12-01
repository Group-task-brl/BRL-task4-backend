require("dotenv").config();
jwt = require('jsonwebtoken');
// import cloudinary from '../node_modules/cloudinary-core/src/index';
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;

const Image = require('../models/imageModel.js');
const User = require('../models/userModel.js');



const addImageController =  async (req, res) => {


    const authorizationHeader = req.headers.authorization;

      if (!authorizationHeader) {
          return res.status(401).json({ error: 'Authorization header missing' });
      }

      const decodedToken = jwt.verify(authorizationHeader, process.env.SECRET_KEY_JWT);

      const email = decodedToken.email;

      const user = await User.findOne({ email: email });
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

    const files = req.files.photo;
    cloudinary.uploader.upload(files.tempFilePath, function (err, result) {
    

    const { imgName } = req.body;

    const newImage = new Image({
        imgName: imgName,
        userEmail: email,
        img: result.secure_url,
    });
    newImage.save()
    .then(() => res.json('Image added!'))
    .catch(err => res.status(400).json('Error: ' + err));
  });
}


const showImageController = async (req, res) => {
    const authorizationHeader = req.headers.authorization;
  
    if (!authorizationHeader) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }
  
    const decodedToken = jwt.verify(authorizationHeader, process.env.SECRET_KEY_JWT);
  
    const email = decodedToken.email;
  
    const { imgName } = req.body;
  
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const image = await Image.findOne({ userEmail: email, imgName: imgName });
      if (!image) {
        return res.status(404).json({ error: 'Image not found for the given user and name' });
      }
  
      // Here, you might want to send the image URL or perform any other action based on your use case.
      res.json({ imgURL: image.img, imgName: image.imgName });
    } catch (error) {
      console.error('Error retrieving image:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
 
  
  
  
  
module.exports={
    addImageController,
    showImageController,
}