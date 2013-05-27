var Editure = require(__dirname + "/../models/editure.js");

exports.actions = function (req, res, ss) {

    req.use('session');

    return {

        /**
         *    Retrieves all the editures from the database.
         *
         * */
        findAll: function () {
            Editure.findAll(function (err, editures) {
                if (err || editures === null) {
                    return res('heresy');
                } else {
                    return res(editures);
                }
            });
        },
        /**
         *     Finds an editure by its' id.
         *
         * */
        findById: function (id) {
            Editure.findById(id, function (err, editure) {
                if (err || editure === null) {
                    return res('heresy');
                } else {
                    return res(editure);
                }
            });
        },
        /**
         *  Finds an editure by its name.
         *
         * */
        findByName: function (name) {
            Editure.findByName(name, function (err, editure) {
                if (err || editure == null) {
                    return res('heresy');
                } else {
                    return res(editure);
                }
            });
        },
        /**
         *  Updates an editure in the db.
         *
         * */
        update: function (editure) {
            Editure.update(editure.id, editure.name, editure / books);
        },
        /**
         *     Removes an editure from the db.
         *
         * */
        remove: function (id) {
            Editure.remove(id);
        }

    };

};