import validator from 'validator';
import bcrypt from 'bcryptjs';
const debug = require('debug')('edu:user:service');
import passport from 'passport';

// User model
import User from '../models/User';

export default class userService {
    constructor() {}

    register(req, res) {
        const { name, email, password, password2 } = req.body;
        let errors = validate(req.body);

        if (errors.length > 0) {
            // Error - render again
            res.render('register', {
                errors,
                name,
                email,
                password,
                password2
            });
        } else {
            // All good - register
            User.findOne({ email: email }).then(user => {
                if (user) {
                    // User already exists
                    errors.push({ msg: 'Email is already registered' });
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else {
                    // Create new user
                    const newUser = new User({
                        name,
                        email,
                        password
                    });

                    // Hash password
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;

                            // Set password to hash
                            newUser.password = hash;

                            // Save user
                            newUser
                                .save()
                                .then(() => {
                                    debug('New user registered');
                                    req.flash('success_msg', 'You are now registered and can log in');
                                    res.redirect('/user/login');
                                })
                                .catch(err => debug(err));
                        })
                    );
                }
            });
        }
    }

    login(req, res, next) {
        // passport.authenticate('local', {
        //     successRedirect: '/dashboard',
        //     failureRedirect: '/user/login',
        //     failureFlash: true
        //   })(req, res, next);
        passport.authenticate('local', { failureFlash: true }, (error, user, info) => {
            // Error
            if (error) {
                debug(error);
                return next(error);
            }

            // Authentication failed
            if (!user) {
                debug('User authentication failed');
                req.flash('crit_error_msg', info.message);
                return res.redirect('/user/login');
            }

            // Authentication succeed
            req.logIn(user, error => {
                if (error) {
                    debug(error);
                    return next(error);
                }
                return res.redirect('/home');
            });
        })(req, res, next);
    }
}

const validate = data => {
    let errors = [];

    // Check required fields
    if (!data.name || !data.email || !data.password || !data.password2)
        errors.push({ msg: 'Please fill in all fields' });

    // Check passwords match
    if (data.password !== data.password2) errors.push({ msg: 'Password do not match' });

    // Check password length
    if (!validator.isLength(data.password, { min: 8 }))
        errors.push({ msg: 'Password should be at least 8 characters' });

    return errors;
};
