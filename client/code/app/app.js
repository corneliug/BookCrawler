exports.initComponents = function(){
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    ss.rpc("user.ensureAuthenticated", '', function(authenticated){
        if(authenticated){
            showMainPage(windowWidth, windowHeight);
        } else {
            $("#mainContainer").css("margin-top", windowHeight/4);
            showLogin();
        }
    }) ;
}

showMainPage = function (windowWidth, windowHeight) {
    ss.rpc("user.getRegisteredUser", "", function (user) {
        var main = ss.tmpl['main-mainPage'].render();

        $("#mainContainer").html(main);
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

        setTimeout(function () {
            $('#tilesContainer').masonry({
                itemSelector: '.bookTile',
                columnWidth: 10,
                animationOptions: {
                    duration: 400
                }
            });
        }, 500);
    });
}

showBookPage = function(bookId){
    previousPage = 'main';

    ss.rpc("user.getRegisteredUser", "", function (user) {
        ss.rpc("book.findById", bookId, function(book){
            if(book!=null && book!='heresy'){
                var bookTile = ss.tmpl['main-bookMain'].render({book: book});
                $("#mainContainer").html(bookTile);
                showActionBar(windowWidth, user);

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

showActionBar = function (windowWidth, user) {
    var avatarUrl = "";

    if (user.avatar != null) {
        avatarUrl = user.avatar;
    } else if (user.sex == 'm') {
        avatarUrl = "/images/male_avatar.jpg"
    } else if (user.sex == 'f') {
        avatarUrl = "/images/female_avatar.jpg"
    }

    $("#actionBar").css({
        "width": (windowWidth - 800),
        "left": windowWidth / 2 - (windowWidth - 800) / 2
    });

    $("#avatar").css({
        "background-image": "url('" + avatarUrl + "')"
    });

    $("#userName").html(user.name);

}