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
  this.weekDays = ["monday", "tuesday", "wednesday", "thursday", "friday"];
  this.days = this.weekDays.map(function(weekDay) {
    return new Day(weekDay);
  });
};

MealPlan.prototype.addRecipe = function(dayBox, recipe) {
  this.days.forEach(function(dayObj) {
    if (dayObj.dayName === dayBox) {
      dayObj.dinner = recipe;
    };
  });
};

MealPlan.prototype.getRecipe = function(dayBox) {
  var recipe;
  this.days.forEach(function(dayObj) {
    if (dayObj.dayName === dayBox) {
      recipe = dayObj.dinner;
    };
  });
  return recipe;
};

MealPlan.prototype.getIngredients = function() {
  var shoppingList = [];
  this.recipes.forEach(function(recipe) {
    recipe.ingredients.forEach(function(ingredient) {
      shoppingList.push(ingredient);
    });
  });
  return shoppingList;
};

function Day(dayName) {
  this.dayName = dayName;
  this.dinner;
};

function RecipeBook() {
  this.recipes = [];
};

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
recipeBook.recipes.push(cerealRecipe);





// Front-End
function updateDays() {
  week.days.forEach(function(day) {
    if (day.dinner) {
      $("#"+day.dayName).empty();
      $("#"+day.dayName).append("<li id='" + day.dayName + "Dinner' draggable='true' ondragstart='drag(event)'>" + day.dinner.displayName + "</li>");
    } else {
      $("#"+day.dayName).empty();
    };
  });
};


function allowDrop(ev) {
  ev.preventDefault();
};

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
};

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  var parent = document.getElementById(data).parentElement;
  if ((parent.id === "recipes") && $(ev.target).hasClass("week-day")) {
    week.addRecipe(ev.target.id, recipeBook.getRecipe(data));
    updateDays();
  } else if ($(parent).hasClass("week-day") && $(ev.target).hasClass("week-day")) {
    var recipe = week.getRecipe(parent.id);
    week.addRecipe(ev.target.id, recipe);
    week.addRecipe(parent.id, null)
    updateDays();
  } else if($(parent).hasClass("week-day")){
    week.addRecipe(parent.id, null)
    updateDays();
  };
  console.log(week);
};

$(function() {
  $("#recipes").append("<li id=" + cerealRecipe.recipeName + " draggable='true' ondragstart='drag(event)'>"+ cerealRecipe.displayName + "</li>");


});
