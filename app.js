var express = require('express'),
    ejs = require('ejs'),
    bodyParser = require('body-parser'),
    uuid = require('node-uuid'),
    validate = require('./lib/validation.js'),
    db = require('./lib/db.js');

// setup
// var docClient = new AWS.DynamoDB.DocumentClient();
var app = express();
module.exports.app = app;
app.set('port', (process.env.PORT || 8081));
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

// routes
app.get('/', function(req, res) {
  if (req.query.status === 'success') {
    res.locals.notes = [{type: 'success', message: 'ORCA ID added successfully!'}];
  }

  if (req.query.status === 'found') {
    res.locals.notes = [{type: 'success', message: 'We found a matching ORCA ID! The owner has been notified via email.'}]
  }

  if (req.query.status === 'added') {
    res.locals.notes = [{type: 'info', message: 'The ORCA ID has not been registered. It has been added to the database.'}];
  }

  return res.render('./index.html');
});

app.get('/register', function(req, res) {
  return res.render('./register.html');
});

app.post('/register', function(req, res) {
  validate(req.body, true, function(errors) {
    if (errors) {
      return res.render('./register.html', {notes: errors});
    }

    db.register(req.body, function(err, data) {
      if (err) {
        return res.render('./register.html', {notes: [err]});
      }

      return res.redirect('/?status=success');
    });
  });
});

app.get('/found', function(req, res) {
  return res.render('./found.html');
});

app.post('/found', function(req, res) {
  validate(req.body, false, function(errors) {
    if (errors) {
      return res.render('./found.html', {notes: errors});
    }

    db.found(req.body, function(err, data) {
      if (err) {
        return res.render('./found.html', {notes: [err]});
      }

      return res.redirect('/?status=' + data);
    });
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});