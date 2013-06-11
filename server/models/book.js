var ObjectId, Schema, Book, Author, BookCategory, Photo, mongoose, bcrypt;

mongoose = require('mongoose');
bcrypt = require('bcrypt');
Author = require('./author');
BookCategory = require('./bookCategory');
Photo = require('./photo');
BookOffer = require('./bookOffer');

Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

Book = new Schema({
    localId: String,
    title: String,
    cover: {
        type: ObjectId,
        ref: 'Photo'
    },
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
    launchYear: Number,
    isbn: String,
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
    }).populate('authors').populate('categories').populate('bookOffers').populate('cover').exec(function (err, book) {
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
    }).populate('authors').populate('categories').populate('bookOffers').populate('cover').exec(function (err, book) {
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
    this.find({}).populate('authors').populate('categories').populate('bookOffers').populate('cover').exec(function (err, books) {
        if (err) {
            return callback(err);
        } else {
//            console.log("RETRIEVING ALL BOOKS FROM THE DB...");
            return callback(null, books);
        }
    });
});

/**
 *     Updates the details of a book.
 *
 * */
Book.static('update', function (id, title, authors, categories, pagesNo, launchYear, isbn, cover, callback) {
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

                if (launchYear != null) {
                    book.launchYear = launchYear;
                }

                if (isbn != null) {
                    book.isbn = isbn;
                }

                if (cover != null) {
                    book.cover = cover;
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