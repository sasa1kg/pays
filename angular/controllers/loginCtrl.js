angular.module('paysApp').controller("loginCtrl", ["$scope", "$http", "$filter", "CartService", "WishlistService",   
	function (scope, http, filter, CartService, WishlistService) {

	console.log("Cart Ctrl!");
	scope.msg = "Cart Ctrl!";

	scope.cartItems = CartService.getItemsSize();
	scope.wishlistItems = WishlistService.getItemsSize();

}]);