var Book = require(__dirname + "/../models/book.js");

module.exports = {

    /**
	 *	Retrieves all the books from the database.
	 * 
	 * */
    findAll: function(){
    	Book.findAll(function(err, books){
    		if(err || books===null){
    			return 'heresy';
    		}else{
    			return books;
    		}
    	});
    },
    
    /**
     * 	Finds a book by id.
     * 
     * */
    findById : function(id){
    	Book.findById(function(err, book){
    		if(err || book===null){
    			return 'heresy';
    		}else{
    			return book;
    		}
    	});
    },

    /**
     *  Retrieves a book from the db, found by its' title.
     *
     * */
    findByTitle: function (title) {
        Book.findByTitle(title, function (err, book) {
            if (err || book == null) {
                return 'heresy';
            } else {
                return book;
            }
        });
    },
    
    /**
	 * 	Removes a book from the db.
	 * 
	 * */
    remove: function(id){
    	Book.remove(id);
    },

    filter: function(book, bc_authors, bc_categories, bc_book_offers){
        Book.findByTitle(book.title, function(err, repoBook){
            var bookUpdates = false;    // flag indicating whether the book will be updated in the db.

            if(repoBook!=null && !err){
                // filter the books' authors.
                if(bc_authors.length!=0){
                    if(repoBook.authors!=null && repoBook.authors.length!=0){
                        var authRegex1 = null, authRegex2 = null,
                            auth1 = null, auth2 = null;

                        for(var j=0; j<bc_authors.length; j++){
                            if(bc_authors[j].name){
                                authRegex1 = new RegExp(bc_authors[j].name);
                                auth1 = bc_authors[j].name;

                                for(var k=0; k<repoBook.authors.length; k++){
                                    authRegex2 = null;
                                    auth2 = null;

                                    if(repoBook.authors[k].name){
                                        authRegex2 = new RegExp(repoBook.authors[k].name);
                                        auth2 = repoBook.authors[k].name;

                                        if(!auth1.match(authRegex2) && !auth2.match(authRegex1)){
                                            bookUpdates = true;

                                            repoBook.authors.push(bc_authors[j]);
                                        }
                                    }
                                }
                            }

                        }
                    } else {
                        bookUpdates = true;

                        for(var j=0; j<bc_authors.length; j++){
                            repoBook.authors.push(bc_authors[j]);
                        }
                    }
                }

                // filter the books' categories
                if(bc_categories.length!=0){
                    if(repoBook.categories!=null && repoBook.categories.length!=0){
                        var categRegex1 = null, categRegex2 = null,
                            categ1 = null, categ2 = null;

                        for(var j=0; j<bc_categories.length; j++){
                            if(bc_categories[j].name){
                                categRegex1 = new RegExp(bc_categories[j].name);
                                categ1 = bc_categories[j].name;

                                for(var k=0; k<repoBook.categories.length; k++){
                                    categRegex2 = null;
                                    categ2 = null;

                                    if(repoBook.categories[k].name){
                                        categRegex2 = new RegExp(repoBook.categories[k].name);
                                        categ2 = repoBook.categories[k].name;

                                        if(!categ1.match(categRegex2) && !categ2.match(categRegex1)){
                                            bookUpdates = true;

                                            repoBook.categories.push(bc_categories[j]);
                                        }
                                    }
                                }
                            }

                        }
                    }else{
                        bookUpdates = true;

                        for(var j=0; j<bc_categories.length; j++){
                            repoBook.categories.push(bc_categories[j]);
                        }
                    }
                }

                // filter the books' offers
                if(bc_book_offers.length!=0){
                    if(repoBook.bookOffers!=null && repoBook.bookOffers.length!=0){
                        var urlRegex1 = null, urlRegex2 = null,
                            ownerRegex1 = null, ownerRegex2 = null;

                        for(var j=0; j<bc_book_offers.length; j++){
                            if(bc_book_offers[j].url && bc_book_offers[j].owner){
                                urlRegex1 = new RegExp(bc_book_offers[j].url);
                                ownerRegex1 = new RegExp(bc_book_offers[j].owner);

                                for(var k=0; k<repoBook.bookOffers.length; k++){
                                    urlRegex2 = null;
                                    ownerRegex2 = null;

                                    if(repoBook.bookOffers[k].url && repoBook.bookOffers[k].owner){
                                        urlRegex2 = new RegExp(repoBook.bookOffers[k].url);
                                        ownerRegex2 = new RegExp(repoBook.bookOffers[k].owner);

                                        if(!ownerRegex1.match(ownerRegex2) && !ownerRegex2.match(ownerRegex1)
                                            && !urlRegex1.match(urlRegex2) && !urlRegex2.match(urlRegex1)){
                                            bookUpdates = true;

                                            repoBook.bookOffers.push(bc_book_offers[j]);
                                        }
                                    }
                                }
                            }

                        }
                    }else{
                        bookUpdates = true;

                        for(var j=0; j<bc_book_offers.length; j++){
                            repoBook.bookOffers.push(bc_book_offers[j]);
                        }
                    }
                }

                // update the book details
                if(bookUpdates){
                    update(repoBook);
                }
            } else {
                book.save();
            }
        });
    }

};

var update = function(book){
    Book.update(book.id, book.title, book.authors, book.categories, book.pagesNo, function(err, book){
        if (err != null) {
            return book;
        } else {
            return 'heresy';
        }
    });
}

exports.update = update;