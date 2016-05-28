var test = require('tape');
var Validation = require('../lib/validation.js');

console.log('> VALIDATION TESTS')

test('validation: errors with empty body', function(t) {
  Validation({}, true, function(err) {
    t.ok(err, 'errors');
    t.equal(err.length, 7, 'all errors');
    t.end();
  });
});

test('Validation: invalid ORCA ID', function(t) {
  Validation({
    fname: 'Test',
    lname: 'Tester',
    orcaid: 'i2345678',
    sorcaid: '567',
    email: 'test@example.com'
  }, true, function(err) {
    t.ok(err);
    t.equal(err.length, 1, 'one error reported');
    t.equal(err[0].code, 'EINVALIDORCAID');
    t.end();
  });
});

test('Validation: invalid secondary ORCA ID', function(t) {
  Validation({
    fname: 'Test',
    lname: 'Tester',
    orcaid: '12345678',
    sorcaid: '567b',
    email: 'test@example.com'
  }, true, function(err) {
    t.ok(err);
    t.equal(err.length, 2, 'two errors reported');
    t.equal(err[0].code, 'EINVALIDSORCAID');
    t.equal(err[1].code, 'EINVALIDSORCAID');
    t.end();
  });
});

test('Validation: invalid registration email', function(t) {
  Validation({
    fname: 'Test',
    lname: 'Tester',
    orcaid: '12345678',
    sorcaid: '567',
    email: 'invalidemail'
  }, true, function(err) {
    t.ok(err);
    t.equal(err.length, 1, 'one error reported');
    t.equal(err[0].code, 'EINVALIDEMAIL');
    t.end();
  });
});

test('Validation: valid registration', function(t) {
  Validation({
    fname: 'Test',
    lname: 'Tester',
    orcaid: '12345678',
    sorcaid: '567',
    email: 'test@example.com'
  }, true, function(err) {
    t.notOk(err, 'no errors');
    t.end();
  });
});

test('Validation: invalid non-registration (found a card)', function(t) {
  Validation({}, false, function(err) {
    t.ok(err);
    t.equal(err.length, 5, 'all errors')
    t.end();
  });
});

test('Validation: invalid finders email', function(t) {
  Validation({
    orcaid: '12345678',
    sorcaid: '123',
    findersemail: 'ifoundit'
  }, false, function(err) {
    t.ok(err);
    t.equal(err.length, 1, 'one error');
    t.equal(err[0].code, 'EINVALIDFINDERSEMAIL');
    t.end();
  });
});

test('Validation: valid non-registration', function(t) {
  Validation({
    orcaid: '12345678',
    sorcaid: '123',
    findersemail: 'finder@example.com'
  }, false, function(err) {
    t.notOk(err);
    t.end();
  });
});