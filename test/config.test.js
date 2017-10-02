'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
const assert = require('assert');
const Ajv = require('ajv');
const ajv = new Ajv();


suite('config', function() {
  suiteSetup((done) => done());
  suiteTeardown((done) => done());


  test('server.json', () => {
    const serverJson = require('../etc/server.json');
    assert.strictEqual(ajv.validate({
      type: 'object',
      patternProperties: {
        '^[a-z.]+$': {
          type: 'object',
          properties: {
            query: {type: 'string'},
            domainQuery: {type: 'string'},
            ipQuery: {type: 'string'},
            handleQuery: {type: 'string'},
            asQuery: {type: 'string'},
            punycode: {type: 'boolean'},
            port: {type: 'number'}
          }
        }
      }
    }, serverJson), true);
  });

  test('tld.json', () => {
    const tldJson = require('../etc/tld.json');
    assert.strictEqual(ajv.validate({
      type: 'object',
      patternProperties: {
        '^[a-z0-9-]+$': {
          type: ['string', 'null']
        }
      }
    }, tldJson), true);
  });

  test('ip_range.json', () => {
    const ipRange = require('../etc/ip_range.json');
    assert.strictEqual(ajv.validate({
      type: 'array',
      items: {
        type: 'object',
        properties: {
          range: {type: 'string'},
          server: {type: ['string', 'null']}
        }
      }
    }, ipRange), true);
  });

  test('ip6_range.json', () => {
    const ipRange = require('../etc/ip6_range.json');
    assert.strictEqual(ajv.validate({
      type: 'array',
      items: {
        type: 'object',
        properties: {
          range: {type: 'string'},
          server: {type: ['string', 'null']}
        }
      }
    }, ipRange), true);
  });
});
