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

    filter: function (book, bookOffer, bc_reviews) {
        var offerFound = false;

        findByBookTitleAndOwner(book.title, bookOffer.owner, function(existentOffers){
            if(existentOffers!=null && existentOffers.length!=0){
                for (var i = 0; i < existentOffers.length; i++) {
                    if (existentOffers[i].book != null && existentOffers[i].book.title != null && existentOffers[i].book.title == book.title) {
                        offerFound = true;
                        var existentOffer = existentOffers[i];

                        if (existentOffer != null) {
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
                                existentOffer.editure = bookOffer.editure;
                            }

                            if (existentOffer.description != null) {
                                var descRegex1 = new RegExp(existentOffer.description);
                                var desc1 = existentOffer.description;

                                if (bookOffer.description != null) {
                                    var descRegex2 = new RegExp(bookOffer.description);
                                    var desc2 = bookOffer.description;

                                    if (!desc1.match(descRegex2) && !desc2.match(descRegex1)) {
                                        updateOffer = true;
                                        existentOffer.description = bookOffer.description;
                                    }
                                }
                            } else {
                                updateOffer = true;
                                existentOffer.description = bookOffer.description;
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

                            if (existentOffer.url != null) {
                                var urlRegex1 = new RegExp(existentOffer.url);
                                var url1 = existentOffer.url;

                                if (bookOffer.url != null) {
                                    var urlRegex2 = new RegExp(bookOffer.url);
                                    var url2 = bookOffer.url;

                                    if (!url1.match(urlRegex2) && !url2.match(urlRegex1)) {
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
                        }
                    }
                }

                if(!offerFound){
                    bookOffer.save();
                }
            } else {
                bookOffer.save();
            }
        });
    }

};

var findByBookTitleAndOwner = function (bookTitle, owner, callback) {
    BookOffer.findByBookTitleAndOwner(bookTitle, owner, function (err, offers) {
        if (err || offers === null) {
            return callaback('heresy');
        } else {
            return callback(offers);
        }
    });
}

/**
 *     Updates the details of a book offer.
 *
 * */
var update = function (offer) {
    BookOffer.update(offer.id, offer.book, offer.editure, offer.description, offer.price,
        offer.currency, offer.available, offer.reviewsList, offer.owner, offer.url);
}

exports.update = update;
exports.findByBookTitleAndOwner = findByBookTitleAndOwner;




