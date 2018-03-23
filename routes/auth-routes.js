var router = require('express').Router();
var User = require('../models/Users');
var passport = require('passport');


//auth login
router.get('/login', (req, res)=>{
    res.render('login', {user : req.user});
});

router.post('/login', passport.authenticate('local-login', {
      successRedirect: '/profile',
      failureRedirect: '/auth/login',
      failureFlash: true
    }));


//auth logout
router.get('/logout', (req, res)=>{
    //handle logout
    req.logout();
    res.redirect('/');
});

//auth google
router.get('/google', passport.authenticate('google', {
    scope : ['profile', 'email']
}));

//redirect route for google
router.get('/google/callback', passport.authenticate('google', {
    successRedirect : '/profile',
    failureRedirect : '/'
}));

//signup route
router.get('/signup', (req, res) =>{
    res.render('signup', {user : req.user});
  });

//signup post route
router.post('/signup', passport.authenticate('local-signup', {
  successRedirect : '/profile',
  failureRedirect : '/auth/signup',
  failureFlash : true
}));


module.exports = router;
