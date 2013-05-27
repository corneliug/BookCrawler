var BookCategory = require(__dirname + "/../models/bookCategory.js");

exports.actions = function (req, res, ss) {

    req.use('session');

    return {

        /**
         *    Retrieves all the book categories from the database.
         *
         * */
        findAll: function () {
            BookCategory.findAll(function (err, categories) {
                if (err || categories === null) {
                    return res('heresy');
                } else {
                    return res(categories);
                }
            });
        },
        /**
         *     Finds a book category by its' id.
         *
         * */
        findById: function (id) {
            BookCategory.findById(id, function (err, category) {
                if (err || category === null) {
                    return res('heresy');
                } else {
                    return res(category);
                }
            });
        },
        /**
         *  Finds a book category by name.
         *
         * */
        findByName: function (name) {
            BookCategory.findByName(name, function (err, category) {
                if (err || category === null) {
                    return res('heresy');
                } else {
                    return res(category);
                }
            });
        },
        /**
         *  Updates a book category object.
         *
         * */
        update: function (category) {
            BookCategory.update(category.id, category.name, category.books);
        },
        /**
         *     Removes a book category from the db.
         *
         * */
        remove: function (id) {
            BookCategory.remove(id);
        }

    };

};
