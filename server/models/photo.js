var ObjectId, Schema, Job, mongoose;

mongoose = require('mongoose');

Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

Photo = new Schema({
    url: {
        type: String,
        unique: true
    },
    dateCreated: {
        type: Date
    }
}, {
    collection: 'bc_photos'
});

/**
 *	Retrieves all the photos from the database.
 *
 * */
Photo.static('findAll', function(callback) {
    this.find({}).exec(function(err, photos) {
        if (err) {
            return callback(err);
        } else {
//            console.log("DISPLAYING PHOTOS...");
            return callback(null, photos);
        }
    });
});

/**
 * 	Removes a photo from the db.
 *
 * */
Photo.static('remove', function(id){
//    console.log('REMOVED PHOTO!');
    this.findOne({_id: id}).exec(function(err, photo){
        if(err===null && job!==null){
            photo.remove();
            return;
        }
    });
});

module.exports = mongoose.model('Photo', Photo);