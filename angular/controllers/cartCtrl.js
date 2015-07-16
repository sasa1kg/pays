angular.module('paysApp').controller("cartCtrl", ["$scope", "$http", "$filter", "CartService",  function (scope, http, filter, CartService) {

	console.log("Cart Ctrl!");
	scope.msg = "Cart Ctrl!";

	scope.cartItems = CartService.getItems();
	scope.farmerName = scope.cartItems[0].farmer;
	scope.farmerLocation = scope.cartItems[0].farmerLocation;
	scope.farmerId = scope.cartItems[0].farmerId;

	scope.deleteCartItem = function (itemId) {
		alert("Delete " + itemId);
	};

	scope.addMore = function (itemId) {
		alert("Add more " + itemId);
	}
	scope.less = function (itemId) {
		alert("Less " + itemId);
	}
}]);