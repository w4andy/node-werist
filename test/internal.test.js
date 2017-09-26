'use strict';

/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */

const assert = require('assert');
const werist = require('../');

suite('internal', function() {
  this.timeout(10000);
  suiteSetup((done) => done());
  suiteTeardown((done) => done());

  test('init Class', () => {
    const weristClass = new werist.Werist();
    assert.strictEqual(weristClass instanceof werist.Werist, true);
  });

  test('google.com via whois.iana.org', (done) => {
    werist.lookup('google.com', {server: 'whois.iana.org', verbose: true}, (err, data) => {
      if (err) {
        return done(err);
      }
      assert.strictEqual(data.length, 2);
      assert.strictEqual(data[0] && data[0].server && typeof data[0].server === 'object', true);
      assert.notStrictEqual(data[0].server.host, 'whois.iana.org');
      done();
    });
  });

  test('google.de via whois.iana.org:43', (done) => {
    werist.lookup('google.de', {server: 'whois.iana.org:43', verbose: true}, (err, data) => {
      if (err) {
        return done(err);
      }
      assert.strictEqual(data.length, 1);
      assert.strictEqual(data[0] && data[0].server && typeof data[0].server === 'object', true);
      assert.notStrictEqual(data[0].server.host, 'whois.iana.org');
      done();
    });
  });

  test('invalid server', (done) => {
    werist.lookup('google.com', {server: 'whois.iana.org:43:', verbose: true}, (err, data) => {
      assert.strictEqual(data, undefined);
      assert.strictEqual(err.message, 'invalid server');
      done();
    });
  });

  test('query invalid tld via whois.iana.org', (done) => {
    werist.lookup('google.werist', {server: 'whois.iana.org', verbose: true}, (err, data) => {
      if (err) {
        return done(err);
      }
      assert.strictEqual(data.length, 0);
      done();
    });
  });
});
