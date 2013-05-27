var ObjectId, Schema, Book, Author, BookCategory, mongoose, bcrypt;

mongoose = require('mongoose');
bcrypt = require('bcrypt');
Author = require('./author');
BookCategory = require('./bookCategory');
BookOffer = require('./bookOffer');

Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

Book = new Schema({
    localId: String,
    title: String,
    authors: [
        {
            type: ObjectId,
            ref: 'Author'
        }
    ],
    categories: [
        {
            type: ObjectId,
            ref: 'BookCategory'
        }
    ],
    pagesNo: Number,
    bookOffers: [
        {
            type: ObjectId,
            ref: 'BookOffer'
        }
    ]
}, {
    collection: 'bc_books'
});

/**
 *     Finds a book by id.
 *
 * */
Book.static('findById', function (id, callback) {
    this.findOne({
        _id: id
    }).exec(function (err, book) {
            if (err) {
                return callback(err, null);
            } else {
                console.log("BOOK FOUND BY ID!");
                return callback(null, book);
            }
        });
});

/**
 *  Retrieves a book from the db, found by its' title.
 *
 * */
Book.static('findByTitle', function (title, callback) {
    this.findOne({
        title: title
    }).populate('authors').populate('categories').populate('bookOffers').exec(function (err, book) {
            if (err) {
                return callback(err, null);
            } else {
                return callback(null, book);
            }
        });
});

/**
 *    Retrieves all the books from the database.
 *
 * */
Book.static('findAll', function (callback) {
    this.find({}).populate('authors').populate('categories').populate('bookOffers').exec(function (err, books) {
        if (err) {
            return callback(err);
        } else {
            console.log("RETRIEVING ALL BOOKS FROM THE DB...");
            console.log(books);
            return callback(null, books);
        }
    });
});

/**
 *     Updates the details of a book.
 *
 * */
Book.static('update', function (id, title, authors, categories, pagesNo, callback) {
//    console.log("UPDATED BOOK!");
    this.findOne({
        _id: id
    }).exec(function (err, book) {
            if (err) {
                return callback(err);
            } else {              var ObjectId, Schema, Book, Author, BookCategory, mongoose, bcrypt;

mongoose = require('mongoose');
bcrypt = require('bcrypt');
Author = require('./author');
BookCategory = require('./bookCategory');
BookOffer = require('./bookOffer');

Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

Book = new Schema({
    localId: String,
    title: String,
    authors: [
        {
            type: ObjectId,
            ref: 'Author'
        }
    ],
    categories: [
        {
            type: ObjectId,
            ref: 'BookCategory'
        }
    ],
    pagesNo: Number,
    bookOffers: [
        {
            type: ObjectId,
            ref: 'BookOffer'
        }
    ]
}, {
    collection: 'bc_books'
});

/**
 *     Finds a book by id.
 *
 * */
Book.static('findById', function (id, callback) {
    this.findOne({
        _id: id
    }).exec(function (err, book) {
            if (err) {
                return callback(err, null);
            } else {
                console.log("BOOK FOUND BY ID!");
                return callback(null, book);
            }
        });
});

/**
 *  Retrieves a book from the db, found by its' title.
 *
 * */
Book.static('findByTitle', function (title, callback) {
    this.findOne({
        title: title
    }).populate('authors').populate('categories').populate('bookOffers').exec(function (err, book) {
            if (err) {
                return callback(err, null);
            } else {
                return callback(null, book);
            }
        });
});

/**
 *    Retrieves all the books from the database.
 *
 * */
Book.static('findAll', function (callback) {
    this.find({}).populate('authors').populate('categories').populate('bookOffers').exec(function (err, books) {
        if (err) {
            return callback(err);
        } else {
            console.log("RETRIEVING ALL BOOKS FROM THE DB...");
            console.log(books);
            return callback(null, books);
        }
    });
});

/**
 *     Updates the details of a book.
 *
 * */
Book.static('update', function (id, title, authors, categories, pagesNo, callback) {
//    console.log("UPDATED BOOK!");
    this.findOne({
        _id: id
    }).exec(function (err, book) {
            if (err) {
                return callback(err);
            } else {
                if (title != null) {
                    book.title = title;
                }

                if (authors != null) {
                    book.authors = authors;
                }

                if (categories != null) {
                    book.categories = categories;
                }

                if (pagesNo != null) {
                    book.pagesNo = pagesNo;
                }

                book.save();

                return callback(null, book);
            }
        });

});

/**
 *     Removes a book from the db.
 *
 * */
Book.static('remove', function (id) {
    console.log('REMOVED BOOK!');
    this.findOne({_id: id}).exec(function (err, book) {
        if (err === null && book !== null) {
            book.remove();
            return;
        }
    });
});

module.exports = mongoose.model('Book', Book);
                if (title != null) {
                    book.title = title;
                }

                if (authors != null) {
                    book.authors = authors;
                }

                if (categories != null) {
                    book.categories = categories;
                }

                if (pagesNo != null) {
                    book.pagesNo = pagesNo;
                }

                book.save();

                return callback(null, book);
            }
        });

});

/**
 *     Removes a book from the db.
 *
 * */
Book.static('remove', function (id) {
    console.log('REMOVED BOOK!');
    this.findOne({_id: id}).exec(function (err, book) {
        if (err === null && book !== null) {
            book.remove();
            return;
        }
    });
});

module.exports = mongoose.model('Book', Book); 