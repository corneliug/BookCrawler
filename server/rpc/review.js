var Review = require(__dirname + "/../models/review.js");

exports.actions = function(req, res, ss) {

	req.use('session');

	return {

		/**
		 * 	Finds a Review by id.
		 *
		 * */
		findById : function(id) {
			Review.findById(id, function(err, review) {
				if (err != null) {
					return res(review);
				} else {
					return res('heresy');
				}
			});
		},

		/**
		 *	Retrieves all reviews from the database.
		 *
		 * */
		findAll : function() {
			Review.findAll(function(err, reviews) {
				if (err != null) {
					return res(reviews);
				} else {
					return res('heresy');
				}
			});
		},

		/**
		 * 	Updates the details of a Review.
		 *
		 * */
		edit : function(review) {
			Review.edit(review.id, review.bookId, review.author, review.text, review.date, review.url, review.source, function(err, review) {
				if (err != null) {
					return res(review);
				} else {
					return res('heresy');
				}
			});
		},

		/**
		 * 	Removes a Review from the db.
		 *
		 * */
		remove : function(id) {
			Review.remove(id, function() {
			});
		}
	};

};
