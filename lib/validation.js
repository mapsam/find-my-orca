var isEmail = require('validator').isEmail;

/*
 * Validation of form body values
 * The form uses standard HTML5 validation, this catches anything else
 * @returns {Array} errors - an array of errors handled by the views to parse individual errors
 */
module.exports = function(body, registration, callback) {
  var errors = [];

  // initial check for values
  if (!body.orcaid) errors.push({type: 'error', message: 'No ORCA ID provided'});
  if (!body.sorcaid) errors.push({type: 'error', message: 'No secondary ORCA ID provided'});

  // if this is coming from the registration form, validate names as well
  if (registration) {
    var array = validateNames(body);
    errors.concat(array);
  } else {
    if (!isEmail(body.findersemail)) errors.push({type: 'error', message: 'Not a valid email'});
  }

  // validate orca id (must be an integer)
  try {
    var orcaid = parseInt(body.orcaid);
  } catch(err) {
    errors.push({type: 'error', message: 'ORCA ID must be a valid number. Example: 12345678'});
  }

  // validate secondary orca id (must be an integer, length of three)
  try {
    var sorcaid = parseInt(body.sorcaid);
  } catch(err) {
    errors.push({type: 'error', message: 'Secondary ORCA ID must be a valid number. Example: 12345678'});
  }
  if (body.sorcaid.length !== 3) errors.push({type: 'error', message: 'Secondary ORCA ID must be three numbers'});

  // email validation

  if (errors.length > 0) {
    return callback(errors);
  } else {
    return callback();
  }
}

/*
 * Used to validate first and last name for the registration form
 */
function validateNames(body) {
  var errors = [];
  if (!body.fname) errors.push({type: 'error', message: 'No first name provided'});
  if (!body.lname) errors.push({type: 'error', message: 'No last name provided'});
  if (!body.email) errors.push({type: 'error', message: 'No email provided'});
  if (!isEmail(body.email)) errors.push({type: 'error', message: 'Not a valid email'});
  return errors;
}