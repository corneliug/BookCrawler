var ObjectId, Schema, Author, Book, mongoose, bcrypt;

mongoose = require('mongoose');
Book = require('./book');

Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

Author = new Schema({	
	name : String,
	books : [{
		type: ObjectId,
        ref: 'Book'
	}]
}, {
	collection : 'bc_authors'
});

/**
 * 	Finds an author by id.
 *
 * */
Author.static('findById', function(id, callback) {
	this.findOne({
		_id : id
	}).exec(function(err, author) {
		if (err) {
			return callback(err, null);
		} else {
			console.log("AUTHOR FOUND BY ID!");
			return callback(null, author);
		}
	});
});

/**
 *  Retrieves an user from the db, found by its' name.
 *
 * */
Author.static('findByName', function(name, callback){
    this.findOne({
        name: name
    }).populate('books').exec(function(err, author){
         if(err || author==null){
            return callback(err, null);
        } else {
            return callback(null, author);
        }
    });
});

/**
 *	Retrieves all authors from the database.
 *
 * */
Author.static('findAll', function(callback) {
	this.find({}).populate('books').exec(function(err, books) {
		if (err) {
			return callback(err);
		} else {
			console.log("RETRIEVING ALL AUTHORS FROM THE DB...");
			return callback(null, authors);
		}
	});
});

/**
 * 	Updates the details of an author.
 *
 * */
Author.static('edit', function(id, name, books, callback) {
	this.findOne({
		_id : id
	}).exec(function(err, author) {
		if (err) {
			return callback(err);
		} else {
//            console.log("UPDATING USER");
			if(name!=null){
				author.name = name;	
			}
			
			if(books!=null){
				author.books = books;	
			}

			author.save();

			return callback(null, author);
		}
	});

});

/**
 * 	Removes an author from the db.
 * 
 * */
Author.static('remove', function(id){
	console.log('REMOVED AUTHOR!');
	this.findOne({_id: id}).exec(function(err, author){
		if(err===null && book!==null){
			author.remove();
			return;
		}
	});
});

module.exports = mongoose.model('Author', Author); 