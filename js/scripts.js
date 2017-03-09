// Back-End
function Ingredient(ingredientName, quantity, unit, meat, dairy) {
  this.ingredientName = ingredientName;
  this.quantity = quantity;
  this.unit = unit;
  this.meat = meat;
  this.dairy = dairy;
};

Ingredient.prototype.getListFormat = function() {
  return "<span class='ingredient-quantity'>" + this.quantity + "</span><span class='ingredient-unit'> " + this.unit + "</span><span class='ingredient-name'> " + this.ingredientName + "</span>";
};

function Recipe(recipeName, imageURL, instructions) {
  this.recipeName = recipeName.replace(/\s/, '-');
  this.displayName = recipeName;
  this.ingredients = [];
  this.imageURL = imageURL;
  this.instructions = instructions;
};

Recipe.prototype.containsNoMeat = function () {
  var result = true;
  this.ingredients.forEach(function(ingredient){
    if (ingredient.meat){
      result = false;
    }
  });
  return result;
};

Recipe.prototype.containsNoDairy = function () {
  var result = true;
  this.ingredients.forEach(function(ingredient){
    if (ingredient.dairy){
      result = false;
    }
  });
  return result;
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
  this.days.forEach(function(day) {
    if (day.dinner) {
      day.dinner.ingredients.forEach(function(ingredient) {
        var index = shoppingList.findIndex(function(item) {
          return item.ingredientName === ingredient.ingredientName
        });
        if (index === -1) {
          var newIngredient = new Ingredient(ingredient.ingredientName, ingredient.quantity, ingredient.unit, ingredient.meat, ingredient.dairy);
          shoppingList.push(newIngredient);
        } else {
          var newValue = converUnits(shoppingList[index].unit, shoppingList[index].quantity, ingredient.unit, ingredient.quantity);

          shoppingList[index].unit = newValue[0];
          shoppingList[index].quantity = newValue[1];
        };
      });
    }
  });
  shoppingList.sort(ingredientSort);
  return shoppingList;
};


function ingredientSort(a, b) {
  if (a.ingredientName < b.ingredientName) {
    return -1;
  } else if (a.ingredientName > b.ingredientName) {
    return 1;
  } else {
    return 0;
  };
};

function converUnits(unit1, quantity1, unit2, quantity2) {
  var weights = ["ounces", "pounds", "teaspoon", "tablespoon", "cup"];
  var unitIndex1 = weights.indexOf(unit1);
  var unitIndex2 = weights.indexOf(unit2);
  var indexDiff = unitIndex1 - unitIndex2;
  if (indexDiff === 0) {
    // same unit return sum of quanities
    return [unit1, (quantity1 + quantity2)];
  } else if (indexDiff === 2) {
    // unit2 convert teaspoon to cups
    return [unit1, (quantity1 + quantity2/48)];
  } else if (indexDiff === -2) {
    // unit1 convert teaspoon to cups
    return [unit2, (quantity2 + quantity1/48)];
  } else if ((indexDiff === 1) && (unitIndex1 === 1)) {
    // unit2 convert ounces to pounds
    return [unit1, (quantity1 + quantity2/16)];
  } else if ((indexDiff === 1) && (unitIndex1 === 3)) {
    // unit2 convert teaspoon to tablespoon
    return [unit1, (quantity1 + quantity2/3)];
  } else if ((indexDiff === 1) && (unitIndex1 === 4)) {
    //unit2 convert tablespoon to cups
    return [unit1, (quantity1 + quantity2/16)];
  } else if ((indexDiff === -1) && (unitIndex1 === 0)) {
    //unit1 convert ounces to pounds
    return [unit2, (quantity2 + quantity1/16)];
  } else if ((indexDiff === -1) && (unitIndex1 === 2)) {
    //unit1 convert teaspoon to tablespoon
    return [unit2, (quantity2 + quantity1/3)];
  } else if ((indexDiff === -1) && (unitIndex1 === 3)) {
    //unit1 convert tablespoon to cups
    return [unit2, (quantity2 + quantity1/16)];
  };
};

function Day(dayName) {
  this.dayName = dayName;
  this.dinner;
};

function RecipeBook() {
  this.recipes = [];
};

RecipeBook.prototype.filter = function (foodFilter) {
  if (foodFilter ==="meatFree") {
    return this.recipes.filter(function(recipe){
      return recipe.containsNoMeat();
    });
  } else if (foodFilter ==="dairyFree") {
    return this.recipes.filter(function(recipe){
      return recipe.containsNoDairy();
    });
  } else {
    return this.recipes;
  }
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


var mealPlan = new MealPlan();
var recipeBook = new RecipeBook();


// Front-End
function updateDays() {
  mealPlan.days.forEach(function(day) {
    if (day.dinner) {
      $("#"+day.dayName).empty();
      $("#"+day.dayName).append("<img id='" + day.dayName + "Dinner' draggable='true' ondragstart='drag(event)' src='"+day.dinner.imageURL+"' class='img-responsive'>");
      $("#"+day.dayName).find("img").click(function() {
        populateRecipeDetails(day.dinner);
      });
    } else {
      $("#"+day.dayName).empty();
    };
  });
  console.log(mealPlan);
};

function populateRecipeDetails(recipe) {
  $("#recipe-details-name").text(recipe.displayName);
  $("#recipe-details-image").html("<img src='"+recipe.imageURL+"' class='img-responsive'>");
  $("#recipe-details-ingredients").empty();
  recipe.ingredients.forEach(function(ingredient) {
    $("#recipe-details-ingredients").append("<li>" + ingredient.getListFormat() + "</li>");
  });
  $("#recipe-details-instructions").text(recipe.instructions);
  $("#recipe-details-modal").modal();
}


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
  if ((parent.parentElement.parentElement.id === "recipes") && $(ev.target).hasClass("week-day")) {
    mealPlan.addRecipe(ev.target.id, recipeBook.getRecipe(data));
    updateDays();
  } else if ((parent.parentElement.parentElement.id === "recipes") && $(ev.target).parent().hasClass("week-day")) {
    mealPlan.addRecipe($(ev.target).parent().attr("id"), recipeBook.getRecipe(data));
    updateDays();
  } else if ($(parent).hasClass("week-day") && $(ev.target).hasClass("week-day")) {
    var recipe = mealPlan.getRecipe(parent.id);
    mealPlan.addRecipe(ev.target.id, recipe);
    mealPlan.addRecipe(parent.id, null)
    updateDays();
  } else if ($(parent).hasClass("week-day") && $(ev.target).parent().hasClass("week-day")) {
    var recipe = mealPlan.getRecipe(parent.id);
    mealPlan.addRecipe($(ev.target).parent().attr("id"), recipe);
    mealPlan.addRecipe(parent.id, null)
    updateDays();
  } else if($(parent).hasClass("week-day")){
    mealPlan.addRecipe(parent.id, null)
    updateDays();
  };
};

$(function() {
  function displayRecipes() {
    var allrecipes = recipeBook.filter($("#filter-food").val());
    $("#recipes > div").empty();
    for (var i = 0; i < allrecipes.length; i++) {
      var recipe = allrecipes[i];
      $("#recipes > div").last().append("<div class='recipe-container'>"+
        "<img src='"+recipe.imageURL+"' class='recipe-img'>"+
        "<div id='"+recipe.recipeName +"' draggable='true' ondragstart='drag(event)' class='recipe-hover'>"+
        "<div class='hover-text'>" + recipe.displayName + "</div>" +
        "</div>"+
        "</div>");
      $("#recipes").find(".recipe-hover").last().click(function() {
        populateRecipeDetails(recipeBook.getRecipe($(this).attr('id')));
      });
    };
  };

  $("#filter-food").change(function(){
    displayRecipes();
  });

  var jsonRecipes = [];
  jsonRecipes.push(awesomeCereal);
  jsonRecipes.push(chili);
  jsonRecipes.push(frittata);
  jsonRecipes.push(risotto);
  jsonRecipes.push(chickenTortilla);
  jsonRecipes.push(porkTenderloin);

  jsonRecipes.forEach(function(recipe) {
    var newRecipe = new Recipe(recipe.displayName, recipe.imageURL, recipe.instructions);
    recipe.ingredients.forEach(function(ingredient) {
      var newIngredient = new Ingredient(ingredient.ingredientName, ingredient.quantity, ingredient.unit, ingredient.meat, ingredient.dairy);
      newRecipe.ingredients.push(newIngredient);
    });
    recipeBook.recipes.push(newRecipe);
  });

  displayRecipes();

  $("#shopping-list").click(function() {
    var shopList = mealPlan.getIngredients();
    $("#ingredientListModal").empty();
    shopList.forEach(function(item) {
      $("#ingredientListModal").append("<li><input type='checkbox'> " + item.getListFormat() + "</li>");
    });
  });

  function insertIngredient() {
    $("#new-ingredients").append("<div class='new-ingredient row'>"+
      "<div class='form-group col-sm-4 col-sm-offset-1'>"+
        "<label for='ingredient-name'>Enter ingredient</label>"+
        "<input class='ingredient-name form-control' type='text' required>"+
      "</div>"+
      "<div class='form-group col-sm-2'>"+
        "<label for='quantity'>Enter Quantity</label>"+
        "<input class='quantity form-control' type='number' placeholder='Example: 3, 0.5' step='0.1' min='0' required>"+
      "</div>"+
      "<div class='form-group col-sm-2'>"+
        "<label for='Unit'>Unit of Measure</label>"+
        "<select class='form-control unit-of-measure'>"+
          "<option value=''> <br>"+
          "<option value='each'> each<br>"+
          "<option value='teaspoon'> teaspoon<br>"+
          "<option value='tablespoon'> tablespoon<br>"+
          "<option value='ounces'> ounce<br>"+
          "<option value='cup'> cup<br>"+
          "<option value='pounds'> pound <br>"+
        "</select>"+
      "</div>"+
      "<div class='form-inline meat-dairy col-sm-2'>"+
        "<p><strong>Contains:</strong></p>"+
        "<div class='form-group'>"+
          "<label><input type='checkbox' name='meat' value='true'> Meat</label>"+
        "</div>"+
        "<div class='form-group'>"+
          "<label><input type='checkbox' name='dairy' value='true'> Dairy</label>"+
        "</div>"+
        "<span class='glyphicon glyphicon-remove-circle remove-ingredient'></span>"+
      "</div>"+
    "</div>");
    $(".new-ingredient").last().hide().slideDown();
    $(".remove-ingredient").last().click(function() {
      $(this).parents(".new-ingredient").remove();
    });
  };

  insertIngredient();

  $("#add-ingredient").click(function(){
    insertIngredient();
  });

  $("#user-recipe").click(function(){
    $("#recipe-form").slideToggle()
  });

  $("#recipe-form").submit(function(event){
    event.preventDefault();
    var recipeName = $("input#recipe-name").val();
    var recipeImage = $("input#meal-image").val();
    if (recipeImage.slice(0, 4) != "http") {
      recipeImage = "https://cdn.pixabay.com/photo/2013/11/28/11/29/cutlery-220219_960_720.jpg"
    };
    var recipeInstructions = $("input#cooking-instructions").val();
    var newRecipe = new Recipe(recipeName, recipeImage, recipeInstructions);
    $(".new-ingredient").each(function() {
      var ingredientName = $(this).find("input.ingredient-name").val();
      var quantity = parseFloat($(this).find("input.quantity").val());
      var unit = $(this).find("select.unit-of-measure").val();
      var containsMeat = Boolean($(this).find("input:checkbox[name=meat]:checked").val());
      var containsDairy = Boolean($(this).find("input:checkbox[name=dairy]:checked").val());
      var newIngredient = new Ingredient(ingredientName, quantity, unit, containsMeat, containsDairy);
      newRecipe.ingredients.push(newIngredient);
    });
    recipeBook.recipes.push(newRecipe);
    displayRecipes();
    $("#recipe-form").slideUp();
    var timeoutID = window.setTimeout(resetForm, 1000);
    function resetForm() {
      $("#recipe-form").trigger("reset");
      $("#new-ingredients").empty();
      insertIngredient();
    };
  });
});
