angular.module('paysApp').controller("mainCtrl", ["$scope", "$http", "$filter", "localStorageService", "GeoLocationService", "CartService", 
	function (scope, http, filter, localStorageService, GeoLocationService, CartService) {

	console.log("Main Ctrl!");
	scope.msg = "Main Ctrl!";
	console.log(GeoLocationService.hello());

	scope.cartItems = CartService.getItemsSize();
	scope.countries = ['Serbia', 'Croatia', 'BiH'];
	scope.selectedCountry = 'Serbia';
	scope.currencies = ['RSD', 'HRK', 'EUR'];
	scope.selectedCurrency = 'RSD';

    GeoLocationService.getLocation();




	scope.putInCart = function (key, value) {
		CartService.putInCart(key, value);
		scope.cartItems = CartService.getItemsSize();
	};

	scope.recommendedFarmers = [
			{
				"name" : "Farmer  jedan",
				"location" : "Novi Sad",
				"img" : "images/home/product1.jpg",
				"items" : 10,
				"id" : 145
			},
			{
				"name" : "Farmer  dva",
				"location" : "Budisava",
				"img" : "images/home/product2.jpg",
				"items" : 8,
				"id" : 155
			},
			{
				"name" : "Farmer  tri",
				"location" : "Curug",
				"img" : "images/home/product1.jpg",
				"items" : 4,
				"id" : 165
			},
			{
				"name" : "Farmer  cetiri",
				"location" : "Begec",
				"img" : "images/home/product2.jpg",
				"items" : 2,
				"id" : 175
			},
			{
				"name" : "Farmer  5",
				"location" : "Crvenka",
				"img" : "images/home/product1.jpg",
				"items" : 22,
				"id" : 185
			}
	];


	scope.farmers = [
			{
				"name" : "Farmer  jedan",
				"location" : "Novi Sad",
				"img" : "images/home/product1.jpg",
				"items" : 10,
				"id" : 145
			},
			{
				"name" : "Farmer  dva",
				"location" : "Budisava",
				"img" : "images/home/product2.jpg",
				"items" : 8,
				"id" : 155
			},
			{
				"name" : "Farmer  tri",
				"location" : "Curug",
				"img" : "images/home/product1.jpg",
				"items" : 4,
				"id" : 165
			},
			{
				"name" : "Farmer  cetiri",
				"location" : "Begec",
				"img" : "images/home/product2.jpg",
				"items" : 2,
				"id" : 175
			},
			{
				"name" : "Farmer  5",
				"location" : "Crvenka",
				"img" : "images/home/product1.jpg",
				"items" : 22,
				"id" : 185
			}
	];
	
}]);