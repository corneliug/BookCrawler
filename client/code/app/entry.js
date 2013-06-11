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
    
    var initComponents, showLogin, ensureAuthenticated, showMainPage, showActionBar, showBookPage;
    
    // Load app
    require('/authenticate');
    var appJs = require('/app');

	appJs.initComponents();
  });

});
