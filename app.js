const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const newsRoute = require('./routes/news');

const app = express();
const cors = require("cors");

// Db connection
const option = {
  socketTimeoutMS: 30000,
  keepAlive: true,
  reconnectTries: 30000,
  useNewUrlParser: true 
};
const mongoUrl=process.env.MONGOURL || 'mongodb://127.0.0.1:27017/mongo-pagination';
mongoose
  .connect(mongoUrl,option)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log("Error in DB connection",err));

//Cors allow all
app.use(
  cors({
    allowedHeaders: ["sessionId", "Content-Type"],
    exposedHeaders: ["sessionId"],
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTION",
    preflightContinue: false
  })
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/news', newsRoute);

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
  res.status(500).send(err.status);
  res.render('error');
});
app.listen(process.env.PORT ||8484);

module.exports = app;
