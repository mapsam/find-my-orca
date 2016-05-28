var nodemailer = require('nodemailer');

var user = process.env.EMAIL_USER;
var password = process.env.EMAIL_PASSWORD;

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: user,
        pass: password
    },
    logger: true, // log to console
    debug: true // include SMTP traffic in the logs
}, {
    from: 'Find My ORCA <findmyorca.test@gmail.com>'
});

function send(name, toEmail, findersEmail, callback) {
  console.log(name, toEmail, findersEmail);
  var message = {
    to: '"'+name+'" <'+toEmail+'>',
    subject: 'Your ORCA card was found!', //
    text: 'Your ORCA Card was reported was found! '+findersEmail+' has reported the number from your card as "found". Contact them to start coordinating how to get your card back!',
    html: '<p><b>Your ORCA Card was reported was found!</b> A lovely citizen has reported the number from your card as "found". Their info is below so you can begin coordinate how to get your card back.</p>' +
          '<p>Email: '+findersEmail+'</p>',
    watchHtml: 'Your ORCA Card has been found!'
  };

  console.log('Sending Mail');
  transporter.sendMail(message, function (error, info) {
    if (error) {
      console.log('Error occurred');
      console.log(error.message);
      return callback(error.message);
    }
    console.log('Message sent successfully!');
    console.log('Server responded with "%s"', info.response);
    callback(null, info);
  });
}

module.exports = send;