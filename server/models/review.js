var ObjectId, Schema, Review, mongoose, bcrypt;

mongoose = require('mongoose');

Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

Review = new Schema({	
	bookId : String,
	author : String,
	text : String,
	date : Date,
	url : String,
	source: String
	
}, {
	collection : 'bc_reviews'
});

/**
 * 	Finds an Review by id.
 *
 * */
Review.static('findById', function(id, callback) {
	this.findOne({
		_id : id
	}).exec(function(err, review) {
		if (err) {
			return callback(err, null);
		} else {
			console.log("REVIEW FOUND BY ID!");
			return callback(null, review);
		}
	});
});

/**
 *	Retrieves all reviews from the database.
 *
 * */
Review.static('findAll', function(callback) {
	this.find({}).exec(function(err, reviews) {
		if (err) {
			return callback(err);
		} else {
			console.log("RETRIEVING ALL REVIEWS FROM THE DB...");
			return callback(null, reviews);
		}
	});
});

/**
 * 	Updates the details of a Review.
 *
 * */
Review.static('edit', function(id, bookId, author, text, date, url, source) {
	console.log("UPDATED REVIEW DETAILS!");
	this.findOne({
		_id : id
	}).exec(function(err, review) {
		if (err) {
			return callback(err);
		} else {
			if(bookId!=null){
				review.bookId = bookId;	
			}
			
			if(author!=null){
				review.author = author;	
			}
			
			if(text!=null){
				review.text = text;	
			}
			
			if(date!=null){
				review.date = date;
			}
			
			if(url!=null){
				review.url = url;
			}
			
			if(source!=null){
				review.source = source;
			}

			review.save();

			return callback(null, review);
		}
	});

});

/**
 * 	Removes a Review from the db.
 * 
 * */
Review.static('remove', function(id){
	console.log('REMOVED REVIEW!');
	this.findOne({_id: id}).exec(function(err, review){
		if(err===null && book!==null){
			review.remove();
			return;
		}
	});
});


module.exports = mongoose.model('Review', Review); 