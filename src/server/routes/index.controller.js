import { Router } from 'express';
const router = Router();
const debug = require('debug')('edu:index:controller');
import { ensureAuthenticated } from '../config/auth';

/* GET Welcome page */
router.get('/', (req, res) => {
    debug('Welcome rendered');
    res.render('index', {});
});

/* GET Home page */
router.get('/home', ensureAuthenticated, (req, res) => {
    debug('Home rendered');
    res.render('home', { title: 'Home', name: req.user.name });
});

export default router;
