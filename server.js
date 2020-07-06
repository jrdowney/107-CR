var express = require("express");
var app = express();


//****************************************************** */
/*** Server Configuration */
/******************************************************* */

// render HTML from the endpoints
var ejs = require('ejs');
app.set('views', __dirname + "/public");
app.engine("html", ejs.renderFile);
app.set("vie engine",ejs);

// server static file (js, css, img, pdf)
app.use(express.static(__dirname + '/public'));

// configure body-parser to read req payload
var bParser = require('body-parser');
app.use(bParser.json());
// wwwroot or public
// DB connection to Mongo DB
var mongoose = require('mongoose');
mongoose.connect("mongodb://ThiIsAPassword:TheRealPassword@cluster0-shard-00-00-euadh.mongodb.net:27017,cluster0-shard-00-01-euadh.mongodb.net:27017,cluster0-shard-00-02-euadh.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin");
var mongoDB = mongoose.connection;  //  DB connection
var itemDB; // is the DB object constructor


/******************************************************* */
/*** Server HTML */
/******************************************************* */


app.get('/', function(req, res){
    res.render('index.html');
});

app.get('/admin', function(req, res){
    res.render('admin.html');
});


app.get('/about', function(req, res){
    res.render('about.html');// the HTML file
});

app.get('/contact', function(req, res){
    res.send('<h1 style="color:blue">Email: jonathanraydowney@gmail.com</h1>');
});

/******************************************************* */
/*** API endpoints */
/******************************************************* */
var list = [];

app.post("/API/items", function(req, res){
    var item = req.body;

    //create a db object
    var itemForDB = itemDB(item);



    //save the obj on the db
    itemForDB.save(function(error, savedObject){
        if (error) {
            // somthing went wrong
            console.log("Error saving the item: " + error);
            res.status(500); // 500: Internal Server Error
            res.send(error);// = return
        }

        // no error
        res.status(201); // 201 = OK created
        res.json(savedObject);
    });
});

app.get("/API/items", function(req, res){
    itemDB.find({}, function(error, data){
        if (error) {
            res.status(500);
            res.send(error);
        }

        // no error
        res.json(data);
    });
});





mongoDB.on('error', function (error) {
    console.log(("Error connection to DB:" + error));
});

mongoDB.on("open", function(){
    console.log("DB connection Success!");

    // predifined schema for items table (collection)
    var itemSchema = mongoose.Schema({
        code: String,
        title: String,
        price: Number,
        description: String,
        category: String,
        image: String,
        user: String
    });

    itemDB = mongoose.model("catalogCh9", itemSchema);
});



// start the project
app.listen(8080, function(){
    console.log("Server running at localhost:8080");
});


// start with: node server.js
// ctrl + c to kill the  server

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
//  https://www.restapitutorial.com/httpstatuscodes.html

// API -> Application Programming Interface