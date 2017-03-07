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
  var recipeBook = new RecipeBook();
  $("#add-ingredient").click(function(event){
    event.preventDefault();
    $("#new-ingredient").append("<div class='new-ingredient'>"+
            "<div class='form-group col-sm-4'>"+
              "<label for='ingredient-name'>Enter ingredient</label>"+
              "<input class='ingredient-name form-control' type='text' required></div>"+
            "<div class='form-group col-sm-4'>"+
              "<label for='quantity'>Enter Quantity</label>"+
              "<input class='quantity form-control' type='number' placeholder='Example: 3, 0.5' step='0.1' min='0' required></div>"+
            "<div class='form-group col-sm-4'>"+
              "<label for='Unit'>Unit of Measure</label>"+
              "<select class='form-control unit-of-measure'>"+
                "<option value=''> <br>"+
                "<option value='each'> each<br>"+
                "<option value='teaspoon'> teaspoon<br>"+
                "<option value='tablespoon'> tablespoon<br>"+
                "<option value='ounces'> ounce<br>"+
                "<option value='cup'> cup<br>"+
                "<option value='pounds'> pound <br>"+
              "</select></div>"+
            "<div class='meat-or-not'>"+
              "<p><strong>Does this ingredient contain meat?</strong></p>"+
              "<div class='form-group'>"+
                "<label><input type='checkbox' name='meat' value='true'>Yes</label></div>"+
            "</div>"+
            "<div class='dairy-or-not'>"+
              "<p><strong>Does this ingredient contain dairy?</strong></p>"+
              "<div class='form-group'>"+
                "<label><input type='checkbox' name='dairy' value='true'>Yes</label></div>"+
            "</div>");
  });
  $("#user-recipe").click(function(){
    $("#recipe-form").slideDown();
  });
  $("#recipe-form").submit(function(event){
    event.preventDefault();
    var recipeName = $("input#recipe-name").val();
    var recipeImage = $("input#meal-image").val();
    var recipeInstructions = $("input#cooking-instructions").val();
    var newRecipe = new Recipe(recipeName, recipeImage, recipeInstructions);
    $(".new-ingredient").each(function() {
      var ingredientName = $(this).find("input.ingredient-name").val();
      var quantity = parseFloat($(this).find("input.quantity").val());
      var unit = $(this).find("select.unit-of-measure").val();
      var containsMeat = $(this).find("input:checkbox[name=meat]:checked").val();
      var containsDairy = $(this).find("input:checkbox[name=dairy]:checked").val();
       if (!containsMeat) {
         containsMeat = false;
       }
       if (!containsDairy) {
         containsDairy= false;
       }
      var newIngredient = new Ingredient(ingredientName, quantity, unit, containsMeat, containsDairy);
      newRecipe.ingredients.push(newIngredient);
    });
   recipeBook.recipes.push(newRecipe);
   console.log(recipeBook);
  });
  $("#recipes").append("<li id=" + cerealRecipe.recipeName + " draggable='true' ondragstart='drag(event)'>"+ cerealRecipe.displayName + "</li>");
});
