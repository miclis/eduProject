import { Router } from 'express';
const router = Router();
const debug = require('debug')('edu:index:controller');

/* GET home page */
router.get('/', (req, res) => {
    debug('Homepage rendered');
    res.render('index', { title: 'Home' });
});

export default router;
