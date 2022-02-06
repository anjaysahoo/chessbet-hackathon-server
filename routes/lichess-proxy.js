const express = require("express");
const request = require("request");

const router = express.Router();

router.post("/lichess-game-status", (req, res) => {
    const gameId = req.body.gameId;
    request(
        {
            url: "https://lichess.org/game/export/" + gameId,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        },
        (error, response, body) => {
            // console.log("response from lichess : " + JSON.stringify(response));

            if (error) {
                return res.status(500).json({
                    type: "error",
                    message: error.message,
                });
            } else if (response.statusCode == "404") {
                res.status(404).json({message: "No such game Id"});
            } else {
                res.status(200).json(JSON.parse(body));
            }
        }
    );
});

module.exports = router;
