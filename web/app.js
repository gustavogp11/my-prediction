const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session')
const appConfig = require('common-web').appConfig;
const appStats = require('./appStats');
const { contractService } = require('common-web/services');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: appConfig.server,
    resave: false,
    saveUninitialized: true
}));

app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});

app.use('/', require('./routes/index'));
app.use('/auth/google', require('./routes/google-auth'));
app.use('/users', require('./routes/users'));
app.use('/message', require('./routes/message'));
app.use('/login', require('./routes/login'));
app.use('/register', require('./routes/register'));

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
  res.render('error', {errorPage: '500'});
});

var lpad = (n) => {
    return ("0"+n).slice(-2);;
}
app.locals.utils = { 
    formatDate: function(timestamp) {
        var date = new Date(timestamp);
        var yyyy = date.getFullYear();
        var MM = lpad(date.getMonth() + 1);
        var dd = lpad(date.getDate());
        var hh = lpad(date.getHours());
        var mm = lpad(date.getMinutes());
        var ss = lpad(date.getSeconds());
        return [dd, MM, yyyy].join("/").concat(" ").concat([hh, mm, ss].join(":"));
    },
    replace: function(str, search, replacement) {
        if(!str)
            return str;
        return str.replace(search, replacement);
    },
    appConfig: function() {
        return appConfig;
    },
    appStats: function() {
        return appStats.get();
    },
    toJSON: function(obj) {
        return JSON.stringify(obj); 
    },
    get contractAddress() {
        return contractService().contractAddress;
    }
}

module.exports = app;
