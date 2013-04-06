var fs = require('fs'); 

/**
 * 	Function used to write content into a JSON file.
 * 
 * */
exports.dumpJSONContent = function(relativePath, objectArray, loggedMessage){
	fs.writeFile(__dirname + relativePath, JSON.stringify(objectArray), function(err) {
			if (err) {
				console.log(err);
			} else {
				console.log(loggedMessage);
			}
		});	
}

/**
 * 	Function used to write content into a file.
 * 
 * */
exports.dumpContent = function(relativePath, content, loggedMessage){
	fs.writeFile(__dirname + relativePath, content, function(err) {
			if (err) {
				console.log(err);
			} else {
				console.log(loggedMessage);
			}
		});	
}