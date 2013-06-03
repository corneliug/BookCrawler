var Book = require(__dirname + "/../models/book.js");

exports.actions = function (req, res, ss) {

    req.use('session');

    return {
        /**
         *    Retrieves all the books from the database.
         *
         * */
        findAll: function () {
            Book.findAll(function (err, books) {
                if (err || books === null) {
                    return res('heresy');
                } else {
                    return res(books);
                }
            });
        },

        /**
         *     Finds a book by id.
         *
         * */
        findById: function (id) {
            Book.findById(id, function (err, book) {
                if (err || book === null) {
                    return res('heresy');
                } else {
                    return res(book);
                }
            });
        },

        /**
         *  Retrieves a book from the db, found by its' title.
         *
         * */
        findByTitle: function (title) {
            Book.findByTitle(title, function (err, book) {
                if (err || book == null) {
                    return res('heresy');
                } else {
                    return res(book);
                }
            });
        },

        /**
         *  Updates the details of a book.
         *
         * */
        update: function (book) {
            Book.update(book.id, book.title, book.authors, book.categories, book.pagesNo, book.cover);
        },

        /**
         *     Removes a book from the db.
         *
         * */
        remove: function (id) {
            Book.remove(id);
        }

    };

};