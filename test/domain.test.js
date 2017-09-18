'use strict';

/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */

const assert = require('assert');
const werist = require('../');


suite('domain', function() {
  this.timeout(5000);
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

  test('charset iso-2022-jp - google.co.jp', (done) => {
    werist.lookup('google.co.jp', (err, data) => {
      if (err) {
        return done(err);
      }
      assert.notStrictEqual(data.toLocaleLowerCase().indexOf('a. [domain name]                google.co.jp'), -1);
      done();
    });
  });

  test('charset cp1251 - google.kg', (done) => {
    werist.lookup('google.kg', (err, data) => {
      if (err) {
        return done(err);
      }
      assert.notStrictEqual(data.toLocaleLowerCase().indexOf('domain google.kg'), -1);
      done();
    });
  });

  test('charset windows-1252 - google.tn', (done) => {
    werist.lookup('google.tn', (err, data) => {
      if (err) {
        return done(err);
      }
      assert.notStrictEqual(data.toLocaleLowerCase().indexOf('domain:.............google.tn'), -1);
      done();
    });
  });

  test('charset iso-8859-9 - nic.tr', (done) => {
    werist.lookup('nic.tr', (err, data) => {
      if (err) {
        return done(err);
      }
      assert.notStrictEqual(data.toLocaleLowerCase().indexOf('** sponsoring organisation'), -1);
      done();
    });
  });

  test('referral server with invalid host', (done) => {
    werist.lookup('cwcom.net', (err, data) => {
      if (err) {
        return done(err);
      }
      assert.notStrictEqual(data.indexOf('Domain Name: CWCOM.NET'), -1);
      done();
    });
  });
});
