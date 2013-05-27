var ObjectId, Schema, BookCategory, Book, mongoose, bcrypt;

mongoose = require('mongoose');
Book = require('./book');

Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

BookCategory = new Schema({	
	name : String,
	books : [{
		type: ObjectId,
        ref: 'Book'
	}]
}, {
	collection : 'bc_categories'
});

/**
 * 	Finds an BookCategory by id.
 *
 * */
BookCategory.static('findById', function(id, callback) {
	this.findOne({
		_id : id
	}).populate("books").exec(function(err, bookCategory) {
		if (err) {
			return callback(err, null);
		} else {
			console.log("BookCategory FOUND BY ID!");
			return callback(null, bookCategory);
		}
	});
});

/**
 *	Retrieves all BookCategories from the database.
 *
 * */
BookCategory.static('findAll', function(callback) {
	this.find({}).populate('books').exec(function(err, categories) {
		if (err) {
			return callback(err);
		} else {
			console.log("RETRIEVING ALL BookCategories FROM THE DB...");
			return callback(null, categories);
		}
	});
});

/**
 *  Finds a book category by name.
 *
 * */
BookCategory.static('findByName', function (name, callback) {
    this.findOne({
        name: name
    }).exec(function (err, category) {
        if(err){
            return callback(err, null);
        } else {
            return callback(null, category);
        }
    });
});

/**
 * 	Updates the details of a BookCategory.
 *
 * */
BookCategory.static('update', function(id, name, books) {
	console.log("UPDATED BookCategory DETAILS!");
	this.findOne({
		_id : id
	}).exec(function(err, bookCategory) {
		if (err) {
			return callback(err);
		} else {
			if(name!=null){
				bookCategory.name = name;	
			}
			
			if(books!=null){
				bookCategory.books = books;	
			}

			bookCategory.save();

			return callback(null, bookCategory);
		}
	});

});

/**
 * 	Removes a BookCategory from the db.
 * 
 * */
BookCategory.static('remove', function(id){
	console.log('REMOVED BookCategory!');
	this.findOne({_id: id}).exec(function(err, bookCategory){
		if(err===null && book!==null){
			bookCategory.remove();
			return;
		}
	});
});

module.exports = mongoose.model('BookCategory', BookCategory); 