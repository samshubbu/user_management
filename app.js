var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var multer = require('multer');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var validator = require('express-validator');
session = require('client-sessions');
var nodemailer = require('node-mailer');
flash =require('express-flash');
//var swagger = require("swagger-node-express");
var forgot = require('password-reset')({
    uri : 'http://localhost:3000/password_reset',
    from : 'shubhamsinghrajput1996@gmail.com',
    host : 'localhost', port : 3000,
});

 


var index = require('./routes/index');
var index1 = require('./routes/index1');
var users = require('./routes/users');
var fileUploader = require('./routes/fileUploader');

var app = express();

app.set('trust proxy', 1) // trust first proxy

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//to prevent back button to go back to login page
app.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

app.use(session({
    cookieName: 'session',
    secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
    duration: 30 * 60 * 10000,
    activeDuration: 30 * 60 * 10000,
    httpOnly: true,
    secure: true,
    ephemeral: true,
    maxAge: 30 * 60 * 10000
}));

app.use(require('connect-flash')());
app.use(function(req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb'}));
app.use(cookieParser());
app.use(express.static('public'));
app.use(forgot.middleware);
//swagger.setAppHandler(app);



app.use('/', index);
app.use('/users', users);
app.use('/index1', index1);
app.use('/fileUploader', fileUploader);

app.get('/dist/img/fileicons/*', function(req, res) {
  res.sendfile('path/to/blank.png')
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;

});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.listen(3000, '0.0.0.0', function(){
    console.log("SERVER-- CONNECTED=====>>>>>>>")
});
module.exports = app;
