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
  //create recipe object, create ingredient objects, insert ingredient objects into recipe object. insert recipe object into recipe book.
  event.preventDefault();
  var recipeName = $("input#recipe-name").val();
  var recipeImage = $("input#meal-image").val();
  var recipeInstructions = $("input#cooking-instructions").val();
  var newRecipe = new Recipe(recipeName, recipeImage, recipeInstructions);
  //loop that makes all the ingredients

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

  console.log(week);
  $("#testBtn").click(function() {
    var testobject = $("#monday").children().attr("id");
    console.log(recipeBook.getRecipe(testobject));
  });

});
