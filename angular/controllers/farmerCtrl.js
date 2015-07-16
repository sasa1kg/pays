angular.module('paysApp').controller("farmCtrl", ["$scope", "$http", "$filter", "$routeParams",  function (scope, http, filter, routeParams) {


	console.log("FARM! " + routeParams.id);
	console.log("farmCtrl!");
	scope.msg = "farmCtrl!";

	scope.farmerId = routeParams.id;

	scope.farmer = {
		"name" : "Farmer  jedan",
		"location" : "Novi Sad",
		"img" : "images/home/product1.jpg",
		"items" : 10,
		"id" : 145
	};

	scope.farmerCategories = [
		{
			"name" : "LIMUN",
			"id" : 101
		},
		{
			"name" : "POMORANDŽE",
			"id" : 102
		},
		{
			"name" : "JABUKE",
			"id" : 103
		},
		{
			"name" : "JAGODE",
			"id" : 104
		}
	];
	
}]);