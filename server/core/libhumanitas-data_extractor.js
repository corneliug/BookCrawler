var lazy = require('lazy'),
    fs = require('fs'),
    jsdom = require('jsdom').jsdom,
    Book = require('../models/book'),
    BookOffer = require('../models/bookOffer'),
    Author = require('../models/author'),
    Editure = require('../models/editure'),
    Review = require('../models/review'),
    BookCategory = require('../models/bookCategory'),
    ExtractorUtils = require(__dirname + '/ExtractorUtils'),
    BookController = require('../controllers/book'),
    BookOfferController = require('../controllers/bookOffer'),
    AuthorController = require('../controllers/author'),
    EditureController = require('../controllers/editure'),
    ReviewController = require('../controllers/review'),
    PhotoController = require('../controllers/photo'),
    BookCategoryController = require('../controllers/bookCategory');

var self;
var sourcePage = "";
var crawlDepth = "";
var uri = "";
var coverPhoto = "";
var bc_books = [], bc_authors = [], bc_categories = [], bc_editures = [], bc_reviews = [], bc_book_offers = [],
    rep_books = [], rep_authors = [], rep_categories = [], rep_editures = [], rep_reviews = [], rep_book_offers = [];

exports.extract = function () {
    console.log("Starting data extract job...");

    new lazy(fs.createReadStream(__dirname + "/../resources/url_extractor/libhumanitas_urls.txt")).lines.forEach(function (line) {

        sourcePage = line.toString();
        var source = sourcePage.match(/(\d+)\t\t([http:\/\/]*www\.libhumanitas\.ro[\d\D\S\s]+)\t\t(<!DOCTYPE[\d\D\S\s]+)/);
//        var reviewPage = sourcePage.match(/\d+\t\t([http:\/\/]*www\.librarie\.net\/comentarii\.php\?id=(\d+)&action=view)\t\t(<!DOCTYPE[\d\D\S\s]+)/);

        if (source) {
            crawlDepth = source[1];
            uri = source[2];
            sourcePage = source[3];
            var book = new Book();
            var bookOffer = new BookOffer();

            var window = jsdom(sourcePage).createWindow();
            var $ = require('jquery').create(window);

            // url sanitization
            if(!uri.match(/http:\/\//)){
                uri = uri.replace(/http:\//, "http://");
            }

            bookOffer.url = uri;
            bookOffer.owner = "www.libhumanitas.ro";

            /**
             *     Test if on book page.
             *
             * */
            if (uri.match(/(http:[\/]+www\.libhumanitas\.ro)(\/carti\/[\w\W\S]+$)/)) {
                var title = $("#product-page-head .product-name h1").text();

                if (title) {
                    book.title = title;
                }

                var pret = $("#container-product-price .price").text();
                var pretMatch = pret.match(/(\d+[\,\d+]*)\s(\w+)/);

                if(pret && pretMatch){
                    bookOffer.price = pretMatch[1].replace(/,/, ".");
                    bookOffer.currency = pretMatch[2];
                }

                var authors = $("#product-page-head .product-author a span").text();
                if(authors){
                    authors = authors.trim().split(",");

                    book.authors = [];
                    for (var i = 0; i < authors.length; i++) {
                        var author = new Author();
                        var authorUpdates = false;    // flag indicating whether the author will be updated in the db.

                        author.name = authors[i].trim();
                        author.books = [];
                        author.books.push(book);

                        bc_authors.push(author);
                        book.authors.push(author);
                    }
                }

                coverPhoto = $(".product-image img").attr("src");;

                var disponibil = $("#container-product-price .availability:first").hasClass("in-stock");
                if (disponibil==true) {
                    bookOffer.available = true;
                } else {
                    bookOffer.available = false;
                }

                var isbn = "";
                var pag = "";
                var sourceId = "";
                var editura = "";
                var anAparitie = "";

                $("div#atributes p").each(function(){
                    if($(this).text().match(/isbn/i)){
                        isbn = $(this).text();
                        isbn = isbn.replace(/isbn/i, "");
                        isbn = isbn.replace(/:/i, "");
                        isbn = isbn.trim();
                    } else if($(this).text().match(/[\w\W]+\sde\spagini/i)){
                        pag = $(this).text();
                        pag = pag.replace(/[\w\W]+\sde\spagini/i, "");
                        pag = pag.replace(/:/i, "");
                        pag = pag.trim();
                    } else if($(this).text().match(/cod\sprodus/i)){
                        sourceId = $(this).text();
                        sourceId = sourceId.replace(/cod\sprodus/i, "");
                        sourceId = sourceId.replace(/:/i, "");
                        sourceId = sourceId.trim();
                    } else if($(this).text().match(/editur\W/i)){
                        editura = $(this).text();
                        editura = editura.replace(/editur\W/i, "");
                        editura = editura.replace(/:/i, "");
                        editura = editura.trim();
                    } else if($(this).text().match(/an\sapari\Wie\scarte/i)){
                        anAparitie = $(this).text();
                        anAparitie = anAparitie.replace(/an\sapari\Wie\scarte/i, "");
                        anAparitie = anAparitie.replace(/:/i, "");
                        anAparitie = anAparitie.trim();
                    }
                });

                if(isbn!=""){
                    book.isbn = isbn;
                }

                if(pag!=""){
                    book.pagesNo = pag;
                }

                if (sourceId!="") {
                    bookOffer.localId = sourceId;
                }

                if (editure!="") {
                    var editure = new Editure();
                    var editureUpdates = false;

                    editure.name = editura;
                    editure.books = [];
                    editure.books.push(book);

                    bookOffer.editure = editure;
                    bc_editures.push(editure);
                }

                if (anAparitie) {
                    book.launchYear = anAparitie;
                }

                var descriere = $("div.box-collateral.box-description div.std p").text();
                if (descriere) {
                    bookOffer.description = descriere.trim();
                }

                book.bookOffers.push(bookOffer);
                bookOffer.book = book;
                bc_book_offers.push(bookOffer);
                bc_books.push(book);
            }
        }

    }).join(function () {
            /**
             *     Dump the extracted content into corresponding JSON files.
             *
             * */
            console.log("Dumping content of www.libhumanitas.ro extractor...");
            ExtractorUtils.dumpJSONContent("/../resources/data_extractor/bc_authors/libhumanitas-bc_authors.json", bc_authors, "Saved the authors list into libhumanitas-bc_authors.json");
            ExtractorUtils.dumpJSONContent("/../resources/data_extractor/bc_books/libhumanitas-bc_books.json", bc_books, "Saved the books list into libhumanitas-bc_books.json");
            ExtractorUtils.dumpJSONContent("/../resources/data_extractor/bc_book_offers/libhumanitas-bc_book_offers.json", bc_book_offers, "Saved the books list into libhumanitas-bc_book_offers.json");
            ExtractorUtils.dumpJSONContent("/../resources/data_extractor/bc_categories/libhumanitas-bc_categories.json", bc_categories, "Saved the books categories list into libhumanitas-bc_categories.json");
            ExtractorUtils.dumpJSONContent("/../resources/data_extractor/bc_editures/libhumanitas-bc_editures.json", bc_editures, "Saved the editures list into libhumanitas-bc_editures.json");
            ExtractorUtils.dumpJSONContent("/../resources/data_extractor/bc_reviews/libhumanitas-bc_reviews.json", bc_reviews, "Saved the reviews list into libhumanitas-bc_reviews.json");
            console.log("\n");

            filter();
        });
}

var filter = function () {
    console.log("Starting filtering job...");

    for (var i = 0; i < bc_books.length; i++) {
        var book = bc_books[i];

        for (var j = 0; j < bc_authors.length; j++) {
            var author = bc_authors[j];

            // db filtering for authors
            AuthorController.filter(author, book);
        }

        for (var j = 0; j < bc_editures.length; j++) {
            var editure = bc_editures[j];

            // db filtering for editure
            EditureController.filter(editure, book);
        }

        for (var j = 0; j < bc_categories.length; j++) {
            var category = bc_categories[j];

            // filter book categories in the db
            BookCategoryController.filter(category, book);
        }

        if (book != null && book.title) {
            BookController.filter(book, bc_authors, bc_categories, bc_book_offers);
        } else {
            if(coverPhoto){
                var data = {};
                data.url = coverPhoto;

                PhotoController.create(data, function(photo){
                    book.cover = photo;
                });
            }

            book.save();
            console.log("Saved "+book.title);
        }

        for (var j = 0; j < bc_book_offers.length; j++) {
            var bookOffer = bc_book_offers[j];

            if (book != null && book.title != null && bookOffer.owner != null) {
                BookOfferController.filter(book, bookOffer, bc_reviews);
            } else {
                bookOffer.save();
            }
        }

    }


}