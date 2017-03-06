// Back-End
function Ingredient(ingredientName, quantity, unit, meat, dairy) {
  this.ingredientName = ingredientName;
  this.quantity = quantity;
  this.unit = unit;
  this.meat = meat;
  this.dairy = dairy;
};

function Recipe(recipeName, imageURL, instructions) {
  this.recipeName = recipeName;
  this.ingredients = [];
  this.imageURL = imageURL;
  this.instructions = instructions;
};

function MealPlan() {
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

var milk = new Ingredient("milk", 1, "cup", false, true);
var cereal = new Ingredient("cereal", 2, "cup", false, false);
var cerealRecipe = new Recipe("awesome cereal", "imglink", "make cereal");
cerealRecipe.ingredients.push(milk);
cerealRecipe.ingredients.push(cereal);
var week = new MealPlan();
week.recipes.push(cerealRecipe)
console.log(week.getIngredients());

// Front-End
