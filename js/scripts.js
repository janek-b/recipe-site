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
  this.days.forEach(function(day) {
    if (day.dinner) {
      day.dinner.ingredients.forEach(function(ingredient) {
        var index = shoppingList.findIndex(function(item) {
          return item.ingredientName === ingredient.ingredientName
        });
        if (index === -1) {
          var newIngredient = Object.assign({}, ingredient);
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
  // $(".week-day").css("border", "5px solid green");
};

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  var parent = document.getElementById(data).parentElement;
  if ((parent.id === "recipes") && $(ev.target).hasClass("week-day")) {
    mealPlan.addRecipe(ev.target.id, recipeBook.getRecipe(data));
    updateDays();
  } else if ($(parent).hasClass("week-day") && $(ev.target).hasClass("week-day")) {
    var recipe = mealPlan.getRecipe(parent.id);
    mealPlan.addRecipe(ev.target.id, recipe);
    mealPlan.addRecipe(parent.id, null)
    updateDays();
  } else if($(parent).hasClass("week-day")){
    mealPlan.addRecipe(parent.id, null)
    updateDays();
  };
  console.log(mealPlan);
};

$(function() {
  function displayRecipes() {
    $("#recipes").empty();
    recipeBook.recipes.forEach(function(recipe) {
      $("#recipes").append("<li id=" + recipe.recipeName + " draggable='true' ondragstart='drag(event)'>"+ recipe.displayName + "</li>");
    });
  };

  recipeBook.recipes.push(awesomeCereal);
  recipeBook.recipes.push(chili);
  recipeBook.recipes.push(frittata);
  recipeBook.recipes.push(risotto);

  displayRecipes();

  $("#shopping-list").click(function() {
    var shopList = mealPlan.getIngredients();
    shopList.forEach(function(item) {
      console.log(item.ingredientName, item.quantity, item.unit);
    });
  });

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
   displayRecipes();
  });
});
