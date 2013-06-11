var BookOffer = require(__dirname + "/../models/bookOffer.js");

exports.actions = function (req, res, ss) {

    req.use('session');

    return {

        /**
         *    Retrieves all the book offers from the database.
         *
         * */
        findAll: function () {
            BookOffer.findAll(function (err, offers) {
                if (err || offers === null) {
                    return res('heresy');
                } else {
                    return res(offers);
                }
            });
        },

        /**
         *     Finds a book offer by its' id.
         *
         * */
        findById: function (id) {
            BookOffer.findById(id, function (err, offer) {
                if (err || offer === null) {
                    return res('heresy');
                } else {
                    return res(offer);
                }
            });
        },

        findByBookTitleAndOwner: function (bookTitle, owner) {
            BookOffer.findByBookTitleAndOwner(bookTitle, owner, function (err, offer) {
                if (err || offer === null) {
                    return res('heresy');
                } else if (offer == 404) {
                    return res(404);
                } else {
                    return res(offer);
                }
            });
        },

        /**
         *     Updates the details of a book offer.
         *
         * */
        update: function (offer) {
            BookOffer.update(offer.id, offer.book, offer.editure, offer.description, offer.price,
                offer.currency, offer.available, offer.reviewsList, offer.owner, offer.url);
        },

        /**
         *     Removes a book offer from the db.
         *
         * */
        remove: function (id) {
            BookOffer.remove(id);
        }

    };

};
