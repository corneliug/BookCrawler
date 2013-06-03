showLogin = function(){
	var login = ss.tmpl['login-form'].render();
	
	$("#mainContainer").html(login);
}

$("#mainContainer").on("click", "#loginBtt", function(){
	var username = $("#loginForm input[name='username']").attr("value");
	var password = $("#loginForm input[name='password']").attr("value");

    var data = {};
    data.username = username;
    data.password = password;

    if(username!=null && password!=null){
        ss.rpc('user.authenticate', data, function(response){
            if(response){
                $("#mainContainer").animate({
                    "margin-top": "0px"
                }, 1000, function(){
                    showMainPage(window.innerWidth);
                });
            }
        });
    }
});
