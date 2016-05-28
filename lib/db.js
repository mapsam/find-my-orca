var AWS = require('aws-sdk');

AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

var client = new AWS.DynamoDB.DocumentClient();
var table = 'FindMyOrcaTest';

/* 
 * Put a new item in the database
 * This responds as an error if the item already exists so we can warn the user
 */
module.exports.register = function(item, callback) {
  var params = {
    TableName: table,
    Item:{
      "ID": parseInt(item.orcaid),
      "sID": parseInt(item.sorcaid),
      "FirstName": item.fname,
      "LastName": item.lname,
      "Email": item.email
    },
    Expected: {
      ID: { Exists: false }
    }
  };

  client.put(params, function(err, data) {
    if (err) {
      if (err.code === 'ConditionalCheckFailedException') {
        return callback({type: 'info', message: 'ORCA card has already been registered.'});
      }
      return callback({type: 'error', message: 'There was an error. Please contact us!'});
    } else {
      return callback(null, data);
    }
  });
};

/*
 * If a card is found, read from the DB
 * If the card ID already exists, respond positively and also email the owner
 * If a card does not exist, add it to the database of registered cards
 */
module.exports.found = function(item, callback) {
  var params = {
    TableName: table,
    Key: {
      "ID": parseInt(item.orcaid)
    }
  };

  client.get(params, function(err, data) {
    if (err) {
      callback({type: 'error', message: 'There was an error. Please contact us!'});
    }

    if (data && data['Item']) {
      sendEmail();
      return callback(null, [{type: 'success', message: 'We found a matching ORCA ID! The owner has been notified via email.'}]);
    } else {
      var putItem = {
        TableName: table,
        Item: {
          "ID": parseInt(item.orcaid),
          "sID": parseInt(item.sorcaid),
          "FoundEmail": item.findersemail
        }
      };

      // try to create it
      client.put(putItem, function(err, data) {
        if (err) return callback({type: 'error', message: 'There was an error. Please contact us!'});
        return callback(null, [{type: 'info', message: 'The ORCA ID has not been registered. It has been added to the database.'}]);
      });
    }
  })
};

function sendEmail() {
  console.log('sending email');
}