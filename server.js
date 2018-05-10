// Dependencies
var express = require("express");
var app = express();

require("./routes/apiRoutes")(app);
// require("./routes/htmlRoutes")(app);




// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
