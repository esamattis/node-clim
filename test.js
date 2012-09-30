
var assert = require("assert");
var cim = require("./index");

var expectLog = function(expected) {
  return function(method, prefixes, msg){
    assert.equal((method + " " + prefixes.join(" ")).trim() + " " + msg, expected);
  };
};

// Basic usage
["log", "info", "warn", "error"].forEach(function(method){
  var console = cim();
  cim.logWrite = expectLog(method.toUpperCase() + " message");
  console[method]("message");
});


// Prefix
cim.logWrite = expectLog("LOG prefix message");
cim("prefix").log("message");

// Formatting
cim.logWrite = expectLog("LOG prefix count: 2");
cim("prefix").log("count: %d", 2);


// Objects
cim.logWrite = expectLog("LOG prefix message { foo: 'bar' }");
cim("prefix").log("message", { foo: "bar" });


// Inheriting
(function() {
  var parent = cim("main");
  var child = cim("sub", parent);
  assert(console !== parent, "new object is created");
  cim.logWrite = expectLog("LOG main sub message");
  child.log("message");
}());



// Patching
(function() {
  var original = {};
  var console = cim(original, true);
  assert(console === original, "no new object is created");
  cim.logWrite = expectLog("LOG message");
  console.log("message");
}());


// Patching with prefix
(function() {
  var original = {};
  var console = cim("prefix", original, true);
  assert(console === original, "no new object is created");
  cim.logWrite = expectLog("LOG prefix message");
  console.log("message");
}());


// Inherit from patched object
(function() {
  var original = {};
  var console = cim("prefix", original, true);
  assert(console === original, "no new object is created");

  var child = cim("subprefix", console);
  assert(child !== console, "no new object is created");

  cim.logWrite = expectLog("LOG prefix subprefix message");

  child.log("message");
}());


// Circular references
(function() {
  var console = cim();

  var a = {}, b = {};
  a.other = b;
  b.other = a;

  cim.logWrite = expectLog("LOG Circular object { other: { other: [Circular] } }");
  console.log("Circular object", a);
}());

// Other methods are there too
(function() {
  var console = cim();
  ["dir", "time", "timeEnd", "trace", "assert"].forEach(function(method){
    assert(typeof console.dir === "function");
  });
}());
