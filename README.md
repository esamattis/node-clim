
# Console.log IMproved for Node.js

This a small library which improves the behavior of the logging methods of the
`console` object changing its API. Just drop it in.


## Improvements

  - Add date
  - Add log level INFO/WARNING/ERROR
  - Always log to stderr
  - Allow prefixing and inheriting

## Function Signature


Object console cim([String prefix], [Object parent], [Boolean patch parent])

All parameters are optional.

## Usage

Just shadow the original `console` object and use it like always:

```javascript
var console = require("cim")();
console.log("message");
```

    Sun Sep 30 2012 16:45:02 GMT+0300 (EEST) INFO message

Or if you want process wide improved console object you can monkeypatch the
original object by passing it and `true` as the third paremeter to `cim`:


```javascript
require("cim")(console, true);
console.log("message");
```

## Prefixes Inheriting

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



