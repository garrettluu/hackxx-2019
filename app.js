const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
var cors = require('cors');


//Initialize Firebase
const firebase = require('firebase');
const config = {
    apiKey: "AIzaSyBxvyLamhcTZczjtobRuYFIE6RahuIV-mg",
    authDomain: "carpool-1554591126344.firebaseapp.com",
    databaseURL: "https://carpool-1554591126344.firebaseio.com",
    projectId: "carpool-1554591126344",
    storageBucket: "carpool-1554591126344.appspot.com",
    messagingSenderId: "769999411158"
};

firebase.initializeApp(config);


let database = firebase.database();

let app = express();
app.use(cors());
app.use(express.json());

//Pass database to router
let indexRouter = require('./routes/index')(database);
let usersRouter = require('./routes/users');

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
