# Empty-Spaces
[![Build Status](https://travis-ci.org/Colored-Coins/Empty-Spaces.svg?branch=master)](https://travis-ci.org/Colored-Coins/Empty-Spaces) [![Coverage Status](https://coveralls.io/repos/Colored-Coins/Empty-Spaces/badge.svg?branch=master)](https://coveralls.io/r/Colored-Coins/Empty-Spaces?branch=master) [![npm version](https://badge.fury.io/js/empty-spaces.svg)](http://badge.fury.io/js/empty-spaces)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

Check checks if a certain folder takes more space then desired

### Installation

```sh
$ npm install empty-spaces
```


### Check folder

Params:
  - Opt - An Object that contains the following properties:

```js
{
  "pathToCheck": "The folder path to check",
  "maximumSize": "The maximum size in either amount in MB or percent in the form of 34%",
  "retryTime": "Time to wait before retring in case the disk is currently busy"
}
```

  - callback - a function in the form of:

  ```js
  function(err, result) {
    if (err) throw err
    console.log(result.pathSize)
    // Will print the size of the folder given to check

    console.log(result.maximumSize)
    // Will print the maximum size in MB this folder is allowed to be

    console.log(result.amountToClear)
    // Can be 1. negative, 2. zero or 3. positive:
    // 1. Negative - The folder is smaller then the maximum allowed.
    // The abosulote value of result.amountToClear is the free size in MB.
    // 2. Zero - The folder is completly has reached the maximum allowed.
    // 3. Positive - The folder has passed the maximum size allowed
    // and result.amountToClear is the amount in MB needed to be cleared
    // from the folder to meet the maximum size limit provided.
  }

  ```

##### Example:

```js
var checkFreeSpace = require('checkFreeSize')

var options = {
  "pathToCheck": ".", // Will check the current folder
  "maximumSize": 50,
  "retryTime": 10000
}

checkFreeSpace(options, function (err, result) {
  if (err) throw err
  console.log('Room taken by path: ' + result.pathSize + ' MB')
  console.log('Maximum allowed size: ' + result.maximumSize + ' MB')
  if (result.amountToClear < 0) {
    console.log('Room Left: ' + (result.amountToClear * -1) + ' MB')
  } else {
    console.log('Space that needs to be clear: ' + result.amountToClear + ' MB')
  }
})

```


### Testing

In order to test you need to install [mocha] globaly on your machine

```sh
$ cd /"module-path"/empty-spaces
$ mocha
```


License
----

MIT

[mocha]:https://www.npmjs.com/package/mocha