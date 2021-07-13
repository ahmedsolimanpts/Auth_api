require("dotenv").config();
const express = require("express");
const app = express();
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
var bcrypt = require('bcryptjs');
const user = require("./Schema/user");
require("./passport/pass");

mongoose.connect(process.env.mongourl, {
    useNewUrlParser: true, useUnifiedTopology: true,
    useCreateIndex: true,
}).then(console.log("connect to mongo"))
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
            await user.findOne({ email: email }).exec(async (err, docs) => {
                if (docs) {
                    res.json(docs);
                } else {
                    var salt = bcrypt.genSaltSync(10);
                    const hash = bcrypt.hashSync(password, salt);
                    let nuser = new user({ email, password: hash });

                    await nuser.save().catch(err => console.log(err))
                    res.json({ msg: "User Create Sucess" });
                }
            });
        }
        catch (err) { console.log(err) }

    }




});

router.get("/users", (req, res) => {

    const email = 'ahmeds';
    user.findOne((err, docs) => {
        if (err) { console.log(err) }
        if (docs) {
            res.json(docs)
        }
    })

})

router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.json({ message: info.message }) }
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            return res.json({ msg: "succes Login", user: user });
        });
    })(req, res, next);
});

app.use(router);
app.use((req, res) => {
    res.status(404).json({ msg: `in valid Route jsut use /signup && /login && /users to get all users ` });
})
app.listen(process.env.PORT, () => {
    console.log(`Server Run on Port : ${process.env.PORT}`)
})