var BookOffer = require(__dirname + "/../models/bookOffer.js");

module.exports = {

    /**
     *    Retrieves all the book offers from the database.
     *
     * */
    findAll: function () {
        BookOffer.findAll(function (err, offers) {
            if (err || offers === null) {
                return 'heresy';
            } else {
                return offers;
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
                return 'heresy';
            } else {
                return offer;
            }
        });
    },

    /**
     *     Removes a book offer from the db.
     *
     * */
    remove: function (id) {
        BookOffer.remove(id);
    },

    filter: function (book, bookOffer) {

        var existentOffer = findByBookTitleAndOwner(book.title, book.owner);

        if (existentOffer != null && existentOffer != 404) {
            var updateOffer = false;    // flag indicating if the offer needs to be updated in the db.

            if (existentOffer.book != null) {
                // TODO: add some comparison methods to the book object
            } else {
                updateOffer = true;
                existentOffer.book = book;
            }

            if (existentOffer.editure != null) {
                // TODO: add some comparison methods to the editure object
            } else {
                updateOffer = true;
                existentOffer.editure = editure;
            }

            if (existentOffer.description != null) {
                var descRegex1 = new RegExp(existentOffer.description);

                if (bookOffer.description != null) {
                    var descRegex2 = new RegExp(bookOffer.description);

                    if (!descRegex1.match(descRegex2) && !descRegex2.match(descRegex1)) {
                        updateOffer = true;
                        existentOffer.description = bookOffer.description;
                    }
                }
            } else {
                updateOffer = true;
                existentOffer.description = bookOffer.description;
            }

            if (existentOffer.launchYear != null && bookOffer.launchYear != null) {
                if (existentOffer.launchYear != bookOffer.launchYear) {
                    updateOffer = true;
                    existentOffer.launchYear = bookOffer.launchYear
                }
            } else {
                updateOffer = true;
                existentOffer.launchYear = bookOffer.launchYear;
            }

            if (existentOffer.price != null && bookOffer.price != null) {
                if (existentOffer.price != bookOffer.price) {
                    updateOffer = true;
                    existentOffer.price = bookOffer.price;
                }
            } else {
                updateOffer = true;
                existentOffer.price = bookOffer.price;
            }

            if (bookOffer.available != null) {
                updateOffer = true;
                existentOffer.available = bookOffer.available;
            }


            if (existentOffer.isbn != null) {
                var isbnRegex1 = new RegExp(existentOffer.isbn);

                if (bookOffer.isbn != null) {
                    var isbnRegex2 = new RegExp(bookOffer.isbn);

                    if (!isbnRegex1.match(isbnRegex2) && !isbnRegex2.match(isbnRegex1)) {
                        updateOffer = true;
                        existentOffer.isbn = bookOffer.isbn;
                    }
                }
            } else {
                updateOffer = true;
                existentOffer.isbn = bookOffer.isbn;
            }

            if (existentOffer.url != null) {
                var urlRegex1 = new RegExp(existentOffer.url);

                if (bookOffer.url != null) {
                    var urlRegex2 = new RegExp(bookOffer.url);

                    if (!urlRegex1.match(urlRegex2) && !urlRegex2.match(urlRegex1)) {
                        updateOffer = true;
                        existentOffer.url = bookOffer.url;
                    }
                }
            } else {
                updateOffer = true;
                existentOffer.url = bookOffer.url;
            }

            if (bc_reviews.length != 0) {
                updateOffer = true;
                existentOffer.reviewsList = bc_reviews;
            }

            if (updateOffer) {
                update(existentOffer);
            }
        } else {
            bookOffer.save();
        }
    }

};

var findByBookTitleAndOwner = function (bookTitle, owner) {
    BookOffer.findByBookTitleAndOwner(bookTitle, owner, function (err, offer) {
        if (err || offer === null) {
            return 'heresy';
        } else if (offer == 404) {
            return res(404);
        } else {
            return offer;
        }
    });
}

/**
 *     Updates the details of a book offer.
 *
 * */
var update = function (offer) {
    BookOffer.update(offer.id, offer.book, offer.editure, offer.description, offer.launchYear, offer.price,
        offer.currency, offer.available, offer.isbn, offer.reviewsList, offer.owner, offer.url);
}

exports.update = update;
exports.findByBookTitleAndOwner = findByBookTitleAndOwner;




