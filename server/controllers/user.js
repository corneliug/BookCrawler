var User = require(__dirname + "/../models/user.js");

module.exports = {

    /**
	 *	Retrieves all the users from the database.
	 * 
	 * */
    findAll: function(){
    	User.findAll(function(err, users){
    		if(err || users===null){
    			return 'heresy';
    		}else{
    			return users;
    		}
    	});
    },
    /**
	 * 	Finds an user by his email address.
	 * 
	 * */
    findByEmail: function(email){
    	User.findByEmail(email, function(err, user){
    		if(err || user===null){
    			return 'heresy';
    		}else{
    			return user;
    		}
    	});
    },
    /**
	 * 	Finds an user by his id.
	 * 
	 * */
    findById: function(id){
    	User.findById(id, function(err, user){
    		if(err || user===null){
    			return 'heresy';
    		}else{
    			return user;
    		}
    	});
    },
    /**
	 * 	Creates an user
	 * 
	 * */
    create: function(data){
    	return createUser(data);
    },
    /**
	 * 	Removes an user from the db.
	 * 
	 * */
    remove: function(id){
    	User.remove(id);
    }

};

/**
 * 	Creates an user.
 * 
 * */
var createUser = function(data){
  	console.log("NEW USER!");
    var user = new User;
    
    if(data.name != null){
    	user.name = data.name;
    }
    if(data.username != null){
    	user.username = data.username;
    }
    if(data.password != null){
    	user.password = data.password;
    }
    if (data.contact.email != null) {
        user.contact.email = data.contact.email;
    }
    if (data.contact.phone_number != null) {
        user.contact.phone_number = data.contact.phone_number;
    }
    
    
    user.save();
    
    return user;
}