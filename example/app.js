
express = require("express");
cim = require("../index");

var console = cim("APP");

app = express();

app.listen(8080, function(){
  console.log("now listening on port %d", 8080);
});


app.get("/", function(req, res) {
  var console = cim("root", console);
  console.log("Request");
  res.send('<a href=/sub>sub<a/>');
});

app.get("/sub", function(req, res) {
  var console = cim("sub", console);
  console.log("Request");
  res.send('<a href=/>root<a/>');
});