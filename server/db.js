// NPM Modules
global.mongoose = require('mongoose');
global.redis = require('redis');

// Redis Configuration
//global.redisClient = redis.createClient(config[ss.env].redis.port,config[ss.env].redis.host);
//redisClient.auth(config[ss.env].redis.pass);


// MongoDB / Mongoose Configuration
mongoose.connect(config[ss.env].db);

// Models
require(__dirname + "/models/user.js");
require(__dirname + "/models/author.js");
require(__dirname + "/models/book.js");
require(__dirname + "/models/bookCategory.js");
require(__dirname + "/models/editure.js");
require(__dirname + "/models/review.js");
