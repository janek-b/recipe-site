# _Recipe Site_

#### _Recipe Site, 3-06-2017_

#### By _**Janek Brandt, Xi Xia, Cameron Jensen, Chris Finney**_

## Description
_This project is a website for managing recipes and creating a weekly meal plan which generates a shopping list based on the ingredients needed for the recipes._


## Specifications

| Behavior                   | Input Example     | Output Example    |
| -------------------------- | -----------------:| -----------------:|
| Create an ingredient object | new Ingredient() | { name: "milk", quantity: 2, unit: "cups", meat: false, dairy: true} |
| Create a recipe object | new Recipe() | {name: "tacos", ingredients: [ingredient1, ingredient2], imageURL: "URL", instructions: "step1, .... step2"} |
| Create a mealPlan object | new mealPlan() | {recipes: [recipe1, recipe2]} |
| mealPlan has a method to go through each recipe and add it's ingredients to an array | mealPlan.getIngredientList() | [ingredient1, ingredient2 ...] |



## Setup/Installation Requirements

* _Clone the repository_
* _Open index.html file in web browser to view the project locally_
* _Use web server of your choice to host the website_


### License

Copyright (c) 2017 **_Janek Brandt, Xi Xia, Cameron Jensen, Chris Finney_**

This software is licensed under the MIT license.
