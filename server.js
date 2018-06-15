const express = require("express");
const mongoose = require("mongoose");

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

app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

app.get("/", (req, res) => {
  res.send("hello12");
});

app.listen(port, () => console.log(`Server started on ${port}`));
