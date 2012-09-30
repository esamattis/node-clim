# Console.log IMproved for Node.js

This a small library which improves the behavior of the logging methods of the
`console` object changing its API. Just drop it in.


## Improvements

  - Add timestamp
  - Add log level INFO/WARNING/ERROR
  - Always log to stderr
  - Allow prefixing and inheriting

## Installation

    npm install cim

## Usage

### Function Signature

_Object_ newconsole = cim( [_String_ prefix], [_Object_ parent], [_Boolean_ patch parent] )

All parameters are optional.

Just shadow the original `console` object and use it like always:

```javascript
var console = require("cim")();
console.log("message");
```


Or if you want process wide improved console object you can monkeypatch the
original object by passing it and `true` as the third paremeter to `cim`:


```javascript
require("cim")(console, true);
console.log("message");
```

### Prefix Inheriting

Add prefix to your log messages by passing it as the first argument:

```javascript
var console = require("cim")("myapp");
console.log("message");
```

    Sun Sep 30 2012 16:45:57 GMT+0300 (EEST) INFO myapp message


Inherit prefixes from some other console object by passing it as the second
parameter:

```javascript
var cim = require("cim");

var console = cim("myapp");
console.log("message");

function somefunc(){
  var logger = cim("somefunc", console);
  logger.warn("in function");
}

somefunc();
```

    Sun Sep 30 2012 16:59:12 GMT+0300 (EEST) INFO myapp message
    Sun Sep 30 2012 16:59:12 GMT+0300 (EEST) WARNING myapp somefunc in function

### Customizing

Change global log target by overriding `logWrite`:

```javascript
cim.logWrite = function(msg) {
  // Log always to stdout
  process.stdout.write(msg + "\n");
};
```

Change Date format by overriding `getTime`:

```javascript
cim.getTime = function(){
  return Date.now();
};
```

## Design Philosophies

  - Keep the Same api as in the original [console](http://nodejs.org/api/stdio.html)
  - Small
  - No dependecies
  - Tests
  - MIT Licensed

