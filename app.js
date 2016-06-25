var express = require('express'),
    ejs = require('ejs'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
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
app.use(session({
  secret: uuid.v4(),
  resave: false,
  saveUninitialized: false
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

// routes
app.get('/', function(req, res) {
  if (req.session.notes) {
    app.locals.notes = req.session.notes;
    req.session.notes = null;
    req.session.destroy();
  }
  return res.render('./index.html');
});

app.get('/register', function(req, res) {
  return res.render('./register.html');
});

app.post('/register', function(req, res) {
  validate(req.body, true, function(errors) {
    if (errors) {
      console.log('validation error')
      app.locals.notes = errors;
      return res.render('./register.html');
    }

    db.register(req.body, function(err, data) {
      if (err) {
        console.log('already exists')
        app.locals.notes = [err];
        return res.render('./register.html');
      }

      req.session.notes = [{type: 'success', message: 'ORCA ID added successfully!'}];
      return res.redirect('/');
    });
  });
});

app.get('/found', function(req, res) {
  return res.render('./found.html');
});

app.post('/found', function(req, res) {
  validate(req.body, false, function(errors) {
    if (errors) {
      app.locals.notes = errors;
      return res.render('./found.html');
    }

    db.found(req.body, function(err, data) {
      if (err) {
        app.locals.notes = [err];
        return res.render('./found.html');
      }

      req.session.notes = data;
      return res.redirect('/');
    });
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});