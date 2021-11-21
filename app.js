var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var bodyParser = require('body-parser')
var usersRouter = require('./routes/auth');
var authRouter = require('./routes/user')
var dashRouter = require('./routes/dashboard')
var attendanceRouter = require('./routes/attendance')
var project = require('./routes/project')
var task = require('./routes/task')
var dsr = require('./routes/dsr')
var leave = require('./routes/leave')
const expressip = require('express-ip');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(expressip().getIpInfoMiddleware);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use('/auth', usersRouter);
app.use('/user', authRouter)
app.use('/dashboard',dashRouter)
app.use('/attendance',attendanceRouter)
app.use('/project',project)
app.use('/task',task)
app.use('/dsr',dsr)
app.use('/leave',leave)
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});





// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
