showLogin = function(){
	var login = ss.tmpl['login-form'].render();
	
	$("#mainContainer").html(login);
}

$("#mainContainer").on("click", "#loginBtt", function(){
	var username = $("#loginForm input[name='username']").attr("value");
	var password = $("#loginForm input[name='password']").attr("value");
	
	if(username!=null && password!=null){
		
		$("#mainContainer").animate({
			"margin-top": "0px"
		}, 500, function(){
			$("#mainContainer").html("");
			$("#mainContainer").css("");
			
			var mainPage = ss.tmpl['main-mainPage'].render();
			$("#mainCOntainer").html(mainPage);
		});
	}
			
});
