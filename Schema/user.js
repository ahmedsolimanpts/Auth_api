const mongoose= require("mongoose");

var bcrypt = require('bcryptjs');


const userShema =mongoose.Schema({

    email:String,
    password:String,

});


//const user =mongoose.model("user",userShema);

module.exports=mongoose.model("user",userShema)