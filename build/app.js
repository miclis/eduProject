"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _httpErrors = _interopRequireDefault(require("http-errors"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _index = _interopRequireDefault(require("./routes/index.controller"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * App settings
 */
var app = (0, _express["default"])();
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: false
}));
app.use((0, _cookieParser["default"])());
app.use((0, _expressSession["default"])({
  secret: 'eduEducate',
  resave: true,
  saveUninitialized: true
}));
/**
 * View engine setup
 */

app.set('views', './build/views');
app.set('view engine', 'pug');
/**
 * Routers
 */
// Routers

// Routes
app.use('/', _index["default"]);
/**
 * Static files
 */

app.use(_express["default"]["static"]('public')); // Can be commentet out if using proxy

/**
 * Error
 */
// Catch 404 error & forward to error handler

app.use(function (req, res, next) {
  next((0, _httpErrors["default"])(404));
}); // Error handler

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}; // render the error page

  res.status(err.status || 500);
  res.render('error');
});
var _default = app;
exports["default"] = _default;