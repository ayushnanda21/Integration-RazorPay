const mongoose = require("mongoose");

const Transactions = new mongoose.Schema({
    transactionid : {
        type: String,
    },
    transactionamount : {
        type: String
    }
});

module.exports = mongoose.model("Transaction", Transactions)