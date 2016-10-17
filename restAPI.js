'use strict';

var
  express =     require("express"),
  sqlite3 =     require("sqlite3").verbose(),
  fs =          require("fs"),
  bodyParser =  require("body-parser");
  
// Configure app to use body-parser
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;
var prefix = "/db";

// --------------
// ROUTES FOR API
// --------------

var router = express.Router();

var dbPath = "./app/db/users.db";
var exists = fs.existsSync(dbPath);
if (exists)
{
  console.log("Database found! I'm happy.")
  var db = new sqlite3.Database(dbPath);

  // db.serialize(function()
  // {
    // db.each("SELECT * FROM Users", function(err, row)
    // {
      // console.log(row.Name);
    // });
  // });
}
else
{
  console.log("Database not found!");
}

router.get('/', function (req, res)
{
  console.log("Get request on" + prefix + ":" + port)
  res.header("Access-Control-Allow-Origin", "*"); // * Temporary
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.json({ message : "Welcome to the API !" });
});

// Register our routes
app.use(prefix, router);

// Start the server
app.listen(port, function ()
{
  console.log("App listening on port " + port);
});




