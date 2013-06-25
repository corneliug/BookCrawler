var util = require('util'),
    url = require('url'),
    httpAgent = require('http-agent'),
    jsdom = require('jsdom').jsdom,
    fs = require('fs'),
    path = require('path'),
    ExtractorUtils = require(__dirname + '/ExtractorUtils');

/**
 *     Set up crawling configuration.
 *
 * */
var urls = ['/carti.html'];
var sourcePage = "";
var crawlDepth = 0;
var nextPage = "";
var extractReviews;
var agent = httpAgent.create('www.libhumanitas.ro', urls);
var dataExtractor = require(__dirname + "/libhumanitas-data_extractor");

agent.addListener('next', function (err, agent) {
    agent.current.uri = path.normalize(agent.current.uri);
    console.log("[" + crawlDepth + "] Dumping content from " + agent.current.uri);
    extractUrls(agent);
    agent.next();
    // console.log(urls);
    // urls.pop(agent.current.uri);
});

/**
 *     Dump the content into libhumanitas_urls.in
 *
 * */
agent.addListener('stop', function (err, agent) {
    if (err)
        console.log(err);

    ExtractorUtils.dumpContent("/../resources/url_extractor/libhumanitas_urls.txt", sourcePage, "Saved the output into libhumanitas_urls.txt");
});

// Startup function.
exports.start = function () {
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

    // \/carti\.html[\?p=\d+]*$
    if (agent.current.uri.match(/\/carti\.html$/i)) {
        var next = true;

        /**
         *     Extract the link to the next page in the books' list.
         *
         * */
        nextPage = $(".pages ol li a.next").attr("href");
        var nextPageRelative = nextPage.match(/(http:[\/]+www\.libhumanitas\.ro)(\/carti\.html[\?p=\d+]*$)/);

        if (nextPage && nextPageRelative) {
            urls.push(nextPageRelative[2]);

            next = false;
            crawlDepth++;
        }

        /**
         *     Extract the link for each book page.
         *
         * */
        $(".category-products .products-grid li").each(function () {
            nextPage = $(this).find("a:first").attr("href");
            var nextPageRelative = nextPage.match(/(http:[\/]+www\.libhumanitas\.ro)(\/carti\/[\w\W\S]+$)/);

            if (nextPage && nextPageRelative) {
                console.log("== " + nextPageRelative[2]);
                urls.push(nextPageRelative[2]);
            }
        });

        nextPage = null;
    }
}