//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const PORT= process.env.PORT || 3030;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// connecting with mongodb
mongoose.connect('mongodb+srv://yashveerxx717:cfq2Hs8q7m1T4Upg@cluster0.hn7mobv.mongodb.net/todolistDB');


const itemSchema = {
  name : String
};

const Items = mongoose.model("Item" , itemSchema)

const item1 = new Items({
  name:"welcome to the do to list"
});

const item2 = new Items({
  name:"Tera bhai seedhe maut"
});

const item3 = new Items({
  name:"$sign"
});

const defaultItems = [item1,item2,item3];

const listSchema= {
  name:String,
  items : [itemSchema]
}

const List = mongoose.model("List" , listSchema);

// connection end

app.get("/", function(req, res) {

  Items.find({}).then(function(foundItems){
    if(foundItems.length===0){
      Items.insertMany(defaultItems);
      res.redirect("/");

    }
    else{
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    }
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item = new Items({
    name:itemName
  });

  item.save();

  res.redirect("/");    
  })


});



app.post("/delete", async function(req, res){
  checkedItemId = req.body.checkbox;
  console.log(checkedItemId);
  if(checkedItemId != undefined){
      await Items.findByIdAndRemove(checkedItemId)
      .then(()=>console.log(`Deleted ${checkedItemId} Successfully`))
      .catch((err) => console.log("Deletion Error: " + err));
      res.redirect("/");

  }
})

app.get("/:customListName", async function(req,res){
  const customListName= req.params.customListName;

 List.findOne({name:customListName})
  .then(function(foundList){
      if(!foundList){
        // create a new list
        const list = new List({
          name:customListName,
          items:defaultItems
        });
        list.save();
        res.redirect("/" + customListName);
      }
      else{
        // show existing list
        res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
      }
});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(PORT, function() {
  console.log(`Server started on port ${PORT}`);
});
