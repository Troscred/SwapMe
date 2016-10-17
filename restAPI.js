'use strict';

var
  express =     require("express"),
  sqlite3 =     require("sqlite3").verbose(),
  fs =          require("fs"),
  bodyParser =  require("body-parser");
  
// Configure app to use body-parser
var app = express();
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

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
}
else
{
  throw new Error("Database " + dbPath + " not found!"); // Terminate execution
}

router.get('/', function (req, res)
{
  console.log(new Date().getHours() + ":" + new Date().getMinutes() + " | GET request on   " + prefix + ":" + port)
  
  res.header("Access-Control-Allow-Origin", "*"); // * Temporary
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  db.all("SELECT * FROM Users", function(err, rows)
  {
    if (err !== null)
    {
      console.error("DB query error : ", err);
    }
    else
    {
      // console.log(rows);
      res.json(rows);
    }
  });
});

// Register our routes
app.use(prefix, router);

// Start the server
app.listen(port, function ()
{
  console.log("App listening on port " + port);
});




