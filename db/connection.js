const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://" + process.env["DBUsername"] +
    ":" + process.env["DBPassword"] + "@cluster0.qaot2.mongodb.net/ChessBet-DB", (err) => {
    if (err) {
        console.log("DB connection error...");
        console.log(err);
    } else {
        console.log("DB connected.");
    }
});

module.exports = mongoose;
