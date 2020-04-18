// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var fs = require('fs');

// Sets up the Express App
// =============================================================
var app = express();
var PORT = 3000;
app.use(express.static("public"))

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var temp  = [
  {
    Notes:"",
    data: ""
  }
]


// Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
    // res.send("Welcome to the Star Wars Page!")
    res.sendFile(path.join(__dirname, "index.html"));
  });
  

  app.get("/notes.html", function(req, res) {
    res.sendFile(path.join(__dirname, "notes.html"));
  });

  app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "db/db.json"));
  });

  app.post("/api/notes", function(req, res){
    fs.appendFile('db.json', res.body, function (err) {
      if (err) throw err;
      console.log('Saved!');
    });
    
  })



  // Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });