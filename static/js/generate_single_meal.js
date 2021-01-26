class Meal {

	constructor(id, title, time, servings, calories, imageUrl, mealUrl, ingredientList, gramsOfProtein, gramsOfFat, gramsOfCarbs) {
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
  	}

}


$(document).ready(function() {

	var listOfMeals = []; // will only ever contain 1 meal
	var listOfSavedMeals = []; // retrieved once in the case a user saves a meal

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


	document.getElementById("regenerateMeal1").style.display = "none";
	document.getElementById("checkbox1").style.display = "none";
	document.getElementById("checkboxText1").style.display = "none";
	document.getElementById("mealSavedContent1").style.display = "none";
	document.getElementById("liRegenMobile1").style.display = "none";

	
	
	$("#generateButton").click(generateMeal);


	document.getElementById(`saveButton1`).onclick = function(){
		swal({
		    title: "Umm",
		    text: "What exactly are you trying to save?",
		    icon: "error",
		    buttons: {
		        confirm : {text:'OK',className:'confirmButton'},
		    }
		});
	};

	document.getElementById(`flagButton1`).onclick = function(){
		swal({
		    title: "Umm",
		    text: "What exactly are you trying to flag?",
		    icon: "error",
		    buttons: {
		        confirm : {text:'OK',className:'confirmButton'},
		    }
		});

	};

	document.getElementById("loader").style.display = "none";
	$(".mealInfo").hide();

	function generateMeal(){


		var calories = parseInt(document.forms["macrosForm"]["caloriesInput"].value);
		var carbs = parseInt(document.forms["macrosForm"]["carbsInput"].value);
        var fat = parseInt(document.forms["macrosForm"]["fatInput"].value);
        var protein = parseInt(document.forms["macrosForm"]["proteinInput"].value);
        document.getElementById("notFoundError").style.display = "none";
        document.getElementById("macrosError").style.display = "none";
        var total = 0;

        if(Number.isNaN(calories))
        	return;

        if(calories < 1 || calories > 1500)
        	return;

        if(!Number.isNaN(carbs) && (carbs < 1 || carbs > 100))
        	return;

        if(!Number.isNaN(protein) && (protein < 1 || protein > 100))
        	return;

        if(!Number.isNaN(fat) && (fat < 1 || fat > 100))
        	return;

        if(!Number.isNaN(carbs))
        	total += carbs;
        if(!Number.isNaN(protein))
        	total += protein;
        if(!Number.isNaN(fat))
        	total += fat;


        if(total > 100){
        	document.getElementById("macrosError").style.display = "block";
        	return;
        }


        $('#spinner').show();
        $("#generateButton").html('Regenerate');
        var meal = new Meal("", "", 0, 1, 0, "", "", [], 0, 0, 0);
        listOfMeals = [];
        var url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByNutrients`;

        var maxCalories = calories + 50;
		var minCalories = ((calories - 50) > 0) ? calories - 50: 0;

		url += `?maxCalories=${maxCalories}&minCalories=${minCalories}`;

		if(!Number.isNaN(carbs)){
			var gramsOfCarbs = Math.round(((carbs / 100) * calories) / 4);
			var maxCarbs = gramsOfCarbs+4;
			var minCarbs = ((gramsOfCarbs - 4) > 0) ? gramsOfCarbs - 4: 0;
			url += `&maxCarbs=${maxCarbs}&minCarbs=${minCarbs}`
		}

		if(!Number.isNaN(fat)){
			var gramsOfFat = Math.round(((fat / 100) * calories) / 9);
			var maxFat = gramsOfFat + 3;
			var minFat = ((gramsOfFat - 3) > 0) ? gramsOfFat - 3: 0;
			url += `&maxFat=${maxFat}&minFat=${minFat}`;
		}

		if(!Number.isNaN(protein)){
			var gramsOfProtein = Math.round(((protein / 100) * calories) / 4);
			var maxProtein = gramsOfProtein + 4;
			var minProtein = ((gramsOfProtein - 4) > 0) ? gramsOfProtein - 4: 0;
			url += `&maxProtein=${maxProtein}&minProtein=${minProtein}`;
		}
		url += `&offset=0&number=1&random=true&limitLicense=false`;

		const settings = {
			"async": true,
			"crossDomain": true,
			"url": "single/get/ajax/spoonacular",
			"method": "GET",
			data: { 
			    url: url 
			 }
		};

		$.ajax(settings).done(function (response) {

			if(response.status === "failure" || response.status === 500){
				document.getElementById("notFoundError").style.display = "block";
				$('#spinner').hide();
				return;
			}

			response = response[0];
			meal.id = response.id;
			meal.title = response.title;
			meal.calories = response.calories;
			meal.imageUrl = response.image;
			meal.gramsOfProtein = response.protein.slice(0, -1);
			meal.gramsOfFat = response.fat.slice(0, -1);
			meal.gramsOfCarbs = response.carbs.slice(0, -1);
			getMissingData(meal, false, 0);

			enableSaveAndFlag();
			document.getElementById(`saveButton1`).innerHTML = "&nbsp;<i class='far fa-save'></i> Save";
			$('#spinner').hide();

			

		})

		.fail(function() {
			document.getElementById("notFoundError").style.display = "block";
			$('#spinner').hide();
		});

	}

	function displayMeal(){

		for(let i = 0; i < listOfMeals.length; i++){
			var modified_i = i+1;

			document.getElementById(`meal_1_title`).innerHTML = listOfMeals[i].title;
			document.getElementById(`meal_1_title`).title = listOfMeals[i].title;
			document.getElementById(`mealSavedContent1`).style.display = "none";
			

			if(listOfMeals[i].title.length > 45)
				document.getElementById(`meal_1_title`).innerHTML = listOfMeals[i].title.substring(0, 45) + "...";

			document.getElementById(`cookingTime1`).innerHTML = listOfMeals[i].time + " mins to cook";
			document.getElementById(`servingSize1`).innerHTML = "Servings: " + listOfMeals[i].servings;
			document.getElementById(`mealImage1`).src = listOfMeals[i].imageUrl;
			document.getElementById(`mealImage${modified_i}`).style.cursor = "pointer";

			document.getElementById(`mealImage${modified_i}`).onclick = function() {
    			window.open(listOfMeals[i].imageUrl);
			};
			document.getElementById(`expandButton1`).href = listOfMeals[i].mealUrl;
			document.getElementById(`calories1`).innerHTML = "Calories: " + listOfMeals[i].calories;

			
			
			document.getElementById(`ingredientsListText1`).innerHTML = (listOfMeals[i].servings > 1) ? `Ingredient list for ${listOfMeals[i].servings} servings` : `Ingredient list for ${listOfMeals[i].servings} serving`;
			var documentIngList = document.getElementById(`ingredientsList1`);
			documentIngList.innerHTML = "";

			for(var ingredient of listOfMeals[i].ingredientList){
				var li = document.createElement("li");
				li.appendChild(document.createTextNode(ingredient));
				documentIngList.appendChild(li);
			}

			// update the values of the pie chart
			var percentCarbs = ((Number.parseInt(listOfMeals[i].gramsOfCarbs) * 4) / listOfMeals[i].calories) * 100;
			var percentProtein = ((Number.parseInt(listOfMeals[i].gramsOfProtein) * 4) / listOfMeals[i].calories) * 100;
			var percentFat = ((Number.parseInt(listOfMeals[i].gramsOfFat) * 9) / listOfMeals[i].calories) * 100;
			myPieChart.data.datasets[0].data = [percentCarbs, percentProtein, percentFat];
			myPieChart.update();

			document.getElementById("carbsText").innerHTML = `${listOfMeals[i].gramsOfCarbs}g`;
			document.getElementById("proteinText").innerHTML = `${listOfMeals[i].gramsOfProtein}g`;
			document.getElementById("fatText").innerHTML = `${listOfMeals[i].gramsOfFat}g`;

			document.getElementById("carbsProgressBar").style.width = `${percentCarbs}%`;
			document.getElementById("proteinProgressBar").style.width = `${percentProtein}%`;
			document.getElementById("fatProgressBar").style.width = `${percentFat}%`;

			$(".mealInfo").show();
			$('#spinner').hide();

		}



	}


	function getMissingData(meal, isRegen, index){

		return new Promise((resolve, reject) => {

			const settings = {
				"async": true,
				"crossDomain": true,
				"url": "single/get/ajax/spoonacular",
				"method": "GET",
				data: { 
				    url: `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${meal.id}/information?includeNutrition=true` 
				 }
			};

			$.ajax(settings).done(function (response) {
				meal.time = response.readyInMinutes;
				meal.servings = response.servings;
				meal.mealUrl = response.sourceUrl;

				populateIngredientList(response.extendedIngredients, meal, 1);
				meal.servings = 1;
				listOfMeals.push(meal);
				displayMeal();

				resolve();
			})
			.fail(function() {
				alert("Error");
			});

		});

	}


	function populateIngredientList(ingList, meal, multiplier){
		var ingredientsText = "";
		var specialMultiplier = 1;
		
		for(var ingredient of ingList){
		

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

	function enableSaveAndFlag(){
		document.getElementById(`saveButton1`).onclick = function(){
			var x = document.getElementById(`mealSavedContent1`);

			if (x.style.display === "none") {
				x.style.display = "block";
				document.getElementById(`saveButton1`).innerHTML = "&nbsp;<i class='far fa-save'></i> Save again?";
				swal({
				    title: "Meal Saved!",
				    text: "You can now find it under 'Saved Meals'",
				    icon: "success",
				    buttons: {
				        confirm : {text:'OK',className:'confirmButton'},
				    }
				});
				addMealToSaved(0);
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
		document.getElementById(`flagButton1`).onclick = function(){
			swal({
				    title: "Meal Flagged.",
				    text: "We will look into the issue.",
				    icon: "success",
				    buttons: {
				        confirm : {text:'OK',className:'confirmButton'},
				    }
				});

		}

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
	  			$("#errorModal").modal('show');
	  		}
		};

		$.ajax(ajax_request).done(function (response) {

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
		  			$("#errorModal").modal('show');
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