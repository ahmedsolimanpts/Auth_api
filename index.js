require("dotenv").config();
const express = require("express");
const app = express();
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
var bcrypt = require('bcryptjs');
const user = require("./Schema/user");
require("./passport/pass");

mongoose.connect(process.env.mongourl, { useNewUrlParser: true ,useUnifiedTopology: true,
    useCreateIndex: true, }).then(console.log("connect to mongo"))
app.use(passport.initialize());
app.use(passport.session());
router.post("/signup", async (req, res) => {
    const email = req.query.email;
    const password = req.query.password;
    const password2 = req.query.password2;

    if ((!password || !password2 || !email) || (password2 != password) || (password.length < 8)) {
        res.json({ msg: "please Enter Vaild Data " });
    }
    else {
        try {
            await user.findOne({ email: email }).exec(async(err,docs) => {
                if (docs) {
                    res.json(docs);
                } else {
                    var salt = bcrypt.genSaltSync(10);
                    const hash = bcrypt.hashSync(password, salt);
                    let nuser = new user( {email,password:hash} );

                  await  nuser.save().catch(err => console.log(err))
                    res.json({ msg: "no data" });
                }
            });
        }
        catch (err) { console.log(err) }

    }




});

router.get("/signup", (req, res) => {
    /* bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash("ahmed", salt, function(err, hash) {
            
        });
    }); */
    const email ='ahmeds';
    user.findOne({email:email},(err,docs)=>{
        bcrypt.compare("12345678", docs.password, function(err, result) {
           if(result){
               res.json(docs)
           }else{
            res.json({msg:"password incorect"})  
           }
        });
    })
 
})

app.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.json({message:info.message}) }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.json({msg:"succes Login",user:user});
      });
    })(req, res, next);
  });
  
app.use(router);

app.listen(process.env.PORT, () => {
    console.log(`Server Run on Port : ${process.env.PORT}`)
})