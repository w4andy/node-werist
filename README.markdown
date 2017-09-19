# node-werist

**_A whois client for node.js_**



_Wer ist are the German words for who is_

[![Build Status](https://travis-ci.org/w4andy/node-werist.svg?branch=master)](https://travis-ci.org/w4andy/node-werist)

## Table of Contents

 - [ChangeLog](https://github.com/w4andy/node-werist/blob/master/CHANGELOG.markdown)
 - [License](https://github.com/w4andy/node-werist/blob/master/LICENSE)
 - [Usage](#usage)
 - [Credit](#credit)

## Installation

```
$ npm install werist
```

## Usage

### With Class

```js
const Werist = require('werist').Werist;
const werist = new Werist(); 
werist.lookup('google.com', function(err, data) {
  console.log(data)
})
```


### Without Class

```js
const werist = require('werist')
werist.lookup('google.com', function(err, data) {
  console.log(data)
})
```


You may pass an object in between the address and the callback function to tweak the behavior of the lookup function:

```js
{
  "server": null,   // this can be a string ("host:port"); leaving it empty then werist chooses the server 
  "follow": 2,      // number of times to follow redirects
  "timeout": 0,     // socket timeout, excluding this doesn't override any default timeout value
  "verbose": false, // setting this to true returns an array of responses from all servers
  "bind": null,     // bind the socket to a local IP address
  "proxy": {        // Socks Proxy
    "ipaddress": null,
    "port": 0,
    "type": 5       // or 4
  }
}
```

## Credit


node-werist is inspired by [rfc1036/whois](https://github.com/rfc1036/whois) and [FurqanSoftware/node-whois](https://github.com/FurqanSoftware/node-whois)
