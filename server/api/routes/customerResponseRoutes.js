'use strict';

var express = require('express');
var router = express.Router();

var customerResponses = require('../controllers/customerResponseController');

router.post('/approve',customerResponses.approve);
router.post('/changeRequest',customerResponses.changeRequest);


module.exports = router;