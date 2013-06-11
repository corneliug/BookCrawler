// My SocketStream 0.3 app

var http = require('http');

global.ss = require('socketstream');
global.config = require(__dirname + "/server/config.js");
global.sanitize = require('validator').sanitize;

global.registeredUser = null;
global.previousPage = null;

require(__dirname + "/server/db.js");
//include authorization methods
require(__dirname + "/server/middleware/authorize.js");
require(__dirname + "/server/core/ExtractorController.js");

// Define a single-page client called 'main'
ss.client.define('main', {
    view: 'app.html',
    css: ['app.css'],
    code: ['libs/jquery.min.js', 'libs/jquery.masonry.min.js', 'libs/jquery.tinyscrollbar.min.js', 'app'],
    tmpl: '*'
});

// Serve this client on the root URL
ss.http.route('/', function (req, res) {
    res.serveClient('main');
});

// Code Formatters
ss.client.formatters.add(require('ss-stylus'));

// Use server-side compiled Hogan (Mustache) templates. Others engines available
ss.client.templateEngine.use(require('ss-hogan'));

// Minimize and pack assets if you type: SS_ENV=production node app.js
if (ss.env === 'production') ss.client.packAssets();

// Start web server
var server = http.Server(ss.http.middleware);
server.listen(config[ss.env].port);

// Start SocketStream
ss.start(server);