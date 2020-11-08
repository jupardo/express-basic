var express = require('express');
const cors = require('cors');
require('dotenv').config();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
const auth = require('./lib/utils/auth');

var app = express();

app.use(cors());
app.use(auth.checkToken);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', usersRouter);
app.use('/products', productsRouter);
app.listen(8000, () => console.log('Server ir running at :8000'));

module.exports = app;
