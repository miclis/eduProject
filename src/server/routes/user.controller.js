import { Router } from 'express';
const debug = require('debug')('edu:user:controller');
import Service from '../services/user.service';
import passport from 'passport';

const router = Router();
const userService = new Service();

/* GET login page */
router.get('/login', (req, res) => {
    debug('Login page rendered');
    res.render('login', { title: 'Home' });
});

/* GET register page */
router.get('/register', (req, res) => {
    debug('Register page rendered');
    res.render('register', { title: 'Home' });
});

/* POST register handler */
router.post('/register', (req, res) => {
    userService.register(req, res);
});

/* POST login handler */
router.post('/login', (req, res, next) => {
    userService.login(req, res, next);
});

/* POST logout handler */
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are now logged out');
    res.redirect('/user/login');
});

export default router;
