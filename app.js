var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//db sync
var db = require('./models');
// db.sequelize.authenticate()
//  .then(function(){
//    console.log('Connection has been established successfully');
//   //  sync메소드가 db에 session table을 자동으로 생성한다. 그렇다면 sequelize migration으로 작업하려면 어떻게 해야하나? 수동으로 할 수 밖에 없을듯.. 
//    return db.sequelize.sync();
//  })
//  .then(function(){
//    console.log('DB sync complete.');
//  })
//  .catch(function(err){
//    console.error('Unable to connect to the database', err);
//  })

//session middleware
var sessionHelper = require('./helper/sessionHelper');
app.use(sessionHelper);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//flash middleware
app.use(flash());

//로그인, 로그아웃 확인변수 설정 middleware
app.use(function(req, res, next) {
  app.locals.isLogin = req.isAuthenticated();
  app.locals.userData = req.user; 
  next();
});

//require routing files
var homeRouter = require('./routes/home');
var accountsRouter = require('./routes/accounts');
var adminRouter = require('./routes/admin');
var productsRouter = require('./routes/products');
var cartRouter = require('./routes/cart');
var nonCartOrderRouter = require('./routes/nonCartOrder');
var myshopRouter = require('./routes/myshop');
var boardRouter = require('./routes/board');

//matching routing 
app.use('/', homeRouter);
app.use('/accounts', accountsRouter);
app.use('/admin', adminRouter);
app.use('/product', productsRouter);
app.use('/cart', cartRouter);
app.use('/nonCartOrder', nonCartOrderRouter);
app.use('/myshop', myshopRouter);
app.use('/board', boardRouter);

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
  res.render('error');
});

module.exports = app;
