var ObjectId, Schema, Editure, Book, mongoose, bcrypt;

mongoose = require('mongoose');
Book = require('./book');

Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

Editure = new Schema({
    name: String,
    books: [
        {
            type: ObjectId,
            ref: 'Book'
        }
    ]
}, {
    collection: 'bc_editures'
});

/**
 *     Finds an Editure by id.
 *
 * */
Editure.static('findById', function (id, callback) {
    this.findOne({
        _id: id
    }).populate("books").exec(function (err, editure) {
            if (err) {
                return callback(err, null);
            } else {
                console.log("Editure FOUND BY ID!");
                return callback(null, editure);
            }
        });
});

/**
 *    Retrieves all editures from the database.
 *
 * */
Editure.static('findAll', function (callback) {
    this.find({}).populate('books').exec(function (err, editures) {
        if (err) {
            return callback(err);
        } else {
            console.log("RETRIEVING ALL EDITURES FROM THE DB...");
            return callback(null, editures);
        }
    });
});

/**
 *  Finds an editure by its name.
 *
 * */
Editure.static('findByName', function (name, callback) {
    this.findOne({
        name: name
    }).populate('books').exec(function (err, editure) {
            if (err || editure == null) {
                return callback(err, null);
            } else {
                return callback(null, editure);
            }
        });
});

/**
 *     Updates the details of a Editure.
 *
 * */
Editure.static('update', function (id, name, books) {
    console.log("UPDATED Editure DETAILS!");
    this.findOne({
        _id: id
    }).exec(function (err, editure) {
            if (err) {
                return callback(err);
            } else {
                if (name != null) {
                    editure.name = name;
                }

                if (books != null) {
                    editure.books = books;
                }

                editure.save();

                return callback(null, editure);
            }
        });

});

/**
 *     Removes a Editure from the db.
 *
 * */
Editure.static('remove', function (id) {
    console.log('REMOVED Editure!');
    this.findOne({_id: id}).exec(function (err, editure) {
        if (err === null && book !== null) {
            editure.remove();
            return;
        }
    });
});


module.exports = mongoose.model('Editure', Editure); 