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
        }, 500)
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