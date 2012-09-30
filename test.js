
var assert = require("assert");
var cim = require("./index");

cim.getTime = function(){
  return "dummydate";
};

// Basic usage
["log", "info", "warn", "error"].forEach(function(method){
  var console = cim();
  cim.logWrite = function(method, msg) {
    assert.equal(msg, "dummydate " + method.toUpperCase() + " message");
  };
  console[method]("message");
});



// Prefix
cim.logWrite = function(method, msg) {
  assert.equal(msg, "dummydate LOG prefix message");
};
cim("prefix").log("message");

// Formatting
cim.logWrite = function(method, msg) {
  assert.equal(msg, "dummydate LOG prefix count: 2");
};
cim("prefix").log("count: %d", 2);


// Objects
cim.logWrite = function(method, msg) {
  assert.equal(msg, "dummydate LOG prefix message { foo: 'bar' }");
};
cim("prefix").log("message", { foo: "bar" });


// Inheriting
(function() {
  var parent = cim("main");
  var child = cim("sub", parent);
  assert(console !== parent, "new object is created");

  cim.logWrite = function(method, msg) {
    assert.equal(msg, "dummydate LOG main sub message");
  };

  child.log("message");
}());



// Patching
(function() {
  var original = {};
  var console = cim(original, true);
  assert(console === original, "no new object is created");

  cim.logWrite = function(method, msg) {
    assert.equal(msg, "dummydate LOG message");
  };

  console.log("message");
}());


// Patching with prefix
(function() {
  var original = {};
  var console = cim("prefix", original, true);
  assert(console === original, "no new object is created");

  cim.logWrite = function(method, msg) {
    assert.equal(msg, "dummydate LOG prefix message");
  };

  console.log("message");
}());


// Inherit from patched object
(function() {
  var original = {};
  var console = cim("prefix", original, true);
  assert(console === original, "no new object is created");

  var child = cim("subprefix", console);
  assert(child !== console, "no new object is created");

  cim.logWrite = function(method, msg) {
    assert.equal(msg, "dummydate LOG prefix subprefix message");
  };

  child.log("message");
}());


// Circular references
(function() {
  var console = cim();

  cim.logWrite = function(method, msg) {
    assert.equal(msg, "dummydate LOG Circular object { other: { other: [Circular] } }");
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
