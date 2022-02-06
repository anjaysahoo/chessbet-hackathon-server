const express = require('express');
const {mainnetDB, testnetDB} = require('../models/match');

const router = express.Router();

router.get("/history/:mode", async function (req, res) {
    try {
        let matches;
        if (req.params["mode"] === "mainnet") {
            matches = await mainnetDB.find({});
        } else if (req.params["mode"] === 'testnet') {
            matches = await testnetDB.find({});
        } else {
            throw "Invalid chain mode";
        }
        // console.log(matches);

        res.status(200).json({
            success: true,
            matches
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: 'No matches are over.',
            err
        });
    }
});

module.exports = router;
