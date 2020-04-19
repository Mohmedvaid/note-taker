// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var fs = require("fs");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = 3000;
app.use(express.static("public"));

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

function rndID(finalData) {
  if(finalData.length ==0){
    return 1;
  }
  var id = Math.floor(Math.random() * (finalData.length + 5))
  for (var i = 0; i < finalData.length; i++) {
    if (finalData[i].id == id) {
      rndID();
    } else {
      return id;
    }
  }

}

// Basic route that sends the user first to the AJAX Page
app.get("/", function (req, res) {
  // res.send("Welcome to the Star Wars Page!")
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/notes.html", function (req, res) {
  res.sendFile(path.join(__dirname, "notes.html"));
});

app.get("/api/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./db/db.json"));
});

app.get("/api/notes/:id", function (req, res) {
  var jsonData;
  fs.readFile("db/db.json", function (err, data) {
    jsonData = JSON.parse(data);

    jsonData.forEach((note) => {
      if (note.id.includes(req.params.id))
        return res.send(note);
    });
  });
});


app.post("/api/notes", function (req, res) {
  try {
    var finalData;
    fs.readFile("db/db.json", function (err, data) {
      var newEntry = req.body;
      finalData = JSON.parse(data);
      newEntry.id = JSON.stringify(rndID(finalData))
  
      finalData.push(newEntry);
      res.send(finalData)
      JSON.stringify(finalData);
      if (err) throw err;
      fs.writeFile("./db/db.json", JSON.stringify(finalData), function (err) {
        if (err) throw err;
        console.log("Saved!");
      });
    });
    
  } catch (error) {
    console.log(error);
    
  }
});

app.delete("/api/notes/:id", function (req, res) {

  try {
    var jsonData;

    fs.readFile("db/db.json", function (err, data) {
      jsonData = JSON.parse(data);
  
      for (var i = 0; i < jsonData.length; i++) {
        if (jsonData[i].id.includes(req.params.id)) {
          jsonData.splice(i, i+1)
        }
      }
      res.send(jsonData)
      fs.writeFile("./db/db.json", JSON.stringify(jsonData), function (err) {
        if (err) throw err;
        console.log("Delete Saved!");
      });
      
    });
  } catch (error) {
    console.log(error);
  }
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});