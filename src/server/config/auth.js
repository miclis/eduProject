export function ensureAuthenticated(req, res, next) {
    // Authenticated
    if (req.isAuthenticated())
        return next();
    // Not authenticated
    req.flash('crit_error_msg', 'Please log in to view this resource');
    res.redirect('/user/login');
}