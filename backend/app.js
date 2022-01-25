//Importing Node Packages
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');

//Configuring Environment Variables
require('dotenv').config();

//Importing Routers
const usersRouter = require('./routes/users');
const listingRouter = require('./routes/listing');
const propertyRouter = require('./routes/property');
const suiteRouter = require('./routes/suite');

//Initiating App
var app = express();

//cors
const cors = require('cors');
app.use(cors());

// Settings setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload({
  //50mb file limit
  limit: {fileSize: 50 * 1024 * 1024},
  abortOnLimit: true,
}))

// Sessions Management
const session = require('express-session');
const MongoStore = require('connect-mongo');

app.use(session({
  secret: process.env.SESSION_SECRET,
  store: MongoStore.create({mongoUrl: process.env.ATLAS_URL}),
  saveUninitialized: false,
  resave: false,
}))

// Authentication
//app.use('/', authRouter);

//Redirect to login if not signed in, and passing in user information to locals if logged in
/*app.all(['/', '/*', '*'], async function(req, res, next) {
  if(!req.session.loggedIn) {
    res.redirect('/login');
  } else {
    res.locals.user = await UserModel.findById(req.session.user_id).populate('photo');
    res.locals.authenticated = req.session.loggedIn;
    res.locals.username = res.locals.user.username;
    next();
  }
})*/

// Router middleware
app.use('/users', usersRouter);
app.use('/listings', listingRouter);
app.use('/properties', propertyRouter);
app.use('/suites', suiteRouter);

// Connecting to the Database
mongoose.connect(process.env.ATLAS_URL);
/*app.listen(5000, () => {
  console.log("Server is running at port 5000");
})*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(res.locals.message);
});

module.exports = app;