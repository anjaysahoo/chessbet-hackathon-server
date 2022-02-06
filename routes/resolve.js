"use strict";

const lichess = require('lichess-api');
const {mainnetDB, testnetDB} = require('../models/match');
const configs = require('./config.json');
const Web3 = require('web3');
const https = require("https");

let web3 = {}, smartContract = {}, privateKey = process.env["ownerWalletKey"];

const lichessActiveGamesEndpoint = "https://lichess.org/api/tv/channels";
let transaction = {
    "mainnet": {
        from: configs["ownerWalletAddress"],
        to: configs["mainnetContractAddress"],
        data: "",
        nonce: 0,
        gas: 10000000,
        gasPrice: 2000000000 // Default to 2 Gwei
    },
    "testnet": {
        from: configs["ownerWalletAddress"],
        to: configs["testnetContractAddress"],
        data: "",
        nonce: 0,
        gas: 10000000,
        gasPrice: 2000000000 // Default to 2 Gwei
    }
};
let gameIDs, index, maxLen, maxAllowedTime, maxAllowedIndex; // Extra var if for future in case of alternate backward and forward traversal.

try {
    let url = process.env["apiKey"];

    web3["mainnet"] = new Web3(url + "/mainnet/");
    web3["testnet"] = new Web3(url + "/mumbai/");

    smartContract["mainnet"] = new web3["mainnet"].eth.Contract(
        configs["contractABI"],
        configs["mainnetContractAddress"],
        {
            from: configs["ownerWalletAddress"]
        }
    );
    smartContract["testnet"] = new web3["testnet"].eth.Contract(
        configs["contractABI"],
        configs["testnetContractAddress"],
        {
            from: configs["ownerWalletAddress"]
        }
    );
} catch (exception) {
    console.log("Restart server. Web3 creation resulted in the following error.");
    console.log(exception);
}

const getCurrentGasPrice = async (chainMode) => {
    return await web3[chainMode].eth.getGasPrice();
};

const getActiveGames = async (chainMode) => {
    return await smartContract[chainMode].methods["getActiveGames"]().call();
};

const getGameDetails = async (chainMode, gameID) => {
    // console.log("GET GAME DETAILS FOR GAME: " + gameID + " on chain : " + chainMode);
    return await smartContract[chainMode].methods["getGameDetails"](gameID).call();
};

const weiToEth = (x) => {
    const y = BigInt(x) / 1000000000000000000n;
    return y.toString();
};

const storeGame = async (chainMode, gameID) => {
    try {
        const data = await getGameDetails(chainMode, gameID);
        // console.log("storeGame :: " + JSON.stringify(data) + ", chain : " + chainMode);
        let winner;
        if (data["0"][1] === "1") {
            winner = "Black"
        } else if (data["0"][1] === "2") {
            winner = "White"
        } else {
            winner = "Draw"
        }
        await lichess.game(gameID, async function () { // add game duration
            const game = {
                matchID: data["0"][0],
                winner: winner,
                blackbets: data["0"][9],
                blackAmount: weiToEth(data["0"][6]),
                whitebets: data["0"][8],
                whiteAmount: weiToEth(data["0"][5]),
                totalAmount: weiToEth(data["0"][4]),
                totalBets: data["0"][7]
            };
            let savableDoc;
            if (chainMode === "mainnet") {
                savableDoc = new mainnetDB(game);
            } else if (chainMode === "testnet") {
                savableDoc = new testnetDB(game);
            } else {
                throw "Invalid chain mode";
            }

            await savableDoc.save();
        });
    } catch (err) {
        console.log("Some error occurred in storeGame() for chain : " + chainMode);
        console.log(err);
    }
};

const sendEndGameTransaction = async (chainMode, gameIndex, gameID, winnerCode, gameEndTimestamp, nonce, gasPrice) => {
    try {
        let duplicateTransaction = JSON.parse(JSON.stringify(transaction));
        duplicateTransaction[chainMode]["data"] = smartContract[chainMode].methods["endGame"](gameIndex, gameID, winnerCode, gameEndTimestamp).encodeABI();
        duplicateTransaction[chainMode]["gasPrice"] = gasPrice;
        duplicateTransaction[chainMode]["nonce"] = nonce;

        let signedTransaction = await web3[chainMode].eth.accounts.signTransaction(duplicateTransaction[chainMode], privateKey)
        await web3[chainMode].eth.sendSignedTransaction(signedTransaction.rawTransaction);

        if (winnerCode !== 3) {
            storeGame(chainMode, gameID).then(() => {
            });
        }
    } catch (err) {
        console.log("Some error occurred in sendEndGameTransaction()");
        console.log(err);
    }
};

const sendPlaceBetTransaction = async (chainMode, gameID, vote, amount, nonce, gasPrice) => {
    try {
        console.log("Sending placeBet transaction");
        let duplicateTransaction = JSON.parse(JSON.stringify(transaction));
        duplicateTransaction[chainMode]["data"] = smartContract[chainMode].methods["placeBet"](gameID, vote, amount).encodeABI();
        duplicateTransaction[chainMode]["value"] = amount;
        duplicateTransaction[chainMode]["nonce"] = nonce;
        duplicateTransaction[chainMode]["gasPrice"] = gasPrice;

        let signedTransaction = await web3[chainMode].eth.accounts.signTransaction(duplicateTransaction[chainMode], privateKey)
        await web3[chainMode].eth.sendSignedTransaction(signedTransaction.rawTransaction);
    } catch (err) {
        console.log("Some error occurred in sendPlaceBetTransaction()");
        console.log(err);
    }
};

const handleCurrentGameID = async (chainMode, gameIndex, gameID, gameEndTimestamp, winnerCode) => {
    console.log("Handling Game ID : " + gameID + " at index : " + gameIndex);
    try {
        let nonce = await web3[chainMode].eth.getTransactionCount(configs["ownerWalletAddress"], 'latest');
        let gasPrice = await getCurrentGasPrice(chainMode);
        console.log(chainMode + ", gasPrice : " + gasPrice + ", Nonce : " + nonce);
        await sendEndGameTransaction(chainMode, gameIndex, gameID, winnerCode, gameEndTimestamp, nonce, gasPrice);
    } catch (err) {
        console.log("Some error occurred in handleCurrentGameID() for chain : " + chainMode);
        console.log(err);
    }
};

const handleCurrentGameIDForPlacingBet = async (chainMode, gameID, vote, amount) => {
    try {
        let nonce = await web3[chainMode].eth.getTransactionCount(configs["ownerWalletAddress"], 'latest');
        let gasPrice = await getCurrentGasPrice(chainMode);
        await sendPlaceBetTransaction(chainMode, gameID, vote, amount, nonce, gasPrice);
    } catch (err) {
        console.log("Some error occurred in handleCurrentGameIDForPlacingBet() for chain : " + chainMode);
        console.log(err);
    }
};

const getResult = async (chainMode, startTime) => {
    if (index < 0 || Date.now() >= maxAllowedTime) {
        return;
    }
    let currentIndex = index;
    let gameID = gameIDs[currentIndex];
    console.log("gameID : " + gameID + " at index : " + currentIndex);

    try {
        lichess.game(gameID, async (err, game) => {
            if (game && !err) {
                const data = JSON.parse(game);
                // console.log(data);
                if (data["status"] !== "started") {
                    console.log("Valid Game ID " + gameID + ", for " + chainMode + " chain.");
                    let gameEndTimestamp = data["createdAt"] + Math.ceil(0.75 * (data["lastMoveAt"] - data["createdAt"]));
                    let winnerCode;

                    if (data["clock"]["initial"] < 180 || data["lastMoveAt"] - data["createdAt"] < 60) {
                        winnerCode = 0;
                    } else if (data["winner"] === "white") {
                        winnerCode = 2;
                    } else if (data["winner"] === "black") {
                        winnerCode = 1;
                    } else {
                        winnerCode = 0;
                    }

                    await handleCurrentGameID(chainMode, currentIndex, gameID, gameEndTimestamp, winnerCode);
                } else {
                    console.log(gameID + " is still active");
                }
            } else if (game === "" && !err) {
                console.log("Invalid Game ID");
                await handleCurrentGameID(chainMode, currentIndex, gameID, 0, 3);
            } else {
                console.log("API call error.");
                console.log(err);
            }

            index--;
            getResult(chainMode, startTime).then(() => {
            }).catch((err) => {
                console.log("Error for " + gameID + " in getResult() for chain : " + chainMode);
                console.log(err);
            });
        });
    } catch (err) {
        console.log("Error for " + gameID + " in getResult() for chain : " + chainMode);
        console.log(err);
    }
};

const resolveActiveGames = async (chainMode, startTime = null, shouldPlaceBets = false) => {
    try {
        let gameList = await getActiveGames(chainMode);
        gameIDs = gameList;
        maxLen = gameList.length;
        console.log(chainMode + " active game list : ");
        console.log(gameList);

        if (shouldPlaceBets && maxLen <= 0) {
            https.get(lichessActiveGamesEndpoint, (response) => {
                response.on("data", (data) => {
                    console.log("Received Data from Lichess");
                    let placeBetGameId = JSON.parse(data.toString())["Classical"]["gameId"];
                    let voteSide = Math.floor(Math.random() * 2) + 1;
                    handleCurrentGameIDForPlacingBet(chainMode, placeBetGameId, voteSide, "1000000000000000000").then(() => {
                    });
                });
            });
        } else {
            index = maxLen - 1;
            if (!startTime) {
                startTime = Date.now();
                maxAllowedTime = startTime + (5 * 60 * 1000) - 1500;
            }
            await getResult(chainMode, startTime);
        }
    } catch (err) {
        console.log("Some unknown error occurred in resolveActiveGames()...");
        console.log(err);
    }
};

module.exports = resolveActiveGames;
