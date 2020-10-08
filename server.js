// Setting up the requires (Express, Path, and FS)
const express = require("express");
const path = require("path");
const fs = require("fs");
const { notStrictEqual } = require("assert");

// Preparing variables to invoke express, name the preferred port for Heroku, and create the main directory path 
const app = express();
const port = process.env.PORT || 3000;
const mainDir = path.join(__dirname, "/public");

// Setting up express and JSON 
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Setting up the notes.html page
app.get("/notes", function(req, res) {
    res.sendFile(path.join(mainDir, "notes.html"));
});

app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

app.get("/api/notes/:id", function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    res.json(savedNotes[Number(req.params.id)]);
});

// Setting up the index.html page
app.get("*", function(req, res) {
    res.sendFile(path.join(mainDir, "index.html"));
});

// Using the 'post' command 
app.post("/api/notes", function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let newNote = req.body;
    let uniqueID = (savedNotes.length).toString();
    newNote.id = uniqueID;
    savedNotes.push(newNote);

    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    console.log("Note saved to db.json. Content: ", newNote);
    res.json(savedNotes);
})

// Setting up the delete function on the page
app.delete("/api/notes/:id", function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteID = req.params.id;
    let newID = 0;
    console.log(`Deleting note with ID ${noteID}`);
    savedNotes = savedNotes.filter(currNote => {
        return currNote.id != noteID;
    })
    
    for (currNote of savedNotes) {
        currNote.id = newID.toString();
        newID++;
    }

    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    res.json(savedNotes);
})

// Setting up the listener function 
app.listen(port, function() {
    console.log(`Now listening to port ${port}. Thanks for your time and enjoy this quick note taker!`);
})