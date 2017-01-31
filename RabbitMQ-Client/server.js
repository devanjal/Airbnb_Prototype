var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var compression = require('compression');
var mongodb = require('mongodb');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var passport = require('passport');
require('./routes/passport')(passport);

var become_host = require('./routes/become_host');
var property = require('./routes/property');
var host = require('./routes/host');

var admin = require('./routes/admin');

var users = require('./routes/users');

var bill = require('./routes/bill');
var host = require('./routes/host');
var review = require('./routes/review');
var bill = require('./routes/bill');

var trips = require('./routes/trips');

var app = express();


app.use(compression());
app.set('port', process.env.PORT || 3000);

app.use(logger('dev'));
app.use(favicon(__dirname + '/public/airbnb-favicon.ico'));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());

app.use(serveStatic(__dirname + '/public', { 'maxAge': '1d' }));
app.use(serveStatic(__dirname + '/node_modules', { 'maxAge': '1d' }));

app.use(serveStatic(path.join(__dirname, 'views')));

app.use(serveStatic(path.join(__dirname, 'angularApp')));


app.use(session({
    secret: 'cmpe273_airbnb',
    resave: false,
    saveUninitialized: true,
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    store: new MongoStore({ url: 'mongodb://root:cmpe273@ds113678.mlab.com:13678/airbnb_mongo' })
}));

//app.engine('html',require('html').renderFile);
app.set('views', __dirname + '\\views');
//app.set('view engine','ejs');

app.use('/users', users);
app.use('/become_host', become_host);
app.use('/bill',bill);

app.use('/admin', admin);

app.use('/property', property);
app.use('/host', host);
app.use('/review', review);

app.use('/bill',bill);

app.use('/usertrips', trips);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

// // error handler
// app.use(function(err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};

//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });

app.all('/*', function (req, res, next) {
  console.log(req.url);
  res.sendFile('views/index.html', { root: __dirname });
});

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});