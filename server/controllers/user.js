var User = require(__dirname + "/../models/user.js");

module.exports = {

    /**
     *    Retrieves all the users from the database.
     *
     * */
    findAll: function () {
        User.findAll(function (err, users) {
            if (err || users === null) {
                return 'heresy';
            } else {
                return users;
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
                return 'heresy';
            } else {
                return user;
            }
        });
    },
    /**
     *     Finds an user by his id.
     *
     * */
    findById: function (id) {
        return findUserById(id);
    },
    /**
     *     Creates an user
     *
     * */
    create: function (data) {
        return createUser(data);
    },
    /**
     *     Removes an user from the db.
     *
     * */
    remove: function (id) {
        User.remove(id);
    },

    /**
     *  Updates the profile photo of an user.
     *
     * */
    updateProfilePhoto: function(user, photo){
        User.updateProfilePhoto(user._id, photo);
    },

    /**
     *     Updates an user's profile info.
     *
     * */
    updateProfileInfo: function(id, info){
        User.updateProfileInfo(id, info, function(err, newUser){
            if(err){
                return 'heresy';
            } else {
                return newUser;
            }
        });
    },

    /**
     *   Changes an user's password.
     *
     * */
    changePassword: function(id, password, newPassword){
        User.changePassword(id, password, newPassword, function(err, feedback){
            if(err!=null || err==true){
                return 'heresy';
            } else if(feedback){
                return 'success';
            }

            return 'heresy';
        });
    }

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


    user.save();

    return user;
}

var findUserById = function(id){
    return User.findById(id, function (err, user) {
        if (err || user === null) {
            return 'heresy';
        } else {
            return user;
        }
    });
}