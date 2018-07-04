# [node-werist](https://github.com/w4andy/node-werist/blob/master/README.markdown) ChangeLog

## 2018-07-04 node-werist, [v0.3.2](https://github.com/w4andy/node-werist/tree/v0.3.2)

### Commits

  - [[`6ba3ad2109`](https://github.com/w4andy/node-werist/commit/6ba3ad2109b35de175fbdb879d923f9b7ca6bfa0)] - **deps**: ip-address v5.8.9, punycode v2.1.1, tldjs v2.3.1, socks v2.2.0, detect-character-encoding v0.6.0, ajv v6.5.1, eslint v5.0.0, eslint-plugin-node v6.0.1, mocha v5.2.0, nyc v12.0.2
  - [[`697e249747`](https://github.com/w4andy/node-werist/commit/697e2497474c404e0bd16676f8ec7ebcae24d00d)] - **etc**: update server charset and update tld server
  - [[`07f9011aec`](https://github.com/w4andy/node-werist/commit/07f9011aecdd414a787057d52327a1e0d225ffc6)] - **test**: fix tests
  - [[`25ea57f6b5`](https://github.com/w4andy/node-werist/commit/25ea57f6b53d75c5c0e0f757ba4d09ef29e04b02)] - **test**: update eslint config
  - [[`dbb3c1e249`](https://github.com/w4andy/node-werist/commit/dbb3c1e249061f660cd930a9943db35cc1925c0b)] - **travis.yml**: update node.js versions

## 2017-11-13 node-werist, [v0.3.1](https://github.com/w4andy/node-werist/tree/v0.3.1)

### Commits

  - [[`747b2c5a93`](https://github.com/w4andy/node-werist/commit/747b2c5a930fb6d4710e10164a64e059951f0282)] - **deps**: ajv v5.3.0, eslint v4.11.0, eslint-plugin-node v5.2.1, nyc, v11.3.0
  - [[`401fcc66dc`](https://github.com/w4andy/node-werist/commit/401fcc66dc461168576a5f370665b2e036205b17)] - **lib/werist**: fix if the whois server response a empty body
  - [[`405f2827cb`](https://github.com/w4andy/node-werist/commit/405f2827cb356110e550bb86af45f60c859bf184)] - **test**: add node.js v9 to .travis.yml
  - [[`3ba1966d3b`](https://github.com/w4andy/node-werist/commit/3ba1966d3bc1f94a335e341d59f13739efca1b63)] - **test**: remove test for ip 209.91.128.30

## 2017-10-08 node-werist, [v0.3.0](https://github.com/w4andy/node-werist/tree/v0.3.0)

### Commits

  - [[`fda370ab20`](https://github.com/w4andy/node-werist/commit/fda370ab202e956ccf69c16f31fdebcb6be1a682)] - **deps**: mocha v4.0.1
  - [[`57e4546cbc`](https://github.com/w4andy/node-werist/commit/57e4546cbc190f2c42c18bfcfd5a664050ff5b6c)] - **deps**: ajv v5.2.3, eslint v4.8.0, eslint-plugin-node v5.2.0
  - [[`3ef717c7c6`](https://github.com/w4andy/node-werist/commit/3ef717c7c6c23c097b28e222445bbc08dbb73973)] - **lib/werist**: domain query follow only verisign-grs.com and iana.org server responses
  - [[`54a948fbf2`](https://github.com/w4andy/node-werist/commit/54a948fbf2564541b9647045441378dcadbb5d1b)] - **lib/werist**: find the responsible whois server after reallocated the ip range
  - [[`b675a00fc8`](https://github.com/w4andy/node-werist/commit/b675a00fc843afd1cec0b6ac811d207ab702dc6e)] - **lib/werist**: refactor the the request to use the context object
  - [[`526bb40068`](https://github.com/w4andy/node-werist/commit/526bb4006884db8a4aed6591fc53a140de747c7c)] - **lib/werist**: add whois server charset detection

## 2017-09-27 node-werist, [v0.2.4](https://github.com/w4andy/node-werist/tree/v0.2.4)

### Commits

  - [[`ef480e1837`](https://github.com/w4andy/node-werist/commit/ef480e1837b3f33e55f22ee3a81f0cd68e75787c)] - **etc/server**: sort list
  - [[`b4ed866a7c`](https://github.com/w4andy/node-werist/commit/b4ed866a7c60aa556b261d05d5509a3ca621fc36)] - **lib**: deprecated functions removed
  - [[`90be1da286`](https://github.com/w4andy/node-werist/commit/90be1da2866da6a4b5288d8840f347cda98121f1)] - **lib/werist**: fix find ReferralServer
  - [[`77268a6ce3`](https://github.com/w4andy/node-werist/commit/77268a6ce34da670896dd5908afb76068f893a3f)] - **test**: fix .eslintrc format

## 2017-09-24 node-werist, [v0.2.3](https://github.com/w4andy/node-werist/tree/v0.2.3)

### Commits

  - [[`0fc94561ae`](https://github.com/w4andy/node-werist/commit/0fc94561aedf5b60a898d3671a05eb24a09b850f)] - **doc**: fix typo
  - [[`e362b37463`](https://github.com/w4andy/node-werist/commit/e362b374634e4c6bd06f5de87142cba05a8f248a)] - **etc/server**: cleanup remove all server with default charset
  - [[`f02fa69b0f`](https://github.com/w4andy/node-werist/commit/f02fa69b0fe82d147a5f1ea34dbe996a1152c4a0)] - **etc/server**: remove verisign-grs from the server config
  - [[`8e2ba33301`](https://github.com/w4andy/node-werist/commit/8e2ba33301e80bdf8723c2bed94e67f9849b8ebc)] - **etc/tld**: update tld list
  - [[`db8d592f69`](https://github.com/w4andy/node-werist/commit/db8d592f69f024d2166b1a18dd64bb920fb66aa6)] - **etc/tld**: remove dead whois server
  - [[`1c2132ee0f`](https://github.com/w4andy/node-werist/commit/1c2132ee0f7642978b6f0772ca06105e3c9a7959)] - **etc/tld**: update tld server list

## 2017-09-21 node-werist, [v0.2.2](https://github.com/w4andy/node-werist/tree/v0.2.2)

### Commits

  - [[`be2d5098c8`](https://github.com/w4andy/node-werist/commit/be2d5098c8b5bd30bb2f724d56fb1a7a272bac33)] - **deps**: eslint v4.7.2
  - [[`71b7f81560`](https://github.com/w4andy/node-werist/commit/71b7f8156021d5ad26a5df2f104c84eb1debd277)] - **etc**: update tld list
  - [[`9de756648e`](https://github.com/w4andy/node-werist/commit/9de756648e54f9a0865a522bb1aa8f3050958c5b)] - **lib/werist**: fix find whois server via whois.iana.org
  - [[`4e8c94e824`](https://github.com/w4andy/node-werist/commit/4e8c94e824d9ffd37ba53bcfc100fec21faf0200)] - **lib/werist**: check the whois.iana.org response if one object was found
  - [[`2916c8ef1c`](https://github.com/w4andy/node-werist/commit/2916c8ef1cb6b798195cded3813671c30727a205)] - **lib/werist**: fix int domain lookup
  - [[`ee2ea5bc51`](https://github.com/w4andy/node-werist/commit/ee2ea5bc5166adcc6fa302b0ddec7c2ced3eb445)] - **npm**: ignore IDE files
  - [[`5dc2822fcd`](https://github.com/w4andy/node-werist/commit/5dc2822fcd9e0236b2596075d37c0e0b946a7bbc)] - **package**: add keywords
  - [[`5b558aba0a`](https://github.com/w4andy/node-werist/commit/5b558aba0a105384067ce02df18dbb70dfd33326)] - rename package


## 2017-09-18 node-werist, [v0.2.1](https://github.com/w4andy/node-werist/tree/v0.2.1)

### Commits

  - [[`3eae8c4b3d`](https://github.com/w4andy/node-werist/commit/3eae8c4b3d7187bfae39bd93571acfedeab511c3)] - **lib**: better error handling

## 2017-09-18 node-werist, [v0.2.0](https://github.com/w4andy/node-werist/tree/v0.2.0)

### Notable Changes

add socks proxy support

### Commits

  - [[`0146851183`](https://github.com/w4andy/node-werist/commit/01468511832447c27bb39537b135a0e19f90d733)] - **doc**: fix typo
  - [[`e404648631`](https://github.com/w4andy/node-werist/commit/e4046486316cc4b19537b12224b1b4a1cca22dd9)] - **lib**: fix connections error handling
  - [[`749c9231bf`](https://github.com/w4andy/node-werist/commit/749c9231bfc47efe44997c42650feba26b546ace)] - **lib**: add socks proxy support
  - [[`072833bfbd`](https://github.com/w4andy/node-werist/commit/072833bfbdc6dc160ba8bd413eb1cf0a9f94de0f)] - **lib/werist**: improve referral server handling
  - [[`39264e37dc`](https://github.com/w4andy/node-werist/commit/39264e37dce34c07cde7cc267f2b1c09418504a1)] - **test**: remove referral server with invalid host
  - [[`a9c6ba7315`](https://github.com/w4andy/node-werist/commit/a9c6ba73158eacfdc10fd44e41637b30abea5743)] - **test**: changed timeout


## 2017-09-17 node-werist, [v0.1.0](https://github.com/w4andy/node-werist/tree/v0.1.0)

First release.

---

_The commit log is generated with [changelog42](https://www.npmjs.com/package/changelog42)._