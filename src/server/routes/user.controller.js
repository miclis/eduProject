import { Router } from 'express';
const debug = require('debug')('edu:user:controller');
import Service from '../services/user.service';
import { ensureAuthenticated } from '../config/auth';
import csurf from 'csurf'

const router = Router();
const userService = new Service();

/* GET login page */
router.get('/login', (req, res) => {
    debug('Login page rendered');
    res.render('login', { title: 'Home', csrf: req.csrfToken() });
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
router.get('/logout', ensureAuthenticated, (req, res) => {
    userService.logout(req, res);
});

export default router;
