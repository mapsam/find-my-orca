// Returns a standard Node.js HTTP server
var dynalite = require('dynalite');
var AWS = require('aws-sdk');
var test = require('tape');
var server = dynalite({path: './findmyorcatest', createTableMs: 50});
var host = 'http://localhost:4507';

process.env.AWS_ENDPOINT = host;
process.env.DYNAMODB_TABLE_NAME = 'FindMyOrcaTest';

// load in test data
function setupClient(callback) {
  var dynamodb = new AWS.DynamoDB({endpoint: host});

  dynamodb.listTables(function(err, data) {
    console.log(data);
    callback();
  });

  // var params = {
  //   TableName : process.env.DYNAMODB_TABLE_NAME,
  //   KeySchema: [       
  //     { AttributeName: "ID", KeyType: "HASH"}
  //   ],
  //   AttributeDefinitions: [       
  //     { AttributeName: "ID", AttributeType: "N" }
  //     // { AttributeName: "sID", AttributeType: "N" },
  //     // { AttributeName: "FirstName", AttributeType: "S" },
  //     // { AttributeName: "LastName", AttributeType: "S" },
  //     // { AttributeName: "Email", AttributeType: "S" },
  //     // { AttributeName: "FindersEmail", AttributeType: "S" }
  //   ],
  //   ProvisionedThroughput: {       
  //     ReadCapacityUnits: 10, 
  //     WriteCapacityUnits: 10
  //   }
  // };

  // console.log('going to create a table now');

  // dynamodb.createTable(params, function(err, data) {
  //   if (err) {
  //     console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
  //     return callback(err);
  //   } else {
  //     console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
  //     return callback();
  //   }
  // });
  
}

function loadData() {};
function clearDB() {};

// stop the dynalite server when the tests are complete
test.onFinish(function() {
  server.close();
});

// start up a server, load data, run tests
server.listen(4507, function(err) {
  if (err) throw err;
  var testDB = require('../lib/db.js');
  
  setupClient(function(err) {
    if (err) throw err;

    test('this is a test', function(t) {
      console.log('now we have a test');
      t.end();
    });

    test('another test', function(t) {
      console.log('finished the test');
      t.end();
    });
  });
});