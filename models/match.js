const mongoose = require('./../db/connection');

const matchSchema = new mongoose.Schema({
    matchID: {
        type: String,
        required: [true, "Match ID Missing."]
    },
    winner: {
        type: String,
        required: [true, "Winner Missing."]
    },
    blackbets: {
        type: String,
        required: [true, "No. of black bettors Missing."]
    },
    blackAmount: {
        type: String,
        required: [true, "Black bet amount Missing."]
    },
    whitebets: {
        type: String,
        required: [true, "No. of white bettors Missing."]
    },
    whiteAmount: {
        type: String,
        required: [true, "White bet amount Missing."]
    },
    totalAmount: {
        type: String,
        required: [true, "Total amount Missing."]
    },
    totalBets: {
        type: String,
        required: [true, "Total bets Missing."]
    }
});

const mainnetDB = mongoose.model("mainnetDB", matchSchema);
const testnetDB = mongoose.model("testnetDB", matchSchema);

module.exports = {
    mainnetDB,
    testnetDB
};
