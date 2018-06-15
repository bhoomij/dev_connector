const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const passport = require('passport');

// Application routes
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const db = require("./config/keys").mongoURI;
const app = express();
const port = process.env.PORT || 8000;

// connect to mongodb
mongoose
  .connect(db)
  .then(() => console.log("Connected with MongoDB"))
  .catch(err => console.log(err));


// middlewares
// body-parser middleware
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// route middleware
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

// passport middleware
app.use(passport.initialize());
// passport config
require('./config/passport')(passport);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(port, () => console.log(`Server started on ${port}`));