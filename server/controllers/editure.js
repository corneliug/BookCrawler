var Editure = require(__dirname + "/../models/editure.js");

module.exports = {

	/**
	 *	Retrieves all the editures from the database.
	 * 
	 * */
    findAll: function(){
    	Editure.findAll(function(err, editures){
    		if(err || editures===null){
    			return 'heresy';
    		}else{
    			return editures;
    		}
    	});
    },
    /**
	 * 	Finds an editure by its' id.
	 * 
	 * */
    findById: function(id){
    	Editure.findById(id, function(err, editure){
    		if(err || editure===null){
    			return 'heresy';
    		}else{
    			return editure;
    		}
    	});
    },
    /**
     *  Finds an editure by its name.
     *
     * */
    findByName: function(name,callback){
        Editure.findByName(name, function(err, editure){
            if(err || editure==null){
                return callback('heresy');
            } else {
                return callback(editure);
            }
        });
    },

    /**
	 * 	Removes an editure from the db.
	 * 
	 * */
    remove: function(id){
    	Editure.remove(id);
    },

    filter: function(editure, book){
        var editureUpdates = false;

        Editure.findByName(editure.name, function(err, existentEditure){
            if (existentEditure != null && !err ) {
                if(existentEditure.books!=null && existentEditure.books.length!=0){
                    var titleMatch1 = new RegExp(book.title),
                        title1 = book.title;

                    for(var k=0; k<editure.books.length; k++){
                        if(editure.books[k].title){
                            var titleMatch2 = new RegExp(editure.books[k].title),
                                title2 = editure.books[k].title;

                            if(!title1.match(titleMatch2) && !title2.match(titleMatch1)){
                                editureUpdates = true;
                                existentEditure.books.push(book);
                            }
                        }
                    }
                } else {
                    existentEditure.books.push(book);
                }

                if(editureUpdates){
                    update(existentEditure);
                }
            } else {
                editure.save();
            }
        });
    }

};

/**
 *  Updates an editure in the db.
 *
 * */
var update = function(editure){
    Editure.update(editure.id, editure.name, editure/books);
}

exports.update = update;