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
    scope : ['profile']
}));

//redirect route for google
router.get('/google/redirect', passport.authenticate('google'), (req, res) =>{
    res.redirect('/profile');
});

//signup route
router.get('/signup', (req, res) =>{
    res.render('signup', {user : req.user});
  });

//new user route
// router.post('/signup', (req, res)=>{
//       var user = new User({
//         username : req.body.username,
//         fname : req.body.fname,
//         lname : req.body.lname,
//         password : req.body.password
//       });

//       user.save((err, user) =>{
//         if(err)
//           console.log(err);
//         else{
//           console.log('success!');
//           res.redirect('/');
//         }
//       });
//     });

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect : '/profile',
  failureRedirect : '/auth/signup',
  failureFlash : true
}));


module.exports = router;
