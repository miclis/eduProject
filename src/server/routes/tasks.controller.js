import { Router } from 'express';
const debug = require('debug')('edu:tasks:controller');
import { ensureAuthenticated } from '../config/auth';
import Service from '../services/tasks.service';

var readings = require('../data/readings.json'); // reads once, then from cache
const router = Router();
const tasksService = new Service();

/* GET movies page */
router.get('/videos', ensureAuthenticated, (req, res) => {
    debug('Videos rendered');
    res.render('videos', {
        name: req.user.name,
        score: req.user.score,
        title: 'Warmup Videos',
        help: 'As a warmup listen to native speakers and try to warm up your tounge.',
        help2: '',
        icon: 'fas fa-film',
        link1: 'https://www.youtube-nocookie.com/embed/gp2VvmUJJc8?start=459',
        link2: 'https://www.youtube-nocookie.com/embed/z78ORZxE3Ko?start=459',
        link3: 'https://www.youtube-nocookie.com/embed/XgVY4zX9Y4M?start=459',
        reading_id: 1
    });
});

/* GET readings page */
router.get('/readings/:id', ensureAuthenticated, (req, res) => {
    const id = req.params.id - 1;
    const exercise = readings.exercises[id];

    debug('Readings rendered');
    res.render('readings', {
        id: req.params.id,
        name: req.user.name,
        score: req.user.score,
        title: 'Readings',
        help: 'Read the article and type in correct answers on the right',
        icon: 'fab fa-readme',
        exercise,
        csrf: req.csrfToken()
    });
});

/* POST readings handler */
router.post('/readings', ensureAuthenticated, (req, res) => {
    const exercise = readings.exercises[req.body.readingId - 1];
    tasksService.checkAnswers(req, res, exercise);
});

/* GET exercises page */
router.get('/exercises/:id', ensureAuthenticated, (req, res) => {
    debug('Exercises rendered');
    res.render('construction', { title: 'Exercises', name: req.user.name, score: req.user.score });
});

export default router;
