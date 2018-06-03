'use strict';

var express = require('express');
var router = express.Router();

var productsList = require('../controllers/productsController');

router.get('/:clientId',productsList.getProduct);

module.exports = router;