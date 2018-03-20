
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var User = require('../models/Users');
var bcrypt = require('bcryptjs');
var keys = require('./keys');
var passport = require('passport');
var body = require('body-parser');


passport.serializeUser((user, done)=> {
    done(null, user.id);
  });
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});


    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

passport.use('local-login', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) { // callback with email and password from our form
        // find a user whose username is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'username' :  username }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });

    }));


// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     User.findOne({ username: username }, function(err, user) {
//       if (err) { return done(err); }
//       if (!user) {
//         return done(null, false, { message: 'Incorrect username.' });
//       }
//       if (!user.validPassword(password)) {
//         return done(null, false, { message: 'Incorrect password.' });
//       }
//       return done(null, user);
//     });
//   }
// ));


// //local strategy
// module.exports = (passport)=>{
//     passport.use(new LocalStrategy((username, password, done)=>{
//         //match username
//         let query = {username: username};
//         User.findOne(query, (err, user)=>{
//             if(err) throw err;
//             if(!user){
//                 return done(null, false, {message: 'User not found'});
//             }

//             //match password
//             bcrypt.compare(password, user.password, (err, isMatch)=>{
//             if(err) throw err;
//             if(isMatch){
//                 return done(null, user);
//             }else{
//                 return done(null, false, {message: 'Invalid password'});
//             }
//             });
//         });
//     }));
// }


//google strategy
passport.use(new GoogleStrategy({
    //setup google strat
    callbackURL: '/auth/google/redirect',
    clientID : keys.google.clientID,
    clientSecret : keys.google.clientSecret}, (accessToken, refreshToken, profile, done)=>{
    // passport callback function
    console.log(profile);
    //check if user exists

    User.findOne({username : profile.id}).then((currentUser)=>{
        if(currentUser){
            //already a user
            console.log('User is a current user ' + currentUser.username);
            done(null, currentUser);
        }else{
            //if not create a user
            new User({
                fname : profile.name.givenName,
                lname : profile.name.familyName,
                username : profile.id,
                password : profile.name.givenName + profile.name.familyName,
                thumbnail : profile._json.image.url
            }).save().then((newUser)=>{
                console.log('New user created' + newUser);
                done(null, newUser);
            });
        }
    });    
}));

passport.use('local-signup', new LocalStrategy({
    usernameField : 'username',
    passwordField : 'passowrd',
    passReqToCallback : true
},
        function(req, username, passowrd, done){
            User.findOne({'username': username}, function(err, user){
                if(err){
                    return done(err);
                }
                if(user)
                    return done(null, false, {message : 'Username is already in use'});
                var newUser = new User();
                newUser.username = req.body.username;
                newUser.passowrd = newUser.generateHash(req.body.passowrd);
                newUser.save(function(err){
                    if (err){
                        return done(err)
                    }
                return done(null, newUser);
                });
            });
        }
));

module.exports = passport;
