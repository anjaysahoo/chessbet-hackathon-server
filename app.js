"use strict";

const express = require('express');
const resolveActiveGames = require('./routes/resolve');
const bodyParser = require('body-parser');

const app = express();

// Before deployment go through the CORS proper use and verify below added lines
app.use(bodyParser.json(), (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, OPTIONS"
    );
    next();
});

app.use(bodyParser.json());

app.get("/api", function (req, res) {
    res.json({
        success: true,
        message: "ChessBet api v1.0"
    });
});

const apiHandlers = require('./routes/handler');
apiHandlers(app);

app.get("/api/*", function (req, res) {
    res.json({
        success: true,
        message: "ChessBet api v1.0"
    });
});

/**
 * 404 Pages
 **/
let outputFolder = __dirname + "/public";
app.get('*.*', express.static(outputFolder, {maxAge: '1y'}));

app.all('*', function (req, res) {
    res.status(200).sendFile(`/`, {root: outputFolder});
});

const port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log(`Server started at port ${port}.`);
});

const callResolveFunction = () => {
    resolveActiveGames("testnet", null, true).then(() => {
    });
};

setTimeout(callResolveFunction, 500); // Initial call for quick resolve rather than waiting for 5+ minutes
setInterval(() => {
    callResolveFunction();
}, (5 * 60 * 1000) + 15000);
