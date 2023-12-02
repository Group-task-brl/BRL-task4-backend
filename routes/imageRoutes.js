

const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');



router.post('/addImage', imageController.addImageController);

router.get('/showImage/:imgName', imageController.showImageController);




module.exports = router;
