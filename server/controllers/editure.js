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
    			return res('heresy');
    		}else{
    			return res(editure);
    		}
    	});
    },
    /**
	 * 	Removes an editure from the db.
	 * 
	 * */
    remove: function(id){
    	Editure.remove(id);
    }

};