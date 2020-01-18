//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const _= require("lodash");
const mongoose = require ("mongoose");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://sunil1ks:Test123@cluster0-injgh.mongodb.net/todoDB', {useNewUrlParser: true});
  ItemsSchema =new mongoose.Schema ({
    ItemName: String
  });
const ItemModel = new mongoose.model("Item",ItemsSchema);


ListSchema = new mongoose.Schema({
listName: String,
listItems: [ItemsSchema]

});
//const ItemArray = [item1,item2,item3,item4];
ListModel = mongoose.model("list", ListSchema);

const item1 = new ItemModel (
  {ItemName: "Plan"}
);

const item2 = new ItemModel (
  {ItemName: "do"}
);

const item3 = new ItemModel (
  {ItemName: "Check"}
);

const item4 = new ItemModel (
  {ItemName: "Act"}
);

const ItemArray = [item1,item2,item3,item4];


 app.get("/", function(req, res) {

const day = date.getDate();

const items = ItemModel.find({}, function(err,foundItems){
  if (err){
console.log(err);

  }
  else {
    if (foundItems.length==0){



  //  ItemArray = [item1,item2,item3,item4];
    ItemModel.insertMany(ItemArray, function ( err ){
res.render("list", {listTitle: day, newListItems: foundItems});
    })
  } else {
    console.log(foundItems);

res.render("list", {listTitle: "Today", newListItems: foundItems});
}
}
})

});
//const workItems = [];
//nsole.log(foundItems);

app.get("/:customListName", function (req,res){
customListName=_.capitalize(req.params.customListName);


 ListModel.findOne({listName: customListName}, function(err,foundItems){
    if (!err){
    if(!foundItems){
      console.log("doesnt exist");
      const newList = new ListModel({
        listName: customListName,
        listItems: ItemArray
      })
newList.save();
res.render("list", {listTitle: newList.listName, newListItems: newList.listItems});
    } else {
      console.log("exists list");
        console.log(foundItems);

      res.render("list", {listTitle: foundItems.listName, newListItems: foundItems.listItems});
    }

  }
});


// const customList = new ListModel({
// listName: customListName,
// listItems:[ItemArray]
// });
//
// customList.save();



});

app.post("/delete", function(req, res){
  const itemID = req.body.itemCheckbox;
  const listName= req.body.listName;
  console.log(itemID);
  if (listName=="Today"){
ItemModel.remove({_id: itemID},function(err){
  if (err){
console.log(err);

}else {

res.redirect("/");

}

});

}else{
ListModel.findOneAndUpdate({listName: listName},{$pull: {listItems:{_id:itemID}}}, function (err, foundItems){

res.redirect("/" + listName);

})

}

});

// app.post("/compose", function(req, res){
//   const listName = req.body.newList;
//   console.log(listName);
//
//
// res.redirect("/");
//
//
// });



app.post("/", function(req, res){

  var newItem = req.body.newItem;
  const listName = req.body.listTitle;
  console.log(newItem);

  if (listName=="Today"){
  console.log(req.body.newItem);
const   item = new ItemModel({ItemName: newItem});
  item.save()
  res.redirect("/");
} else {
ListModel.findOne({listName: listName}, function (err,foundList){

  console.log("in insert");
  console.log(newItem);
  foundList.listItems.push( {ItemName: newItem});
    console.log("after push");
  foundList.save();
    console.log("after save");
  res.redirect("/"+ listName);
})

}

});




// app.get("/work", function(req,res){
//   res.render("list", {listTitle: "Work List", newListItems: workItems});
// });
//
// app.get("/about", function(req, res){
//   res.render("about");
// });

app.listen(process.env.PORT||3000, function() {
  console.log("Server started on port 3000");
});

// app.post("/:listTitle", function(req, res){
// const listTitle =req.body.listTitle;
//   const newItem = req.body.newItem;
//   console.log(req.body.newItem);
// const   item = new ItemModel({ItemName: newItem});
//   item.save();
//
//
//
//  ListModel.findOne({listName: listTitle }, function(err,foundItems){
//     if (!err){
//     if(!foundItems){
//       console.log("doesnt exist");
//     } else {
//       console.log("exists");
//     }
//
//
// res.redirect("/");
//
// }
// });
//
// });
