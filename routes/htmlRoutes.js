var exphbs = require("express-handlebars");
var path = require("path");
var articles = require("../data/articles.js");




// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app) {
  

  app.get("/", function(req, res) {
    res.render("index", articles);
  });

};
