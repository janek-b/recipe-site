// Back-End
function Ingredient(ingredientName, quantity, unit, meat, dairy) {
  this.ingredientName = ingredientName;
  this.quantity = quantity;
  this.unit = unit;
  this.meat = meat;
  this.dairy = dairy;
};

function Recipe(recipeName, imageURL, instructions) {
  this.recipeName = recipeName.replace(/\s/, '-');
  this.displayName = recipeName;
  this.ingredients = [];
  this.imageURL = imageURL;
  this.instructions = instructions;
};

function MealPlan() {
  this.monday = new Day();
  this.recipes = [];
}

MealPlan.prototype.getIngredients = function() {
  var shoppingList = [];
  this.recipes.forEach(function(recipe) {
    recipe.ingredients.forEach(function(ingredient) {
      shoppingList.push(ingredient);
    })
  })
  return shoppingList;
}

function Day() {
  this.dinner;
}

function RecipeBook() {
  this.recipes = [];
}

RecipeBook.prototype.getRecipe = function(recipeName) {
  var returnRecipe;
  this.recipes.forEach(function(recipe) {
    if (recipe.recipeName === recipeName) {
      returnRecipe = recipe;
    };
  });
  return returnRecipe;
};

var milk = new Ingredient("milk", 1, "cup", false, true);
var cereal = new Ingredient("cereal", 2, "cup", false, false);
var cerealRecipe = new Recipe("awesome cereal", "imglink", "make cereal");
cerealRecipe.ingredients.push(milk);
cerealRecipe.ingredients.push(cereal);
var week = new MealPlan();
var recipeBook = new RecipeBook();
recipeBook.recipes.push(cerealRecipe)





// Front-End
function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  // console.log(data);
  // console.log(document.getElementById(data).parentElement);
  if (ev.target.id === "monday") {
    $("#monday").empty();
    week.monday.dinner = recipeBook.getRecipe(data);
    var nodeCopy = document.getElementById(data).cloneNode(true)
    nodeCopy.id = "testid"
    ev.target.appendChild(nodeCopy);
    console.log(week);
  } else if(document.getElementById(data).parentElement.id != "recipes"){
    document.getElementById(data).remove();
    week.monday.dinner = null;
    console.log(week);
  }
}

$(function() {



  $("#recipes").append("<li id=" + cerealRecipe.recipeName + " draggable='true' ondragstart='drag(event)'>"+ cerealRecipe.displayName + "</li>");

  console.log(week);
  $("#testBtn").click(function() {
    var testobject = $("#monday").children().attr("id");
    console.log(recipeBook.getRecipe(testobject));
  })

})
