var Photo = require(__dirname + "/../models/photo.js");

module.exports = {

    /**
	 *	Retrieves all the photos from the database.
	 * 
	 * */
    findAll: function(callback){
    	Photo.findAll(function(err, photos){
    		if(err || photos===null){
    			return callback('heresy');
    		}else{
    			return callback(photos);
    		}
    	});
    },
    /**
	 * 	Creates a photo.
	 * 
	 * */
    create: function(data, callback){
    	addPhoto(data, function(photo){

    		if(photo){
                return callback(photo);
			}
    	});
    },
	/**
	 * 	Removes a photo from the db.
	 * 
	 * */
    remove: function(id){
    	Photo.remove(id);
    },

    filter: function(){

    }

  };

/**
 * 	Adds a photo into the db.
 * 
 * */
var addPhoto = function(data, cb) {
//	console.log("ADD PHOTO!");
	var photo = new Photo, create = 1;
	if (data.url) {
		photo.url = sanitize(data.url).xss().toString();
	} else {
		create = 0;
	}

//	if (data.dateCreated) {
//		photo.dateCreated = sanitize(data.dateCreated).xss().toString();
//	} else {
//		create = 0;
//	}

	if (create == 1) {
		photo.save();

        return cb(photo);
	} else {
		return cb();
	}
}