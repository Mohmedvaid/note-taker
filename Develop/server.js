// Dependencies
var express = require("express");
var path = require("path");
var fs = require("fs");

// setup app and port
var app = express();
var PORT = 3000;
app.use(express.static("public"));

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());


// Homepage route
app.get("/", function (req, res) {
  //sends index file
  res.sendFile(path.join(__dirname, "index.html"));
});
//sends notes file
app.get("/notes.html", function (req, res) {
  res.sendFile(path.join(__dirname, "notes.html"));
});
//sends db.json data
app.get("/api/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./db/db.json"));
});

//sends specefic id
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

//posts data to db.json file
app.post("/api/notes", function (req, res) {
  //try catch block
  try {
    //reads db.json file
    fs.readFile("db/db.json", function (err, data) {
      var finalData;
      //newEntry points to request received
      var newEntry = req.body;
      //finalData points to db.json data converted to json format from strings
      finalData = JSON.parse(data);
      //id is added to the data received in the request
      newEntry.id = JSON.stringify(Date.now())

      //the whole object is pushed into the initail array 
      finalData.push(newEntry);
      //sends the new array with finalData
      res.send(finalData)
      // //finalData array is stringified
      // JSON.stringify(finalData);

      //finalData array is stringified and stored in the db.json file
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
          jsonData.splice(i, i + 1)
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