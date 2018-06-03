'use strict';

const mysql = require('../../db');
const mongo = require('../../db');
const nodeMailer = require('nodemailer');
const secrets = require('../../secret');
const client = require('twilio')(secrets.twilio.sid, secrets.twilio.token);
const Nexmo = require('nexmo')
const nexmo = new Nexmo({
  apiKey: secrets.nexmo.key,
  apiSecret: secrets.nexmo.secret
});

exports.sendEmail = function(req, res,next) {
    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: secrets.email.user,
            pass: secrets.email.password
        }
    });

    let id = req.body.id;

    mysql.db.query( mysql.db.format('SELECT * from products WHERE id=?',[id]),function(err,products){
        if(err || !products || products.length == 0) res.send('Failed to get product');
        let product = products[0];
        let htmlMessage = product.message ? product.message.replace(/\n\r?/g, '<br />') : '';
        let orderSubject = product.productId ? 'הזמנה מס ' + product.productId + ': ' : '';
        let mailOptions = {
            from: '"Tira Print Notification System" <customerNotifierAdm@gmail.com>', // sender address
            to: product.email, // list of receivers
            subject: orderSubject + (product.messageSubject || ''), // Subject line
           // text: req.body.body, // plain text body
            html: htmlMessage + '<br/>' + (product.attachmentType == 'picture' || product.attachmentType == 'file' ? 
                '<a href="http://tirapress.us-east-2.elasticbeanstalk.com/#/products/' + product.clientId + '"> לחץ כאן כדי לראות את הקבצים המצורפים </a>' : '')
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
            res.json('succeeded!');
        });
        
    });
    
};

exports.sendSMS = function(req, res,next) {

    mysql.db.query( mysql.db.format('SELECT * from products WHERE id=?',[req.body.id]),function(err,products){
        if(err || !products || products.length == 0) res.send('Failed to get product');
        let product = products[0];
        const from = secrets.nexmo.from;
        let phoneNumber = product.phone;

        if(phoneNumber.startsWith('0')){
            phoneNumber = phoneNumber.substr(1);
            phoneNumber = '972' + phoneNumber;
        }

        const to = phoneNumber;
        const messageSubject = product.messageSubject && product.messageSubject != '' ? product.messageSubject + '\n' : ''
        const text = messageSubject + product.message + '\n' + (product.attachmentType == 'picture' || product.attachmentType == 'file' ? 'http://tirapress.us-east-2.elasticbeanstalk.com/#/products/' + product.clientId : '');
        const options = {
            "type" : "unicode"
        };

        nexmo.message.sendSms(from, to, text,options,function(err,data){
            if(err){
                res.send('Failed to send sms')
            }else{
                res.send('SMS Sent successfully');
            }
        });
    });
};



