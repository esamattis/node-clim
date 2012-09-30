
var assert = require("assert");
var createCim = require("./index");

createCim.getTime = function(){
  return "dummydate";
};

// Basic usage
createCim.logWrite = function(msg) {
  assert.deepEqual(msg, ["dummydate", "INFO", "message"]);
};
createCim().log("message");


// Basic usage with prefix
createCim.logWrite = function(msg) {
  assert.deepEqual(msg, ["dummydate", "INFO", "prefix", "message"]);
};
createCim("prefix").log("message");


// Objects
createCim.logWrite = function(msg) {
  assert.deepEqual(msg, ["dummydate", "INFO", "prefix", "message", { foo: "bar" }]);
};
createCim("prefix").log("message", { foo: "bar" });


// Inheriting
(function() {
  var parent = createCim("main");
  child = createCim("sub", parent);
  assert(console !== parent, "new object is created");

  createCim.logWrite = function(msg) {
    assert.deepEqual(msg, ["dummydate", "INFO", "main", "sub", "message"]);
  };

  child.log("message");
}());


// Patching
(function() {
  var original = {};
  var console = createCim(original, true);
  assert(console === original, "no new object is created");

  createCim.logWrite = function(msg) {
    assert.deepEqual(msg, ["dummydate", "INFO", "message"]);
  };

  console.log("message");
}());


// Patching with prefix
(function() {
  var original = {};
  var console = createCim("prefix", original, true);
  assert(console === original, "no new object is created");

  createCim.logWrite = function(msg) {
    assert.deepEqual(msg, ["dummydate", "INFO", "prefix", "message"]);
  };

  console.log("message");
}());
