var ObjectId, Schema, User, Photo, mongoose, bcrypt;

Photo = require('./photo');
mongoose = require('mongoose');
bcrypt = require('bcrypt');

Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

User = new Schema({
    name: {
        type: String
    },
    username: {
        type: String
    },
    salt: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    },
    avatar: {
        type: ObjectId,
        ref: 'Photo'
    },
    sex: {
        type: String,
        enum: ['f', 'm'],
        default: 'm'
    },
    contact: {
        email: {
            type: String,
            unique: true
        },
        phone_number: String,
        address: String
    }


}, {
    collection: 'bc_users'
});

User.virtual('password').get(function () {
    return this._password;
}).set(function (password) {
        this._password = password;
        var salt = this.salt = bcrypt.genSaltSync(10);
        this.hash = bcrypt.hashSync(password, salt);
    });

User.method('checkPassword', function (password, callback) {
    var eq = bcrypt.compareSync(password, this.hash);

    return callback(null, eq);
});

/**
 *   Authenticates an user by his username and password.
 *
 * */
User.static('authenticate', function (username, password, callback) {
    this.findOne({
        username: username
    }).populate('contact').populate('avatar').exec(function (err, user) {
            if (err)
                return callback(err);

            if (!user)
                return callback(true, false);

            user.checkPassword(password, function (err, passwordCorrect) {
                if (err) {
                    return callback(err);
                } else if (!passwordCorrect) {
                    console.log("INCORRECT PASSWORD!");
                    return callback(true, false);
                }

                console.log("USER AUTHENTICATED!");
                return callback(null, user);
            });

        });
});

/**
 *     Finds an user by his email address.
 *
 * */
User.static('findByEmail', function (email, callback) {
    this.findOne({
        email: email
    }).exec(function (err, user) {
            if (err) {
                return callback(err, null);
            } else {
                console.log("USER FOUND BY EMAIL!");
                return callback(null, user);
            }
        });
});

/**
 *     Finds an user by his id.
 *
 * */
User.static('findById', function (id, callback) {
    this.findOne({
        _id: id
    })
        .populate('contact')
        .populate('avatar')
        .exec(function (err, user) {
            if (err) {
                return callback(err, null);
            } else {
                console.log("USER FOUND BY ID!");
                return callback(null, user);
            }
        });
});

/**
 *    Retrieves all the users from the database.
 *
 * */
User.static('findAll', function (callback) {
    this.find({}).exec(function (err, users) {
        if (err) {
            return callback(err, null);
        } else {
            console.log("DISPLAYING ALL USERS...");
            return callback(null, users);
        }
    });
});

/**
 *     Removes an user from the db.
 *
 * */
User.static('remove', function (id) {
    console.log('USER REMOVED!');
    this.findOne({_id: id}).exec(function (err, user) {
        if (err === null && user !== null) {
            user.remove();
            return;
        }
    });
});

/**
 *     Updates the profile photo of an user.
 *
 * */
User.static('updateProfilePhoto', function (id, photo, callback) {
    this.findOne({
        _id: id
    }).exec(function (err, user) {
            if (err) {
                return callback(err);
            } else {
                if (photo!= null) {
                    user.avatar = photo;
                }

                user.save();
                return;
            }
        });

});

/**
 *     Updates an user's profile info.
 *
 * */
User.static('updateProfileInfo', function (id, info, callback) {
    this.findOne({
        _id: id
    }).exec(function (err, user) {
            if (err) {
                return callback(err);
            } else {
                if(info.name!=null && info.name!=""){
                    user.name = info.name;
                }

                if(info.sex!=null && info.sex!=""){
                    user.sex = info.sex;
                }

                if(info.email!=null & info.email!=""){
                    user.contact.email = info.email;
                }

                user.save();

                return callback(null, user);
            }
        });
});

/**
 *   Changes an user's password.
 *
 * */
User.static('changePassword', function (id, password, newPassword, callback) {
    this.findOne({
        _id: id
    }).exec(function (err, user) {
            if (err)
                return callback(err);

            if (!user)
                return callback(true, false);

            user.checkPassword(password, function (err, passwordCorrect) {
                if (err) {
                    return callback(err);
                } else if (!passwordCorrect) {
                    console.log("INCORRECT PASSWORD!");
                    return callback(true, false);
                }

                user.password = newPassword;
                user.save();

                console.log("USER PASSWORD HAS CHANGED!");
                return callback(null, true);
            });

        });
});

module.exports = mongoose.model('User', User); 