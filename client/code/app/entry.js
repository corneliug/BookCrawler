window.ss = require('socketstream');
var windowWidth, windowHeight;

ss.server.on('disconnect', function(){
  console.log('Connection down :-(');
});

ss.server.on('reconnect', function(){
  console.log('Connection back up :-)');
});

ss.server.on('ready', function(){

  // Wait for the DOM to finish loading
  jQuery(function(){
    
    var showLogin, ensureAuthenticated;
    
    // Load app
    require('/login');
    require('/app');

	initComponents();
  });

});

var initComponents = function(){
	windowWidth = window.innerWidth;
	windowHeight = window.innerHeight;
	console.log(windowHeight);
	showLogin();
	$("#mainContainer").css("margin-top", windowHeight/4);
	$("#mainContainer").css("margin", "0px auto");
}

