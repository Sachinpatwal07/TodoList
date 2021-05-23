const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + "/date.js")

console.log(date);

const app = express();

let item = [];
let workItem = [];
app.set('view engine', 'ejs');
app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {

  let day = date.getDate();
  res.render('view', {
    title: day,
    newListItem: item
  });

});

app.post("/", function(req, res) {

  console.log(req.body.button);
  if (req.body.button === "Work") {
    workItem.push(req.body.inputText);
    res.redirect("/work");
  } else {
    item.push(req.body.inputText);

    res.redirect("/");

  }



})



app.get("/work", function(req, res) {


  res.render('view', {
    title: "Work ",
    newListItem: workItem
  });



})

app.get("/about", function(req, res) {

  res.render("about");


});









app.listen(3000, function() {

  console.log("server ready");
})
