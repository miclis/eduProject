import { Router } from 'express';
const router = Router();
const debug = require('debug')('edu:index:controller');

/* GET home page */
router.get('/', (req, res, next) => {
    debug('Homepage rendered');
    res.render('index', { title: 'Hom' });
});

export default router;
