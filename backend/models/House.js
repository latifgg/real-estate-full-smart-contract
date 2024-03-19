// backend/models/House.js
const mongoose = require('mongoose');

const houseSchema = new mongoose.Schema({
    blockchainId: { type: String, unique: true },
    title: String,
    description: String,
    imageUrl: String,
    price: Number,
    totalShares: Number,
    sharesSold: { type: Number, default: 0 },
    houseOwner: String,
    

});


module.exports = mongoose.model('House', houseSchema);
