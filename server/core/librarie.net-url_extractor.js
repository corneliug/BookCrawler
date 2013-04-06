var util = require('util'),
	url = require('url'), 
	httpAgent = require('http-agent'), 
	jsdom = require('jsdom').jsdom, 
	fs = require('fs'), 
	path = require('path'),
	ExtractorUtils = require(__dirname +'/ExtractorUtils');

/**
 * 	Set up crawling configuration.
 *
 * */
var urls = ['/catalog-titluri.php?l=Z'];
var sourcePage = "";
var crawlDepth = 0;
var nextPage = "";
var extractReviews;
var agent = httpAgent.create('www.librarie.net', urls);
var dataExtractor = require(__dirname + "/librarie.net-data_extractor");

agent.addListener('next', function(err, agent) {
	agent.current.uri = path.normalize(agent.current.uri);
	console.log("[" + crawlDepth + "] Dumping content from " + agent.current.uri);
	extractUrls(agent);
	agent.next();
	// console.log(urls);
	// urls.pop(agent.current.uri);
});

/**
 * 	Dump the content into librarie.net_urls.in
 * 
 * */
agent.addListener('stop', function(err, agent) {
	if (err)
		console.log(err);

	ExtractorUtils.dumpContent("/../resources/url_extractor/librarie.net_urls.txt", sourcePage, "Saved the output into librarie.net_urls.txt");
});

// Startup function.
exports.start = function() {
	agent.start();
	console.log('Starting url extract job for ', agent.host);
}

function extractUrls(agent) {
	var window = jsdom(agent.body).createWindow();
	var $ = require('jquery').create(window);

	var chunk = agent.body;

	chunk = chunk.replace(/\n|\r|\r\n/g, '');
	sourcePage += crawlDepth + "\t\t" + agent.current.uri + "\t\t" + chunk + "\n";
	nextPage = "";
	extractReviews = null;

	if (agent.current.uri.match(/catalog-titluri/i)) {
		var next = true;
		$("div.navbar a").each(function() {
			var that = $(this);

			/**
			 * 	Extract the link to the next page in the books' list.
			 *
			 * */
			if ($(this).text().match(/inainte/) && next == true) {
				nextPage = that.attr("href");

				if (nextPage) {
					urls.push(nextPage);

					next = false;
					crawlDepth++;
				}
			}
		});

		/**
		 * 	Extract the link for each book page.
		 *
		 * */
		$(".carte_row").each(function() {
			nextPage = $(this).find("tr:first td table tr td a:first").attr("href");
			console.log("== "+nextPage);
			if (nextPage) {
				urls.push(nextPage);
			}
		});
		
		nextPage = null;

	/**
	 * 	Extract the reviews page.
	 * 
	 * */
	}else if(agent.current.uri.match(/[http:\/\/]*www\.librarie\.net\/carti\/(\d+)\/[\d\D\S\s]+/i)){
		extractReviews = window.document.getElementsByClassName('cautari_asemanatoare')[0].getElementsByTagName('div')[0];
		var len = extractReviews.childNodes.length;
		
		extractReviews = extractReviews.childNodes[len-1].nodeValue;
		if(extractReviews && !extractReviews.match(/\(0\)/)){
			nextPage = $("div.cautari_asemanatoare:first div:last a:last").attr("href");
			
			if(nextPage && nextPage.match(/[http:\/\/]*www\.librarie\.net(\/comentarii\.php\?id=\d+&action=view)/)){
				nextPage = nextPage.match(/[http:\/\/]*www\.librarie\.net(\/comentarii\.php\?id=\d+&action=view)/)[1];
				console.log("review page == " + nextPage);
				urls.push(nextPage);
			}
		}
	}
}