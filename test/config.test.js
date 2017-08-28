'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
const assert = require('assert');
const common = require('./common');
const mglValidate = require('mgl-validate');


suite('config', function() {
  let registry = new mglValidate({breakOnError: true});

  suiteSetup((done) => {
    registry.addSchema({
      id: 'server.json',
      type: 'object',
      properties: {
        '*': {
          type: 'object',
          properties: {
            charset: {
              type: 'string'
            },
            domainParameter: {
              type: 'string',
              optional: true
            },
            ipParameter: {
              type: 'string',
              optional: true
            },
            handleParameter: {
              type: 'string',
              optional: true
            },
            asParameter: {
              type: 'string',
              optional: true
            },
            punycode: {
              type: 'boolean',
              optional: true
            },
            port: {
              type: 'number',
              optional: true
            }
          }
        }
      }
    });
    registry.addSchema({
      id: 'tld.json',
      type: 'object',
      properties: {
        '*': {
          type: 'string',
          allowNullValue: true
        }
      }
    });
    done();
  });
  suiteTeardown((done) => done());


  test('server.json', () => {
    const serverJson = require('../etc/server.json');
    const errors = registry.test('server.json', serverJson);
    assert.strictEqual(errors, null);
  });

  test('tld.json', () => {
    const tldJson = require('../etc/tld.json');
    const errors = registry.test('tld.json', tldJson);
    assert.strictEqual(errors, null);
  });

});
