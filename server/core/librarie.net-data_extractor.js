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

var sourcePage = "";
var crawlDepth = "";
var uri = "";
var bc_books = [], bc_authors = [], bc_categories = [], bc_editures = [], bc_reviews = [], bc_book_offers = [],
	rep_books = [], rep_authors = [], rep_categories = [], rep_editures = [], rep_reviews = [], rep_book_offers = [];

exports.extract = function() {
	console.log("Starting data extract job...");

	new lazy(fs.createReadStream(__dirname + "/../resources/url_extractor/librarie.net_urls.txt")).lines.forEach(function(line) {

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
			 * 	Test if on book page.
			 *
			 * */
			if (uri.match(/\/carti\/\d+\/[\d\s\D]+/)) {
				var title = $("table.st_big_table tr[valign='top'] td[align='left'] h1 b").text();

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

				var autor = $("td.carte table  tr td[align='right'] b").filter(function() {
					if ($(this).text() != null && $(this).text().match(/Autor/)) {
						return true;
					}
				}).parent().siblings().text();

				if (autor != null) {
					var authors = autor.trim().split(",");
					book.authors = [];

					for (var i = 0; i < authors.length; i++) {
						var author = new Author();
						author.name = authors[i];
						author.books = [];
						author.books.push(book);

						bc_authors.push(author);
						
						
						
						//author.save();
						book.authors.push(author);
					}
				}

				var disponibil = $("td.carte table  tr td[align='right'] b").filter(function() {
					if ($(this).text() != null && $(this).text().match(/Disponibilitate/)) {
						return true;
					}
				}).parent().siblings().text();

				if (disponibil && disponibil.match(/in\sstoc/)) {
					bookOffer.available = true;
				} else {
					bookOffer.available = false;
				}

				var isbn = $("td.carte table  tr td[align='right'] b").filter(function() {
					if ($(this).text() != null && $(this).text().match(/ISBN/)) {
						return true;
					}
				}).parent().siblings().text();

				if (isbn) {
					bookOffer.isbn = isbn.trim();
				}

				var pag = $("td.carte table  tr td[align='right'] b").filter(function() {
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

				var editura = $("td.carte table  tr td[align='right'] b").filter(function() {
					if ($(this).text() != null && $(this).text().match(/Editura/)) {
						return true;
					}
				}).parent().siblings().text();

				if (editura) {
					var editure = new Editure();
					editure.name = editura.trim();
					editure.books = [];
					editure.books.push(book);

					bookOffer.editure = editure;
					//editure.save();
					bc_editures.push(editure);
				}

				var anAparitie = $("td.carte table  tr td[align='right'] b").filter(function() {
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
					category.name = categorie.trim();
					category.books = [];

					category.books.push(book);
					book.categories.push(category);
					//category.save();
					bc_categories.push(category);
				}

				book.bookOffer = bookOffer;
				bookOffer.book = book;
				
				//bookOffer.save();
				book.save();
				
				bc_book_offers.push(bookOffer);
				bc_books.push(book);

			}
		}
		
		/**
		 * 	Extract reviews.
		 *
		 * */
		if (reviewPage) {
			for (var i = 0; i < bc_books.length; i++) {
				if (bc_books[i].localId == reviewPage[2]) {
					var author, revText, review, book = bc_books[i];

					$("td.center_panel table:not(.st_big_table) tr td hr").siblings("b, p").each(function() {
						if (this.nodeName == 'B') {
							author = $(this).text();
						} else if (this.nodeName == 'P') {
							revText = $(this).text();
							review = new Review();

							review.author = author;
							review.text = revText;
							review.source = "www.librarie.net";
							review.url = reviewPage[1];
							review.bookId = book._id;

							bookOffer.reviewsList = [];
							bookOffer.reviewsList.push(review);
							review.save();
							bc_reviews.push(review);
							author = null;
							revText = null;
						}
					});
				}
			}
		}
	}).join(function() {
		/**
		 * 	Dump the extracted content into corresponding JSON files.
		 *
		 * */
		console.log("Dumping content for www.librarie.net extractor...");
		ExtractorUtils.dumpJSONContent("/../resources/data_extractor/bc_authors/librarie.net-bc_authors.json", bc_authors, "Saved the authors list into librarie.net-bc_authors.json");
		ExtractorUtils.dumpJSONContent("/../resources/data_extractor/bc_books/librarie.net-bc_books.json", bc_books, "Saved the books list into librarie.net-bc_books.json");
		ExtractorUtils.dumpJSONContent("/../resources/data_extractor/bc_book_offers/librarie.net-bc_book_offers.json", bc_book_offers, "Saved the books list into librarie.net-bc_book_offers.json");
		ExtractorUtils.dumpJSONContent("/../resources/data_extractor/bc_categories/librarie.net-bc_categories.json", bc_categories, "Saved the books categories list into librarie.net-bc_categories.json");
		ExtractorUtils.dumpJSONContent("/../resources/data_extractor/bc_editures/librarie.net-bc_editures.json", bc_editures, "Saved the editures list into librarie.net-bc_editures.json");
		ExtractorUtils.dumpJSONContent("/../resources/data_extractor/bc_reviews/librarie.net-bc_reviews.json", bc_reviews, "Saved the reviews list into librarie.net-bc_reviews.json");
		console.log("\n");
	});
}