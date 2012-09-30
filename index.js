
var util = require("util");
var cim;

module.exports = cim = function (prefix, parent, patch) {
  var ob;

  // Fiddle optional arguments
  patch = Array.prototype.slice.call(arguments, -1)[0];
  if (typeof patch !== "boolean") patch = false;
  if (typeof prefix === "object" && prefix !== null) {
    parent = prefix;
    prefix = undefined;
  }

  if (patch && parent) {
    // Modify given object when patching is requested
    ob = parent;
  }
  else {
    // Otherwise create new object
    ob = {};
    if (parent && parent._prefixes) {
      // and inherit prefixes from the given object
      ob._prefixes = parent._prefixes.slice();
    }
  }

  // Append new prefix
  if (!ob._prefixes) ob._prefixes = [];
  if (prefix) ob._prefixes.push(prefix);

  ob.info = createLogger("INFO", ob._prefixes);
  ob.warn = createLogger("WARN", ob._prefixes);
  ob.error = createLogger("ERROR", ob._prefixes);
  ob.log = ob.info;
  consoleProxy(ob);

  return ob;
};

// By default write all logs to stderr
cim.logWrite = function(method, msg){
  process.stderr.write(msg + "\n");
};


cim.getTime = function(){
  return new Date().toString();
};


// Just proxy methods we don't care about to original console object
function consoleProxy(ob){
  // list from http://nodejs.org/api/stdio.html
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
    // Handle formatting and circular objects like in the original
    var msg = util.format.apply(this, arguments);

    var prefix = method + " " + prefixes.join(" ");
    if (cim.getTime) prefix = cim.getTime() + " " + prefix;

    cim.logWrite(method, prefix.trim() + " " + msg);
  };
}
