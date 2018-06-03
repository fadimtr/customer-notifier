'use strict';

var express = require('express');
var router = express.Router();

var productsList = require('../controllers/productsController');
var multer  = require('multer'),
    multerS3 = require('multer-s3');
const AWS = require('aws-sdk'),
    secrets = require('../../secret');


AWS.config.update({
	accessKeyId: secrets.aws.accessKeyId,
	secretAccessKey: secrets.aws.secretAccessKey
});

var s3 = new AWS.S3();

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'customernotifier',
        acl: 'public-read',
        // metadata: function (req, file, cb) {
        //     console.log('1');
        //     cb(null, { fieldName: file.fieldname });
        // },
        key: function (req, file, cb) {
            var fileTypeIndex = file.originalname.lastIndexOf(".");
            if(fileTypeIndex == -1){
                fileTypeIndex = file.originalname.length -1;
            }
            var fileName = 'public/' + Date.now().toString() + file.originalname.substr(fileTypeIndex, file.originalname.length -1);
            cb(null, fileName);
        }
    })
})

// router('/products')
//   .get(productsList.getAll)
//   .post(productsList.addProduct);

router.get('/',productsList.getAll);
router.post('/',productsList.addProduct);

router.post('/uploadProductFiles', upload.array('files'), productsList.uploadProductFiles);

// router('/products/:productId')
//   .get(productsList.getProduct);
router.get('/:productId',productsList.getProduct);

module.exports = router;