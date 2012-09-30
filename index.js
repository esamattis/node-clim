
var util = require("util");


function createCim(prefix, parent, patch) {
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

  // Append new prefix if any
  if (prefix) {
    ob._prefixes.push(prefix);
  }

  ob.info = createLogger(["INFO"].concat(ob._prefixes));
  ob.warn = createLogger(["WARNING"].concat(ob._prefixes));
  ob.error = createLogger(["ERROR"].concat(ob._prefixes));
  ob.log = ob.info;
  return ob;
}

// By default write all logs to stderr
createCim.logWrite = function(msg){
  process.stderr.write(util.format.apply(this, msg) + "\n");
};


createCim.getTime = function(){
  return new Date().toString();
};


function createLogger(prefixes) {
  return function () {
    var msg, i;

    if (createCim.getTime) {
      msg = [createCim.getTime()].concat(prefixes);
    }
    else {
      msg = prefixes.slice();
    }

    for (i = 0; i < arguments.length; i += 1) {
      msg.push(arguments[i]);
    }

    createCim.logWrite(msg);
  };
}

module.exports = createCim;




