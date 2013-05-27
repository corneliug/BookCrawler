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
     *  Finds a book category by name.
     *
     * */
    findByName: function(name){
        BookCategory.findByName(name, function(err, category){
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
    },

    filter: function(category, book){
        var updateCategory = false;

        BookCategory.findByName(category.name, function(err, existentCategory){
            if(existentCategory!=null && !err){
                if(existentCategory.books!=null && existentCategory.books.length!=0){
                    var titleRegex1 = new RegExp(book.title),
                        title1 = book.title;

                    for(var k=0; k<existentCategory.books.length; k++){
                        if(existentCategory.books[k].title!=null){
                            var titleRegex2 = new RegExp(existentCategory.books[k].title),
                                title2 = existentCategory.books[k].title;

                            if(!title1.match(titleRegex2) && !title2.match(titleRegex1)){
                                updateCategory = true;
                                existentCategory.books.push(book);
                            }
                        }
                    }
                } else {
                    updateCategory = true;
                    existentCategory.books.push(book);
                }

                if(updateCategory){
                    update(existentCategory);
                }
            } else {
                category.save();
            }
        });
    }

};

/**
 *  Updates a book category object.
 *
 * */
var update = function(category){
    BookCategory.update(category.id, category.name, category.books);
}

exports.update = update;