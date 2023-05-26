const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    orders: {
        type: Number,
        required: true,
        default: 0
    }


});
mongoose.models = {};
module.exports = mongoose.model("user", UserSchema);