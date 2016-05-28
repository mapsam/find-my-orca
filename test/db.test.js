var AWS = require('aws-sdk');
var db = require('../lib/db.js');

AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

var client = new AWS.DynamoDB.DocumentClient();
var table = 'FindMyOrcaTest';

var item = {
  fname: "Sam",
  lname: "Matthews",
  email: "matthews.sam@gmail.com",
  orcaid: 12345678,
  sorcaid: 123
};

db.put(item, function(err, data) {
  if (err) throw err;
  console.log('success!');
  console.log(data)
});