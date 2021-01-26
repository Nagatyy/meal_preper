class Meal {

	constructor(id, title, time, servings, calories, imageUrl, mealUrl, ingredientList, gramsOfProtein, gramsOfFat, gramsOfCarbs, percentVitaminA, percentVitaminC, percentCalcium, percentIron, percentFiber) {
		this.id = id;
		this.title = title;
		this.time = time;
		this.servings = servings;
		this.calories = calories;
		this.imageUrl = imageUrl;
		this.mealUrl = mealUrl;
		this.ingredientList = ingredientList;
		this.gramsOfProtein = gramsOfProtein;
		this.gramsOfFat = gramsOfFat;
		this.gramsOfCarbs = gramsOfCarbs;
		this.percentVitaminA = percentVitaminA;
		this.percentVitaminC = percentVitaminC;
		this.percentCalcium = percentCalcium;
		this.percentIron = percentIron;
		this.percentFiber = percentFiber;
  	}

}

$j(document).ready(function() {


	var snacksCalories = userNumOfSnacks * 150;
	var mealsCalories = userCals - snacksCalories;

	var caloriesPerMeal = Math.round(mealsCalories / userNumOfMeals);
	var caloriesPerSnack = 150;
	
	var totalProtein = Math.round(((proteinPercent / 100) * mealsCalories) / 4);
	var proteinPerMeal = Math.round(totalProtein / userNumOfMeals);

	var totalCarbs = Math.round(((carbsPercent / 100) * mealsCalories) / 4);
	var carbsPerMeal = Math.round(totalCarbs / userNumOfMeals);

	var totalFat = Math.round(((fatPercent / 100) * mealsCalories) / 9);
	var fatPerMeal = Math.round(totalFat / userNumOfMeals);

	var listOfMeals = [];
	var listOfSavedMeals = [];
	var mealsGenerated = 0;
	var caloriesRemaining = mealsCalories;
	var specialMultiplier = 1; // used in the case where calories needed are very high
	var tempCount = 0;




	// add on click listener to the regenerate button to regenerate a meal plan
	$j("#regenButton").click(regenerateMeals);
	$j("#regenButtonFromChange").click(regenerateMeals);
	$j("#newUserRegenButton").click(regenerateMeals);
	$j("#errorRegenButton").click(regenerateMeals);

	// saveMeals(JSON.stringify({x:5,y:6}));
	

	for(let i = 0; i < userNumOfMeals; i++){
		if(i === 0){ // the meal is a breakfast
			document.getElementById(`regenerateMeal${i+1}`).onclick = function(){
				regenerateBreakfast();

			};
			document.getElementById(`regenerateMealMobile${i+1}`).onclick = function(){
				regenerateBreakfast();

			};
		}
		else{
			document.getElementById(`regenerateMeal${i+1}`).onclick = function(){
				regenerateInidividualMeal(i);
			};
			document.getElementById(`regenerateMealMobile${i+1}`).onclick = function(){
				regenerateInidividualMeal(i);
			};
		}

		document.getElementById(`saveButton${i+1}`).onclick = function(){
			var x = document.getElementById(`mealSavedContent${i+1}`);

			if (x.style.display === "none") {
				x.style.display = "block";
				document.getElementById(`saveButton${i+1}`).innerHTML = "&nbsp;<i class='far fa-save'></i> Save again?";
				swal({
				    title: "Meal Saved!",
				    text: "You can now find it under 'Saved Meals'",
				    icon: "success",
				    buttons: {
				        confirm : {text:'OK',className:'confirmButton'},
				    }
				});
				addMealToSaved(i);
			}
			else {
				swal({
				    title: "Quit it!",
				    text: "This meal is already saved",
				    icon: "warning",
				    buttons: {
				        confirm : {text:'OK',className:'confirmButton'},
				    }
				});

			}


		};
		document.getElementById(`flagButton${i+1}`).onclick = function(){
			swal({
				    title: "Meal Flagged.",
				    text: "We will look into the issue.",
				    icon: "success",
				    buttons: {
				        confirm : {text:'OK',className:'confirmButton'},
				    }
				});

		}

		document.getElementById(`meal_${i+1}_title`).style.cursor = "pointer";

		$j(`#meal_${i+1}_title`).click(function(){
			var mealBody = document.getElementById(`card-body${i+1}`);

			if(mealBody.style.display === "none")
				mealBody.style.display = "initial";
			else {
				mealBody.style.display = "none";
			}
    		
		});

		$j(`#checkbox${i+1}`).on('change', function(){ 
			var mealBody = document.getElementById(`card-body${i+1}`);
		   if(this.checked){
		        mealBody.style.display = "none";
		        swal({
				    title: "We hope you liked it!",
				    text: "If you did, be sure to add it to your saved meals.",
				    icon: "success",
				    buttons: {
				        confirm : {text:'OK',className:'confirmButton'},
				    }
				});
		    }
		    else
		    	mealBody.style.display = "initial";
		})
	}
	getMealPlanFromDatabase();



	//JS for the pie chart
	var ctxP = document.getElementById("pieChart").getContext('2d');
	var myPieChart = new Chart(ctxP, {
		type: 'pie',
		data: {
			labels: ["Carbs", "Protein", "Fat"],
			datasets: [{
				data: [30, 30, 30],
				backgroundColor: ["#15AEC0", "#0ED7EF", "#549198"],
				hoverBackgroundColor: ["#4fc8d6", "#28e4fa", "#78b8bf"]
			}]
		},
		
		options: {
			maintainAspectRatio:false,
			tooltips: {
		      callbacks: {
		        title: function(tooltipItem, data) {
		        	return data['labels'][tooltipItem[0]['index']];
		        },
		        label: function(tooltipItem, data) {
		        	return data['datasets'][0]['data'][tooltipItem['index']].toFixed(2) + '%';
		        },
		      },
		      backgroundColor: '#FFF',
		      titleFontSize: 12,
		      titleFontColor: '#549198',
		      bodyFontColor: '#000',
		      bodyFontSize: 12,
		      displayColors: false
		    }
		}
	});

	$j( document ).ajaxStop(function() {
	  		console.log("done");
	  		// saveMeals(JSON.stringify(savedMeals));
	});

	function getMeal(){
		var meal = new Meal("", "", 0, 1, 0, "", "", [], 0, 0, 0, 0, 0, 0, 0, 0);


		if(mealsGenerated >= userNumOfMeals){
			// all meals have been generated
			$j('#spinner').hide();
			$j('#mainRefresh').show();

			// display the meals to the user
			displayMeals();

			// save the meals in the DB
			saveMeals(JSON.stringify(listOfMeals));

			return;

		}

		// if it is the first meal being generated
		// then the meal is a breakfast
		if(mealsGenerated === 0){
			const settings = {
				"async": true,
				"crossDomain": true,
				"url": "get/ajax/spoonacular",
				"method": "GET",
				data: { 
				    url: "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random?number=1&limitLicense=false&tags=breakfast"
				},
				statusCode: {
      				500: function() {
      					swal({
						    title: "Something went wrong",
						    text: "We can't seem to find meals that match your calories. If this error persists, contact us at hello@mealmill.com",
						    icon: "error",
						    buttons: {
						        confirm : {text:'OK',className:'confirmButton'},
						    }
						});

       				}
    			}
			};

			$.ajax(settings).done(async function (response) {

				response = response.recipes[0];
				meal.id = response.id;
				meal.title = response.title;
				meal.time = response.readyInMinutes;
				meal.servings = response.servings;
				meal.imageUrl = response.image;
				meal.mealUrl = response.sourceUrl;

				var multiplier = await getCaloriesInMeal(meal, false);
				if(multiplier === -1){
					$j("#errorModal").modal('show');
					return;
				}
				populateIngredientList(response.extendedIngredients, meal, multiplier);
				meal.servings = multiplier;
				getMeal(); // to get the next meal (if exists)
				
			})
			.fail(function() {
				$j("#errorModal").modal('show');
				document.getElementById("loader").style.display = "none";

				mealsGenerated = 1000;
			});
		}
		// else it is a non breakfast meal
		else {
			if(caloriesPerMeal >= 900){
				caloriesPerMeal /= 2;
				proteinPerMeal /= 2;
				fatPerMeal /= 2;
				carbsPerMeal /= 2;
				specialMultiplier = 2;
			}

			// set up the macronutrient bounds for the search

			var maxCalories = caloriesPerMeal + 100;
			var minCalories = ((caloriesPerMeal - 100) > 0) ? caloriesPerMeal - 100: 0;
			var maxProtein = proteinPerMeal + 10;
			var minProtein = ((proteinPerMeal - 10) > 0) ? proteinPerMeal - 10: 0;
			var maxFat = fatPerMeal + 6;
			var minFat = ((fatPerMeal - 6) > 0) ? fatPerMeal - 6: 0;
			var maxCarbs = carbsPerMeal+20;
			var minCarbs = ((carbsPerMeal - 20) > 0) ? carbsPerMeal - 20: 0;

			const settings = {
				"async": true,
				"crossDomain": true,
				"url": "get/ajax/spoonacular",
				"method": "GET",
				data: { 
				    url: `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByNutrients?maxCalories=${maxCalories}&minCalories=${minCalories}&maxProtein=${maxProtein}&minProtein=${minProtein}&maxFat=${maxFat}&minFat=${minFat}&maxCarbs=${maxCarbs}&minCarbs=${minCarbs}&offset=0&number=1&random=true&limitLicense=false`
				},
				statusCode: {
      				500: function() {
      					swal({
						    title: "Something went wrong",
						    text: "We can't seem to find meals that match your calories. If this error persists, contact us at hello@mealmill.com",
						    icon: "error",
						    buttons: {
						        confirm : {text:'OK',className:'confirmButton'},
						    }
						});

       				}
    			}
			};

			$.ajax(settings).done(function (response) {

				response = response[0];
				meal.id = response.id;
				meal.title = response.title;
				meal.calories = response.calories * specialMultiplier;
				meal.imageUrl = response.image;
				meal.gramsOfProtein = response.protein.slice(0, -1) * specialMultiplier;
				meal.gramsOfFat = response.fat.slice(0, -1) * specialMultiplier;
				meal.gramsOfCarbs = response.carbs.slice(0, -1) * specialMultiplier;
				getMissingData(meal, false, 0);

			})
			.fail(function() {
				$j("#errorModal").modal('show');
				document.getElementById("loader").style.display = "none";
				mealsGenerated = 1000;
			});
			
		}
		


	}

	function populateIngredientList(ingList, meal, multiplier){
		var ingredientsText = "";
		
		for(var ingredient of ingList){
		
			// console.log(ingredient.measures.metric);

			ingredientsText = "";

			// set the quanitity
			if(Math.round(ingredient.measures.metric.amount/meal.servings) === 0)
				ingredientsText+=`${multiplier * specialMultiplier}`;
			else
				ingredientsText += Math.round((ingredient.measures.metric.amount/meal.servings) * multiplier * specialMultiplier);


			// followed by the quantifier ie g, ml, Tbsps
			if(ingredient.measures.metric.unitShort === "servings" && Math.round((ingredient.measures.metric.amount/meal.servings) * multiplier * specialMultiplier) === 1)
				ingredient.measures.metric.unitShort = "serving";

			if(ingredient.measures.metric.unitShort === "tsps" || ingredient.measures.metric.unitShort === "Tbsps")
				if((Math.round(ingredient.measures.metric.amount/meal.servings) * multiplier * specialMultiplier) === 1)
					ingredient.measures.metric.unitShort = ingredient.measures.metric.unitShort.substring(0, ingredient.measures.metric.unitShort.length-1);



			ingredientsText += " " + ingredient.measures.metric.unitShort + " ";

			if(!(ingredient.measures.metric.unitShort === "") && !(ingredient.measures.metric.unitShort === "large") && !(ingredient.measures.metric.unitShort === "medium") && !(ingredient.measures.metric.unitShort === "small"))
				ingredientsText+= " of ";

			ingredientsText += ingredient.name;


			// remove s at the end if quantity is 1
			if(Math.round(ingredient.measures.metric.amount/meal.servings) === 1 || Math.round(ingredient.measures.metric.amount/meal.servings) === 0){
				if(ingredient.name.charAt(ingredient.name.length-1) === "s")
					ingredientsText = ingredientsText.substring(0, ingredientsText.length-1);
			}

			meal.ingredientList.push(ingredientsText);

		}

	}

	function getCaloriesInMeal(meal, isRegen){

		return new Promise((resolve, reject) => {

			const settings = {
				"async": true,
				"crossDomain": true,
				"url": "get/ajax/spoonacular",
				"method": "GET",
				data: { 
				    url: `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${meal.id}/nutritionWidget.json`
				},
				statusCode: {
      				500: function() {
      					swal({
						    title: "Something went wrong",
						    text: "We can't seem to find meals that match your calories. If this error persists, contact us at hello@mealmill.com",
						    icon: "error",
						    buttons: {
						        confirm : {text:'OK',className:'confirmButton'},
						    }
						});

       				}
    			}
			};


			$.ajax(settings).done(function (response) {

				var multiplier = 1;
				// if the breakfast is too small, make it multiple servings
				multiplier = Math.floor((mealsCalories / userNumOfMeals) / response.calories);
				if(multiplier === 0)
					multiplier = 1;

				meal.calories = response.calories * multiplier;
				// meal.servings = multiplier;

				meal.gramsOfProtein = (response.protein.slice(0, -1) * multiplier);
				meal.gramsOfCarbs = (response.carbs.slice(0, -1) * multiplier);
				meal.gramsOfFat = (response.fat.slice(0, -1) * multiplier);

				// add other nutrients
				for(var nutrient of response.good){
					if(nutrient.title === "Vitamin A")
						meal.percentVitaminA = nutrient.percentOfDailyNeeds * multiplier;
					else if(nutrient.title === "Vitamin C")
						meal.percentVitaminC = nutrient.percentOfDailyNeeds * multiplier;
					else if(nutrient.title === "Iron")
						meal.percentIron = nutrient.percentOfDailyNeeds * multiplier;
					else if(nutrient.title === "Calcium")
						meal.percentCalcium = nutrient.percentOfDailyNeeds * multiplier;
					else if(nutrient.title === "Fiber")
						meal.percentFiber = nutrient.percentOfDailyNeeds * multiplier;
				}

				totalProtein = Math.round(((proteinPercent / 100) * mealsCalories) / 4) - meal.gramsOfProtein;
				totalFat = Math.round(((fatPercent / 100) * mealsCalories) / 9) - meal.gramsOfFat;
				totalCarbs = Math.round(((carbsPercent / 100) * mealsCalories) / 4) - meal.gramsOfCarbs;

				if(totalFat < 0 || totalCarbs < 0 || totalProtein < 0){
					resolve(-1);
					return;
				}
					

				if(isRegen)
					listOfMeals[0] = meal;
				else {
					listOfMeals.push(meal);
					mealsGenerated++;
				}



				caloriesRemaining = mealsCalories - meal.calories;
				caloriesPerMeal = Math.round(caloriesRemaining / (userNumOfMeals - 1));
				proteinPerMeal = Math.round(totalProtein / (userNumOfMeals-1));
				carbsPerMeal = Math.round(totalCarbs / (userNumOfMeals-1));
				fatPerMeal = Math.round(totalFat / (userNumOfMeals-1));

				resolve(multiplier);

				// getMeal();

			})
			.fail(function() {
				$j("#errorModal").modal('show');
				document.getElementById("loader").style.display = "none";
				mealsGenerated = 1000;
			});

		});
	}

	function getMissingData(meal, isRegen, index){

		return new Promise((resolve, reject) => {

			const settings = {
				"async": true,
				"crossDomain": true,
				"url": "get/ajax/spoonacular",
				"method": "GET",
				data: { 
				    url: `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${meal.id}/information?includeNutrition=true`
				},
				statusCode: {
      				500: function() {
      					swal({
						    title: "Something went wrong",
						    text: "We can't seem to find meals that match your calories. If this error persists, contact us at hello@mealmill.com",
						    icon: "error",
						    buttons: {
						        confirm : {text:'OK',className:'confirmButton'},
						    }
						});

       				}
    			}
			};

			$.ajax(settings).done(function (response) {
				meal.time = response.readyInMinutes;
				meal.servings = response.servings;
				meal.mealUrl = response.sourceUrl;

				populateIngredientList(response.extendedIngredients, meal, 1);
				meal.servings = specialMultiplier;

				// add other nutrients
				for(var nutrient of response.nutrition.nutrients){
					if(nutrient.title === "Vitamin A")
						meal.percentVitaminA = nutrient.percentOfDailyNeeds * specialMultiplier;
					else if(nutrient.title === "Vitamin C")
						meal.percentVitaminC = nutrient.percentOfDailyNeeds * specialMultiplier;
					else if(nutrient.title === "Iron")
						meal.percentIron = nutrient.percentOfDailyNeeds * specialMultiplier;
					else if(nutrient.title === "Calcium")
						meal.percentCalcium = nutrient.percentOfDailyNeeds * specialMultiplier;
					else if(nutrient.title === "Fiber")
						meal.percentFiber = nutrient.percentOfDailyNeeds * specialMultiplier;
				}

				if(isRegen)
					listOfMeals[index] = meal;
				else {
					listOfMeals.push(meal);
					mealsGenerated++;
					getMeal();
				}

				resolve();
			})
			.fail(function() {
				$j("#errorModal").modal('show');
				document.getElementById("loader").style.display = "none";
				mealsGenerated = 1000;
			});

		});

	}

	function displayMeals(){
		var totalCalories = 0;
		var proteinInPlan = 0;
		var fatInPlan = 0;
		var carbsInPlan = 0;

		// other nutrients
		var totalVitaminA = 0;
		var totalVitaminC = 0;
		var totalCalcium = 0;
		var totalIron = 0;
		var totalFiber = 0;

		for(let i = 0; i < listOfMeals.length; i++){
			var modified_i = i+1;

			document.getElementById(`meal_${modified_i}_title`).innerHTML = listOfMeals[i].title;
			document.getElementById(`meal_${modified_i}_title`).title = listOfMeals[i].title;
			document.getElementById(`mealSavedContent${modified_i}`).style.display = "none";
			

			if(listOfMeals[i].title.length > 40)
				document.getElementById(`meal_${modified_i}_title`).innerHTML = listOfMeals[i].title.substring(0, 40) + "...";

			document.getElementById(`cookingTime${modified_i}`).innerHTML = listOfMeals[i].time + " mins to cook";
			document.getElementById(`servingSize${modified_i}`).innerHTML = "Servings: " + listOfMeals[i].servings;
			document.getElementById(`mealImage${modified_i}`).src = listOfMeals[i].imageUrl;
			document.getElementById(`mealImage${modified_i}`).style.cursor = "pointer";
			document.getElementById(`mealImage${modified_i}`).onclick = function() {
    			window.open(listOfMeals[i].imageUrl);
			};

			document.getElementById(`expandButton${modified_i}`).href = listOfMeals[i].mealUrl;
			document.getElementById(`expandButtonMobile${modified_i}`).href = listOfMeals[i].mealUrl;
			document.getElementById(`calories${modified_i}`).innerHTML = "Calories: " + listOfMeals[i].calories;
			totalCalories += listOfMeals[i].calories;
			proteinInPlan += listOfMeals[i].gramsOfProtein;
			fatInPlan += listOfMeals[i].gramsOfFat;
			carbsInPlan += listOfMeals[i].gramsOfCarbs;
			totalVitaminA += Math.round(listOfMeals[i].percentVitaminA);
			totalVitaminC += Math.round(listOfMeals[i].percentVitaminC);
			totalCalcium += Math.round(listOfMeals[i].percentCalcium);
			totalIron += Math.round(listOfMeals[i].percentIron);
			totalFiber += Math.round(listOfMeals[i].percentFiber);

			
			
			document.getElementById(`ingredientsListText${modified_i}`).innerHTML = (listOfMeals[i].servings > 1) ? `Ingredient list for ${listOfMeals[i].servings} servings` : `Ingredient list for ${listOfMeals[i].servings} serving`;
			var documentIngList = document.getElementById(`ingredientsList${modified_i}`);
			documentIngList.innerHTML = "";

			for(var ingredient of listOfMeals[i].ingredientList){
				var li = document.createElement("li");
				li.appendChild(document.createTextNode(ingredient));
				documentIngList.appendChild(li);
			}
		}

		document.getElementById("caloriesText").innerHTML = `Calories in Meals: ${totalCalories}`;
		document.getElementById("snackCaloriesText").innerHTML = `Calories in snacks: ${snacksCalories}`;
		document.getElementById("totalCaloriesText").innerHTML = `Total calories: ${totalCalories + snacksCalories}`;
		
		var s = "";
		if(userNumOfSnacks > 1){
			s = "s";
		}
		if(userNumOfSnacks === 0)
			document.getElementById("snacksText").innerHTML = `You have opted for no snacks.`;
		else
			document.getElementById("snacksText").innerHTML = `You can have ${userNumOfSnacks} snack${s}. Each snack must not exceed ${caloriesPerSnack} calories.`;

		// update the values of the pie chart
		var percentCarbs = ((carbsInPlan * 4) / totalCalories) * 100;
		var percentProtein = ((proteinInPlan * 4) / totalCalories) * 100;
		var percentFat = ((fatInPlan * 9) / totalCalories) * 100;
		myPieChart.data.datasets[0].data = [percentCarbs, percentProtein, percentFat];
		myPieChart.update();

		// update the values of the macronutrient progress bars
		document.getElementById("carbsText").innerHTML = `${carbsInPlan}g`;
		document.getElementById("proteinText").innerHTML = `${proteinInPlan}g`;
		document.getElementById("fatText").innerHTML = `${fatInPlan}g`;
		document.getElementById("carbsProgressBar").style.width = `${percentCarbs/carbsPercent * 100}%`;
		document.getElementById("proteinProgressBar").style.width = `${percentProtein/proteinPercent * 100}%`;
		document.getElementById("fatProgressBar").style.width = `${percentFat/fatPercent * 100}%`;

		// update the values of the other nutrients progress bars

		document.getElementById("vitaminAText").innerHTML = document.getElementById("vitaminAProgressBar").style.width = `${totalVitaminA}%`;
		document.getElementById("vitaminCText").innerHTML = document.getElementById("vitaminCProgressBar").style.width = `${totalVitaminC}%`;
		document.getElementById("calciumText").innerHTML = document.getElementById("calciumProgressBar").style.width = `${totalCalcium}%`;
		document.getElementById("ironText").innerHTML = document.getElementById("ironProgressBar").style.width = `${totalIron}%`;
		document.getElementById("fiberText").innerHTML = document.getElementById("fiberProgressBar").style.width = `${totalFiber}%`;

	}

	function saveMeals(meals_json){

		var ajax_request = {
		  	"url": "post/ajax/meal_plan",
	  		"method": "POST",
	  		"data": meals_json,
	  		global: false,
	  		// success: function (response) {
	  		// 	console.log("success");
	  		// },
	  		error: function(response){
	  			$j("#errorModal").modal('show');
				document.getElementById("loader").style.display = "none";
	  		}
		};

		$j.ajax(ajax_request).done(function (response) {
			// console.log(response);

		});

	}

	function getMealPlanFromDatabase(){
		var ajax_request = {
		  	"url": "get/ajax/meal_plan",
	  		"method": "GET",
	  		global: false,
	  		dataType: "json",
	  		// success: function (response) {
	  		// 	console.log("success");
	  		// },
	  		error: function(XMLHttpRequest, textStatus, errorThrown){
	  			$j("#errorModal").modal('show');
				document.getElementById("loader").style.display = "none";
	  		}
		};


		$j.ajax(ajax_request).done(function (response) {
			// console.log(response);

			// if the user has changed the number of meals since their previous meal plan
			if (JSON.stringify(response) === "{}"){
				// new user
				$j("#newUserModal").modal('show');
				document.getElementById("loader").style.display = "none";
				
			}
			else if(response.length != userNumOfMeals){
				$j("#regenerateModalFromChange").modal('show');
				document.getElementById("loader").style.display = "none";

				// regenerateMeals();
				// displayMeals();
			}

			else {
				for(let i = 0; i < response.length; i++)
					listOfMeals[i] = new Meal(response[i].id, response[i].title, response[i].time, response[i].servings, response[i].calories, response[i].imageUrl, response[i].mealUrl, response[i].ingredientList, response[i].gramsOfProtein, response[i].gramsOfFat, response[i].gramsOfCarbs, response[i].percentVitaminA, response[i].percentVitaminC, response[i].percentCalcium, response[i].percentIron, response[i].percentFiber);
				displayMeals();
				// console.log(listOfMeals);
				document.getElementById("loader").style.display = "none";				
			}

		});
	}

	function regenerateBreakfast(){
		var w = parseInt(window.innerWidth);


		if(w <= 1000){
			$j('#mobileSpinner1').show(); 
		} 
		else {
			$j('#spinner1').show(); 
			$j('#refresh1').hide();
		}	    
		document.getElementById(`saveButton1`).innerHTML = "&nbsp;<i class='far fa-save'></i> Save";
		var meal = new Meal("", "", 0, 1, 0, "", "", [], 0, 0, 0, 0, 0, 0, 0, 0);


		const settings = {
			"async": true,
			"crossDomain": true,
			"url": "get/ajax/spoonacular",
			"method": "GET",
			data: { 
			    url: "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random?number=1&limitLicense=false&tags=breakfast"
			},
			statusCode: {
  				500: function() {
  					swal({
					    title: "Something went wrong",
					    text: "We can't seem to find meals that match your calories. If this error persists, contact us at hello@mealmill.com",
					    icon: "error",
					    buttons: {
					        confirm : {text:'OK',className:'confirmButton'},
					    }
					});

   				}
			}
		};

		$.ajax(settings).done(async function (response) {
			
			response = response.recipes[0];
			meal.id = response.id;
			meal.title = response.title;
			meal.time = response.readyInMinutes;
			meal.servings = response.servings;
			meal.imageUrl = response.image;
			meal.mealUrl = response.sourceUrl;

			var multiplier = await getCaloriesInMeal(meal, true);
			populateIngredientList(response.extendedIngredients, meal, multiplier);
			meal.servings = multiplier;

			displayMeals();
			saveMeals(JSON.stringify(listOfMeals));

			if(w <= 1000){
				$j('#mobileSpinner1').hide(); 
			} 
			else {
				$j('#spinner1').hide(); 
				$j('#refresh1').show();
			}			
			
		})
		.fail(function() {
			$j("#errorModal").modal('show');
			document.getElementById("loader").style.display = "none";
			mealsGenerated = 1000;
		});
	}
	function regenerateInidividualMeal(index){
		var w = parseInt(window.innerWidth);

		if(w <= 1000){
			$j(`#mobileSpinner${index+1}`).show(); 
		} 
		else {
			$j(`#spinner${index+1}`).show(); 
			$j(`#refresh${index+1}`).hide();
		}	

		document.getElementById(`saveButton${index+1}`).innerHTML = "&nbsp;<i class='far fa-save'></i> Save";



		var meal = new Meal("", "", 0, 1, 0, "", "", [], 0, 0, 0, 0, 0, 0, 0, 0);
		// where index refers to the meal number (starts at 2 for 2nd meal)
		if(caloriesPerMeal >= 900){
			caloriesPerMeal /= 2;
			proteinPerMeal /= 2;
			fatPerMeal /= 2;
			carbsPerMeal /= 2;
			specialMultiplier = 2;
		}

		// set up the macronutrient bounds for the search

		var maxCalories = caloriesPerMeal + 100;
		var minCalories = ((caloriesPerMeal - 100) > 0) ? caloriesPerMeal - 100: 0;
		var maxProtein = proteinPerMeal + 10;
		var minProtein = ((proteinPerMeal - 10) > 0) ? proteinPerMeal - 10: 0;
		var maxFat = fatPerMeal + 6;
		var minFat = ((fatPerMeal - 6) > 0) ? fatPerMeal - 6: 0;
		var maxCarbs = carbsPerMeal+20;
		var minCarbs = ((carbsPerMeal - 20) > 0) ? carbsPerMeal - 20: 0;


		const settings = {
			"async": true,
			"crossDomain": true,
			"url": "get/ajax/spoonacular",
			"method": "GET",
			data: { 
			    url: `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByNutrients?maxCalories=${maxCalories}&minCalories=${minCalories}&maxProtein=${maxProtein}&minProtein=${minProtein}&maxFat=${maxFat}&minFat=${minFat}&maxCarbs=${maxCarbs}&minCarbs=${minCarbs}&offset=0&number=1&random=true&limitLicense=false`
			},
			statusCode: {
  				500: function() {
  					swal({
					    title: "Something went wrong",
					    text: "We can't seem to find meals that match your calories. If this error persists, contact us at hello@mealmill.com",
					    icon: "error",
					    buttons: {
					        confirm : {text:'OK',className:'confirmButton'},
					    }
					});

   				}
			}
		};


		$.ajax(settings).done(async function (response) {

			response = response[0];
			meal.id = response.id;
			meal.title = response.title;
			meal.calories = response.calories * specialMultiplier;
			meal.imageUrl = response.image;
			meal.gramsOfProtein = response.protein.slice(0, -1) * specialMultiplier;
			meal.gramsOfFat = response.fat.slice(0, -1) * specialMultiplier;
			meal.gramsOfCarbs = response.carbs.slice(0, -1) * specialMultiplier;
			await getMissingData(meal, true, index);

			displayMeals();		
			if(w <= 1000){
				$j(`#mobileSpinner${index+1}`).hide(); 
			} 
			else {
				$j(`#spinner${index+1}`).hide(); 
				$j(`#refresh${index+1}`).show();
			}	

			saveMeals(JSON.stringify(listOfMeals));


		})
		.fail(function() {
			$j("#errorModal").modal('show');
			document.getElementById("loader").style.display = "none";
			mealsGenerated = 1000;
		});

	}

	

	function regenerateMeals(){
		$j('#spinner').show();
		$j('#mainRefresh').hide();

		// reinitialize
		for(let i = 0; i < listOfMeals.length; i++)
			document.getElementById(`saveButton${i+1}`).innerHTML = "&nbsp;<i class='far fa-save'></i> Save";
		mealsGenerated = 0;
		listOfMeals = [];
		caloriesRemaining = mealsCalories;
		totalProtein = Math.round(((proteinPercent / 100) * mealsCalories) / 4);
		totalCarbs = Math.round(((carbsPercent / 100) * mealsCalories) / 4);
		totalFat = Math.round(((fatPercent / 100) * mealsCalories) / 9);
		specialMultiplier = 1;



		getMeal();

	}


	async function addMealToSaved(index){

		if(listOfSavedMeals.length === 0){
			await getSavedMealsFromDatabase()
		}

		listOfSavedMeals.splice(0, 0, listOfMeals[index]);

		var meals_json = {};

		meals_json.listOfMeals = JSON.stringify(listOfSavedMeals);

		meals_json.numOfMeals = "increment";

		var ajax_request = {
		  	"url": "saved/post/ajax/saved_meals",
	  		"method": "POST",
	  		"data": meals_json,
	  		global: false,

	  		error: function(XMLHttpRequest, textStatus, errorThrown){
	  			// document.getElementById("loader").style.display = "none";
	  			$j("#errorModal").modal('show');
	  		}
		};

		$.ajax(ajax_request).done(function (response) {
			console.log(response);
		});

	}

	function getSavedMealsFromDatabase(){
		return new Promise((resolve, reject) => {

			var ajax_request = {
			  	"url": "saved/get/ajax/saved_meals",
		  		"method": "GET",
		  		global: false,
		  		dataType: "json",
		  		// success: function (response) {
		  		// 	console.log("success");
		  		// },
		  		error: function(XMLHttpRequest, textStatus, errorThrown){
		  			$j("#errorModal").modal('show');
		  		}
			};


			$.ajax(ajax_request).done(function (response) {

				if (JSON.stringify(response) === "{}"){
					// no meals saved
				}
				else {
					for(let i = 0; i < response.length; i++)
						listOfSavedMeals[i] = new Meal(response[i].id, response[i].title, response[i].time, response[i].servings, response[i].calories, response[i].imageUrl, response[i].mealUrl, response[i].ingredientList, response[i].gramsOfProtein, response[i].gramsOfFat, response[i].gramsOfCarbs);				
				}

				resolve();

			});
		});
	}



});








