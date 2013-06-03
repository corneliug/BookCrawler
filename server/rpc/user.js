var User = require(__dirname + "/../models/user.js");

exports.actions = function (req, res, ss) {

    req.use('session');

    return {

        /**
         *   Authenticates an user by his email and password.
         *
         *   It also saves the user on the session, with the
         * main purpose of authorizing actions in the application.
         *
         * */
        authenticate: function (data) {
            var username = data.username;
            var password = data.password;
            User.authenticate(username, password, function (err, user) {
                if (err || user === null) {
                    return res('heresy');
                } else {
                    registeredUser = user;
                    return res(user);
                }
            });
        },
        /**
         *     Loggs out the user.
         *
         * */
        logout: function () {
            ensureAuthenticated(req, res, function () {
                console.log("Logging out...");
                registeredUser = null;
                return;
            });
        },
        /**
         *     The function verifies whether the user is logged in.
         * We use this function to authorize different actions
         * and routes throughout the application.
         *
         * */
        ensureAuthenticated: function(){
            ensureAuthenticated(req, res, function(){
                return res(true);
            });

            return res(false);
        },
        /**
         *  Retrieve the current authenticated user.
         *
         * */
        getRegisteredUser: function(){
            return res(registeredUser);
        },
        /**
         *    Retrieves all the users from the database.
         *
         * */
        findAll: function () {
            User.findAll(function (err, users) {
                if (err || users === null) {
                    return res('heresy');
                } else {
                    return res(users);
                }
            });
        },
        /**
         *     Finds an user by his email address.
         *
         * */
        findByEmail: function (email) {
            User.findByEmail(email, function (err, user) {
                if (err || user === null) {
                    return res.send('heresy');
                } else {
                    return res(user);
                }
            });
        },
        /**
         *     Finds an user by his id.
         *
         * */
        findById: function (id) {
            User.findById(id, function (err, user) {
                if (err || user === null) {
                    return res('heresy');
                } else {
                    return res(user);
                }
            });
        },
        /**
         *     Creates an user
         *
         * */
        create: function (data) {
            return res(createUser(data));
        },
        /**
         *     Retrieves the authenticated user's details.
         *
         * */
        getUserDetails: function () {
            var authenticated = ensureAuthenticated(req, res, function () {
                return res(req.session.userId);
            });

            if (!authenticated) {
                return res("heresy");
            }
        },
        /**
         *     Removes an user from the db.
         *
         * */
        remove: function (id) {
            User.remove(id);
        }

    };

};

/**
 *     Creates an user.
 *
 * */
var createUser = function (data) {
    console.log("NEW USER!");
    var user = new User;

    if (data.name != null) {
        user.name = data.name;
    }
    if (data.username != null) {
        user.username = data.username;
    }
    if (data.password != null) {
        user.password = data.password;
    }
    if (data.contact.email != null) {
        user.contact.email = data.contact.email;
    }
    if (data.contact.phone_number != null) {
        user.contact.phone_number = data.contact.phone_number;
    }
    if(data.sex){
        user.sex = data.sex;
    }


    user.save();

    return user;
}