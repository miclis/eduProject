import { Router } from 'express';
const router = Router();
const debug = require('debug')('edu:user:controller');

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

export default router;
