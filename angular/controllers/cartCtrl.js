angular.module('paysApp').controller("cartCtrl", ["$scope", "$http", "$filter", "CartService", "WishlistService",  
	function (scope, http, filter, CartService, WishlistService) {

	console.log("Cart Ctrl!");

	

	scope.shipping = 0;
	 
	

	scope.calculateTotal = function () {
		scope.totalPrice = 0;
		for (var i = scope.cartItems.length - 1; i >= 0; i--) {
			scope.totalPrice = scope.totalPrice + scope.cartItems[i].itemPrice * scope.cartItems[i].itemNum;
		};
		scope.total = scope.totalPrice + scope.shipping;
	}


	scope.deleteCartItem = function (itemId) {
		CartService.remove(itemId, scope.farmerId);
		scope.loadData();
	};

	scope.addMore = function (itemId) {
		CartService.more(itemId, scope.farmerId);
		scope.loadData();
	}
	scope.less = function (itemId) {
		CartService.less(itemId, scope.farmerId);
		scope.loadData();
	};


	scope.loadData = function () {
		scope.cartItems = CartService.getItems();
		scope.cartItemsSize = CartService.getItemsSize();
		scope.wishlistItemSize = WishlistService.getItemsSize();
		if (scope.cartItems[0] != undefined) {
			scope.farmerName = scope.cartItems[0].farmer;
			scope.farmerLocation = scope.cartItems[0].farmerLocation;
			scope.farmerId = scope.cartItems[0].farmerId;
		} else {
			scope.farmerName = "";
			scope.farmerLocation = "";
			scope.farmerId = "";
		}
		scope.calculateTotal();
	}


	scope.loadData();
	
}]);