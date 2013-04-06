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
	 * 	Removes a book from the db.
	 * 
	 * */
    remove: function(id){
    	Book.remove(id);
    }

};