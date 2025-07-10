const mongoose = require("mongoose");
const supporterSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt : {
        type : Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Supporter", supporterSchema);