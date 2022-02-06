const mongoose = require('./../db/connection');

const incompleteSchema = new mongoose.Schema({
    timestamp: {
        type: Number,
        required: [true, "Timestamp not here!!!"]
    },
    matchID: {
        type: String,
        required: [true, "Match ID Missing..."]
    },
    winnerCode: {
        type: Number,
        required: [true, "Who won!?"]
    },
    nonce: {
        type: Number,
        required: [true, "Nonce of the transaction..."]
    }
});

const Incomplete = mongoose.model("Incomplete", incompleteSchema);
module.exports = {
    Incomplete
};
