'use strict';

var
  express =     require("express"),
  sqlite3 =     require("sqlite3").verbose(),
  fs =          require("fs")
//  bodyParser =  require("body-parser");
  
var app = express();
// Configure app to use body-parser
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

var port = process.env.PORT || 3000;
var prefix = "/db";
var DB_PARAMS = ["users", "categories"];

// ---------
// FUNCTIONS
// ---------

function log(msg)
{
  console.log(new Date().getHours() + ":" + new Date().getMinutes() + " ### " + msg);
}

// --------------
// ROUTES FOR API
// --------------

var router = express.Router();

var dbPath = "./app/db/datas.db";
var exists = fs.existsSync(dbPath);
if (exists)
{
  log("Database found! I'm happy.")
  var db = new sqlite3.Database(dbPath);
}
else
{
  throw new Error("Database " + dbPath + " not found!"); // Terminate execution
}

router.get('/:dbParam', function (req, res)
{
  var param = req.params.dbParam;
  
  if (DB_PARAMS.indexOf(param) != -1) // Valid DB request
  {
    log("GET request on   " + prefix + "/" + param);

    res.header("Access-Control-Allow-Origin", "http://localhost:8001"); // Localhost Temporary
//    res.header("Access-Control-Allow-Methods", "GET, POST, PUT");
//    res.header("Access-Control-Allow-Headers", "Content-Type");

    db.all("SELECT * FROM " + param, function(err, rows)
    {
      if (err == null)
      {
//        console.log(rows);
        res.json(rows);
      }
      else
      {
        console.error("DB query error : ", err);
      }
    });
  }
  else // Invalid DB request
  {
    log("Invalid GET request : " + prefix + "/" + param + ":" + port);
  }
});

// Register our routes
app.use(prefix, router);

// Start the server
app.listen(port, function ()
{
  log("App listening on port " + port);
});




