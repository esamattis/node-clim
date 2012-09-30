
var assert = require("assert");
var cim = require("./index");

cim.getTime = function(){
  return "dummydate";
};

// Basic usage
cim.logWrite = function(msg) {
  assert.deepEqual(msg, ["dummydate", "INFO", "message"]);
};
cim().log("message");


// Basic usage with prefix
cim.logWrite = function(msg) {
  assert.deepEqual(msg, ["dummydate", "INFO", "prefix", "message"]);
};
cim("prefix").log("message");


// Objects
cim.logWrite = function(msg) {
  assert.deepEqual(msg, ["dummydate", "INFO", "prefix", "message", { foo: "bar" }]);
};
cim("prefix").log("message", { foo: "bar" });


// Inheriting
(function() {
  var parent = cim("main");
  child = cim("sub", parent);
  assert(console !== parent, "new object is created");

  cim.logWrite = function(msg) {
    assert.deepEqual(msg, ["dummydate", "INFO", "main", "sub", "message"]);
  };

  child.log("message");
}());


// Patching
(function() {
  var original = {};
  var console = cim(original, true);
  assert(console === original, "no new object is created");

  cim.logWrite = function(msg) {
    assert.deepEqual(msg, ["dummydate", "INFO", "message"]);
  };

  console.log("message");
}());


// Patching with prefix
(function() {
  var original = {};
  var console = cim("prefix", original, true);
  assert(console === original, "no new object is created");

  cim.logWrite = function(msg) {
    assert.deepEqual(msg, ["dummydate", "INFO", "prefix", "message"]);
  };

  console.log("message");
}());
