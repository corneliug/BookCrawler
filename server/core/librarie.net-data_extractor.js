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
    BookCategoryController = require('../controllers/bookCategory');

var self;
var sourcePage = "";
var crawlDepth = "";
var uri = "";
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

//                        // db filtering for authors
//                        var existentAuthor = AuthorController.findByName(author.name);
//                        if (existentAuthor != null && existentAuthor != 'heresy') {
//                            if (existentAuthor.books != null && existentAuthor.books.length != 0) {
//                                for (var i = 0; i < existentAuthor.books.length; i++) {
//
//                                    if (existentAuthor.books[i].title != null && book.title != null) {
//                                        var titleRegex1 = new RegExp(existentAuthor.books[i].title);
//                                        var titleRegex2 = new RegExp(book.title);
//
//                                        if (!titleRegex1.match(titleRegex2) && !titleRegex2.match(titleRegex1)) {
//                                            existentAuthor.books.push(book);
//                                            authorUpdates = true;
//                                        }
//                                    }
//                                }
//                            } else {
//                                authorUpdates = true;
//                                existentAuthor.books.push(book);
//                            }
//
//                            if(authorUpdates){
//                                AuthorController.edit(existentAuthor);
//                            }
//                        } else {
//                            author.save();
//                        }

                        book.authors.push(author);
                    }
                }

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
                    bookOffer.isbn = isbn.trim();
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

//                    // db filtering for editure
//                    var existentEditure = EditureController.findByName(editure.name);
//                    if (existentEditure != null && existentEditure != 'heresy') {
//                        if(existentEditure.books!=null && existentEditure.books.length!=0){
//                            var titleMatch1 = new RegExp(book.title);
//
//                            for(var i=0; i<editure.books.length; i++){
//                                if(editure.books[i].title){
//                                    var titleMatch2 = new RegExp(editure.books[i].title);
//
//                                    if(!titleMatch1.match(titleMatch2) && !titleMatch2.match(titleMatch1)){
//                                        editureUpdates = true;
//                                        existentEditure.books.push(book);
//                                    }
//                                }
//                            }
//                        } else {
//                            existentEditure.books.push(book);
//                        }
//
//                        if(editureUpdates){
//                            EditureController.update(existentEditure);
//                        }
//                    } else {
//                        editure.save();
//                    }

                }

                var anAparitie = $("td.carte table  tr td[align='right'] b").filter(function () {
                    if ($(this).text() != null && $(this).text().match(/aparitie/)) {
                        return true;
                    }
                }).parent().siblings().text();

                if (anAparitie) {
                    bookOffer.launchYear = anAparitie;
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

//                    // filter book categories in the db
//                    var existentCategory = BookCategoryController.findByName(category.name);
//                    if(existentCategory!=null && existentCategory!='heresy'){
//                        if(existentCategory.books!=null && existentCategory.books.length!=0){
//                            var titleRegex1 = new RegExp(book.title);
//
//                            for(var i=0; i<existentCategory.books.length; i++){
//                                if(existentCategory.books[i].title!=null){
//                                    var titleRegex2 = new RegExp(existentCategory.books[i].title);
//
//                                    if(!titleRegex1.match(titleRegex2) && !titleRegex2.match(titleRegex1)){
//                                        updateCategory = true;
//                                        existentCategory.books.push(book);
//                                    }
//                                }
//                            }
//                        } else {
//                            updateCategory = true;
//                            existentCategory.books.push(book);
//                        }
//
//                        if(updateCategory){
//                            BookCategoryController.update(existentCategory);
//                        }
//                    }
                }

                book.bookOffers.push(bookOffer);
                bookOffer.book = book;
                bc_book_offers.push(bookOffer);

//                if(book.title){
//                    var repoBook = BookController.findByTitle(book.title);
//                    var bookUpdates = false;    // flag indicating whether the book will be updated in the db.
//
//                    if(repoBook!=null && repoBook!='heresy'){
//                        // todo filter the books' authors.
//                        if(bc_authors.length!=0){
//                            if(repoBook.authors!=null && repoBook.authors.length!=0){
//                                var authRegex1 = null, authRegex2 = null;
//
//                                for(var i=0; i<bc_authors.length; i++){
//                                    if(bc_authors[i].name){
//                                        authRegex1 = bc_authors[i].name;
//
//                                        for(var j=0; j<repoBook.authors.length; j++){
//                                            authRegex2 = null;
//
//                                            if(repoBook.authors[j].name){
//                                                authRegex2 = new RegExp(repoBook.authors[j].name);
//
//                                                if(!authRegex1.match(authRegex2) && !authRegex2.match(authRegex1)){
//                                                    bookUpdates = true;
//
//                                                    repoBook.authors.push(bc_authors[i]);
//                                                }
//                                            }
//                                        }
//                                    }
//
//                                }
//                            } else {
//                                bookUpdates = true;
//
//                                for(var i=0; i<bc_authors.length; i++){
//                                    repoBook.authors.push(bc_authors[i]);
//                                }
//                            }
//                        }
//
//                        // TODO filter the books' categories
//                        if(bc_categories.length!=0){
//                            if(repoBook.categories!=null && repoBook.categories.length!=0){
//                                var categRegex1 = null, categRegex2 = null;
//
//                                for(var i=0; i<bc_categories.length; i++){
//                                    if(bc_categories[i].name){
//                                        categRegex1 = new RegExp(bc_categories[i].name);
//
//                                        for(var j=0; j<repoBook.categories.length; j++){
//                                            categRegex2 = null;
//
//                                            if(repoBook.categories[j].name){
//                                                categRegex2 = new RegExp(repoBook.categories[j].name);
//
//                                                if(!categRegex1.match(categRegex2) && !categRegex2.match(categRegex1)){
//                                                    bookUpdates = true;
//
//                                                    repoBook.categories.push(bc_categories[i]);
//                                                }
//                                            }
//                                        }
//                                    }
//
//                                }
//                            }else{
//                                bookUpdates = true;
//
//                                for(var i=0; i<bc_categories.length; i++){
//                                    repoBook.categories.push(bc_categories[i]);
//                                }
//                            }
//                        }
//
//                        // TODO filter the books' offers
//                        if(bc_book_offers.length!=0){
//                            if(repoBook.bookOffers!=null && repoBook.bookOffers.length!=0){
//                                var urlRegex1 = null, urlRegex2 = null,
//                                    ownerRegex1 = null, ownerRegex2 = null;
//
//                                for(var i=0; i<bc_book_offers.length; i++){
//                                    if(bc_book_offers[i].url && bc_book_offers[i].owner){
//                                        urlRegex1 = new RegExp(bc_book_offers[i].url);
//                                        ownerRegex1 = new RegExp(bc_book_offers[i].owner);
//
//                                        for(var j=0; j<repoBook.bookOffers.length; j++){
//                                            urlRegex2 = null;
//                                            ownerRegex2 = null;
//
//                                            if(repoBook.bookOffers[j].url && repoBook.bookOffers[j].owner){
//                                                urlRegex2 = new RegExp(repoBook.bookOffers[j].url);
//                                                ownerRegex2 = new RegExp(repoBook.bookOffers[j].owner);
//
//                                                if(!ownerRegex1.match(ownerRegex2) && !ownerRegex2.match(ownerRegex1)
//                                                    && !urlRegex1.match(urlRegex2) && !urlRegex2.match(urlRegex1)){
//                                                    bookUpdates = true;
//
//                                                    repoBook.bookOffers.push(bc_book_offers[i]);
//                                                }
//                                            }
//                                        }
//                                    }
//
//                                }
//                            }else{
//                                bookUpdates = true;
//
//                                for(var i=0; i<bc_book_offers.length; i++){
//                                    repoBook.bookOffers.push(bc_book_offers[i]);
//                                }
//                            }
//                        }
//
//                        // update the book details
//                        if(bookUpdates){
//                            BookController.update(repoBook);
//                        }
//                    }
//                } else {
//                    book.save();
//                }

                bc_books.push(book);

            }
        }

        /**
         *     Extract reviews.
         *
         * */
        if (reviewPage) {
            var db_reviews = ReviewController.findAll();

            for (var i = 0; i < bc_books.length; i++) {
                if (bc_books[i].localId == reviewPage[2]) {
                    var author, revText, review, book = bc_books[i];

                    $("td.center_panel table:not(.st_big_table) tr td hr").siblings("b, p").each(function () {
                        if (this.nodeName == 'B') {
                            author = $(this).text();
                        } else if (this.nodeName == 'P') {
                            var saveReview = true;
                            revText = $(this).text();
                            review = new Review();

                            review.author = author;
                            review.text = revText;
                            review.source = "www.librarie.net";
                            review.url = reviewPage[1];
                            review.bookId = book._id;

                            bookOffer.reviewsList = [];
                            bookOffer.reviewsList.push(review);

                            if(db_reviews!=null && db_reviews.length!=0){
                                for(var j=0; j<db_reviews.length; j++){
                                    if(review.text!=null && db_reviews[j].text!=null){
                                        var revRegex1 = new RegExp(review.text);
                                        var revRegex2 = new RegExp(db_reviews[j].text);

                                        if(revRegex1.match(revRegex2) || revRegex2.match(revRegex1)){
                                            saveReview = false;
                                        }
                                    } else if(review.text!=null){
                                        saveReview = true;
                                    }
                                }
                            }

                            if(saveReview){
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

var filter = function(){
    console.log("Starting filtering job...");

    for(var i=0; i<bc_books.length; i++){
        var book = bc_books[i];

        for(var j=0; j<bc_authors.length; j++){
            var author = bc_authors[j];

            // db filtering for authors
            AuthorController.filter(author, book);
        }

        for(var j=0; j<bc_editures.length; j++){
            var editure = bc_editures[j];

            // db filtering for editure
            EditureController.filter(editure, book);
        }

        for(var j=0; j<bc_categories.length; j++){
            var category = bc_categories[j];

            // filter book categories in the db
            BookCategoryController.filter(category, book);
        }

        if(book!=null && book.title){
            BookController.filter(book, bc_authors, bc_categories, bc_book_offers);
        } else {
            book.save();
        }

        for(var j=0; j<bc_book_offers.length; j++){
            var bookOffer = bc_book_offers[j];

            if(book!=null && book.title!=null && book.owner!=null){
                BookOfferController.filter(book,bookOffer);
            } else {
                bookOffer.save();
            }
        }

    }


}