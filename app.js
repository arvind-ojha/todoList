const express = require("express");
const app = express();

const date = require(__dirname + "/date.js")

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
var items = ["buy", "cook", "eat"];
let workItems = [];

app.get("/", function (req, res) {
  let day = date.getdate();
  res.render("list", { listTitles: day, newListItems: items });
});
app.post("/", function (req, res) {
  var item = req.body.newItem;
  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});
app.get("/work", function (req, res) {
  res.render("list", { listTitles: "Work List", newListItems: workItems });
});


app.listen(3000, function () {
  console.log("server is running");
});
