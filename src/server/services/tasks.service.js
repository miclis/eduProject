const debug = require('debug')('edu:tasks:service');

// User model
import User from '../models/User';

export default class TasksService {
    constructor() {}

    checkAnswers(req, res, exercise) {
        const answers = req.body.answer;
        let errors = 0;

        // Check if correct
        for (let i = 0; i < exercise.answers.length; i++) {
            if (answers[i].toUpperCase() !== exercise.answers[i].toUpperCase()) {
                errors++;
            }
        }

        // Calculate score
        let score = exercise.answers.length * 10 - errors * 10;

        // Add points to account
        User.findById(req.user._id, (err, user) => {
            if (user) {
                user.score += score;
                user.save(err => {
                    if (err) {
                        debug('Error saving new score');
                        console.log(err);
                    }
                });
            } else {
                debug('No user found');
                console.log(err);
            }
        });

        if (errors == 0) req.flash('points_success', `You have earned ${score} points!`);
        else req.flash('points_errors', `You have earned only ${score} points.`);

        res.redirect('/tasks/exercises/1');
    }
}
