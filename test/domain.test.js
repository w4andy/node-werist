'use strict';

/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */

const assert = require('assert');
const werist = require('../');


suite('domain', function() {
  this.timeout(10000);
  suiteSetup((done) => done());
  suiteTeardown((done) => done());

  test('google.com', (done) => {
    werist.lookup('google.com', (err, data) => {
      if (err) {
        return done(err);
      }
      assert.notStrictEqual(data.toLocaleLowerCase().indexOf('domain name: google.com'), -1);
      done();
    });
  });

  test('idn - küche.de', (done) => {
    werist.lookup('küche.de', (err, data) => {
      if (err) {
        return done(err);
      }
      assert.notStrictEqual(data.toLocaleLowerCase().indexOf('domain: küche.de'), -1);
      done();
    });
  });

  test('idn - küche.at', (done) => {
    werist.lookup('küche.at', (err, data) => {
      if (err) {
        return done(err);
      }
      assert.notStrictEqual(data.toLocaleLowerCase().indexOf('domain:         xn--kche-0ra.at'), -1);
      done();
    });
  });

  test('charset - google.tn', (done) => {
    werist.lookup('google.tn', (err, data) => {
      if (err) {
        return done(err);
      }

      assert.notStrictEqual(data.toLocaleLowerCase().indexOf('domain name.........: google.tn'), -1);
      assert.notStrictEqual(data.indexOf('ccTLDs : .tn , .تونس'), -1);
      done();
    });
  });

  test('nato.int', (done) => {
    werist.lookup('nato.int', (err, data) => {
      if (err) {
        return done(err);
      }
      assert.notStrictEqual(data.toLocaleLowerCase().indexOf('organisation: north atlantic treaty organization'), -1);
      done();
    });
  });

  test('cme.coop - non existing Registrar WHOIS Server', (done) => {
    werist.lookup('cme.coop', (err, data) => {
      if (err) {
        return done(err);
      }
      assert.notStrictEqual(data.toLocaleLowerCase().indexOf('registry domain id: d7876879-cnic'), -1);
      done();
    });
  });

  test('pirelli.com - don\t follow the non verisign-grs.com whois server', (done) => {
    werist.lookup('pirelli.com', (err, data) => {
      if (err) {
        return done(err);
      }
      assert.notStrictEqual(data.toLocaleLowerCase().indexOf('registrant organization: pirelli & c. s.p.a.'), -1);
      done();
    });
  });
});
