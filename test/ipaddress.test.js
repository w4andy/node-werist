'use strict';

/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */

const assert = require('assert');
const werist = require('../');
const util = require('util');

suite('ip address', function() {
  this.timeout(5000);
  suiteSetup((done) => done());
  suiteTeardown((done) => done());

  test('AFRINIC IPv4', (done) => {
    werist.lookup('196.208.156.226', {verbose: true}, (err, data) => {
      if (err) {
        return done(err);
      }
      assert.strictEqual(data.length, 1);
      assert.strictEqual(util.isObject(data[0].server), true);
      assert.strictEqual(data[0].server.host, 'whois.afrinic.net');
      assert.notStrictEqual(data[0].data.indexOf('This is the AfriNIC Whois server'), -1);
      done();
    });
  });

  test('AFRINIC IPv6', (done) => {
    werist.lookup('2001:42d0:0:200::6', {verbose: true}, (err, data) => {
      if (err) {
        return done(err);
      }
      assert.strictEqual(data.length, 1);
      assert.strictEqual(util.isObject(data[0].server), true);
      assert.strictEqual(data[0].server.host, 'whois.afrinic.net');
      assert.notStrictEqual(data[0].data.indexOf('This is the AfriNIC Whois server'), -1);
      done();
    });
  });

  test('APNIC IPv4', (done) => {
    werist.lookup('14.130.123.10', {verbose: true}, (err, data) => {
      if (err) {
        return done(err);
      }
      assert.strictEqual(data.length, 1);
      assert.strictEqual(util.isObject(data[0].server), true);
      assert.strictEqual(data[0].server.host, 'whois.apnic.net');
      assert.notStrictEqual(data[0].data.indexOf('[whois.apnic.net]'), -1);
      done();
    });
  });

  test('APNIC IPv6', (done) => {
    werist.lookup('2400:cb00:2048:1::6814:3bc2', {verbose: true}, (err, data) => {
      if (err) {
        return done(err);
      }
      assert.strictEqual(data.length, 1);
      assert.strictEqual(util.isObject(data[0].server), true);
      assert.strictEqual(data[0].server.host, 'whois.apnic.net');
      assert.notStrictEqual(data[0].data.indexOf('[whois.apnic.net]'), -1);
      done();
    });
  });

  test('LACNIC IPv4', (done) => {
    werist.lookup('200.208.156.226', {verbose: true}, (err, data) => {
      if (err) {
        return done(err);
      }
      assert.strictEqual(data.length, 1);
      assert.strictEqual(util.isObject(data[0].server), true);
      assert.strictEqual(data[0].server.host, 'whois.lacnic.net');
      assert.notStrictEqual(data[0].data.indexOf('Joint Whois - whois.lacnic.net'), -1);
      done();
    });
  });

  test('LACNIC IPv6', (done) => {
    werist.lookup('2001:13c7:7002:4000::10', {verbose: true}, (err, data) => {
      if (err) {
        return done(err);
      }
      assert.strictEqual(data.length, 1);
      assert.strictEqual(util.isObject(data[0].server), true);
      assert.strictEqual(data[0].server.host, 'whois.lacnic.net');
      assert.notStrictEqual(data[0].data.indexOf('Joint Whois - whois.lacnic.net'), -1);
      done();
    });
  });

  test('RIPE IPv4', (done) => {
    werist.lookup('77.208.156.226', {verbose: true}, (err, data) => {
      if (err) {
        return done(err);
      }
      assert.strictEqual(data.length, 1);
      assert.strictEqual(util.isObject(data[0].server), true);
      assert.strictEqual(data[0].server.host, 'whois.ripe.net');
      assert.notStrictEqual(data[0].data.indexOf('This is the RIPE Database query service.'), -1);
      done();
    });
  });

  test('RIPE IPv6', (done) => {
    werist.lookup('2001:67c:2e8:22::c100:68b', {verbose: true}, (err, data) => {
      if (err) {
        return done(err);
      }
      assert.strictEqual(data.length, 1);
      assert.strictEqual(util.isObject(data[0].server), true);
      assert.strictEqual(data[0].server.host, 'whois.ripe.net');
      assert.notStrictEqual(data[0].data.indexOf('This is the RIPE Database query service.'), -1);
      done();
    });
  });

  test('ReferralServer check', (done) => {
    werist.lookup('204.45.120.19', {verbose: true}, (err, data) => {
      if (err) {
        return done(err);
      }
      assert.strictEqual(data.length, 2);
      assert.strictEqual(util.isObject(data[0].server), true);
      assert.strictEqual(data[0].server.host, 'whois.arin.net');
      assert.notStrictEqual(data[0].data.indexOf('ARIN WHOIS data and services are subject'), -1);
      assert.strictEqual(util.isObject(data[1].server), true);
      assert.strictEqual(data[1].server.host, 'rwhois.fdcservers.net');
      assert.notStrictEqual(data[1].data.indexOf('rwhois V-1.5:003fff:00 rwhois.fdcservers.net'), -1);
      done();
    });
  });

  test('not working ReferralServer', (done) => {
    werist.lookup('66.254.122.108', {verbose: true}, (err, data) => {
      if (err) {
        return done(err);
      }
      assert.strictEqual(data.length, 1);
      assert.strictEqual(util.isObject(data[0].server), true);
      assert.strictEqual(data[0].server.host, 'whois.arin.net');
      assert.notStrictEqual(data[0].data.indexOf('ARIN WHOIS data and services are subject'), -1);
      done();
    });
  });

  test('IPv6 - IPv4-mapped addresses', (done) => {
    werist.lookup('ffff::77.208.156.226', {verbose: true}, (err, data) => {
      if (err) {
        return done(err);
      }
      assert.strictEqual(data.length, 1);
      assert.strictEqual(util.isObject(data[0].server), true);
      assert.strictEqual(data[0].server.host, 'whois.ripe.net');
      assert.notStrictEqual(data[0].data.indexOf('This is the RIPE Database query service.'), -1);
      done();
    });
  });

  test('connection refused ReferralServer', (done) => {
    werist.lookup('209.91.128.30', {verbose: true}, (err, data) => {
      if (err) {
        return done(err);
      }
      assert.strictEqual(data.length, 1);
      assert.strictEqual(util.isObject(data[0].server), true);
      assert.strictEqual(data[0].server.host, 'whois.arin.net');
      assert.notStrictEqual(data[0].data.indexOf('NetRange:       209.91.128.0 - 209.91.191.255'), -1);
      done();
    });
  });

});

