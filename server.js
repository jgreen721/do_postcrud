const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const SECRET = "dkeiengeire3oirno3ifkbm83JKDfjeiuoe920929ekdfj382oskdkf";
const cookieParser = require("cookie-parser");
const Post = require("./db");
const app = express();
const PORT = process.env.PORT || 4455;
const connectionString =
  "mongodb+srv://admin:admin@crudcluster.zjkmt.mongodb.net/freespeechdb?retryWrites=true&w=majority";

mongoose.connect(connectionString, () => {
  console.log("mongoose is connected...");
});

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", async (req, res) => {
  if (!req.headers.cookie) {
    return res.redirect("/login");
  }
  let cookie = req.headers["cookie"].split("=")[1];
  let user = await jwt.verify(cookie, SECRET);
  console.log(user);
  let posts = await Post.find();
  res.render("dashboard", { user, posts });
});

app.get("/login", (req, res) => {
  if (req.headers.cookie) {
    return res.redirect("/");
  }
  console.log(req.headers);
  res.render("login");
});

// app.get("/savedsession", (req, res) => {
//   console.log(req.headers["Auth-cookie"]);
//   res.json({ msg: "got the ping!" });
// });

app.post("/signin", async (req, res) => {
  console.log(req.body);
  let token = await jwt.sign(req.body, SECRET);
  console.log("Token", token);
  res.setHeader("Set-Cookie", `authtoken=${token};max-age=36000`);
  res.redirect("/");
});

app.post("/addpost", async (req, res) => {
  let user = req.headers.cookie.split("=")[1];
  user = await jwt.verify(user, SECRET);
  let newPost = {
    post: req.body.post,
    postedBy: user.username,
  };
  console.log(newPost);
  await Post.create(newPost);
  res.redirect("/");
});

app.delete("/delete/:id", async (req, res) => {
  console.log(req.params.id);
  await Post.findOneAndDelete({ _id: req.params.id });
  res.redirect("/");
});

app.listen(PORT, console.log(`Listening in on port ${PORT}`));
