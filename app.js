const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require("lodash");




const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));


mongoose.connect('mongodb+srv://sachinpatwal07:nikeemessi10@cluster0.ov8aw.mongodb.net/todolistDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const todolistSchema = new mongoose.Schema({

  name: {
    type: String,
    require: [true, "Item can not be empty"]
  }

})

const listSchema = new mongoose.Schema({

  name: String,
  items: [todolistSchema],


})

const Item = mongoose.model("Item", todolistSchema);
const List = mongoose.model("List", listSchema);

const item1 = new Item({
  name: "Welcome to your todolist!"
});
const item2 = new Item({
  name: "Hit the + button to add the new item."
});
const item3 = new Item({
  name: "<-- Hit this to delete an item"
});




const defaultItems = [item1, item2, item3];


app.get("/", function(req, res) {

  Item.find({}, (err, foundItems) => {

    if (err)
      console.log(err);
    else {

      if (foundItems.length === 0) {

        Item.insertMany(defaultItems, (err) => {

          if (err)
            console.log(err)
          else
            console.log("Successfully saved default items to DB.")


        });



      } else
        res.render('view', {
          title: "Today",
          newListItem: foundItems
        });

    }

  })


})


app.post("/", function(req, res) {

  const itemName = req.body.inputText;

  const listName = req.body.list;

  const newItem = new Item({
    name: itemName
  })

  if (listName === "Today") {

    newItem.save();

    res.redirect("/");

  } else {
    List.findOne({
      name: listName
    }, (err, foundList) => {

      if (err)
        console.log(err)
      else {

        foundList.items.push(newItem);
        foundList.save();
        res.redirect("/" + listName);

      }




    })


  }


})

app.post("/delete", (req, res) => {

  const itemId = req.body.deleteText;
  const listName = req.body.listName;


  if (listName === "Today") {
    Item.findByIdAndRemove(itemId, (err) => {

      if (err)
        console.log(err);
      else
        console.log("Item Deleted Successfully");


    })

    res.redirect("/");
  } else {

    List.findOneAndUpdate({
      name: listName
    }, {
      $pull: {
        items: {
          _id: itemId
        }
      }
    }, (err, result) => {

      if (!err) {
        res.redirect("/" + listName);

      }
    })



  }



})



app.get("/:customListName", function(req, res) {



  const customListName = _.capitalize(req.params.customListName);



  List.findOne({
    name: customListName
  }, (err, result) => {

    if (!err) {
      if (!result) {

        const list = new List({

          name: customListName,
          items: defaultItems

        })
        list.save();
        res.redirect("/" + customListName)

      } else
        res.render('view', {
          title: result.name,
          newListItem: result.items
        });



    }
  })






})



let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}




app.listen(port, function() {

  console.log("Server Started");
})
