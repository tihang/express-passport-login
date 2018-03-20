var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var passport = require('passport');
var passportSetup = require('./config/passport');
var cookieSession = require('cookie-session');

var config = require('./config/keys');
var authRoutes = require('./routes/auth-routes');
var profileRoutes = require('./routes/profile-routes');

var app = express();

//connect to mongodb
mongoose.connect(config.mongodb.database, ()=>{
  console.log('Connected to db!')
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

//set up cookie
app.use(cookieSession({
  message : 24*60*60*1000,
  keys : [config.session.cookieKey]
}));
//passport middleware
app.use(passport.initialize());
app.use(passport.session());


//passport config
require('./config/passport')


//routes
app.use('/auth/', authRoutes);
app.use('/profile', profileRoutes);


app.get('/', (req, res)=>{
  res.render('index', {user : req.user});
})

// catch 404 and forward to error handler
app.use((req, res, next)=> {
    res.status(404).send("Sorry cannot find that.");
});
// error handler
app.use((err, req, res, next)=> {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000, ()=>{
  console.log('Server Started')
});
module.exports = app;