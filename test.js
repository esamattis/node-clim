
var assert = require("assert");
var cim = require("./index");

cim.getTime = function(){
  return "dummydate";
};

// Basic usage
cim.logWrite = function(msg) {
  assert.deepEqual(msg, "dummydate INFO message");
};
cim().log("message");


// Prefix
cim.logWrite = function(msg) {
  assert.deepEqual(msg, "dummydate INFO prefix message");
};
cim("prefix").log("message");

// Formatting
cim.logWrite = function(msg) {
  assert.deepEqual(msg, "dummydate INFO prefix count: 2");
};
cim("prefix").log("count: %d", 2);


// Objects
cim.logWrite = function(msg) {
  assert.deepEqual(msg, "dummydate INFO prefix message { foo: 'bar' }");
};
cim("prefix").log("message", { foo: "bar" });


// Inheriting
(function() {
  var parent = cim("main");
  child = cim("sub", parent);
  assert(console !== parent, "new object is created");

  cim.logWrite = function(msg) {
    assert.deepEqual(msg, "dummydate INFO main sub message");
  };

  child.log("message");
}());


// Patching
(function() {
  var original = {};
  var console = cim(original, true);
  assert(console === original, "no new object is created");

  cim.logWrite = function(msg) {
    assert.deepEqual(msg, "dummydate INFO message");
  };

  console.log("message");
}());


// Patching with prefix
(function() {
  var original = {};
  var console = cim("prefix", original, true);
  assert(console === original, "no new object is created");

  cim.logWrite = function(msg) {
    assert.deepEqual(msg, "dummydate INFO prefix message");
  };

  console.log("message");
}());

// Circular references
(function() {
  var console = cim();

  cim.logWrite = function(msg) {
    assert.deepEqual(msg, "dummydate INFO Circular object { other: { other: [Circular] } }");
  };

  var a = {};
  var b = {};
  a.other = b;
  b.other = a;
  console.log("Circular object", a);
}());

// Other methods are there too
(function() {
  var console = cim();
  ["dir", "time", "timeEnd", "trace", "assert"].forEach(function(method){
    assert(typeof console.dir === "function");
  });
}());
