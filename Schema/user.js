const mongoose = require("mongoose");

var bcrypt = require('bcryptjs');


const userShema = mongoose.Schema({

    email: String,
    password: String,

});
module.exports = mongoose.model("user", userShema)