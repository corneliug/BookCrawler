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

    new lazy(fs.createReadStream(__dirname + "/../resources/url_extractor/librarie.net_urls.txt")).lines.forEach(function (line) {

        sourcePage = line.toString();
        var source = sourcePage.match(/(\d+)\t\t([http:\/\/]*www\.librarie\.net[\d\D\S\s]+)\t\t(<!DOCTYPE[\d\D\S\s]+)/);
        var reviewPage = sourcePage.match(/\d+\t\t([http:\/\/]*www\.librarie\.net\/comentarii\.php\?id=(\d+)&action=view)\t\t(<!DOCTYPE[\d\D\S\s]+)/);

        if (source) {
            crawlDepth = source[1];
            uri = source[2];
            sourcePage = source[3];
            var book = new Book;
            var bookOffer = new BookOffer();

            sourceId = sourcePage.match(/[http:\/\/]*www\.librarie\.net\/carti\/(\d+)\/[\d\D\S\s]+/);
            if (sourceId) {
                bookOffer.localId = sourceId[1];
            }

            var window = jsdom(sourcePage).createWindow();
            var $ = require('jquery').create(window);

            // url sanitization
            if(!uri.match(/http:\/\//)){
                uri = uri.replace(/http:\//, "http://");
            }

            bookOffer.url = uri;
            bookOffer.owner = "www.librarie.net";

            /**
             *     Test if on book page.
             *
             * */
            if (uri.match(/\/carti\/\d+\/[\d\s\D]+/)) {
                var title = $("table.st_big_table tr[valign='top'] td[align='left'] h1 b:first").text();

                if (title) {
                    book.title = title;
                }

                var pret = $("td.carte table tr:first td[align='left']").text();
                var reducere = $("td.carte table tr:first td[align='left'] strike").text();
                if (pret && pret.match(/([\d+\S]+)\s(\w+)/) && reducere == "") {
                    pret = pret.match(/([\d+\S]+)\s(\w+)/);
                    bookOffer.price = pret[1].replace(/,/, ".");
                    bookOffer.currency = pret[2];
                } else {
                    pret = $("td.carte tr:eq(1) td[align='left']").text();

                    if (pret && pret.match(/([\d+\S]+)\s(\w+)/)) {
                        pret = pret.match(/([\d+\S]+)\s(\w+)/);
                        bookOffer.price = pret[1].replace(/,/, ".");
                        bookOffer.currency = pret[2];
                    }
                }

                var autor = $("td.carte table  tr td[align='right'] b").filter(function () {
                    if ($(this).text() != null && $(this).text().match(/Autor/)) {
                        return true;
                    }
                }).parent().siblings().text();

                if (autor != null) {
                    var authors = autor.trim().split(",");
                    book.authors = [];

                    for (var i = 0; i < authors.length; i++) {
                        var author = new Author();
                        var authorUpdates = false;    // flag indicating whether the author will be updated in the db.

                        author.name = authors[i];
                        author.books = [];
                        author.books.push(book);

                        bc_authors.push(author);
                        book.authors.push(author);
                    }
                }

                coverPhoto = $("td.center_panel table tr td table tr td a img").attr('src');

                var disponibil = $("td.carte table  tr td[align='right'] b").filter(function () {
                    if ($(this).text() != null && $(this).text().match(/Disponibilitate/)) {
                        return true;
                    }
                }).parent().siblings().text();

                if (disponibil && disponibil.match(/in\sstoc/)) {
                    bookOffer.available = true;
                } else {
                    bookOffer.available = false;
                }

                var isbn = $("td.carte table  tr td[align='right'] b").filter(function () {
                    if ($(this).text() != null && $(this).text().match(/ISBN/)) {
                        return true;
                    }
                }).parent().siblings().text();

                if (isbn) {
                    book.isbn = isbn.trim();
                }

                var pag = $("td.carte table  tr td[align='right'] b").filter(function () {
                    if ($(this).text() != null && $(this).text().match(/pagini/)) {
                        return true;
                    }
                }).parent().siblings().text();

                if (pag && pag.match(/\d+\s\w+/)) {
                    pag = pag.match(/(\d+)\s\w+/)[1];
                    book.pagesNo = pag;
                }

                var descriere = $("div.detaliu_carte_info").text();
                if (descriere) {
                    bookOffer.description = descriere.trim();
                }

                var editura = $("td.carte table  tr td[align='right'] b").filter(function () {
                    if ($(this).text() != null && $(this).text().match(/Editura/)) {
                        return true;
                    }
                }).parent().siblings().text();

                if (editura) {
                    var editure = new Editure();
                    var editureUpdates = false;

                    editure.name = editura.trim();
                    editure.books = [];
                    editure.books.push(book);

                    bookOffer.editure = editure;
                    bc_editures.push(editure);
                }

                var anAparitie = $("td.carte table  tr td[align='right'] b").filter(function () {
                    if ($(this).text() != null && $(this).text().match(/aparitie/)) {
                        return true;
                    }
                }).parent().siblings().text();

                if (anAparitie) {
                    book.launchYear = anAparitie;
                }

                var categorie = $("div.navbar a:last").text();
                if (categorie) {
                    var category = new BookCategory();
                    var updateCategory = false;

                    category.name = categorie.trim();
                    category.books = [];

                    category.books.push(book);
                    book.categories.push(category);
                    bc_categories.push(category);
                }

                book.bookOffers.push(bookOffer);
                bookOffer.book = book;
                bc_book_offers.push(bookOffer);
                bc_books.push(book);

            }
        }

        /**
         *     Extract reviews.
         *
         * */
        if (reviewPage) {
            var db_reviews = ReviewController.findAll();

            for (var i = 0; i < bc_book_offers.length; i++) {
                if (bc_book_offers[i].localId == reviewPage[2]) {
                    var author, revText, review, book = bc_books[i];

                    $("td.center_panel table:not(.st_big_table) tr td hr").siblings("b, p").each(function () {
                        if (this.nodeName == 'B') {
                            author = $(this).text();
                        } else if (this.nodeName == 'P') {
                            var saveReview = true;
                            revText = $(this).text();
                            review = new Review();

                            // url sanitization
                            if(!reviewPage[1].match(/http:\/\//)){
                                reviewPage[1] = reviewPage[1].replace(/http:\//, "http://");
                            }

                            review.author = author;
                            review.text = revText;
                            review.source = "www.librarie.net";
                            review.url = reviewPage[1];
                            review.bookId = book._id;

                            bookOffer.reviewsList = [];
                            bookOffer.reviewsList.push(review);

                            if (db_reviews != null && db_reviews.length != 0) {
                                for (var j = 0; j < db_reviews.length; j++) {
                                    if (review.text != null && db_reviews[j].text != null) {
                                        var revRegex1 = new RegExp(review.text);
                                        var revRegex2 = new RegExp(db_reviews[j].text);
                                        var rev1 = review.text;
                                        var rev2 = db_reviews[j].text;

                                        if (rev1.match(revRegex2) || rev2.match(revRegex1)) {
                                            saveReview = false;
                                        }
                                    } else if (review.text != null) {
                                        saveReview = true;
                                    }
                                }
                            }

                            if (saveReview) {
                                review.save();
                                bc_reviews.push(review);
                            }

                            author = null;
                            revText = null;
                        }
                    });
                }
            }
        }

    }).join(function () {
            /**
             *     Dump the extracted content into corresponding JSON files.
             *
             * */
            console.log("Dumping content of www.librarie.net extractor...");
            ExtractorUtils.dumpJSONContent("/../resources/data_extractor/bc_authors/librarie.net-bc_authors.json", bc_authors, "Saved the authors list into librarie.net-bc_authors.json");
            ExtractorUtils.dumpJSONContent("/../resources/data_extractor/bc_books/librarie.net-bc_books.json", bc_books, "Saved the books list into librarie.net-bc_books.json");
            ExtractorUtils.dumpJSONContent("/../resources/data_extractor/bc_book_offers/librarie.net-bc_book_offers.json", bc_book_offers, "Saved the books list into librarie.net-bc_book_offers.json");
            ExtractorUtils.dumpJSONContent("/../resources/data_extractor/bc_categories/librarie.net-bc_categories.json", bc_categories, "Saved the books categories list into librarie.net-bc_categories.json");
            ExtractorUtils.dumpJSONContent("/../resources/data_extractor/bc_editures/librarie.net-bc_editures.json", bc_editures, "Saved the editures list into librarie.net-bc_editures.json");
            ExtractorUtils.dumpJSONContent("/../resources/data_extractor/bc_reviews/librarie.net-bc_reviews.json", bc_reviews, "Saved the reviews list into librarie.net-bc_reviews.json");
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
            console.log("Saved "+title);
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