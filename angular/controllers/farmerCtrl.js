angular.module('paysApp').controller("farmCtrl", ["$scope", "$http", "$filter", "$routeParams", "CartService", "WishlistService", "SearchService",
	function (scope, http, filter, routeParams, CartService, WishlistService, SearchService) {


	console.log("FARM! " + routeParams.id);
	console.log("farmCtrl!");
	scope.msg = "farmCtrl!";

	scope.cartItems = CartService.getItemsSize();
	scope.wishlistItems = WishlistService.getItemsSize();

	scope.farmerId = routeParams.id;
	scope.searchedItems = [];

	scope.addToWishlist = function (productId) {
		for (var i = scope.farmerProducts.length - 1; i >= 0; i--) {
			if (scope.farmerProducts[i].id == productId) {
				WishlistService.putInWishlist(scope.farmerProducts[i].id, 
								scope.farmerProducts[i].name, 
								scope.farmerProducts[i].measure, 
								scope.farmerProducts[i].price, 
								scope.farmerProducts[i].image,
								scope.farmer.id, 
								scope.farmer.name, 
								scope.farmer.location
				);
			}
		}
		scope.wishlistItems = WishlistService.getItemsSize();
	}


	scope.addToCart = function(productId) {
		if (CartService.canBeAdded(scope.farmer.id)) {
			for (var i = scope.farmerProducts.length - 1; i >= 0; i--) {
				if (scope.farmerProducts[i].id == productId) {
					CartService.putInCart(scope.farmerProducts[i].id, 
						scope.farmerProducts[i].name, 
						scope.farmerProducts[i].measure, 
						scope.farmerProducts[i].price, 
						scope.farmerProducts[i].image,
						scope.farmer.id, 
						scope.farmer.name, 
						scope.farmer.location);
				}
			};
			scope.cartItems = CartService.getItemsSize();
			scope.wishlistItems = WishlistService.getItemsSize();
		} else {
			alert("Proizvodi drugog farmera su u kolicima.");
		}
	}

	scope.farmer = SearchService.getFarmerById(scope.farmerId);

	scope.farmerProducts = [
		{
			"id" : 10,
			"name" : "Paradajz",
			"category" : "Povrce",
			"price" : 215,
			"measure" : "kg",
			"currency" : "RSD",
			"image" : "images/cart/tomato.png"
		},
		{
			"id" : 11,
			"name" : "Paradajz druga klasa",
			"category" : "Povrce",
			"price" : 115,
			"measure" : "kg",
			"currency" : "RSD",
			"image" : "images/cart/tomato.png"
		},
		{
			"id" : 12,
			"name" : "Krastavac",
			"category" : "Povrce",
			"price" : 45,
			"measure" : "kg",
			"currency" : "RSD",
			"image" : "images/cart/cucumber.png"
		},
		{
			"id" : 13,
			"name" : "Krastavac Druga klasa",
			"category" : "Povrce",
			"price" : 65,
			"measure" : "kg",
			"currency" : "RSD",
			"image" : "images/cart/cucumber.png"
		},
		{
			"id" : 14,
			"name" : "Mladi luk",
			"category" : "Povrce",
			"price" : 75,
			"measure" : "veza",
			"currency" : "RSD",
			"image" : "images/cart/onion.gif"
		},
		{
			"id" : 15,
			"name" : "Mladi luk",
			"category" : "Povrce",
			"price" : 105,
			"measure" : "veza",
			"currency" : "RSD",
			"image" : "images/cart/onion.gif"
		}
	];

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

	scope.searchedItems = SearchService.getSearchedItems();
}]);