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
	var listOfMeals = [];

	getSavedMealsFromDatabase();

	for(let i = 0; i < numOfSavedMeals; i++){
		// hide the regenerate buttons
		document.getElementById(`regenerateMeal${i+1}`).style.display = "none";
		document.getElementById(`checkbox${i+1}`).style.display = "none";
		document.getElementById(`checkboxText${i+1}`).style.display = "none";
		document.getElementById(`noSavedMealsAlert`).style.display = "none";
		document.getElementById(`saveButton${i+1}`).innerHTML = "&nbsp;<i class='far fa-save'></i> Unsave";
		

		document.getElementById(`saveButton${i+1}`).onclick = function(){
			swal({
			    title: "Meal Unsaved!",
			    text: "It will now be removed.",
			    icon: "success",
			    buttons: {
			        confirm : {text:'OK',className:'confirmButton'},
			    }
			});

			removeMealFromSaved(i);
		}
	}

	function getSavedMealsFromDatabase(){
		var ajax_request = {
		  	"url": "saved/get/ajax/saved_meals",
	  		"method": "GET",
	  		global: false,
	  		dataType: "json",
	  		// success: function (response) {
	  		// 	console.log("success");
	  		// },
	  		error: function(XMLHttpRequest, textStatus, errorThrown){
	  			document.getElementById("loader").style.display = "none";
	  			$("#errorModal").modal('show');
	  		}
		};


		$.ajax(ajax_request).done(function (response) {
			// console.log(response);

			if (JSON.stringify(response) === "{}"){
				// no meals saved
				document.getElementById(`noSavedMealsAlert`).style.display = "block";
				document.getElementById("loader").style.display = "none";
			}


			else {
				for(let i = 0; i < response.length; i++)
					listOfMeals[i] = new Meal(response[i].id, response[i].title, response[i].time, response[i].servings, response[i].calories, response[i].imageUrl, response[i].mealUrl, response[i].ingredientList, response[i].gramsOfProtein, response[i].gramsOfFat, response[i].gramsOfCarbs);
				displayMeals();
				document.getElementById("loader").style.display = "none";
			
			}

		});
	}

	function displayMeals(){

		for(let i = 0; i < listOfMeals.length; i++){
			var modified_i = i+1;

			document.getElementById(`meal_${modified_i}_title`).innerHTML = listOfMeals[i].title;
			document.getElementById(`meal_${modified_i}_title`).title = listOfMeals[i].title;
			document.getElementById(`mealSavedContent${modified_i}`).style.display = "none";
			document.getElementById(`liRegenMobile${modified_i}`).style.display = "none";
			document.getElementById(`flagButton${modified_i}`).onclick = function(){
			swal({
				    title: "Meal Flagged.",
				    text: "We will look into the issue.",
				    icon: "success",
				    buttons: {
				        confirm : {text:'OK',className:'confirmButton'},
				    }
				});

		}

			
			

			if(listOfMeals[i].title.length > 45)
				document.getElementById(`meal_${modified_i}_title`).innerHTML = listOfMeals[i].title.substring(0, 45) + "...";

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

			
			
			document.getElementById(`ingredientsListText${modified_i}`).innerHTML = (listOfMeals[i].servings > 1) ? `Ingredient list for ${listOfMeals[i].servings} servings` : `Ingredient list for ${listOfMeals[i].servings} serving`;
			var documentIngList = document.getElementById(`ingredientsList${modified_i}`);
			documentIngList.innerHTML = "";

			for(var ingredient of listOfMeals[i].ingredientList){
				var li = document.createElement("li");
				li.appendChild(document.createTextNode(ingredient));
				documentIngList.appendChild(li);
			}


			
		}
	}

	function removeMealFromSaved(index){
		// remove the item but preserve the indexes
		listOfMeals[index] = undefined;
		$(`#mealDiv${index+1}`).fadeOut(1000);

		// now to update this information in the DB
		// first we prepare the new data that will be stored in the DB
		var listOfMealsToSend = [];
		for(let i = 0; i < listOfMeals.length; i++){
			if(listOfMeals[i] != undefined)
				listOfMealsToSend.push(new Meal(listOfMeals[i].id, listOfMeals[i].title, listOfMeals[i].time, listOfMeals[i].servings, listOfMeals[i].calories, listOfMeals[i].imageUrl, listOfMeals[i].mealUrl, listOfMeals[i].ingredientList, listOfMeals[i].gramsOfProtein, listOfMeals[i].gramsOfFat, listOfMeals[i].gramsOfCarbs));
		}

		var meals_json = {};

		meals_json.listOfMeals = JSON.stringify(listOfMealsToSend);

		if(listOfMealsToSend.length === 0)
			meals_json.listOfMeals = JSON.stringify({});
		
		numOfSavedMeals -= 1;
		meals_json.numOfMeals = numOfSavedMeals;

		var ajax_request = {
		  	"url": "saved/post/ajax/saved_meals",
	  		"method": "POST",
	  		"data": meals_json,
	  		global: false,

	  		error: function(XMLHttpRequest, textStatus, errorThrown){
	  			document.getElementById("loader").style.display = "none";
	  			$("#errorModal").modal('show');
	  		}
		};

		$.ajax(ajax_request).done(function (response) {
			console.log(response);
		});

		
	}

});