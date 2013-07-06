var http = require('http');
var fs = require("fs");
var https = require("https");
var connect = require("connect");
var connectRoute = require("connect-route");

global.ss = require('socketstream');
global.config = require(__dirname + "/server/config.js");
global.sanitize = require('validator').sanitize;

global.registeredUser = null;    // the registered user
global.previousPage = null;

require(__dirname + "/server/db.js");
//include authorization methods
require(__dirname + "/server/core/ExtractorController.js");

// Define a single-page client called 'main'
ss.client.define('main', {
    view: 'app.html',
    css: [],
    code: ['libs/jquery.min.js', 'app'],
    tmpl: '*'
});

// Router Middleware
ss.http.middleware.prepend(ss.http.connect.bodyParser());
ss.http.middleware.prepend(ss.http.connect.query());

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