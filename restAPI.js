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
var DB_TABLE = ["users", "categories", "nb_serv", "cat_users"];

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
  log(dbPath + " found.")
  var db = new sqlite3.Database(dbPath);
}
else
{
  throw new Error("Database " + dbPath + " not found!"); // Terminate execution
}

router.get('/:dbTable/:param?', function (req, res)
{
  var dbTable = req.params.dbTable;
  
  if (DB_TABLE.includes(dbTable)) // Valid DB request
  {
    log("GET request on   " + prefix + "/" + dbTable);

    res.header("Access-Control-Allow-Origin", "http://localhost:8001"); // Localhost Temporary
//    res.header("Access-Control-Allow-Methods", "GET, POST, PUT");
//    res.header("Access-Control-Allow-Headers", "Content-Type");
    
    var request = "";
    if (dbTable == DB_TABLE[3])
    {
      var param = req.params.param;
      if (param)
      {
        request = "SELECT id_user FROM " + dbTable +
                  " WHERE id_category = " + param + 
                  " OR id_parent = " + param +
                  " GROUP BY id_user";
      }
      else
      {
        // Error
      }
    }
    else
    {
      request = "SELECT * FROM " + dbTable;
    }

    db.all(request, function(err, rows)
    {
      if (err == null)
      {
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
    log("Invalid GET request : " + prefix + "/" + dbTable);
  }
});

// Register our routes
app.use(prefix, router);

// Start the server
app.listen(port, function ()
{
  log("App listening on port " + port);
});




