var express = require("express");
var router   = express.Router(); 
var passport = require("passport");
var User     = require("../models/user");

//==========================
//        Root ROUTE
//==========================
router.get("/", function(req,res){
    res.render("landing");
});

//==========================
//        Auth ROUTE
//==========================

//Show register form 
router.get("/register", function(req, res){
   res.render("register"); 
});

//handle sign up logic
router.post("/register", function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");  //end the function if err
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to TaiwanSpots, " + user.username);
            res.redirect("/spots");
        });
    });
});

// show login form 
router.get("/login",function(req, res){
    res.render("login");
});

//handle login logic, use middleware 
//just like: 
//app.post("/login", middleware, callback)
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/spots",
        failureRedirect: "/login"
    }),
    function(req, res){
});

//logout route
router.get("/logout", function(req,res){
    req.logout();  //came from package
    req.flash("success", "You have logged out.");
    res.redirect("/spots");
}); 

module.exports = router;
