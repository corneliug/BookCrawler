showLogin = function(){
	var login = ss.tmpl['authorization-loginForm'].render();

	$("#mainContainer").html(login);
    $("body").css("background-image", "url('/images/book_login_wallpaper.jpg')");

    $("#loginForm").submit(function() {
        var username = $("#loginForm input[type='text']").attr("value");
        var password = $("#loginForm input[type='password']").attr("value");

        var data = {};
        data.username = username;
        data.password = password;

        if(username!=null && password!=null){
            ss.rpc('user.authenticate', data, function(response){
                if(response!=null && response!='heresy'){
                    showMainPage(windowWidth, windowHeight);
                } else {
                    $("#loginError").show();
                }
            });
        }

        return false;
    });

    $("#loginForm button[type='button']").click(function(){
        showRegister();
    });
}

showRegister = function(){
    var register = ss.tmpl['authorization-registerForm'].render();
    $("#mainContainer").html(register);

    $("#registerMessage button").click(function(){
        $('#registerMessage').hide();
    });

    $("#registerForm").submit(function(){
        var username = $("#inputUser").attr("value");
        var password = $("#inputPassword").attr("value");
        var password2 = $("#inputPassword2").attr("value");
        var name = $("#inputName").attr("value");
        var sex = $("#inputSex").attr("value");
        var email = $("#inputEmail").attr("value");
        var address = $("#inputAddress").attr("value");
        var phone = $("#inputPhone").attr("value");

        var fieldsOk = true;
        var emailValid = true;
        var phoneValid = true;
        var passwordsMatch = true;

        if(username!="" && password!="" && password2!="" && name!="" && sex!="" && email!=""
            && address!="" && phone!=""){

            if(!email.match(/[\w\W\S]+@[\w\W\S]+\.[\w\W\S]+/)){
                emailValid = false;
            }

            if(!phone.match(/\d+/) || phone.match(/\D+/) || !phone.match(/\d{10,}/)){
                phoneValid = false;
            }

            if(password!=password2){
                passwordsMatch = false;
            }

        } else {
            fieldsOk = false;
        }

        $("#registerMessage").removeClass();
        $("#registerMessage").addClass("alert");

        if(fieldsOk){
            if(emailValid){
                if(phoneValid){
                    if(passwordsMatch){
                        var data = {};
                        data.contact = {};

                        data.name = name;
                        data.username = username;
                        data.password = password;
                        data.contact.email = email;
                        data.contact.address = address;
                        data.contact.phone_number = phone;

                        ss.rpc("user.create", data, function(user){});
                        var messageTmpl = ss.tmpl['bootstrap-confirmationEmail'].render();

                        $("#registerMessage .messageContainer").html(messageTmpl);
                        $("#registerMessage").addClass("alert alert-info");
                        $("#registerMessage").show();

                        return false;
                    } else {
                        var messageTmpl = ss.tmpl['bootstrap-passwordsMismatch'].render();

                        $("#registerMessage .messageContainer").html(messageTmpl);
                        $("#registerMessage").addClass("alert alert-error");
                        $("#registerMessage").show();
                        return false;
                    }
                } else {
                    var messageTmpl = ss.tmpl['bootstrap-invalidPhone'].render();

                    $("#registerMessage .messageContainer").html(messageTmpl);
                    $("#registerMessage").addClass("alert alert-error");
                    $("#registerMessage").show();
                    return false;
                }
            } else {
                var messageTmpl = ss.tmpl['bootstrap-invalidEmail'].render();

                $("#registerMessage .messageContainer").html(messageTmpl);
                $("#registerMessage").addClass("alert alert-error");
                $("#registerMessage").show();
                return false;
            }
        } else {
            var messageTmpl = ss.tmpl['bootstrap-fillAllFields'].render();

            $("#registerMessage .messageContainer").html(messageTmpl);
            $("#registerMessage").addClass("alert alert-error");
            $("#registerMessage").show();
            return false;
        }

    });

    $("#registerForm button[type='button']").click(function(){
        showLogin();
    });
}
