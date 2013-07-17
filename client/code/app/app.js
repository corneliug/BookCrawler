var contextMenuOpened = false;

exports.initComponents = function(){
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    ss.rpc("user.ensureAuthenticated", '', function(authenticated){
        if(authenticated){
            var main = ss.tmpl['main-pageLayout'].render();

            setTimeout(function(){
                $("#mainContainer").html(main);
                showMainPage(windowWidth, windowHeight);
            }, 1000);
        } else {
            $("#mainContainer").css("margin-top", windowHeight/4+20);
            $("#mainContainer").css("margin-left", windowWidth/3);
            $("#mainContainer").css("width", 500);

            showLogin();
        }
    }) ;
}

showMainPage = function (windowWidth, windowHeight) {
    $("#mainContainer").css("margin-top", 0);
    $("#mainContainer").css("margin-left", 0);
    $("#mainContainer").css("width", 0)

    ss.rpc("user.getRegisteredUser", "", function (user) {
        closeOptions();
        var main = ss.tmpl['main-mainPage'].render();
        $("body").css("background-image", "");

        $("#content").html(main);
        showActionBar(windowWidth, user);

        $("#tilesContainer").css({
            "width": (windowWidth - 500),
            "height": (windowHeight - 80),
            "left": windowWidth / 2 - (windowWidth - 500) / 2
        });

        setTimeout(function () {
            ss.rpc("book.findAll", "", function (books) {
                for (var i = 0; i < books.length; i++) {
                    var book = books[i]

                    var bookTile = ss.tmpl['main-bookTile'].render({book: book});

                    $("#tilesContainer").append(bookTile);

                    var imgWidth = $(".bookTile:last img").width();
                    var imgHeight = $(".bookTile:last img").height();

                    if (imgWidth == 0) {
                        imgWidth = 270;
                    }

                    $(".bookTile:last").css("width", imgWidth + 90);
                    $(".bookTile:last").children(".bookTitle").css("max-width", imgWidth + 70);

                    var bookTitleHeight = $(".bookTile:last").children(".bookTitle").height();
                    var bookAuthorsHeight = 0, bookOffersHeight = 0;
                    $(".bookTile:last").children(".bookAuthor").each(function () {
                        bookAuthorsHeight += $(this).height();
                    });

                    $(".bookTile:last").children(".bookOfferTile").each(function () {
                        bookOffersHeight += $(this).height();
                    });

                    $(".bookTile:last").css("height", imgHeight + bookTitleHeight + bookAuthorsHeight + bookOffersHeight + 90);
                }

                $(".bookTile").on("click", function(){
                    var id = $(this).children("input[type='hidden']").val();
                    showBookPage(id);
                });
            });
        }, 500);

        $('#tilesContainer').masonry({
                itemSelector: '.bookTile',
                columnWidth: 10,
                animationOptions: {
                    duration: 400
                }
         });

        $("#tilesContainer").show();
        $('#tilesContainer').tinyscrollbar();
    });
}

showBookPage = function(bookId){
    previousPage = 'main';

    ss.rpc("user.getRegisteredUser", "", function (user) {
        ss.rpc("book.findById", bookId, function(book){
            if(book!=null && book!='heresy'){
                closeOptions();
                var bookTile = ss.tmpl['main-bookMain'].render({book: book});
                $("#content").html(bookTile);

                $("#offers .offerTile").each(function(index){
                    if(index%2==0){
                        $(this).addClass("evenOfferRow");
                    } else {
                        $(this).addClass("oddOfferRow");
                    }

                    $(this).on("click", function(){
                        window.location = book.bookOffers[index].url;
                    });

                    $(this).on("mouseenter", function(){
                        var revId = $("input[name='currentOfferReviews']").val();

                        if(revId==null || revId!=book._id){
                            $("input[name='currentOfferReviews']").attr("value", book._id);
                            $("#reviewsContainer").find(".overview").html("");

                            for(var i=0; i<book.bookOffers[index].reviewsList.length; i++){
                                var reviewId = book.bookOffers[index].reviewsList[i];

                                ss.rpc("review.findById", reviewId, function(review){
                                    if(review!=null && review!='heresy'){
                                        var reviewTile = ss.tmpl['main-reviewTile'].render({review: review});
                                        $("#reviewsContainer").find(".overview").append(reviewTile);

                                        $(".reviewTile:last").on("click", function(){
                                            window.location = review.url;
                                        });
                                    }
                                });
                            }

                            setTimeout(function(){
                                $("#reviewsContainer").show();
                                $('#reviewsContainer').tinyscrollbar();
                            }, 500)
                        }
                    });

                    ss.rpc("editure.findById", book.bookOffers[index].editure, function(editure){
                        $(this).find(".editura").html(editure.name);
                    });
                });
            }

            $("#backButton").on("click",function(){
                if(previousPage!=null){
                    if(previousPage == 'main'){
                        exports.initComponents();
                    }
                }
            });
        });
    });
}

showProfilePage = function(user){
    previousPage = 'main';

    ss.rpc("user.getRegisteredUser", "", function (user) {
        var avatarUrl = "";

        if (user.avatar != null) {
            avatarUrl = user.avatar;
        } else if (user.sex == 'm') {
            avatarUrl = "/images/male_avatar.jpg"
        } else if (user.sex == 'f') {
            avatarUrl = "/images/female_avatar.jpg"
        }

        var profilePage = ss.tmpl['main-profilePage'].render({user: user, avatarUrl: avatarUrl});
        $("body").css("background-image", "");

        closeOptions();

        $("#content").css("margin-top", windowHeight/4+20);
        $("#content").css("margin-left", windowWidth/3);
        $("#content").css("width", 500);

        $("#content").html(profilePage);

        $(".profileItemEdit").click(function(){
            $(this).hide();
            $(this).parent("tr").find(".editDisabled").hide();
            $(this).parent("tr").find(".editEnabled").show();
        });

        $(".passChangeButton").click(function(){
            $(this).hide();
            $(".passChange").show();
        });

        $("#profileSettingsForm").submit(function(e){
            var continueFlow = true;
            var newName = $(".nameUpdate input").val();
            var newSex = $(".sexUpdate select").val();
            var newEmail = $(".emailUpdate input").val();

            var currentPass = $(".passChange:eq(0) input").val();
            var newPass = $(".passChange:eq(1) input").val();
            var newPass2 = $(".passChange:eq(2) input").val();

            var newPhoto = $("#imageUpload")[0].files[0];
            if(!newPhoto) {
                e.preventDefault();
            }

            if(currentPass!=""){
                if(newPass!="" && newPass2!=""){
                    if(newPass===newPass2){
                        ss.rpc("user.changePassword", user._id, currentPass, newPass, function(feedback){
                            if(feedback!=null && feedback!='heresy'){
                                $("#profileUpdateFeedback").removeClass();
                                $("#profileUpdateFeedback").addClass("alert");

                                var messageTmpl = ss.tmpl['bootstrap-passwordChanged'].render();
                                $("#profileUpdateFeedback .messageContainer").html(messageTmpl);
                                $("#profileUpdateFeedback").addClass("alert alert-info");
                                $("#profileUpdateFeedback").show()

                            } else {
                                $("#profileUpdateFeedback").removeClass();
                                $("#profileUpdateFeedback").addClass("alert");

                                var messageTmpl = ss.tmpl['bootstrap-invalidPassword'].render();
                                $("#profileUpdateFeedback .messageContainer").html(messageTmpl);
                                $("#profileUpdateFeedback").addClass("alert alert-error");
                                $("#profileUpdateFeedback").show();

                                continueFlow = false;
                            }
                        });
                    } else {
                        $("#profileUpdateFeedback").removeClass();
                        $("#profileUpdateFeedback").addClass("alert");

                        var messageTmpl = ss.tmpl['bootstrap-passwordsMismatch'].render();
                        $("#profileUpdateFeedback .messageContainer").html(messageTmpl);
                        $("#profileUpdateFeedback").addClass("alert alert-error");
                        $("#profileUpdateFeedback").show()

                        continueFlow = false;
                    }
                } else {
                    $("#profileUpdateFeedback").removeClass();
                    $("#profileUpdateFeedback").addClass("alert");

                    var messageTmpl = ss.tmpl['bootstrap-passwordFieldsNotFilledIn'].render();
                    $("#profileUpdateFeedback .messageContainer").html(messageTmpl);
                    $("#profileUpdateFeedback").addClass("alert alert-error");
                    $("#profileUpdateFeedback").show()

                    continueFlow = false;
                }
            }

            setTimeout(function(){
                if((newEmail!="" || newSex!="" || newEmail!="") && continueFlow==true){
                    var info = {};
                    info.name = newName;
                    info.sex = newSex;
                    info.email = newEmail;

                    ss.rpc("user.updateProfileInfo", user._id, info, function(feedback){
                        if(feedback!='heresy'){
                            $("#profileUpdateFeedback1").removeClass();
                            $("#profileUpdateFeedback1").addClass("alert");

                            var messageTmpl = ss.tmpl['bootstrap-profileUpdated'].render();
                            $("#profileUpdateFeedback1 .messageContainer").html(messageTmpl);
                            $("#profileUpdateFeedback1").addClass("alert alert-info");
                            $("#profileUpdateFeedback1").show()

                            setTimeout(function(){
                                window.location = "/";
                            }, 3000);
                        } else {
                            $("#profileUpdateFeedback1").removeClass();
                            $("#profileUpdateFeedback1").addClass("alert");

                            var messageTmpl = ss.tmpl['bootstrap-profileUpdateError'].render();
                            $("#profileUpdateFeedback1 .messageContainer").html(messageTmpl);
                            $("#profileUpdateFeedback1").addClass("alert alert-error");
                            $("#profileUpdateFeedback1").show()
                        }
                    });
                }
            }, 200);

        });

    });
}

showActionBar = function (windowWidth, user) {
    var avatarUrl = "";

    if(user!=null){
        $("#userName").html(user.name);
        if (user.avatar != null) {
            avatarUrl = user.avatar.url;
        } else if (user.sex == 'm') {
            avatarUrl = "/images/male_avatar.jpg"
        } else if (user.sex == 'f') {
            avatarUrl = "/images/female_avatar.jpg"
        }

        $("#avatar").css({
            "background-image": "url('" + avatarUrl + "')"
        });

        $("#actionBar").css({
            "width": windowWidth
        });

        $("#avatarHover").hover(
            function(){
                $("#avatarHover").css("opacity", "0.7");
            },
            function(){
                $("#avatarHover").css("opacity", "0");
            }
        ).click(function(){
            toggleContextualMenu();
        });

        $("#topLogo").click(function(){
            window.location = "/";
        });

        $("#userName").click(function(){
            toggleContextualMenu();
        });

        $(".contextOption:eq(0)").click(function(){
            showProfilePage(user);
        });

        $(".contextOption:eq(1)").click(function(){
            ss.rpc("user.logout", "", function(){
            });

            $("#mainContainer").css("margin-top", windowHeight/4+20);
            $("#mainContainer").css("margin-left", windowWidth/3);
            $("#mainContainer").css("width", 500);

            showLogin();
        });

        $("#searchBar input").keyup(function(){
            var searchText = $(this).val();
            clearSearchResults();

            ss.rpc("book.findByTitleRegex", searchText, function(books){
                for(var i=0; i<books.length; i++){
                    addBookToSearchResults(books[i]);
                }

                $("#searchBarContent .searchResultSeparator:last").remove();

                $("#searchBarContent").show();

                $(".searchResult").on("click", function(){
                    $("#searchBarContent").hide();
                    $("#searchBar input").val("");

                    var id = $(this).children("input[type='hidden']").val();
                    showBookPage(id);
                });
            });
        });

    } else {
        showLogin();
    }

}

closeOptions = function(){
    if(contextMenuOpened){
        $("#contextualMenu").hide();
        contextMenuOpened = false;
    }
}

toggleContextualMenu = function(){
    if(contextMenuOpened){
        closeOptions();
    } else {
        $("#contextualMenu").show();
        contextMenuOpened = true;
    }
}

var clearSearchResults = function(){
    $("#searchBarContent").html("");
}

var addBookToSearchResults = function(book){
    //authors+=book.authors[book.authors.length].name;

    var tile = ss.tmpl['main-searchResult'].render({book: book});
    $("#searchBarContent").append(tile);
}