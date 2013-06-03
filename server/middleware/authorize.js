/**
 *     The function verifies whether the user is logged in.
 * We use this function to authorize differents actions
 * and routes throughout the application.
 *
 * */
global.ensureAuthenticated = function (req, res, next) {
    if (registeredUser) {
        return next();
    }

    return false;
}
