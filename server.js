"use strict";
require("dotenv").config();
const express = require("express");
const fccTesting = require("./freeCodeCamp/fcctesting.js");
const session = require("express-session");
const passport = require("passport");

// mongodb setup
const myDB = require("mongodb").MongoClient;
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;

// Database Name

const url = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.wqup4.mongodb.net/`;
const client = new MongoClient(url, { useUnifiedTopology: true });
const dbName = "freecodecamp";

const app = express();
fccTesting(app); //For FCC testing purposes
app.use("/public", express.static(process.cwd() + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "pug");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  myDB.findOne({ _id: new ObjectID(id) }, (err, doc) => {
    done(null, null);
  });
});

// Use connect method to connect to the server

try {
  client.connect(async function (err) {
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    const users = await db.collection("users");
    app.route("/").get((req, res) => {
      //Change the response to render the Pug template
      res.render("index", {
        title: "Connected to Database",
        message: "Please login",
      });
    });
  });
} catch (error) {
  app.route("/").get((req, res) => {
    res.render("index", { title: e, message: "Unable to login" });
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
