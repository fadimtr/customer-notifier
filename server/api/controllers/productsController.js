'use strict';

const mysql = require('../../db');
const uuidv1 = require('uuid/v1');
const fs = require('fs');
const AWS = require('aws-sdk'),
      secrets = require('../../secret');


AWS.config.update({
	accessKeyId: secrets.aws.accessKeyId,
	secretAccessKey: secrets.aws.secretAccessKey
});


var s3 = new AWS.S3();


exports.uploadProductFiles = function(req,res,next){
  res.send(req.files.map(file => file.location));
}


exports.getAll = function(req, res,next) {
    mysql.db.query('SELECT * from products ORDER BY dateAdded DESC',function(err,products){
      if(err) res.send('Failed to get products');
      res.json(products);
    });
};

exports.getProduct = function(req, res,next) {
  mysql.db.query( mysql.db.format('SELECT * from products WHERE clientId=?',[req.params.clientId]),function(err,products){
    if(err || !products || products.length == 0) res.send('Failed to get product');
    mysql.db.query( mysql.db.format('SELECT fileName from productUploadedFiles WHERE productId=?',[req.params.clientId]),function(err,files){
      if(err || !products || !products[0]) res.send(err);
      let result = products[0];
      if(files && files.length >= 0){
        result.files = files;
      }
      res.json(result);
    });
  });
};

exports.addProduct = function(req, res,next) {
	var product = req.body;
	let clientId = uuidv1();
  var file = product.file ? product.file : '';
  let uploadedFiles = [];
  if(!product.uploadedFiles || product.uploadedFiles.length == 0 ){
    uploadedFiles = product.link && product.link != '' ? [[product.link,clientId]] : []; 
  }else{
    uploadedFiles = product.uploadedFiles.map(fileName => [fileName,clientId]);
  }
  product = Object.assign({ dateAdded: new Date() },product);
  let mysqlQuery = mysql.db.format('INSERT INTO products (productId,customer,messageSubject,message,link,attachmentType, email,phone,dateAdded,createdBy,clientId) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
                        [product.productId,product.customer,product.messageSubject,product.message,product.link,product.attachmentType,product.email,product.phone,product.dateAdded,product.createdBy,clientId]);
  let mysqlQuery2 = mysql.db.format('INSERT INTO productUploadedFiles (fileName,productId) VALUES ?',[uploadedFiles]);
  mysql.db.query( mysqlQuery,function(err,products){
		if(err){
       res.send('Failed to add product');
    }
    console.log(err);
    console.log(products);
    if(uploadedFiles.length != 0){  
      mysql.db.query( mysqlQuery2,function(err,files){
          if(err) res.send('Failed to add product');
          res.json(products.insertId);
      });
    }else{
      res.json(products.insertId);
    }
  });
     
};



