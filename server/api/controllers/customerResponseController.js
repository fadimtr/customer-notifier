'use strict';

const mysql = require('../../db');
const nodeMailer = require('nodemailer');
const secrets = require('../../secret');
var ObjectID = require('mongodb').ObjectID;

exports.approve = function(req, res,next) {
    var product = req.body.product;
    let mysqlQuery = mysql.db.format('UPDATE products SET isApproved = ?, customerMessage = ?, dateApproved = ? WHERE clientId = ?',
        [true,req.body.message,new Date(),product.clientId]);
    mysql.db.query(mysqlQuery,function(err){
        if(err) res.send('Failed to update product');
        sendEmail({message: req.body.message,product},'approve')
        res.json('Approved');
    });
};

exports.changeRequest = function(req, res,next) {
    var product = req.body.product;
    let mysqlQuery = mysql.db.format('UPDATE products SET changeRequested = ?, customerMessage = ?, dateApproved = ? WHERE clientId = ?',
        [true,req.body.message,new Date(),product.clientId]);
    
    mysql.db.query(mysqlQuery,function(err){
        if(err) res.send('Failed to update product');
        sendEmail({message: req.body.message,product})
        res.json('Change reuest sent successfully');
    });
};

function sendEmail(mailInfo,actionName) {
    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: secrets.email.user,
            pass: secrets.email.password
        }
    });
    let actionMessage = actionName == 'approve' ? 'הלקוח אישר את הפנייה<br/>' : 'הלקוח מבקש שינוי<br/>';
    let message = mailInfo.message && mailInfo.message != '' ? 'הודעה מהלקוח : ' + mailInfo.message : '';
    let customerName = 'שם הלקוח : ' + mailInfo.product.customer + '<br/>';
    let productNumber = 'מספר הזמנה : ' + mailInfo.product.productId + '<br/>';

    let mailOptions = {
        from: '"Tira Print Notification System" <office@tirapress.com>', // sender address
        to: 'office@tirapress.com', // list of receivers
        subject: 'פנייה עבור ' + mailInfo.product.createdBy + ' - הזמנה מספר ' + mailInfo.product.productId, // Subject line
       // text: req.body.body, // plain text body
        html: '<p>שלום,</p>' +
                actionMessage +
                customerName +
                productNumber +
                message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
};





