const express = require("express");
const bodyParser = require ("body-parser");
const session = require("express-session");
const passport = require("passport");
var cors = require("cors")
const app = express();

app.use(cors());
const dotenv = require("dotenv");
dotenv.config();
require("./db")
// app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    name: "sequelizeSession",
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 100000,
      httpOnly: true,
      secure: false,
      sameSite: "strict"
    }
  })
);

// passport authentication
app.use(passport.initialize());
// elephantsql
var pg = require('pg');
//or native libpq bindings
//var pg = require('pg').native

var conString = "postgres://iygugnvx:FgRhMPVXhY4LSH33cSc5BGiqYAJz1Y3L@john.db.elephantsql.com:5432/iygugnvx" //Can be found in the Details page
var client = new pg.Client(conString);
client.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
  client.query('SELECT NOW() AS "theTime"', function(err, result) {
    if(err) {
      return console.error('error running query', err);
    }
    console.log("connected to elephantsql ",result.rows[0].theTime);
    // >> output: 2018-08-23T14:02:57.117Z
    client.end();
  });
});



//Routes
app.use(require("./routes/userroutes"))

app.get('/',(_,res) => res.send('Hello folks'));
app.get('/logout',(_, res) => res.send('you have been logged out successfully'));

module.exports = app ;