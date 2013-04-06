var BookCategory = require(__dirname + "/../models/bookCategory.js");

module.exports = {
	/**
	 *	Retrieves all the book categories from the database.
	 * 
	 * */
    findAll: function(){
    	BookCategory.findAll(function(err, categories){
    		if(err || categories===null){
    			return 'heresy';
    		}else{
    			return categories;
    		}
    	});
    },
    /**
	 * 	Finds a book category by its' id.
	 * 
	 * */
    findById: function(id){
    	BookCategory.findById(id, function(err, category){
    		if(err || category===null){
    			return 'heresy';
    		}else{
    			return category;
    		}
    	});
    },
    /**
	 * 	Removes a book category from the db.
	 * 
	 * */
    remove: function(id){
    	BookCategory.remove(id);
    }

};