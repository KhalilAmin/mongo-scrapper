

var mongojs = require("mongojs");
var request = require("request");
var cheerio = require("cheerio");



module.exports = function (app) {
  // API GET Requests
  // Below code handles when users "visit" a page.
  // In each of the below cases when a user visits a link
  // (ex: localhost:PORT/api/admin... they are shown a JSON of the data in the table)
  // ---------------------------------------------------------------------------
  // Database configuration
  var exphbs = require("express-handlebars");
  var databaseUrl = "scraper";
  var collections = ["scrapedData"];

  app.engine("handlebars", exphbs({ defaultLayout: "main" }));
  app.set("view engine", "handlebars");

  // Hook mongojs configuration to the db variable
  var db = mongojs(databaseUrl, collections);
  db.on("error", function (error) {
    console.log("Database Error:", error);
  });

  var articles = [];



  app.get("/", function (req, res) {
    // Find all results from the scrapedData collection in the db
    db.scrapedData.find({}, function (error, found) {
      // Thrcow any errors to the console
      console.log(found);
      if (error) {
        console.log(error);
      }
      // If there are no errors, send the data to the browser as json
      else {
        for (i = 0; i <= found.length; i++){
          articles.push(found[i]);
        };
        var hbsObj = {
          articles: articles
        }
        // console.log(articles);
        res.render("index", hbsObj);;
      }
    });
  });

  // Scrape data from one site and place it into the mongodb db
  app.get("/scrape", function (req, res) {
    // Make a request for the news section of `ycombinator`
    request("https://www.nytimes.com/", function (error, response, html) {
      // Load the html body from request into cheerio;
      var $ = cheerio.load(html);
      // For each element with a "title" class
      $("article").each(function (i, element) {
        // Save the text and href of each link enclosed in the current element
        var title = $(element).children("a").text().trim();
        var link = $(element).children("a").attr("href");
        var summary = $(element).children("p").attr("class", "summary")

        // console.log(title);
        if (title && link) {
          // Insert the data in the scrapedData db
          db.scrapedData.insert({
            headline: title,
            url: link,
            summary: summary.text()
          },
            function (err, inserted) {
              if (err) {
                // Log the error if one is encountered during the query
                console.log(err);
              }
              else {

                // Otherwise, log the inserted data
                // console.log(inserted);
              }
            });
        }
      });
    });

    
  });
};
