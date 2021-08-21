const express = require("express");
const app = express();
const mongoose = require('mongoose');
const _ = require('lodash');

app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost:27017/todolistdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const itemsSchema = {
  name: String
};
const Item = mongoose.model("Item", itemsSchema);
const item1 = new Item({
  name: "welcome"
});
const item2 = new Item({
  name: "hit the + to add"
});
const item3 = new Item({
  name: "<-- hit to delete"
});
const defaultItems = [item1, item2, item3];
const listSchema = {
  name: String,
  items: [itemsSchema]
}
const List = mongoose.model("List", listSchema);
app.get("/", function (req, res) {
  Item.find({}, function (err, results) {
    if (results.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("success save db");
        }
      });
      
      res.redirect("/")
    } else {
      res.render("list", {
        listTitles: "Today",
        newListItems: results
      });
    }
  });
});
app.get("/:clName", function (req, res) {
  const clName = _.capitalize(req.params.clName);
  List.findOne({
    name: clName
  }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: clName,
          items: defaultItems
        })
        list.save();
        res.redirect("/" + clName)
      } else {
        res.render("list", {
          listTitles: foundList.name,
          newListItems: foundList.items
        });
      }
    }
  })


})
app.post("/", function (req, res) {
  const iName = req.body.newItem;
  const lname = req.body.list;
  const item = new Item({
    name: iName
  })
  if (lname === "Today") {
    item.save()
    res.redirect("/")
  } else {
    List.findOne({
      name: lname
    }, function (err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + lname)
    })
  }

});
app.post("/delete", function (req, res) {
  const checkItemID = req.body.checkBox;
  const listName = req.body.listName;
  if (listName === "Today") {
    Item.findByIdAndRemove(checkItemID, function (err) {
      if (!err) {
        console.log("deleted");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({
      name: listName
    }, {
      $pull: {
        items: {
          _id: checkItemID
        }
      }
    }, function (err, foundList) {
      if (!err) {
        res.redirect("/" + listName)
      }
    })
  }
})
app.get("/work", function (req, res) {
  res.render("list", {
    listTitles: "Work List",
    newListItems: workItems
  });
});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function () {
  console.log("server is running");
});