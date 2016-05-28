var isEmail = require('validator').isEmail;

/*
 * Validation of form body values
 * The form uses standard HTML5 validation, this catches anything else
 * @returns {Array} errors - an array of errors handled by the views to parse individual errors
 */
module.exports = function(body, registration, callback) {
  var errors = [];

  // initial check for values
  if (!body.orcaid) errors.push({code: 'EINVALIDORCAID', type: 'error', message: 'No ORCA ID provided'});
  if (!body.sorcaid) errors.push({code: 'EINVALIDSORCAID', type: 'error', message: 'No secondary ORCA ID provided'});

  // if this is coming from the registration form, validate names/email as well
  if (registration) {
    var array = validateNames(body);
    
    if (!errors.length) {
      errors = array;
    } else {
      errors = errors.concat(array);
    }
  } else {
    // otherwise this is from the "found" route
    if (!body.findersemail) {
      errors.push({code: 'EINVALIDFINDERSEMAIL', type: 'error', message: 'No email provided'});
    } else {
      if (!isEmail(body.findersemail)) errors.push({code: 'EINVALIDFINDERSEMAIL', type: 'error', message: 'Not a valid email'});
    }
  }

  // validate orca id (must be an integer)
  if (isNaN(body.orcaid % 1)) {
    errors.push({code: 'EINVALIDORCAID', type: 'error', message: 'ORCA ID must be a valid number. Example: 12345678'});
  }

  // validate secondary orca id (must be an integer, length of three)
  if (isNaN(body.sorcaid % 1)) {
    errors.push({code: 'EINVALIDSORCAID', type: 'error', message: 'Secondary ORCA ID must be a valid number. Example: 12345678'});
  }
  if (body.sorcaid && body.sorcaid.length !== 3) {
    errors.push({code: 'EINVALIDSORCAID', type: 'error', message: 'Secondary ORCA ID must be three numbers'});
  }

  if (errors.length > 0) {
    return callback(errors);
  } else {
    return callback();
  }
}

/*
 * Used to validate first/last name/email for the registration form
 */
function validateNames(body) {
  var errors = [];
  if (!body.fname) errors.push({code: 'EINVALIDFNAME', type: 'error', message: 'No first name provided'});
  if (!body.lname) errors.push({code: 'EINVALIDLNAME', type: 'error', message: 'No last name provided'});
  // only test email validity if the field exists
  if (!body.email) {
    errors.push({code: 'EINVALIDEMAIL', type: 'error', message: 'No email provided'});
  } else {
    if (!isEmail(body.email)) errors.push({code: 'EINVALIDEMAIL', type: 'error', message: 'Not a valid email'});
  }
  return errors;
}