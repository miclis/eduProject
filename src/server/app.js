/**
 * Dependencies
 */
import express from 'express';
import path from 'path';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
const debug = require('debug')('edu:app');
import expressSession from 'express-session';
const MongoStore = require('connect-mongo')(expressSession);
import mongoose from 'mongoose';
import flash from 'connect-flash';
import favicon from 'serve-favicon';
import passport from 'passport';
import csurf from 'csurf';

/**
 * Configs
 */
import keys from './config/keys';
require('./config/passport')(passport);

/**
 * Database setup
 */
mongoose
    .connect(keys.MongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(debug('MongoDB Connected'))
    .catch(err => {
        debug('MongoDB Error');
        debug(err);
    });

/**
 * App settings
 */
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // Bodyparser
app.use(cookieParser());
app.use(
    expressSession({
        secret: 'eduEducate',
        resave: true,
        saveUninitialized: true,
        maxAge: Date.now() + 1 * 24 * 60 * 60 * 1000, // day * hour * min * s * ms
        store: new MongoStore({ mongooseConnection: mongoose.connection }) // Session store for production
    })
);
app.use(favicon(path.join(__dirname, '../public/img/favicon.ico')));
app.use(flash()); // Flash
app.use(passport.initialize()); // Passport middleware
app.use(passport.session());
app.use(
    csurf({
        cookie: true
    })
);

/**
 * Global variables
 */
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.crit_error_msg = req.flash('crit_error_msg');
    next();
});

/**
 * View engine setup
 */
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'pug');

/**
 * Routers
 */
// Routers
import indexRouter from './routes/index.controller';
import userRouter from './routes/user.controller';

// Routes
app.use('/', indexRouter);
app.use('/user', userRouter);

/**
 * Static files
 */
app.use(express.static('public')); // Can be commentet out if using proxy
app.use('/js', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '../node_modules/jquery/dist')));

/**
 * Error
 */
// Catch 404 error & forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});
// Error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.status = err.status;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

export default app;
