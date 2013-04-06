var ObjectId, Schema, Review, Editure, Book, BookOffer, mongoose, bcrypt;

mongoose = require('mongoose');
bcrypt = require('bcrypt');
Review = require('./review');
Editure = require('./editure');
Book = require('./book');

Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

BookOffer = new Schema({
	localId : String,
	book : {
		type: ObjectId,
		ref: 'Book'
	},
	editure : {
		type: ObjectId,
		ref: 'Editure'
	},
	description : String,
	launchYear : Number,
	price : Number,
	currency : String,
	available : Boolean,
	isbn : String,
	reviewsList : [{
		type: ObjectId,
        ref: 'Review'
	}],
	owner : String,
	url : String
}, {
	collection : 'bc_book_offers'
});

/**
 * 	Finds a book offer by id.
 *
 * */
BookOffer.static('findById', function(id, callback) {
	this.findOne({
		_id : id
	}).exec(function(err, bookOffer) {
		if (err) {
			return callback(err, null);
		} else {
			console.log("BOOK OFFER FOUND BY ID!");
			return callback(null, bookOffer);
		}
	});
});

/**
 *	Retrieves all the book offers from the database.
 *
 * */
BookOffer.static('findAll', function(callback) {
	this.find({}).populate('editure').populate('reviewsList').exec(function(err, bookOffers) {
		if (err) {
			return callback(err);
		} else {
			console.log("RETRIEVING ALL BOOK OFFERS FROM THE DB...");
			return callback(null, booksOffers);
		}
	});
});

/**
 * 	Updates the details of a book offer.
 *
 * */
BookOffer.static('edit', function(id, book, editure, description, launchYear, price, currency, available, isbn, reviewsList, owner, url) {
	console.log("UPDATED BOOK OFFER!");
	this.findOne({
		_id : id
	}).exec(function(err, bookOffer) {
		if (err) {
			return callback(err);
		} else {
			if(book!=null){
				bookOffer.book = book;	
			}
			
			if(authors!=null){
				bookOffer.authors = authors;	
			}
			
			if(editure!=null){
				bookOffer.editure = editure;	
			}
			
			if(description!=null){
				bookOffer.description = description;	
			}
			
			if(launchYear!=null){
				bookOffer.launchYear = launchYear;	
			}
			
			if(price!=null){
				bookOffer.price = price;	
			}
			
			if(currency!=null){
				bookOffer.currency = currency;	
			}
			
			if(available!=null){
				bookOffer.available = available;	
			}
			
			if(isbn!=null){
				bookOffer.isbn = isbn;	
			}
			
			if(reviewsList!=null){
				bookOffer.reviewsList = reviewsList;	
			}
			
			if(owner!=null){
				bookOffer.owner = owner;	
			}
			
			if(url!=null){
				bookOffer.url = url;	
			}

			bookOffer.save();

			return callback(null, bookOffer);
		}
	});

});

/**
 * 	Removes a book offer from the db.
 * 
 * */
BookOffer.static('remove', function(id){
	console.log('REMOVED BOOK OFFEr!');
	this.findOne({_id: id}).exec(function(err, bookOffer){
		if(err===null && bookOffer!==null){
			bookOffer.remove();
			return;
		}
	});
});

module.exports = mongoose.model('BookOffer', BookOffer); 