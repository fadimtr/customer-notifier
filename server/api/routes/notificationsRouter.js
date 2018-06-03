'use strict';

var express = require('express');
var router = express.Router();

var notificationsList = require('../controllers/notificationsController');

router.post('/email',notificationsList.sendEmail);
router.post('/sms',notificationsList.sendSMS);


module.exports = router;