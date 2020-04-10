import express, { urlencoded } from "express";
import { json, urlencoded as _urlencoded } from "body-parser";
import session from "express-session";
import { initialize } from "passport";
import cors from "cors";
const app = express();

app.use(cors());
import { config } from "dotenv";
config();
import "./../db";
// app.use(express.json());
app.use(json());
app.use(_urlencoded({ extended: false }));
app.use(urlencoded({ extended: false }));
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
app.use(initialize());
// elephantsql
import { Client } from 'pg';
//or native libpq bindings
//var pg = require('pg').native

var conString = "postgres://iygugnvx:FgRhMPVXhY4LSH33cSc5BGiqYAJz1Y3L@john.db.elephantsql.com:5432/iygugnvx" //Can be found in the Details page
var client = new Client(conString);
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
app.use(require("./routes/userroutes").default)

app.get('/',(_,res) => res.send('Hello folks'));
app.get('/logout',(_, res) => res.send('you have been logged out successfully'));

export default app ;