
var util = require("util");

function cim(prefix, parent, patch) {
  var ob;
  patch = Array.prototype.slice.call(arguments, -1)[0];

  if (typeof patch !== "boolean") {
    patch = false;
  }

  if (typeof prefix === "object" && prefix !== null) {
    parent = prefix;
    prefix = undefined;
  }


  // Patch given object if requested
  if (patch && parent) {
    ob = parent;
    ob._prefixes = ob._prefixes || [];
  }
  // Otherwise create new object and inherit prefixes from parent
  else {
    ob = { _prefixes: [] };
    if (parent && parent._prefixes) {
      ob._prefixes = parent._prefixes.slice();
    }
  }

  consoleProxy(ob);

  // Append new prefix if any
  if (prefix) {
    ob._prefixes.push(prefix);
  }

  ob.info = createLogger("INFO", ob._prefixes);
  ob.warn = createLogger("WARN", ob._prefixes);
  ob.error = createLogger("ERROR", ob._prefixes);
  ob.log = ob.info;
  return ob;
}

// By default write all logs to stderr
cim.logWrite = function(method, msg){
  process.stderr.write(msg + "\n");
};


cim.getTime = function(){
  return new Date().toString();
};


// Just proxy methods we don't care about to original console object
// Get method list from http://nodejs.org/api/stdio.html
function consoleProxy(ob){
  var methods = ["dir", "time", "timeEnd", "trace", "assert"];
  methods.forEach(function(method){
    if (ob[method]) return;
    ob[method] = function(){
      return console[method].apply(console, arguments);
    };
  });
}

function createLogger(method, prefixes) {
  return function () {
    var msg = util.format.apply(this, arguments);
    var prefix = method + " " + prefixes.join(" ");

    if (cim.getTime) {
      prefix = cim.getTime() + " " + prefix;
    }

    cim.logWrite(method, prefix.trim() + " " + msg);
  };
}

module.exports = cim;
